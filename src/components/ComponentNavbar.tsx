import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarFallback } from "./ui/avatar";

const CreatorNavbar = () => {

  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Left: Logo and Title */}
      <div className="flex items-center gap-4">
        <span className="text-base sm:text-lg font-semibold md:block hidden">Dashboard</span>
      </div>
      {/* Right: Theme toggle and user info */}
      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
            <AvatarFallback className="text-sm sm:text-base">LC</AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col text-right">
            <span className="font-medium leading-none">Luiza Costa</span>
            <span className="text-xs text-muted-foreground">Content Creator</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default CreatorNavbar;