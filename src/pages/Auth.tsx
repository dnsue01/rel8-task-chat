
import React, { useState, useEffect, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useCrm } from "../context/CrmContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AtSign, KeyRound, ArrowRight, UserPlus, LogIn, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { googleClient } from "../integrations/google/googleClient";

const Auth: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { isAuthenticated, login, register, loginWithGoogle } = useCrm();
  const { toast } = useToast();
  const navigate = useNavigate();
  const googleSignInButtonRef = useRef<HTMLDivElement>(null);
  const googleSignInButtonRegisterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Render Google Sign-In buttons for both login and register tabs
    const renderGoogleButtons = () => {
      // Render for login tab
      if (googleSignInButtonRef.current) {
        const handleGoogleResponse = async (response: any) => {
          try {
            await loginWithGoogle(response.credential);
            toast({
              title: "Inicio de sesión exitoso",
              description: "Bienvenido a tu CRM personal",
            });
            navigate("/app");
          } catch (error) {
            toast({
              title: "Error al iniciar sesión con Google",
              description: error instanceof Error ? error.message : "Error de autenticación",
              variant: "destructive",
            });
          }
        };

        googleClient.renderGoogleSignInButton("google-signin-button", handleGoogleResponse);
      }

      // Render for register tab
      if (googleSignInButtonRegisterRef.current) {
        const handleGoogleResponseRegister = async (response: any) => {
          try {
            await loginWithGoogle(response.credential);
            toast({
              title: "Registro exitoso",
              description: "Bienvenido a tu CRM personal",
            });
            navigate("/app");
          } catch (error) {
            toast({
              title: "Error al registrarse con Google",
              description: error instanceof Error ? error.message : "Error de autenticación",
              variant: "destructive",
            });
          }
        };

        googleClient.renderGoogleSignInButton("google-signin-button-register", handleGoogleResponseRegister);
      }
    };

    // Small delay to ensure DOM elements are ready
    const timer = setTimeout(() => {
      renderGoogleButtons();
    }, 100);

    return () => clearTimeout(timer);
  }, [loginWithGoogle, navigate, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido a tu CRM personal",
      });
      navigate("/app");
    } catch (error) {
      toast({
        title: "Error al iniciar sesión",
        description: error instanceof Error ? error.message : "Credenciales inválidas",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    try {
      await register(name, email, password);
      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada. ¡Bienvenido!",
      });
      navigate("/app");
    } catch (error) {
      toast({
        title: "Error al registrarse",
        description: error instanceof Error ? error.message : "No se pudo crear la cuenta",
        variant: "destructive",
      });
    }
  };

  const goBack = () => {
    navigate('/');
  };

  // If the user is already authenticated, redirect to the app
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-4 text-gray-600"
            onClick={goBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la página principal
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            CRM Personal
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona tus contactos y tareas en un solo lugar
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acceso</CardTitle>
            <CardDescription>
              Inicia sesión o crea una cuenta para comenzar a usar tu CRM personal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" /> Iniciar sesión
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" /> Registrarse
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <div className="mb-4">
                  <div 
                    id="google-signin-button" 
                    ref={googleSignInButtonRef} 
                    className="flex justify-center mb-4"
                  ></div>
                </div>

                <div className="relative mb-4">
                  <Separator className="my-4" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white px-2 text-xs text-gray-500">o continuar con email</span>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email-login">Email</Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email-login"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password-login">Contraseña</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password-login"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Iniciar sesión <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <div className="mb-4">
                  <div 
                    id="google-signin-button-register"
                    ref={googleSignInButtonRegisterRef}
                    className="flex justify-center mb-4"
                  ></div>
                </div>

                <div className="relative mb-4">
                  <Separator className="my-4" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white px-2 text-xs text-gray-500">o registrarse con email</span>
                  </div>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email-register">Email</Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email-register"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password-register">Contraseña</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password-register"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Crear cuenta <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-gray-500">
              Tus datos personales están protegidos
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
