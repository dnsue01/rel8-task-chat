
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Inbox, 
  Calendar, 
  CheckSquare, 
  Users, 
  Mail, 
  ArrowRight,
  Zap,
  Shield,
  Search,
  Clock
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 md:py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-6">
            Tu CRM Personal Inteligente
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Gestiona tus contactos, tareas y emails en un solo lugar.
            Optimizado para mantener tus relaciones profesionales organizadas.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="text-lg py-6">
                Comenzar ahora <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg py-6">
              Ver demostración
            </Button>
          </div>
        </div>
        
        {/* Preview Image */}
        <div className="mt-12 rounded-lg shadow-xl overflow-hidden mx-auto max-w-4xl border-4 border-white">
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
            alt="CRM Preview" 
            className="w-full object-cover"
          />
        </div>
      </header>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Todo lo que necesitas en un solo lugar
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckSquare className="h-10 w-10 text-crm-purple" />,
                title: "Gestión de tareas",
                description: "Organiza tus tareas por contacto y prioridad. Nunca olvides un seguimiento importante."
              },
              {
                icon: <Users className="h-10 w-10 text-crm-blue" />,
                title: "Base de contactos",
                description: "Mantén toda la información de tus contactos ordenada y accesible cuando la necesites."
              },
              {
                icon: <Mail className="h-10 w-10 text-crm-light-purple" />,
                title: "Integración con email",
                description: "Conecta tus cuentas de email y asocia correos con contactos automáticamente."
              },
              {
                icon: <Calendar className="h-10 w-10 text-crm-indigo" />,
                title: "Sincronización con calendario",
                description: "Sincroniza fechas límite con Google Calendar para estar siempre al día."
              },
              {
                icon: <Search className="h-10 w-10 text-crm-light-blue" />,
                title: "Búsqueda inteligente",
                description: "Encuentra rápidamente cualquier tarea, email o contacto con filtros avanzados."
              },
              {
                icon: <Zap className="h-10 w-10 text-amber-500" />,
                title: "Asistente IA",
                description: "Resúmenes de emails, sugerencias de seguimiento y más con nuestro asistente IA."
              }
            ].map((feature, i) => (
              <Card key={i} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Cómo funciona
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Users className="h-8 w-8" />,
                title: "Añade tus contactos",
                description: "Importa o crea contactos y organízalos por categorías."
              },
              {
                icon: <CheckSquare className="h-8 w-8" />,
                title: "Crea tareas y notas",
                description: "Asigna tareas, recordatorios o notas a cada contacto."
              },
              {
                icon: <Mail className="h-8 w-8" />,
                title: "Conecta tu email",
                description: "Integra tu cuenta de correo para una gestión unificada."
              }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                
                {i < 2 && <ArrowRight className="rotate-90 md:rotate-0 my-4 text-gray-300 md:hidden" />}
                {i < 2 && <ArrowRight className="hidden md:block my-4 text-gray-300" />}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl mx-auto">
            <div className="bg-purple-100 p-6 rounded-full">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            
            <div className="text-left">
              <h3 className="text-2xl font-bold mb-2">Tu información siempre segura</h3>
              <p className="text-gray-600">
                Todos tus datos están cifrados y nunca compartimos tu información con terceros.
                Tu privacidad es nuestra prioridad.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Empieza a organizar tu vida profesional hoy
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Une tus contactos, tareas y comunicaciones en una sola plataforma potente y fácil de usar.
          </p>
          
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="text-lg py-6">
              Comenzar ahora <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 bg-gray-100">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 Personal CRM — Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
