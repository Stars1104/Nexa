import { Button } from "../ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchApprovedCampaigns } from "../../store/thunks/campaignThunks";
import { clearError } from "../../store/slices/campaignSlice";
import { toast } from "../ui/sonner";
import { Skeleton } from "../ui/skeleton";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { fetchCreatorApplications } from "../../store/thunks/campaignThunks";

// Stats will be calculated dynamically based on approved campaigns

// Categorias em português
const categories = [
    "Todas as categorias",
    "Vídeo",
    "Foto",
    "Review",
    "Unboxing",
    "Tutorial",
    "Story",
    "Reels",
    "Post",
];

// Estados brasileiros por nome
const brazilianStates = [
    "Acre",
    "Alagoas",
    "Amapá",
    "Amazonas",
    "Bahia",
    "Ceará",
    "Distrito Federal",
    "Espírito Santo",
    "Goiás",
    "Maranhão",
    "Mato Grosso",
    "Mato Grosso do Sul",
    "Minas Gerais",
    "Pará",
    "Paraíba",
    "Paraná",
    "Pernambuco",
    "Piauí",
    "Rio de Janeiro",
    "Rio Grande do Norte",
    "Rio Grande do Sul",
    "Rondônia",
    "Roraima",
    "Santa Catarina",
    "São Paulo",
    "Sergipe",
    "Tocantins"
];

interface DashboardProps {
    setComponent?: (component: string) => void;
    setProjectId?: (projectId: number) => void;
}

interface FilterState {
    category: string;
    region: string;
    dateFrom: Date | undefined;
    dateTo: Date | undefined;
    sort: string;
}

const statesColors = [
  "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200",
  "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200",
  "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200",
  "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200",
  "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200",
];

export default function Dashboard({ setComponent, setProjectId }: DashboardProps) {
    const dispatch = useAppDispatch();
    const { approvedCampaigns, isLoading, error } = useAppSelector((state) => state.campaign);
    const { creatorApplications } = useAppSelector((state) => state.campaign);
    const { user } = useAppSelector((state) => state.auth);
    
    // Filter state
    const [filters, setFilters] = useState<FilterState>({
        category: "all",
        region: "all",
        dateFrom: undefined,
        dateTo: undefined,
        sort: "sort-by"
    });

    // Filter panel state
    const [showFilters, setShowFilters] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Ensure approvedCampaigns is always an array
    const campaigns = Array.isArray(approvedCampaigns.data) ? approvedCampaigns.data : [];

    // Fetch approved campaigns on component mount
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                await dispatch(fetchApprovedCampaigns()).unwrap();
            } catch (error) {
                console.error('Error fetching approved campaigns:', error);
                toast.error("Erro ao carregar campanhas");
            }
        };
        
        fetchCampaigns();
    }, [dispatch]);

    // Clear error on component unmount
    useEffect(() => {
        return () => {
            if (error) {
                dispatch(clearError());
            }
        };
    }, [dispatch, error]);

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            category: "all",
            region: "all",
            dateFrom: undefined,
            dateTo: undefined,
            sort: "sort-by"
        });
    };

    // Check if any filters are active
    const hasActiveFilters = filters.category !== "all" || 
                           filters.region !== "all" || 
                           filters.dateFrom || 
                           filters.dateTo;

    // Filter and sort campaigns
    const filteredAndSortedCampaigns = campaigns
        .filter(campaign => {
            // Category filter
            if (filters.category !== "all") {
                const campaignCategory = campaign.category?.toLowerCase() || campaign.type?.toLowerCase() || "";
                if (!campaignCategory.includes(filters.category.toLowerCase())) {
                    return false;
                }
            }

            // Region filter
            if (filters.region !== "all") {
                // Split campaign.location string into array, trim spaces
                const campaignLocations = typeof campaign.location === "string"
                    ? campaign.location.split(",").map(loc => loc.trim())
                    : Array.isArray(campaign.location)
                        ? campaign.location
                        : [];
                if (!campaignLocations.some(loc => loc.toUpperCase() === filters.region.toUpperCase())) {
                    return false;
                }
            }

            // Date range filter
            if (filters.dateFrom) {
                const campaignDate = new Date(campaign.deadline);
                if (campaignDate < filters.dateFrom) {
                    return false;
                }
            }

            if (filters.dateTo) {
                const campaignDate = new Date(campaign.deadline);
                if (campaignDate > filters.dateTo) {
                    return false;
                }
            }

            return true;
        })
        .sort((a, b) => {
            switch (filters.sort) {
                case "price-high-to-low":
                    return b.budget - a.budget;
                case "price-low-to-high":
                    return a.budget - b.budget;
                case "deadline-soonest":
                    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
                case "deadline-latest":
                    return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
                case "newest-first":
                    return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
                default:
                    return 0;
            }
        });

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    // Format budget for display
    const formatBudget = (budget: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(budget);
    };

    // Calculate stats dynamically
    const stats = [
        { label: "CAMPANHAS DISPONÍVEIS", value: campaigns.length },
        { label: "CAMPANHAS ATIVAS", value: 1 }, // Pode ser calculado a partir das aplicações
        { label: "GANHOS DO MÊS", value: "R$ 750" }, // Pode ser calculado a partir das campanhas concluídas
    ];

    useEffect(() => {
        if (user?.role === 'creator') {
            dispatch(fetchCreatorApplications());
        }
    }, [dispatch, user?.id, user?.role]);

    return (
        <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8 min-h-[92vh] dark:bg-[#171717]">
            {/* Welcome */}
            <div className="flex flex-col gap-2">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold flex items-center gap-2">
                    Bem-vinda, Luiza Costa <span>👋</span>
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                    Descubra novas campanhas e comece a criar!
                </p>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-xl border bg-card p-4 sm:p-6 flex flex-col gap-2 shadow-sm"
                    >
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {stat.label}
                        </span>
                        <span className="text-xl sm:text-2xl lg:text-3xl font-bold">
                            {stat.value}
                        </span>
                    </div>
                ))}
            </div>
            
            {/* Filters */}
            <div className="space-y-4">
                {/* Filter Toggle and Quick Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
                    <div className="flex items-center gap-2 w-full justify-between">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2"
                        >
                            <Filter className="h-4 w-4" />
                            Filtros
                            {hasActiveFilters && (
                                <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                                    {[
                                        filters.category !== "all" ? 1 : 0,
                                        filters.region !== "all" ? 1 : 0,
                                        filters.dateFrom ? 1 : 0,
                                        filters.dateTo ? 1 : 0
                                    ].reduce((a, b) => a + b, 0)}
                                </span>
                            )}
                        </Button>
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                                Limpar
                            </Button>
                        )}
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[140px] h-9 ml-2">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="approved">Aprovados</SelectItem>
                                <SelectItem value="rejected">Rejeitados</SelectItem>
                                <SelectItem value="pending">Pendentes</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Advanced Filters Panel */}
                {showFilters && (
                    <div className="bg-card border rounded-lg p-4 space-y-4">
                        <h3 className="font-semibold text-sm">Filtros Avançados</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Category Filter */}
                            <div className="space-y-2">
                                <Label htmlFor="category-filter" className="text-xs font-medium">
                                    Categoria
                                </Label>
                                <Select 
                                    value={filters.category} 
                                    onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
                                >
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder="Todas as categorias" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '-')}> {/* Mantém o valor em minúsculo para filtro */}
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Region Filter */}
                            <div className="space-y-2">
                                <Label htmlFor="region-filter" className="text-xs font-medium">
                                    Estado
                                </Label>
                                <Select 
                                    value={filters.region} 
                                    onValueChange={(value) => setFilters(prev => ({ ...prev, region: value }))}
                                >
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder="Todos os estados" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos os estados</SelectItem>
                                        {brazilianStates.map((state) => (
                                            <SelectItem key={state} value={state}>
                                                {state}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Date From Filter */}
                            <div className="space-y-2">
                                <Label className="text-xs font-medium">Data Inicial</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal h-9"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {filters.dateFrom ? (
                                                format(filters.dateFrom, "PPP", { locale: ptBR })
                                            ) : (
                                                <span className="text-muted-foreground">Escolha uma data</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={filters.dateFrom}
                                            onSelect={(date) => setFilters(prev => ({ ...prev, dateFrom: date }))}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Date To Filter */}
                            <div className="space-y-2">
                                <Label className="text-xs font-medium">Data Final</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal h-9"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {filters.dateTo ? (
                                                format(filters.dateTo, "PPP", { locale: ptBR })
                                            ) : (
                                                <span className="text-muted-foreground">Escolha uma data</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={filters.dateTo}
                                            onSelect={(date) => setFilters(prev => ({ ...prev, dateTo: date }))}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Campaigns */}
            <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold">Campanhas Aprovadas</h3>
                    {filteredAndSortedCampaigns.length > 0 && (
                        <span className="text-sm text-muted-foreground">
                            {filteredAndSortedCampaigns.length} de {campaigns.length} campanhas
                        </span>
                    )}
                </div>
                
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="rounded-xl border bg-card p-4 sm:p-5 flex flex-col gap-3 shadow-sm">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-6 w-24" />
                                </div>
                                <div className="flex justify-between items-center mt-auto">
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-9 w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredAndSortedCampaigns.length === 0 ? (
                    <div className="text-center py-12">
                        {hasActiveFilters ? (
                            <>
                                <p className="text-muted-foreground text-lg">Nenhuma campanha corresponde aos filtros atuais.</p>
                                <p className="text-muted-foreground text-sm mt-2">Tente ajustar os filtros ou limpe-os para ver todas as campanhas.</p>
                                <Button 
                                    variant="outline" 
                                    onClick={clearFilters}
                                    className="mt-4"
                                >
                                    Limpar Filtros
                                </Button>
                            </>
                        ) : (
                            <>
                                <p className="text-muted-foreground text-lg">Nenhuma campanha aprovada disponível no momento.</p>
                                <p className="text-muted-foreground text-sm mt-2">Volte mais tarde para novas oportunidades!</p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                        {filteredAndSortedCampaigns
                            .filter((campaign: any) => {
                                if (statusFilter === "all") return true;
                                const myApp = user?.role === 'creator' ? creatorApplications.find(app => app.campaign_id === campaign.id && app.creator_id === user.id) : null;
                                if (!myApp) return false;
                                return myApp.status === statusFilter;
                            })
                            .map((campaign : any) => {
                                const myApp = user?.role === 'creator' ? creatorApplications.find(app => app.campaign_id === campaign.id && app.creator_id === user.id) : null;
                                let badge = null;
                                let button = null;
                                if (myApp) {
                                    if (myApp.status === 'approved') {
                                        badge = <span className="ml-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Aprovado</span>;
                                        button = (
                                                <a href={`#`} className="w-full sm:w-auto">
                                                    <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base">Chat</Button>
                                                </a>
                                            );
                                    } else if (myApp.status === 'rejected') {
                                        badge = <span className="ml-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Rejeitado</span>;
                                        button = (
                                            <Button className="w-full sm:w-auto bg-gray-400 text-white text-sm sm:text-base cursor-not-allowed" disabled>Rejeitado</Button>
                                        );
                                    } else {
                                        badge = <span className="ml-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Aplicado</span>;
                                        button = (
                                            <Button className="w-full sm:w-auto bg-[#E91E63] hover:bg-[#E91E63]/80 text-white text-sm sm:text-base" onClick={() => {
                                                setComponent("Detalhes do Projeto");
                                                setProjectId(campaign.id);
                                            }}>
                                                Ver detalhes
                                            </Button>
                                        );
                                    }
                                } else {
                                    button = (
                                        <Button className="w-full sm:w-auto bg-[#E91E63] hover:bg-[#E91E63]/80 text-white text-sm sm:text-base" onClick={() => {
                                            setComponent("Detalhes do Projeto");
                                            setProjectId(campaign.id);
                                        }}>
                                            Ver detalhes
                                        </Button>
                                    );
                                }
                                return (
                                    <div
                                        key={campaign.id}
                                        className="rounded-xl border bg-card p-4 sm:p-5 flex flex-col gap-3 shadow-sm relative"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="font-semibold text-sm sm:text-base pr-16 sm:pr-20">{campaign.title}</div>
                                            {badge}
                                        </div>
                                        <div className="text-xs text-muted-foreground mb-1">Marca: {campaign.brand?.name || 'N/A'}</div>
                                        <div className="text-xs text-muted-foreground mb-1">Descrição: {campaign.description.length > 100 ? campaign.description.slice(0, 100) + '...' : campaign.description}</div>
                                        {/* States/Location badges styled as in the image */}
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {campaign.location && campaign.location.split(',').map((uf: string, i: number) => (
                                                <span
                                                key={uf.trim()}
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${statesColors[i % statesColors.length]}`}
                                                >
                                                {uf.trim()}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs mb-3">
                                            <div className="text-xs text-blue-600 dark:text-blue-300 bg-[#EFF6FF] dark:bg-[#151515] rounded-full px-2 py-1 w-fit">
                                                {campaign.category || campaign.type}
                                            </div>
                                            <div className="text-yellow-600 dark:text-yellow-300 bg-[#FFFBEB] dark:bg-[#151515] rounded-full px-2 py-1 w-fit">
                                                Até {formatDate(campaign.deadline)}
                                            </div>
                                        </div>
                                        <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-auto">
                                            <div className="font-bold text-lg sm:text-xl">{formatBudget(campaign.budget)}</div>
                                            {button}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>
        </div>
    );
}
