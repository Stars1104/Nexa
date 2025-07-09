import { ThemeProvider } from "../../components/ThemeProvider";
import ComponentNavbar from "../../components/ComponentNavbar";
import { useIsMobile } from "../../hooks/use-mobile";
import { useState } from "react";
import NotFound from "../NotFound";
import AdminSidebar from "@/components/admin/Sidebar";
import Dashboard from "@/components/admin/Dashboard";
import PendingCampaign from "@/components/admin/PendingCampaign";
import CampaignList from "@/components/admin/CampaignList";
import UserList from "@/components/admin/UserList";
import Setting from "@/components/admin/Setting";
import Notification from "@/components/Notification";

const AdminIndex = () => {
    const isMobile = useIsMobile();

    const [component, setComponent] = useState<string | null>("Painel");

    const CreatorComponent = () => {
        switch (component) {
            case "Painel":
                return <Dashboard />;
            case "Campanhas Pendentes":
                return <PendingCampaign />;
            case "Todas as Campanhas":
                return <CampaignList />;
            case "Usuários":
                return <UserList />;
            case "Configurações de Regras":
                return <Setting />;
            case "Notificações":
                return <Notification />
            default:
                return <NotFound />;
        }
    }

    return (
        <ThemeProvider>
            <div className="flex h-screen bg-background text-foreground">
                {!isMobile && <AdminSidebar setComponent={setComponent} component={component} />}
                <div className="flex-1 flex flex-col min-w-0">
                    <ComponentNavbar title={component || "Dashboard"} />
                    <main className={`flex-1 overflow-y-auto bg-muted/50 ${isMobile ? 'pb-20' : ''}`}>
                        <CreatorComponent />
                    </main>
                </div>
                {isMobile && <AdminSidebar setComponent={setComponent} component={component} />}
            </div>
        </ThemeProvider>
    );
};

export default AdminIndex;