
import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { useCrm } from "../context/CrmContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { CircleUserRound, Mail, Upload, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useIntegrations } from "../context/IntegrationsContext";

const Settings: React.FC = () => {
  const { currentUser, updateUser } = useCrm(); // Changed from updateUserProfile to updateUser to match context
  const { isGoogleConnected, disconnectGoogleCalendar } = useIntegrations();
  const { toast } = useToast();
  
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [updating, setUpdating] = useState(false);

  const handleUpdateProfile = () => {
    setUpdating(true);
    
    // Simulación de actualización
    setTimeout(() => {
      updateUser({
        ...currentUser,
        name,
        email
      });
      
      toast({
        title: "Perfil actualizado",
        description: "Tu información de perfil ha sido actualizada exitosamente."
      });
      
      setUpdating(false);
    }, 1000);
  };

  // Generador de iniciales para el avatar
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Configuración</h1>
        <p className="text-muted-foreground mb-6">Gestiona tu cuenta y preferencias</p>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="account">Cuenta</TabsTrigger>
            <TabsTrigger value="integrations">Integraciones</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Información de Perfil</CardTitle>
                <CardDescription>
                  Actualiza tu información personal y foto de perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={currentUser.avatar_url} />
                      <AvatarFallback className="text-xl bg-primary/10 text-primary">
                        {getInitials(currentUser.name)}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" className="mt-4">
                      <Upload className="mr-2 h-4 w-4" /> Cambiar foto
                    </Button>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre completo</Label>
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleUpdateProfile} disabled={updating}>
                  {updating ? "Actualizando..." : "Guardar cambios"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Cuenta</CardTitle>
                <CardDescription>
                  Gestiona la configuración de tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Correo electrónico verificado</h3>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{currentUser.email}</span>
                    <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">Verificado</Badge>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Cambiar contraseña</h3>
                  <p className="text-sm text-muted-foreground">
                    Para mayor seguridad, te recomendamos cambiar tu contraseña regularmente
                  </p>
                  <Button variant="outline" className="mt-2">Cambiar contraseña</Button>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-destructive">Eliminar cuenta</h3>
                  <p className="text-sm text-muted-foreground">
                    Al eliminar tu cuenta, perderás permanentemente todos tus datos
                  </p>
                  <Button variant="destructive" className="mt-2">Eliminar cuenta</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Integraciones</CardTitle>
                <CardDescription>
                  Gestiona tus servicios conectados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="w-8 h-8 bg-red-100 rounded-full -ml-3 flex items-center justify-center">
                          <Mail className="h-4 w-4 text-red-500" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium">Google (Calendario y Gmail)</h3>
                        <p className="text-sm text-gray-500">
                          {isGoogleConnected ? 'Conectado' : 'No conectado'}
                        </p>
                      </div>
                    </div>
                    {isGoogleConnected ? (
                      <Button variant="outline" onClick={disconnectGoogleCalendar}>
                        Desconectar
                      </Button>
                    ) : (
                      <Button onClick={() => window.location.href = '/integrations'}>
                        Conectar
                      </Button>
                    )}
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>
                      La integración con Google te permite sincronizar tu calendario y correo,
                      para mantener toda tu información organizada en un solo lugar.
                    </p>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm"
                      onClick={() => window.location.href = '/integrations'}
                    >
                      Configurar en detalle →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
