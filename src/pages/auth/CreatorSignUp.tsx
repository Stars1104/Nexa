import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import LightLogo from "../../assets/light-logo.png";
import DarkLogo from "../../assets/dark-logo.png";
import { useTheme } from "../../components/ThemeProvider";
import { ThemeToggle } from "../../components/ThemeToggle";
import { useSystemTheme } from "../../hooks/use-system-theme";
import { useParams, useNavigate } from "react-router-dom";

const CreatorSignUp = () => {
  const { theme } = useTheme();
  const systemTheme = useSystemTheme();
  const isDarkMode = theme === "dark" || (theme === "system" && systemTheme);
  const [authType, setAuthType] = useState("signup");
  const { role } = useParams();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      password: "",
      confirmPassword: "",
      isStudent: false,
    },
    mode: "onChange",
  });

  // Reset form when switching auth types
  const handleAuthTypeChange = (newAuthType: string) => {
    setAuthType(newAuthType);
    form.reset({
      name: "",
      email: "",
      whatsapp: "",
      password: "",
      confirmPassword: "",
      isStudent: false,
    });
  };

  // Sign up Function
  const onSignUp = (data: any) => {
    // Handle sign up logic here
    // const user = {
    //   name: data.name,
    //   email: data.email,
    //   whatsapp: data.whatsapp,
    //   password: data.password,
    //   isStudent: data.isStudent,
    // }

    if (data.isStudent) {
      navigate("/student-verify");
    } else {
      if (role === "creator") {
        navigate("/creator/dashboard");
      } else {
        navigate("/brand/dashboard");
      }
    }
  };

  // Sign in Function
  const onSignIn = (data: any) => {
    // const user = {
    //   name: data.name,
    //   email: data.email,
    //   whatsapp: data.whatsapp,
    //   password: data.password,
    //   isStudent: data.isStudent,
    // }

    if (role === "brand") {
      navigate("/brand/dashboard");
    } else {
      navigate("/creator/dashboard");
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted dark:bg-[#171717] transition-colors duration-300 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="bg-background rounded-2xl shadow-lg p-6 md:p-10 w-full max-w-lg flex flex-col items-center gap-6 border border-border relative">
        <img
          src={isDarkMode ? LightLogo : DarkLogo}
          alt="Nexa logo"
          className="w-28 mb-2 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <h1 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-1">
          {authType === "signup" ? "Registrar" : "Entrar"}
        </h1>
        <p className="text-muted-foreground text-center text-base mb-2">
          {authType === "signup" ? "Crie sua conta para começar" : "Entre na sua conta"}
        </p>
        {/* Account type toggle */}
        <div className="flex w-full mb-2 border border-[#E2E2E2] p-1 rounded-full">
          <button
            className={`flex-1 py-2 rounded-full text-base font-semibold transition-colors ${authType === "signup" ? "bg-[#E91E63] text-white" : "bg-background text-foreground"}`}
            onClick={() => handleAuthTypeChange("signup")}
            type="button"
          >
            Cadastrar
          </button>
          <button
            className={`flex-1 py-2 rounded-full border-border text-base font-semibold transition-colors ${authType === "signin" ? "bg-[#E91E63] text-white" : "bg-background text-foreground"}`}
            onClick={() => handleAuthTypeChange("signin")}
            type="button"
          >
            Entrar
          </button>
        </div>
        {authType === "signup" ? (
          <>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSignUp)} className="w-full flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{
                    required: "Nome é obrigatório",
                    minLength: {
                      value: 5,
                      message: "Nome deve ter pelo menos 5 caracteres"
                    },
                    maxLength: {
                      value: 15,
                      message: "Nome deve ter menos de 15 caracteres"
                    },
                    pattern: {
                      value: /\s/,
                      message: "Nome deve conter pelo menos um espaço"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: "E-mail é obrigatório",
                    pattern: {
                      value: /@/,
                      message: "E-mail deve conter o símbolo @"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="seu@email.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  rules={{
                    required: "Senha é obrigatória",
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]+$/,
                      message: "Senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input placeholder="Crie uma senha segura" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  rules={{
                    required: "Por favor, confirme sua senha",
                    validate: (value) => {
                      const password = form.getValues("password");
                      return value === password || "Senhas não coincidem";
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Senha</FormLabel>
                      <FormControl>
                        <Input placeholder="Repita a senha" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {
                  role === "creator" && (
                    <FormField
                      control={form.control}
                      name="isStudent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Sou um estudante e quero verificar meu status
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  )
                }

                <Button type="submit" className="w-full bg-[#E91E63] hover:bg-pink-600 text-white mt-2 rounded-full">
                  Criar conta
                </Button>
              </form>
            </Form>
            <div className="flex items-center w-full gap-2 my-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-muted-foreground text-sm">ou</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 py-2 text-base font-medium rounded-full"
              type="button"
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
            <div className="text-center w-full mt-2 flex justify-center gap-2">
              <span className="text-muted-foreground">Já tem uma conta? </span>
              <div onClick={() => handleAuthTypeChange("signin")} className="font-semibold text-pink-500 hover:underline cursor-pointer">Entrar</div>
            </div>
          </>
        ) : (
          <>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSignIn)} className="w-full flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: "E-mail é obrigatório",
                    pattern: {
                      value: /@/,
                      message: "E-mail deve conter o símbolo @"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="seu@email.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  rules={{
                    required: "Senha é obrigatória"
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite sua senha" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox />
                    <span className="text-muted-foreground text-sm">Lembrar-me</span>
                  </div>
                  <span className="font-bold text-[#E91E63] dark:text-[#E91E63] hover:underline cursor-pointer text-sm" onClick={() => navigate("/forgot-password")}>Esqueceu a senha?</span>
                </div>
                <Button type="submit" className="w-full bg-[#E91E63] hover:bg-pink-600 text-white mt-2 rounded-full">
                  Entrar
                </Button>
              </form>
            </Form>
            <div className="flex items-center w-full gap-2 my-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-muted-foreground text-sm">ou</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 py-2 text-base font-medium rounded-full"
              type="button"
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
            <div className="text-center w-full mt-2 flex justify-center gap-2">
              <span className="text-muted-foreground">Não tem uma conta? </span>
              <div onClick={() => handleAuthTypeChange("signup")} className="font-semibold text-pink-500 hover:underline cursor-pointer">Criar conta</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreatorSignUp;