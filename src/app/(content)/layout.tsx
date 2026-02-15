import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface DocsLayoutProps {
    children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pt-24 pb-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl">
                        {children}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
