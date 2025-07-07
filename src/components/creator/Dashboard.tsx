import { Button } from "../ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

const stats = [
    { label: "AVAILABLE CAMPAIGNS", value: 12 },
    { label: "ACTIVE CAMPAIGNS", value: 1 },
    { label: "EARNINGS OF THE MONTH", value: "R$ 750" },
];

const campaigns = [
    {
        title: "Summer Look",
        mark: "ModaX",
        type: "Video · TikTok (15 sec)",
        deadline: "10/07/2025",
        price: "R$500",
        badge: "NEW",
    },
    {
        title: "Headphone Review",
        mark: "TechSound",
        type: "Review · Instagram Reels",
        deadline: "15/07/2025",
        price: "R$750",
        badge: "NEW",
    },
    {
        title: "Healthy Recipe",
        mark: "NutriLife",
        type: "Photo · Post Feed Instagram",
        deadline: "20/07/2025",
        price: "R$350",
        badge: "NEW",
    },
    {
        title: "Skincare Routine",
        mark: "BeautyGlow",
        type: "Video · YouTube Shorts",
        deadline: "25/07/2025",
        price: "R$600",
        badge: "NEW",
    },
];

const categories = [
    "All categories",
    "Fashion & Beauty",
    "Technology",
    "Food & Nutrition",
    "Health & Wellness",
    "Lifestyle",
    "Gaming",
    "Education",
    "Travel",
];

const sortOptions = [
    "Sort by",
    "Price: High to Low",
    "Price: Low to High",
    "Deadline: Soonest",
    "Deadline: Latest",
    "Newest First",
    "Most Popular",
];

export default function Dashboard() {
    return (
        <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8 min-h-screen dark:bg-[#171717]">
            {/* Welcome */}
            <div className="flex flex-col gap-2">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold flex items-center gap-2">
                    Welcome, Luiza Costa <span>👋</span>
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                    Discover new campaigns and start creating!
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
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-end">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Select>
                        <SelectTrigger className="w-full sm:w-[160px] lg:w-[180px] h-10 sm:h-9">
                            <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    
                    <Select>
                        <SelectTrigger className="w-full sm:w-[160px] lg:w-[180px] h-10 sm:h-9">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            {sortOptions.map((option) => (
                                <SelectItem key={option} value={option.toLowerCase().replace(/\s+/g, '-')}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            {/* Campaigns */}
            <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">Available Campaigns</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    {campaigns.map((c) => (
                        <div
                            key={c.title}
                            className="rounded-xl border bg-card p-4 sm:p-5 flex flex-col gap-3 shadow-sm relative"
                        >
                            <span className="absolute top-3 right-3 sm:top-4 sm:right-4 text-xs bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-300 rounded-full px-2 sm:px-3 py-1 font-semibold">
                                {c.badge}
                            </span>
                            <div className="font-semibold text-sm sm:text-base pr-16 sm:pr-20">{c.title}</div>
                            <div className="text-xs text-muted-foreground mb-1">Mark: {c.mark}</div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs mb-3">
                                <div className="text-xs text-blue-600 dark:text-blue-300 bg-[#EFF6FF] dark:bg-[#151515] rounded-full px-2 py-1 w-fit">
                                    {c.type}
                                </div>
                                <div className="text-yellow-600 dark:text-yellow-300 bg-[#FFFBEB] dark:bg-[#151515] rounded-full px-2 py-1 w-fit">
                                    Until {c.deadline}
                                </div>
                            </div>
                            <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-auto">
                                <div className="font-bold text-lg sm:text-xl">{c.price}</div>
                                <Button className="w-full sm:w-auto bg-[#E91E63] hover:bg-[#E91E63]/80 text-white text-sm sm:text-base">
                                    See details
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
