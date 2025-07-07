import { ThemeProvider } from "../../components/ThemeProvider";
import ComponentNavbar from "../../components/ComponentNavbar";
import Sidebar from "../../components/creator/Sidebar";
import Dashboard from "../../components/creator/Dashboard";
import { useIsMobile } from "../../hooks/use-mobile";
import { CreatorProfile } from "../../components/creator/CreatorProfile";
import { useState } from "react";
import NotFound from "../NotFound";

const Index = () => {
    const isMobile = useIsMobile();

    const [component, setComponent] = useState<string | null>("dashboard");

    const CreatorComponent = () => {
        switch (component) {
            case "dashboard":
                return <Dashboard />;
            case "my account":
                return <CreatorProfile />;
            default:
                return <NotFound />;
        }
    }

    return (
        <ThemeProvider>
            <div className="flex h-screen bg-background text-foreground">
                {!isMobile && <Sidebar setComponent={setComponent} />}
                <div className="flex-1 flex flex-col min-w-0">
                    <ComponentNavbar />
                    <main className={`flex-1 overflow-y-auto bg-muted/50 ${isMobile ? 'pb-20' : ''}`}>
                        <CreatorComponent />
                    </main>
                </div>
                {isMobile && <Sidebar setComponent={setComponent} />}
            </div>
        </ThemeProvider>
    );
};

export default Index;