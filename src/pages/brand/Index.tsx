import { ThemeProvider } from "../../components/ThemeProvider";
import ComponentNavbar from "../../components/ComponentNavbar";
import { useIsMobile } from "../../hooks/use-mobile";
import { useState } from "react";
import BrandSidebar from "../../components/brand/BrandSidebar";
import BrandDashboard from "../../components/brand/BrandDashboard";
import BrandProfile from "@/components/brand/BrandProfile";
import NotFound from "../NotFound";
import Chat from "@/components/Chat";
import ViewCreators from "@/components/brand/ViewCreators";
import ViewApplication from "@/components/brand/ViewApplication";
import CreateCampaign from "@/components/brand/CreateCampaign";
import Payment from "@/components/brand/Payment";
import Notification from "@/components/Notification";

const Index = () => {
    const isMobile = useIsMobile();

    const [component, setComponent] = useState<string | null>("Minhas campanhas");

    const CreatorComponent = () => {
        switch (component) {
            case "Minhas campanhas":
                return <BrandDashboard setComponent={setComponent} />;
            case "Meu perfil":
                return <BrandProfile />;
            case "Chat":
                return <Chat />
            case "Ver criadores":
                return <ViewCreators setComponent={setComponent} />
            case "Ver aplicação":
                return <ViewApplication setComponent={setComponent} />
            case "Nova campanha":
                return <CreateCampaign />
            case "Pagamentos":
                return <Payment />
            case "Notificações":
                return <Notification />
            default:
                return <NotFound />;
        }
    }

    return (
        <ThemeProvider>
            <div className="flex h-screen bg-background text-foreground">
                {!isMobile && <BrandSidebar setComponent={setComponent} component={component} />}
                <div className="flex-1 flex flex-col min-w-0">
                    <ComponentNavbar title={component || "Dashboard"} />
                    <main className={`flex-1 overflow-y-auto bg-muted/50 ${isMobile ? 'pb-20' : ''}`}>
                        <CreatorComponent />
                    </main>
                </div>
                {isMobile && <BrandSidebar setComponent={setComponent} component={component} />}
            </div>
        </ThemeProvider>
    );
};

export default Index;