
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Inbox, Calendar, Users, CheckSquare, Mail, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FeatureTab = ({ icon, title, children, color }: { icon: React.ReactNode; title: string; children: React.ReactNode; color: string }) => (
  <Card className="border-none shadow-xl overflow-hidden rounded-xl hover-elevate">
    <CardContent className="p-0">
      <div className={`bg-gradient-to-br ${color} p-8 text-white`}>
        <div className="flex items-center gap-4 mb-3">
          {icon}
          <h3 className="text-2xl font-bold">{title}</h3>
        </div>
      </div>
      <div className="p-8">
        {children}
      </div>
    </CardContent>
  </Card>
);

const FeaturesShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState("contacts");

  return (
    <section className="py-20 bg-gradient-to-br from-white to-purple-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 gradient-text">
          Funcionalidades principales
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
          Descubre cómo nuestro CRM puede transformar tu gestión profesional diaria
        </p>

        <Tabs defaultValue="contacts" className="w-full max-w-5xl mx-auto" value={activeTab} onValueChange={setActiveTab}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200/50 to-blue-200/50 -m-2 rounded-full blur-xl"></div>
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-12 p-1 relative bg-white/80 backdrop-blur-sm mx-auto max-w-4xl">
              {[
                { value: "contacts", icon: <Users size={20} />, label: "Contactos" },
                { value: "tasks", icon: <CheckSquare size={20} />, label: "Tareas" },
                { value: "email", icon: <Mail size={20} />, label: "Email" },
                { value: "calendar", icon: <Calendar size={20} />, label: "Calendario" },
                { value: "inbox", icon: <Inbox size={20} />, label: "Inbox" },
                { value: "ai", icon: <Zap size={20} />, label: "IA" }
              ].map(tab => (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value} 
                  className={`flex flex-col items-center gap-2 py-4 ${activeTab === tab.value ? 'bg-white shadow-lg' : ''}`}
                >
                  <div className={`p-2 rounded-full ${activeTab === tab.value ? 'bg-primary/10' : 'bg-gray-50'}`}>
                    {tab.icon}
                  </div>
                  <span className="text-sm">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          <div className="mt-8">
            <TabsContent value="contacts" className="mt-0 animate-slide-up">
              <FeatureTab 
                icon={<Users size={28} />} 
                title="Gestión de contactos"
                color="from-purple-600 to-indigo-600"
              >
                <div className="space-y-6">
                  <p className="text-lg">Organiza todos tus contactos profesionales en un solo lugar:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-purple-100 p-1 mt-1">
                        <ArrowRight size={14} className="text-purple-600" />
                      </div>
                      <p>Categorización por tipo de relación, industria o potencial</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-purple-100 p-1 mt-1">
                        <ArrowRight size={14} className="text-purple-600" />
                      </div>
                      <p>Historial completo de interacciones para cada contacto</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-purple-100 p-1 mt-1">
                        <ArrowRight size={14} className="text-purple-600" />
                      </div>
                      <p>Información de contacto detallada y personalizable</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-purple-100 p-1 mt-1">
                        <ArrowRight size={14} className="text-purple-600" />
                      </div>
                      <p>Notas y documentos asociados a cada perfil</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 border border-gray-100 rounded-xl overflow-hidden shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1551836022-d5d88e9218df" 
                      alt="Gestión de contactos" 
                      className="w-full h-64 object-cover object-top hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  
                  <div className="mt-8 text-center">
                    <Link to="/auth">
                      <Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
                        Prueba la gestión de contactos <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </FeatureTab>
            </TabsContent>
            
            <TabsContent value="tasks" className="mt-0 animate-slide-up">
              <FeatureTab 
                icon={<CheckSquare size={28} />} 
                title="Gestión de tareas"
                color="from-blue-600 to-cyan-600"
              >
                <div className="space-y-6">
                  <p className="text-lg">Mantén un seguimiento efectivo de todas tus tareas pendientes:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-blue-100 p-1 mt-1">
                        <ArrowRight size={14} className="text-blue-600" />
                      </div>
                      <p>Organización por contacto, proyecto o prioridad</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-blue-100 p-1 mt-1">
                        <ArrowRight size={14} className="text-blue-600" />
                      </div>
                      <p>Recordatorios y fechas límite automatizadas</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-blue-100 p-1 mt-1">
                        <ArrowRight size={14} className="text-blue-600" />
                      </div>
                      <p>Visualización en formato lista o tablero Kanban</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-blue-100 p-1 mt-1">
                        <ArrowRight size={14} className="text-blue-600" />
                      </div>
                      <p>Etiquetas personalizables para clasificación</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 border border-gray-100 rounded-xl overflow-hidden shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b" 
                      alt="Gestión de tareas" 
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  
                  <div className="mt-8 text-center">
                    <Link to="/auth">
                      <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
                        Prueba la gestión de tareas <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </FeatureTab>
            </TabsContent>
            
            <TabsContent value="email" className="mt-0 animate-slide-up">
              <FeatureTab 
                icon={<Mail size={28} />} 
                title="Integración con email"
                color="from-purple-600 to-blue-600"
              >
                <div className="space-y-6">
                  <p className="text-lg">Conecta tus cuentas de correo electrónico para una gestión unificada:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-purple-100 p-1 mt-1">
                        <ArrowRight size={14} className="text-purple-600" />
                      </div>
                      <p>Visualiza y responde emails sin salir de la plataforma</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-purple-100 p-1 mt-1">
                        <ArrowRight size={14} className="text-purple-600" />
                      </div>
                      <p>Asociación automática de correos con contactos</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-purple-100 p-1 mt-1">
                        <ArrowRight size={14} className="text-purple-600" />
                      </div>
                      <p>Plantillas de email personalizables</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-purple-100 p-1 mt-1">
                        <ArrowRight size={14} className="text-purple-600" />
                      </div>
                      <p>Programación de envíos y seguimiento de aperturas</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 border border-gray-100 rounded-xl overflow-hidden shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2" 
                      alt="Integración con email" 
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  
                  <div className="mt-8 text-center">
                    <Link to="/auth">
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                        Prueba la integración con email <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </FeatureTab>
            </TabsContent>
            
            <TabsContent value="calendar" className="mt-0 animate-slide-up">
              <FeatureTab 
                icon={<Calendar size={28} />} 
                title="Calendario integrado"
                color="from-indigo-600 to-blue-600"
              >
                <div className="space-y-6">
                  <p className="text-lg">Gestiona tu agenda directamente desde tu CRM personal:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-indigo-100 p-1 mt-1">
                        <ArrowRight size={14} className="text-indigo-600" />
                      </div>
                      <p>Sincronización bidireccional con Google Calendar y Outlook</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-indigo-100 p-1 mt-1">
                        <ArrowRight size={14} className="text-indigo-600" />
                      </div>
                      <p>Vista diaria, semanal y mensual personalizable</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-indigo-100 p-1 mt-1">
                        <ArrowRight size={14} className="text-indigo-600" />
                      </div>
                      <p>Eventos vinculados a contactos específicos</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-indigo-100 p-1 mt-1">
                        <ArrowRight size={14} className="text-indigo-600" />
                      </div>
                      <p>Recordatorios automáticos y notificaciones</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 border border-gray-100 rounded-xl overflow-hidden shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1506784365847-bbad939e9335" 
                      alt="Calendario integrado" 
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  
                  <div className="mt-8 text-center">
                    <Link to="/auth">
                      <Button className="bg-gradient-to-r from-indigo-600 to-blue-600">
                        Prueba el calendario integrado <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </FeatureTab>
            </TabsContent>
            
            <TabsContent value="inbox" className="mt-0 animate-slide-up">
              <FeatureTab 
                icon={<Inbox size={28} />} 
                title="Bandeja de entrada unificada"
                color="from-amber-600 to-orange-600"
              >
                <div className="space-y-6">
                  <p className="text-lg">Centraliza todas tus comunicaciones en un solo lugar:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-amber-100 p-1 mt-1">
                        <ArrowRight size={14} className="text-amber-600" />
                      </div>
                      <p>Agregación de emails, mensajes y notificaciones</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-amber-100 p-1 mt-1">
                        <ArrowRight size={14} className="text-amber-600" />
                      </div>
                      <p>Filtros inteligentes para priorizar lo importante</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-amber-100 p-1 mt-1">
                        <ArrowRight size={14} className="text-amber-600" />
                      </div>
                      <p>Sistema de etiquetado y archivado eficiente</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-amber-100 p-1 mt-1">
                        <ArrowRight size={14} className="text-amber-600" />
                      </div>
                      <p>Búsqueda avanzada en todo el contenido</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 border border-gray-100 rounded-xl overflow-hidden shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1563986768494-4dee2763ff3f" 
                      alt="Bandeja de entrada" 
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  
                  <div className="mt-8 text-center">
                    <Link to="/auth">
                      <Button className="bg-gradient-to-r from-amber-600 to-orange-600">
                        Prueba la bandeja de entrada <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </FeatureTab>
            </TabsContent>
            
            <TabsContent value="ai" className="mt-0 animate-slide-up">
              <FeatureTab 
                icon={<Zap size={28} />} 
                title="Asistente con IA"
                color="from-violet-600 to-purple-600"
              >
                <div className="space-y-6">
                  <p className="text-lg">Potencia tu productividad con nuestro asistente inteligente:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-violet-100 p-1 mt-1">
                        <ArrowRight size={14} className="text-violet-600" />
                      </div>
                      <p>Resúmenes automáticos de conversaciones largas</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-violet-100 p-1 mt-1">
                        <ArrowRight size={14} className="text-violet-600" />
                      </div>
                      <p>Sugerencias de seguimiento basadas en interacciones previas</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-violet-100 p-1 mt-1">
                        <ArrowRight size={14} className="text-violet-600" />
                      </div>
                      <p>Categorización automática de contactos y tareas</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-violet-100 p-1 mt-1">
                        <ArrowRight size={14} className="text-violet-600" />
                      </div>
                      <p>Recomendaciones personalizadas para mejorar tu networking</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 border border-gray-100 rounded-xl overflow-hidden shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1677442135136-760302cb3d18" 
                      alt="Asistente IA" 
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  
                  <div className="mt-8 text-center">
                    <Link to="/auth">
                      <Button className="bg-gradient-to-r from-violet-600 to-purple-600">
                        Prueba el asistente IA <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
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
