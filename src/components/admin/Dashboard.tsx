import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Calendar, Clock, Users, Settings, ClipboardList } from "lucide-react";

const stats = [
    {
        icon: <ClipboardList className="w-full h-full text-[#F72585] bg-pink-100 dark:bg-pink-900/40 rounded-full p-3" />, // Campaigns
        label: "Campanhas Pendentes",
        value: 12,
    },
    {
        icon: <Users className="w-full h-full text-blue-500 bg-blue-100 dark:bg-blue-900/40 rounded-full p-3" />, // Users
        label: "Usuários Ativos",
        value: "1,234",
    },
    {
        icon: <Settings className="w-full h-full text-green-600 bg-green-100 dark:bg-green-900/40 rounded-full p-3" />, // Rules
        label: "Regras Ativas",
        value: 7,
    },
    {
        icon: <Clock className="w-full h-full text-purple-500 bg-purple-100 dark:bg-purple-900/40 rounded-full p-3" />, // Actions
        label: "Ações Recentes",
        value: 48,
    },
];

const campaigns = [
    {
        name: "Campanha de Verão 1",
        brand: "Marca 1",
        type: "Vídeo",
        value: "R$ 1.000",
    },
    {
        name: "Campanha de Verão 2",
        brand: "Marca 2",
        type: "Vídeo",
        value: "R$ 2.000",
    },
    {
        name: "Campanha de Verão 3",
        brand: "Marca 3",
        type: "Vídeo",
        value: "R$ 3.000",
    },
];

const users = [
    {
        name: "Usuário 1",
        type: "Marca",
        days: 1,
        status: "Pagante",
        badge: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300",
    },
    {
        name: "Usuário 2",
        type: "Criador",
        days: 2,
        status: "Aluno",
        badge: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300",
    },
    {
        name: "Usuário 3",
        type: "Marca",
        days: 3,
        status: "Pagante",
        badge: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300",
    },
];

export default function Dashboard() {
    return (
        <div className="flex flex-col gap-6 px-2 sm:px-4 py-4 max-w-full mx-auto dark:bg-[#171717] min-h-[92vh]">
            {/* Header */}
            <div className="mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Painel do Administrador</h1>
                <p className="text-muted-foreground text-sm mt-1">Gerencie campanhas, usuários e regras da plataforma</p>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
                {stats.map((stat, i) => (
                    <Card key={stat.label} className="flex items-center justify-center gap-4 py-6 px-2 bg-background">
                        <div className="mb-2 w-12 h-12 flex items-center justify-center">{stat.icon}</div>
                        <div className="flex flex-col">
                            <div className="text-sm text-muted-foreground mb-1 text-center">{stat.label}</div>
                            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                        </div>
                    </Card>
                ))}
            </div>
            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Recent Campaigns */}
                <Card className="bg-background">
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Campanhas Pendentes Recentes</h2>
                        <div className="flex flex-col gap-4">
                            {campaigns.map((c, i) => (
                                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-lg px-4 py-3 bg-muted/40 dark:bg-muted/20">
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-foreground">{c.name}</div>
                                        <div className="text-xs text-muted-foreground mt-0.5">{c.brand} • {c.type} • {c.value}</div>
                                    </div>
                                    <div className="flex gap-2 mt-3 sm:mt-0 sm:ml-4">
                                        <Button className="bg-[#F72585] hover:bg-pink-600 text-white" size="sm">Aprovar</Button>
                                        <Button variant="outline" className="text-muted-foreground border-muted-foreground/30" size="sm">Rejeitar</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 text-center">
                            <a href="#" className="text-[#F72585] hover:underline text-sm">Ver todas as campanhas pendentes</a>
                        </div>
                    </CardContent>
                </Card>
                {/* Right: Recent Users */}
                <Card className="bg-background">
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Usuários Recentes</h2>
                        <div className="flex flex-col gap-4">
                            {users.map((u, i) => (
                                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-lg px-4 py-3 bg-muted/40 dark:bg-muted/20">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <Avatar className="w-8 h-8">
                                            <AvatarFallback>{i + 1}</AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <div className="font-medium text-foreground text-sm">{u.name}</div>
                                            <div className="text-xs text-muted-foreground">{u.type} • Registrado há {u.days} {u.days === 1 ? 'dia' : 'dias'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center mt-3 sm:mt-0 sm:ml-4">
                                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${u.badge}`}>{u.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 text-center">
                            <a href="#" className="text-[#F72585] hover:underline text-sm">Ver todos os usuários</a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
