import React, { useState, useEffect, useRef } from "react";
import { useRecommendation } from "../store";
import { SelectionCard } from "./SelectionCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Sun, Zap, Battery, Home, Settings, Wallet, CloudRain, Shield, ThermometerSun } from "lucide-react";
import { HomeownerProfile } from "@/lib/recommendation/types";

export function ProfileRefinement() {
    const { profile, updateProfile, startAnalysis, setFlowState } = useRecommendation();
    const [currentStep, setCurrentStep] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll to top of component when step changes
    useEffect(() => {
        if (containerRef.current) {
            const yOffset = -100; 
            const y = containerRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }, [currentStep]);

    const steps = [
        {
            id: 'solar',
            title: "Solar Setup",
            description: "Tell us about your existing or planned solar panels. This dictates whether you need AC or DC coupled storage.",
            field: 'solarOwnership' as keyof HomeownerProfile,
            options: [
                { label: "Planning New Solar", value: "Planning New", desc: "I want to install solar panels and a battery together.", icon: <Sun /> },
                { label: "Existing Microinverters", value: "Existing Microinverters", desc: "I have Enphase or similar microinverters on my roof.", icon: <Settings /> },
                { label: "Existing String Inverter", value: "Existing String", desc: "I have a central wall-mounted string inverter.", icon: <Zap /> },
                { label: "No Solar (Battery Only)", value: "None", desc: "I only want a battery for backup or tariff shifting.", icon: <Battery /> },
            ]
        },
        {
            id: 'outages',
            title: "Grid Reliability",
            description: "How often do you experience power cuts? This determines the resilience score of our recommendations.",
            field: 'outageFrequency' as keyof HomeownerProfile,
            options: [
                { label: "Rarely / Never", value: "Rare", desc: "Maybe once every few years for a short time.", icon: <Shield /> },
                { label: "A few times a year", value: "Few times a year", desc: "Occasional weather-related outages.", icon: <CloudRain /> },
                { label: "Frequent / Weekly", value: "Weekly", desc: "Highly unreliable grid, need constant backup.", icon: <Zap /> },
            ]
        },
        {
            id: 'backup',
            title: "Backup Goal",
            description: "When the grid goes down, what do you need to keep running?",
            field: 'backupGoal' as keyof HomeownerProfile,
            options: [
                { label: "Whole-Home Backup", value: "Whole-Home", desc: "Keep everything running, including heavy loads.", icon: <Home /> },
                { label: "Critical Loads Only", value: "Critical Loads", desc: "Just lights, fridge, and internet.", icon: <Shield /> },
                { label: "No Backup Needed", value: "None", desc: "I just want to save money on bills.", icon: <Wallet /> },
            ]
        },
        {
            id: 'climate',
            title: "Installation Environment",
            description: "Where do you live, and where will the battery be installed?",
            field: 'climate' as keyof HomeownerProfile,
            options: [
                { label: "Mild / Moderate", value: "Mild", desc: "Standard temperatures year-round.", icon: <Home /> },
                { label: "Extreme Heat", value: "Extreme Heat", desc: "Regularly above 35°C (95°F) in summer.", icon: <ThermometerSun /> },
                { label: "Extreme Cold", value: "Extreme Cold", desc: "Regularly below freezing in winter.", icon: <CloudRain /> },
            ]
        },
        {
            id: 'install',
            title: "Installation Preference",
            description: "How do you plan to install this system?",
            field: 'installerPreference' as keyof HomeownerProfile,
            options: [
                { label: "Professional Installer", value: "Professional", desc: "I want a certified turn-key installation.", icon: <Settings /> },
                { label: "DIY / Self-Install", value: "DIY", desc: "I am building my own server-rack system.", icon: <Zap /> },
            ]
        },
        {
            id: 'budget',
            title: "Budget Alignment",
            description: "What is your primary financial motivation?",
            field: 'budgetSensitivity' as keyof HomeownerProfile,
            options: [
                { label: "Premium / Turnkey", value: "Premium", desc: "I want the best ecosystem, regardless of cost.", icon: <Settings /> },
                { label: "Value / Mid-Range", value: "Moderate", desc: "Best balance of quality and payback period.", icon: <Wallet /> },
                { label: "Strict Budget", value: "Strict", desc: "Lowest cost per kWh is my main priority.", icon: <Zap /> },
            ]
        }
    ];

    const currentStepData = steps[currentStep];
    const currentValue = profile[currentStepData.field as keyof HomeownerProfile];

    const handleSelect = (value: string) => {
        updateProfile({ [currentStepData.field]: value } as Partial<HomeownerProfile>);
        
        // Auto-advance if not the last step
        if (currentStep < steps.length - 1) {
            setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 300);
        }
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            startAnalysis();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        } else {
            setFlowState('sizing');
        }
    };

    return (
        <div ref={containerRef} className="max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-sm font-medium text-muted-foreground mb-2">
                    <span>Step {currentStep + 1} of {steps.length}</span>
                    <span>{Math.round(((currentStep) / steps.length) * 100)}% Complete</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${((currentStep) / steps.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Header */}
            <div className="mb-8 text-center sm:text-left">
                <h2 className="text-3xl font-bold tracking-tight mb-2">{currentStepData.title}</h2>
                <p className="text-muted-foreground text-lg">{currentStepData.description}</p>
            </div>

            {/* Options */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
                {currentStepData.options.map((opt) => (
                    <SelectionCard
                        key={opt.value}
                        title={opt.label}
                        description={opt.desc}
                        icon={opt.icon}
                        selected={currentValue === opt.value}
                        onClick={() => handleSelect(opt.value)}
                    />
                ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-border/40">
                <Button variant="ghost" onClick={handleBack} className="text-muted-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                
                <Button 
                    onClick={handleNext} 
                    disabled={!currentValue}
                    className="min-w-[140px] shadow-md shadow-primary/20"
                >
                    {currentStep === steps.length - 1 ? (
                        <>Run Analysis <Zap className="w-4 h-4 ml-2 fill-current" /></>
                    ) : (
                        <>Continue <ArrowRight className="w-4 h-4 ml-2" /></>
                    )}
                </Button>
            </div>
        </div>
    );
}
