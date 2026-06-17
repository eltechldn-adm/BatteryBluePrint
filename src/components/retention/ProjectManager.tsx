"use client";

import { useState, useRef, useEffect } from "react";
import { useRetention } from "@/lib/retention/context";
import { getAllProjects, exportProjectAsPDF, validateProjectImportFromPDF, importProject } from "@/lib/retention/store";
import { Project, ProjectExportPayload } from "@/lib/retention/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FolderOpen, Download, Upload, Trash2, CheckCircle2, AlertTriangle, FileText, Clock, Timer } from "lucide-react";
import Link from "next/link";

export function ProjectManager() {
    const { project: activeProject, switchProject, deleteProject, sessionTimeRemaining, sessionWasReset } = useRetention();
    const [open, setOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [exportingId, setExportingId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Collision State
    const [collisionPayload, setCollisionPayload] = useState<ProjectExportPayload | null>(null);

    useEffect(() => {
        if (open) {
            setProjects(getAllProjects());
            setConfirmDeleteId(null);
            setError(null);
            setCollisionPayload(null);
        }
    }, [open, activeProject.id]);

    const handleSwitch = (id: string) => {
        switchProject(id);
        setOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirmDeleteId === id) {
            deleteProject(id);
            setProjects(getAllProjects());
            setConfirmDeleteId(null);
        } else {
            setConfirmDeleteId(id);
        }
    };

    const handleExport = async (project: Project) => {
        setExportingId(project.id);
        try {
            const blob = await exportProjectAsPDF(project);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `batteryblueprint_${project.label.replace(/\s+/g, "_").toLowerCase()}_${new Date().toISOString().split("T")[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            setError("Failed to generate PDF. Please try again.");
        } finally {
            setExportingId(null);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Read as ArrayBuffer for PDF parsing
        const reader = new FileReader();
        reader.onload = (event) => {
            const arrayBuffer = event.target?.result as ArrayBuffer;
            const validation = validateProjectImportFromPDF(arrayBuffer);

            if (!validation.valid) {
                setError(validation.error);
                return;
            }

            if (validation.collision) {
                setCollisionPayload(validation.payload);
            } else {
                try {
                    importProject(validation.payload, false);
                    setProjects(getAllProjects());
                    switchProject(validation.payload.project.id);
                    setOpen(false);
                } catch (err: any) {
                    setError(err.message || "Failed to import project.");
                }
            }
        };
        reader.readAsArrayBuffer(file);

        // Reset input so same file can be re-selected
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const resolveCollision = (asCopy: boolean) => {
        if (!collisionPayload) return;
        try {
            importProject(collisionPayload, asCopy);
            setProjects(getAllProjects());
            switchProject(asCopy ? getAllProjects()[getAllProjects().length - 1].id : collisionPayload.project.id);
            setOpen(false);
        } catch (err: any) {
            setError(err.message || "Failed to import project.");
        }
        setCollisionPayload(null);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-foreground w-full md:w-auto justify-start md:justify-center px-0 md:px-3">
                    <FolderOpen className="w-4 h-4" />
                    Projects ({projects.length}/5)
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-background border-border shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FolderOpen className="w-5 h-5 text-primary" />
                        Project Manager
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {/* Session Reset Banner */}
                    {sessionWasReset && (
                        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 text-sm rounded-lg flex items-start gap-2">
                            <Timer className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>Your previous session expired. Project list has been reset. Your last active project data is still available.</span>
                        </div>
                    )}

                    {/* Session Timer */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Session expires in <strong className="text-foreground">{sessionTimeRemaining}</strong></span>
                        </div>
                        <Link href="/projects" className="text-primary hover:underline" onClick={() => setOpen(false)}>
                            View dashboard →
                        </Link>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                            {error}
                        </div>
                    )}

                    {collisionPayload ? (
                        <div className="p-4 border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/10 rounded-xl space-y-4">
                            <div className="flex items-start gap-3 text-orange-800 dark:text-orange-200">
                                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-sm">Project Collision Detected</h4>
                                    <p className="text-xs mt-1 opacity-90">
                                        You already have a project with this ID. Do you want to overwrite it, or import this as a new copy?
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end">
                                <Button variant="outline" size="sm" onClick={() => setCollisionPayload(null)}>Cancel</Button>
                                <Button variant="secondary" size="sm" onClick={() => resolveCollision(true)}>Import as Copy</Button>
                                <Button variant="destructive" size="sm" onClick={() => resolveCollision(false)}>Overwrite Existing</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {projects.length === 0 && (
                                <p className="text-sm text-muted-foreground italic">No projects in this session. Import a PDF to restore a previous project.</p>
                            )}
                            {projects.map(p => {
                                const isActive = p.id === activeProject.id;
                                return (
                                    <div key={p.id} className={`p-3 rounded-xl border ${isActive ? "border-primary bg-primary/5" : "border-border/50 bg-muted/20"} flex flex-col gap-2`}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-medium text-sm text-foreground">{p.label}</h4>
                                                    {isActive && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    Updated: {new Date(p.updatedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-1">
                                                {!isActive && (
                                                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => handleSwitch(p.id)}>
                                                        Switch
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => handleExport(p)}
                                                    title="Export as PDF"
                                                    disabled={exportingId === p.id}
                                                >
                                                    {exportingId === p.id
                                                        ? <span className="w-3.5 h-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                                        : <Download className="w-3.5 h-3.5" />
                                                    }
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={`h-7 w-7 ${confirmDeleteId === p.id ? "text-red-500 bg-red-50 dark:bg-red-950/30" : ""}`}
                                                    onClick={() => handleDelete(p.id)}
                                                    title="Delete Project"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {!collisionPayload && (
                    <div className="pt-4 border-t flex justify-between items-center">
                        <p className="text-xs text-muted-foreground">
                            {projects.length} / 5 this session
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            disabled={projects.length >= 5}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="w-4 h-4" />
                            Import PDF
                        </Button>
                        <input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
