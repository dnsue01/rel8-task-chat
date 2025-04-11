
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Inbox, Calendar, Users, CheckSquare, Mail, Zap } from "lucide-react";

const FeatureTab = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <Card className="border-none shadow-xl overflow-hidden">
    <CardContent className="p-0">
      <div className="bg-gradient-to-br from-purple-600 to-blue-500 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          {icon}
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </CardContent>
  </Card>
);

const FeaturesShowcase: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-white to-purple-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Funcionalidades principales
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Descubre cómo nuestro CRM puede transformar tu gestión profesional diaria
        </p>

        <Tabs defaultValue="contacts" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
            <TabsTrigger value="contacts" className="flex flex-col items-center gap-1 py-3">
              <Users size={18} />
              <span className="text-xs">Contactos</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex flex-col items-center gap-1 py-3">
              <CheckSquare size={18} />
              <span className="text-xs">Tareas</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex flex-col items-center gap-1 py-3">
              <Mail size={18} />
              <span className="text-xs">Email</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex flex-col items-center gap-1 py-3">
              <Calendar size={18} />
              <span className="text-xs">Calendario</span>
            </TabsTrigger>
            <TabsTrigger value="inbox" className="flex flex-col items-center gap-1 py-3">
              <Inbox size={18} />
              <span className="text-xs">Inbox</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex flex-col items-center gap-1 py-3">
              <Zap size={18} />
              <span className="text-xs">IA</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-8">
            <TabsContent value="contacts" className="mt-0 animate-fade-in">
              <FeatureTab icon={<Users size={24} />} title="Gestión de contactos">
                <div className="space-y-4">
                  <p>Organiza todos tus contactos profesionales en un solo lugar:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Categorización por tipo de relación, industria o potencial</li>
                    <li>Historial completo de interacciones para cada contacto</li>
                    <li>Información de contacto detallada y personalizable</li>
                    <li>Notas y documentos asociados a cada perfil</li>
                  </ul>
                  <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1551836022-d5d88e9218df" 
                      alt="Gestión de contactos" 
                      className="w-full h-56 object-cover object-top"
                    />
                  </div>
                </div>
              </FeatureTab>
            </TabsContent>
            
            <TabsContent value="tasks" className="mt-0 animate-fade-in">
              <FeatureTab icon={<CheckSquare size={24} />} title="Gestión de tareas">
                <div className="space-y-4">
                  <p>Mantén un seguimiento efectivo de todas tus tareas pendientes:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Organización por contacto, proyecto o prioridad</li>
                    <li>Recordatorios y fechas límite automatizadas</li>
                    <li>Visualización en formato lista o tablero Kanban</li>
                    <li>Etiquetas personalizables para clasificación</li>
                  </ul>
                  <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b" 
                      alt="Gestión de tareas" 
                      className="w-full h-56 object-cover"
                    />
                  </div>
                </div>
              </FeatureTab>
            </TabsContent>
            
            <TabsContent value="email" className="mt-0 animate-fade-in">
              <FeatureTab icon={<Mail size={24} />} title="Integración con email">
                <div className="space-y-4">
                  <p>Conecta tus cuentas de correo electrónico para una gestión unificada:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Visualiza y responde emails sin salir de la plataforma</li>
                    <li>Asociación automática de correos con contactos</li>
                    <li>Plantillas de email personalizables</li>
                    <li>Programación de envíos y seguimiento de aperturas</li>
                  </ul>
                  <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2" 
                      alt="Integración con email" 
                      className="w-full h-56 object-cover"
                    />
                  </div>
                </div>
              </FeatureTab>
            </TabsContent>
            
            <TabsContent value="calendar" className="mt-0 animate-fade-in">
              <FeatureTab icon={<Calendar size={24} />} title="Calendario integrado">
                <div className="space-y-4">
                  <p>Gestiona tu agenda directamente desde tu CRM personal:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Sincronización bidireccional con Google Calendar y Outlook</li>
                    <li>Vista diaria, semanal y mensual personalizable</li>
                    <li>Eventos vinculados a contactos específicos</li>
                    <li>Recordatorios automáticos y notificaciones</li>
                  </ul>
                  <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1506784365847-bbad939e9335" 
                      alt="Calendario integrado" 
                      className="w-full h-56 object-cover"
                    />
                  </div>
                </div>
              </FeatureTab>
            </TabsContent>
            
            <TabsContent value="inbox" className="mt-0 animate-fade-in">
              <FeatureTab icon={<Inbox size={24} />} title="Bandeja de entrada unificada">
                <div className="space-y-4">
                  <p>Centraliza todas tus comunicaciones en un solo lugar:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Agregación de emails, mensajes y notificaciones</li>
                    <li>Filtros inteligentes para priorizar lo importante</li>
                    <li>Sistema de etiquetado y archivado eficiente</li>
                    <li>Búsqueda avanzada en todo el contenido</li>
                  </ul>
                  <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1563986768494-4dee2763ff3f" 
                      alt="Bandeja de entrada" 
                      className="w-full h-56 object-cover"
                    />
                  </div>
                </div>
              </FeatureTab>
            </TabsContent>
            
            <TabsContent value="ai" className="mt-0 animate-fade-in">
              <FeatureTab icon={<Zap size={24} />} title="Asistente con IA">
                <div className="space-y-4">
                  <p>Potencia tu productividad con nuestro asistente inteligente:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Resúmenes automáticos de conversaciones largas</li>
                    <li>Sugerencias de seguimiento basadas en interacciones previas</li>
                    <li>Categorización automática de contactos y tareas</li>
                    <li>Recomendaciones personalizadas para mejorar tu networking</li>
                  </ul>
                  <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1677442135136-760302cb3d18" 
                      alt="Asistente IA" 
                      className="w-full h-56 object-cover"
                    />
                  </div>
                </div>
              </FeatureTab>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default FeaturesShowcase;
