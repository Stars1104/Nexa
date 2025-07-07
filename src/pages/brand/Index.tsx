import { ThemeProvider } from "../../components/ThemeProvider";
import ComponentNavbar from "../../components/ComponentNavbar";
import { useIsMobile } from "../../hooks/use-mobile";
import { useState } from "react";
import BrandSidebar from "../../components/brand/BrandSidebar";
import BrandDashboard from "../../components/brand/BrandDashboard";
import BrandProfile from "@/components/brand/BrandProfile";
import NotFound from "../NotFound";

const Index = () => {
    const isMobile = useIsMobile();

    const [component, setComponent] = useState<string | null>("my campaigns");

    const CreatorComponent = () => {
        switch (component) {
            case "my campaigns":
                return <BrandDashboard />;
            case "my account":
                return <BrandProfile />;
            default:
                return <NotFound />;
        }
    }

    return (
        <ThemeProvider>
            <div className="flex h-screen bg-background text-foreground">
                {!isMobile && <BrandSidebar setComponent={setComponent} />}
                <div className="flex-1 flex flex-col min-w-0">
                    <ComponentNavbar />
                    <main className={`flex-1 overflow-y-auto bg-muted/50 ${isMobile ? 'pb-20' : ''}`}>
                        <CreatorComponent />
                    </main>
                </div>
                {isMobile && <BrandSidebar setComponent={setComponent} />}
            </div>
        </ThemeProvider>
    );
};

export default Index;