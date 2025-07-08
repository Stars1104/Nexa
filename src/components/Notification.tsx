import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { 
    Bell, 
    CheckCircle, 
    AlertCircle, 
    Info, 
    X, 
    Filter,
    Check,
    Trash2,
    Archive
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

interface NotificationItem {
    id: number;
    title: string;
    message: string;
    time: string;
    type: 'success' | 'warning' | 'info' | 'error';
    unread: boolean;
    category: 'campaign' | 'payment' | 'application' | 'system';
}

const Notification = () => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([
        {
            id: 1,
            title: "Nova Campanha Disponível",
            message: "A marca ModaX está procurando criadores de conteúdo para a campanha 'Summer Look'",
            time: "2 horas atrás",
            type: 'info',
            unread: true,
            category: 'campaign'
        },
        {
            id: 2,
            title: "Aplicação Aprovada",
            message: "Sua aplicação para a campanha 'TechSound Headphones' foi aprovada!",
            time: "1 dia atrás",
            type: 'success',
            unread: true,
            category: 'application'
        },
        {
            id: 3,
            title: "Pagamento Processado",
            message: "Pagamento de R$ 750 foi processado com sucesso para sua conta",
            time: "3 dias atrás",
            type: 'success',
            unread: false,
            category: 'payment'
        },
        {
            id: 4,
            title: "Campanha Expirada",
            message: "A campanha 'BeautyGlow Skincare' expirou. Considere aplicar para novas oportunidades",
            time: "5 dias atrás",
            type: 'warning',
            unread: false,
            category: 'campaign'
        },
        {
            id: 5,
            title: "Manutenção Programada",
            message: "O sistema estará em manutenção amanhã das 2h às 4h da manhã",
            time: "1 semana atrás",
            type: 'info',
            unread: false,
            category: 'system'
        },
        {
            id: 6,
            title: "Aplicação Rejeitada",
            message: "Sua aplicação para 'Fitness Challenge' não foi selecionada desta vez",
            time: "1 semana atrás",
            type: 'error',
            unread: false,
            category: 'application'
        }
    ]);

    const [filter, setFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'info':
                return <Info className="w-5 h-5 text-blue-500" />;
            default:
                return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };

    const getCategoryBadge = (category: string) => {
        const categoryConfig = {
            campaign: { label: 'Campanha', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
            payment: { label: 'Pagamento', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
            application: { label: 'Aplicação', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
            system: { label: 'Sistema', color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300' }
        };
        
        const config = categoryConfig[category as keyof typeof categoryConfig];
        return (
            <Badge className={`text-xs ${config.color}`}>
                {config.label}
            </Badge>
        );
    };

    const filteredNotifications = notifications.filter(notification => {
        const matchesFilter = filter === 'all' || 
            (filter === 'unread' && notification.unread) ||
            (filter === 'read' && !notification.unread);
        
        const matchesCategory = categoryFilter === 'all' || notification.category === categoryFilter;
        
        return matchesFilter && matchesCategory;
    });

    const unreadCount = notifications.filter(n => n.unread).length;

    const markAsRead = (id: number) => {
        setNotifications(prev => 
            prev.map(notification => 
                notification.id === id 
                    ? { ...notification, unread: false }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => 
            prev.map(notification => ({ ...notification, unread: false }))
        );
    };

    const deleteNotification = (id: number) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    const clearAllRead = () => {
        setNotifications(prev => prev.filter(notification => notification.unread));
    };

    return (
        <div className="min-h-[92vh] dark:bg-[#171717] flex flex-col py-4 px-2 sm:px-10">
            <div className="w-full mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Notificações</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {unreadCount} não lida{unreadCount !== 1 ? 's' : ''} • {notifications.length} total
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={markAllAsRead}
                            disabled={unreadCount === 0}
                            className="text-xs"
                        >
                            <Check className="w-4 h-4 mr-2" />
                            Marcar todas como lidas
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={clearAllRead}
                            className="text-xs"
                        >
                            <Archive className="w-4 h-4 mr-2" />
                            Limpar lidas
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Filtros:</span>
                            </div>
                            
                            <Select value={filter} onValueChange={setFilter}>
                                <SelectTrigger className="w-full sm:w-[140px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas</SelectItem>
                                    <SelectItem value="unread">Não lidas</SelectItem>
                                    <SelectItem value="read">Lidas</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-full sm:w-[140px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas categorias</SelectItem>
                                    <SelectItem value="campaign">Campanhas</SelectItem>
                                    <SelectItem value="payment">Pagamentos</SelectItem>
                                    <SelectItem value="application">Aplicações</SelectItem>
                                    <SelectItem value="system">Sistema</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications List */}
                <div className="space-y-3">
                    {filteredNotifications.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Nenhuma notificação</h3>
                                <p className="text-muted-foreground">
                                    {filter === 'all' ? 'Você está em dia com suas notificações!' : 'Nenhuma notificação encontrada com os filtros selecionados.'}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredNotifications.map((notification, index) => (
                            <Card 
                                key={notification.id} 
                                className={`transition-all duration-200 hover:shadow-md ${
                                    notification.unread ? 'border-l-4 border-l-primary bg-accent/20' : ''
                                }`}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 mt-1">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className={`font-medium ${notification.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                            {notification.title}
                                                        </h3>
                                                        {notification.unread && (
                                                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        {getCategoryBadge(notification.category)}
                                                        <span className="text-xs text-muted-foreground">
                                                            {notification.time}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-1">
                                                    {notification.unread && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notification;