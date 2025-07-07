import { Button } from "../../components/ui/button";
import LightLogo from "../../assets/light-logo.png";
import DarkLogo from "../../assets/dark-logo.png";
import { ArrowRight, Home, User } from "lucide-react";
import { useTheme } from "../../components/ThemeProvider";
import { ThemeToggle } from "../../components/ThemeToggle";
import { useSystemTheme } from "../../hooks/use-system-theme";
import { useNavigate } from "react-router-dom";

const AuthStep = () => {
    const { theme } = useTheme();
    const systemTheme = useSystemTheme();
    const isDarkMode = theme === "dark" || (theme === "system" && systemTheme);
    const navigate = useNavigate();

    const handleInfluencer = () => {
        navigate("/signup/creator");
    };

    const handleCompany = () => {
        navigate("/signup/brand");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted dark:bg-[#171717] transition-colors duration-300">
            <div className="bg-background rounded-2xl shadow-lg p-8 md:p-10 w-full max-w-lg flex flex-col items-center gap-6 border border-border">
                <div className="flex flex-col items-center gap-2">
                    <img
                        src={isDarkMode ? LightLogo : DarkLogo}
                        alt="Nexa logo"
                        className="w-28 mb-2 cursor-pointer"
                        onClick={() => navigate("/")}
                    />
                    <h1 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-1">
                        Como você quer entrar?
                    </h1>
                    <p className="text-muted-foreground text-center text-base mb-2">
                        Escolha o tipo de conta para acessar a plataforma
                    </p>
                </div>
                <div className="flex flex-col gap-3 w-full">
                    <Button
                        variant="outline"
                        className="w-full flex justify-between items-center py-6 px-4 text-lg font-semibold"
                        onClick={handleCompany}
                    >
                        <span className="flex items-center gap-2">
                            <Home className="w-6 h-6" /> Sou uma empresa
                        </span>
                        <span>
                            <ArrowRight className="w-6 h-6" />
                        </span>
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full flex justify-between items-center py-6 px-4 text-lg font-semibold"
                        onClick={handleInfluencer}
                    >
                        <span className="flex items-center gap-2">
                            <User className="w-6 h-6" /> Sou um influenciador
                        </span>
                        <span>
                            <ArrowRight className="w-6 h-6" />
                        </span>
                    </Button>
                </div>
                <div className="flex items-center w-full gap-2 my-2">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-muted-foreground text-sm">ou</span>
                    <div className="flex-1 h-px bg-border" />
                </div>
                <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 py-5 text-base font-medium"
                >
                    <span className="inline-block align-middle">
                        {/* Google SVG icon */}
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <g clipPath="url(#clip0_993_156)">
                                <path d="M19.8052 10.2305C19.8052 9.55078 19.7491 8.86719 19.6285 8.19922H10.2V12.0508H15.6402C15.4152 13.2812 14.671 14.332 13.6241 15.0117V17.0898H16.6841C18.4291 15.4805 19.8052 13.1602 19.8052 10.2305Z" fill="#4285F4" />
                                <path d="M10.2 20C12.6991 20 14.7991 19.1797 16.6841 17.0898L13.6241 15.0117C12.5491 15.7519 11.2741 16.1679 10.2 16.1679C7.78906 16.1679 5.74906 14.542 5.01406 12.3672H1.84906V14.5117C3.78906 17.7422 6.79906 20 10.2 20Z" fill="#34A853" />
                                <path d="M5.01406 12.3672C4.81406 11.792 4.69906 11.1797 4.69906 10.542C4.69906 9.9043 4.81406 9.292 5.01406 8.7168V6.57227H1.84906C1.15406 7.89258 0.75 9.38672 0.75 10.542C0.75 11.6973 1.15406 13.1914 1.84906 14.5117L5.01406 12.3672Z" fill="#FBBC05" />
                                <path d="M10.2 4.91602C11.386 4.91602 12.462 5.32227 13.3052 6.12305L16.7485 2.67969C14.7991 0.855469 12.6991 0 10.2 0C6.79906 0 3.78906 2.25781 1.84906 5.48828L5.01406 7.63281C5.74906 5.45703 7.78906 3.83203 10.2 3.83203V4.91602Z" fill="#EA4335" />
                            </g>
                            <defs>
                                <clipPath id="clip0_993_156">
                                    <rect width="19.0552" height="20" fill="white" transform="translate(0.75)" />
                                </clipPath>
                            </defs>
                        </svg>
                    </span>
                    Continuar com o Google
                </Button>
                <div className="text-center w-full mt-2">
                    <span className="text-muted-foreground">Não tem uma conta? </span>
                    <a href="#" className="font-semibold text-pink-500 hover:underline">Criar conta</a>
                </div>
                <div className="absolute top-4 right-4">
                    <ThemeToggle />
                </div>
            </div>
        </div>
    );
};

export default AuthStep;
