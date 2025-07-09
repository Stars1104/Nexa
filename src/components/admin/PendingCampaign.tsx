import { useState } from "react";
import { Card, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import CampaignLogo from "../../assets/landing/post.png";
import { Dialog, DialogContent } from "../ui/dialog";
import CampaignDetail from "@/components/admin/CampaignDetail";

// Hardcoded campaign data
const initialCampaigns = [
    {
        id: 1,
        title: "Campanha de Verão 2023",
        brand: "Marca Solar",
        value: 2500,
        deadline: "15/12/2023",
        type: "Vídeo",
        briefing: "Criar conteúdo mostrando produtos de verão em uso na praia.",
        logo: "../../assets/landing/post.png",
    },
    {
        id: 2,
        title: "Lançamento Produto X",
        brand: "Tech Innovations",
        value: 1800,
        deadline: "10/12/2023",
        type: "Foto",
        briefing: "Unboxing e primeiras impressões do novo produto.",
        logo: "../../assets/landing/post.png",
    },
];

export default function PendingCampaign() {
    const [campaigns, setCampaigns] = useState(initialCampaigns);
    const [actionStatus, setActionStatus] = useState({}); // { [id]: 'approved' | 'rejected' }
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const handleApprove = (id) => {
        setActionStatus((prev) => ({ ...prev, [id]: "approved" }));
        setTimeout(() => setCampaigns((prev) => prev.filter((c) => c.id !== id)), 800);
    };
    const handleReject = (id) => {
        setActionStatus((prev) => ({ ...prev, [id]: "rejected" }));
        setTimeout(() => setCampaigns((prev) => prev.filter((c) => c.id !== id)), 800);
    };
    const handleViewDetails = (campaign) => {
        setSelectedCampaign(campaign);
        setDetailOpen(true);
    };

    return (
        <div className="w-full px-2 sm:px-6 py-6 dark:bg-[#171717] min-h-[92vh]">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground">Campanhas Pendentes</h1>
                    <p className="text-muted-foreground text-sm mt-1">Aprove ou rejeite campanhas submetidas por marcas</p>
                </div>
            </div>
            <div className="w-full flex flex-col gap-4 p-4 sm:p-6 bg-background rounded-lg">
                <div className="flex gap-2 mt-2 sm:mt-0 justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">Total</span>
                        <Badge variant="secondary">{campaigns.length} campanhas</Badge>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="hidden sm:inline-block">Ordenar</Button>
                        <Button variant="outline" className="hidden sm:inline-block">Filtrar</Button>
                    </div>
                </div>
                <div className="space-y-6">
                    {campaigns.length === 0 && (
                        <Alert className="mt-8">
                            <AlertTitle>Nenhuma campanha pendente</AlertTitle>
                            <AlertDescription>Não há campanhas aguardando aprovação no momento.</AlertDescription>
                        </Alert>
                    )}
                    {campaigns.map((c) => (
                        <Card key={c.id} className="p-0 border bg-background text-foreground shadow-sm">
                            <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row sm:items-center justify-between px-4 sm:px-6 pt-6">
                                <div className="flex flex-col gap-1 w-full">
                                    <div className="flex items-center gap-3">
                                        <img src={CampaignLogo} alt={c.title + ' logo'} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover bg-muted border" />
                                        <CardTitle className="text-base sm:text-lg md:text-xl">{c.title}</CardTitle>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-1">
                                        <span><span className="font-medium text-foreground">Marca</span><br className="sm:hidden" /> {c.brand}</span>
                                        <span className="hidden sm:inline-block mx-2">|</span>
                                        <span><span className="font-medium text-foreground">Valor</span><br className="sm:hidden" /> R$ {c.value.toLocaleString("pt-BR")}</span>
                                        <span className="hidden sm:inline-block mx-2">|</span>
                                        <span><span className="font-medium text-foreground">Deadline</span><br className="sm:hidden" /> <span className="font-semibold text-foreground">{c.deadline}</span></span>
                                    </div>
                                </div>
                                <Badge variant="outline" className="self-end sm:self-center mt-2 sm:mt-0">{c.type}</Badge>
                            </div>
                            <CardContent className="pt-4 pb-2 px-4 sm:px-6">
                                <div>
                                    <span className="block text-xs text-muted-foreground mb-1">Briefing</span>
                                    <span className="text-sm text-foreground">{c.briefing}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 px-4 sm:px-6 pb-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewDetails(c)}
                                    className="w-full sm:w-auto"
                                >
                                    Ver detalhes
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => handleReject(c.id)}
                                    disabled={actionStatus[c.id] === "rejected" || actionStatus[c.id] === "approved"}
                                    className="w-full sm:w-auto bg-[#DC2626] text-white"
                                >
                                    {actionStatus[c.id] === "rejected" ? "Rejeitado" : "Rejeitar"}
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => handleApprove(c.id)}
                                    disabled={actionStatus[c.id] === "approved" || actionStatus[c.id] === "rejected"}
                                    className="w-full sm:w-auto bg-[#16A34A] text-white"
                                >
                                    {actionStatus[c.id] === "approved" ? "Aprovado" : "Aprovar"}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
            {selectedCampaign && (
                <CampaignDetail campaign={selectedCampaign} open={detailOpen} onOpenChange={setDetailOpen} onApprove={() => { }} onReject={() => { }} path="pending" />
            )}
        </div>
    );
}
