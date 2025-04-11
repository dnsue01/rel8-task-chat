
import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { useCrm } from "../context/CrmContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const Settings = () => {
  const { currentUser } = useCrm();
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    calendar: true,
  });
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("es");

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar el perfil
    toast({
      title: "Perfil actualizado",
      description: "Tus cambios han sido guardados exitosamente.",
    });
  };

  const handleSavePreferences = () => {
    // Aquí iría la lógica para guardar las preferencias
    toast({
      title: "Preferencias actualizadas",
      description: "Tus preferencias han sido guardadas exitosamente.",
    });
  };

  return (
    <Layout hideSidebar>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8">Configuración</h1>

        <Tabs defaultValue="profile" className="max-w-4xl">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="preferences">Preferencias</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Información de Perfil</CardTitle>
                <CardDescription>
                  Actualiza tu información personal y foto de perfil.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="flex items-center space-x-6 mb-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={currentUser?.avatar} />
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {getInitials(name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button type="button" variant="outline" className="mb-2">
                        Cambiar foto
                      </Button>
                      <p className="text-sm text-gray-500">
                        JPG, GIF o PNG. Máximo 1MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tu nombre"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit">Guardar cambios</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferencias</CardTitle>
                <CardDescription>
                  Personaliza tu experiencia de usuario.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Tema</h3>
                        <p className="text-sm text-gray-500">
                          Selecciona el tema de la aplicación
                        </p>
                      </div>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Selecciona tema" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="dark">Oscuro</SelectItem>
                          <SelectItem value="system">Sistema</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Idioma</h3>
                        <p className="text-sm text-gray-500">
                          Selecciona tu idioma preferido
                        </p>
                      </div>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Selecciona idioma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-medium">Notificaciones</h3>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications">Correo electrónico</Label>
                          <p className="text-sm text-gray-500">
                            Recibir notificaciones por email
                          </p>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={notifications.email}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, email: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="browser-notifications">Navegador</Label>
                          <p className="text-sm text-gray-500">
                            Mostrar notificaciones en el navegador
                          </p>
                        </div>
                        <Switch
                          id="browser-notifications"
                          checked={notifications.browser}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, browser: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="calendar-notifications">Calendario</Label>
                          <p className="text-sm text-gray-500">
                            Sincronizar eventos con tu calendario
                          </p>
                        </div>
                        <Switch
                          id="calendar-notifications"
                          checked={notifications.calendar}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, calendar: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSavePreferences}>Guardar preferencias</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Seguridad</CardTitle>
                <CardDescription>
                  Administra tu contraseña y seguridad de la cuenta.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Contraseña actual</Label>
                      <Input
                        id="current-password"
                        type="password"
                        placeholder="••••••••••"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nueva contraseña</Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="••••••••••"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••••"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="button">Actualizar contraseña</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
