
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
  Clock,
  Sparkles,
  Globe,
  BadgeCheck,
  Heart
} from "lucide-react";
import Testimonials from "@/components/landing/Testimonials";
import Faq from "@/components/landing/Faq";
import FeaturesShowcase from "@/components/landing/FeaturesShowcase";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section - Mejorado con animaciones y mejores CTA */}
      <header className="container mx-auto px-4 pt-24 pb-16 md:pt-32 md:pb-24 text-center relative">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-purple-300 to-blue-300 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 flex items-center gap-1 animate-fade-in">
              <Sparkles size={14} className="inline" />
              <span>Organiza tus relaciones profesionales como nunca antes</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 leading-tight animate-fade-in">
            Tu CRM Personal <br className="hidden md:block" />Inteligente
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto animate-fade-in">
            Gestiona tus contactos, tareas y comunicaciones en un solo lugar.
            Diseñado para profesionales que valoran sus relaciones y su tiempo.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in">
            <Link to="/auth">
              <Button size="lg" className="text-lg py-6 px-8 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300">
                Comenzar gratis <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg py-6 px-8 border-2 hover:bg-gray-50 transition-all duration-300">
              Ver demostración
            </Button>
          </div>
        </div>
        
        {/* Preview Image - Mejorado con sombra y bordes */}
        <div className="mt-16 rounded-xl shadow-2xl overflow-hidden mx-auto max-w-4xl border-8 border-white animate-fade-in">
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
            alt="CRM Preview" 
            className="w-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
      </header>
      
      {/* Trusted by Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 mb-6">UTILIZADO POR PROFESIONALES DE</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60">
            <span className="text-gray-400 font-semibold text-xl">Microsoft</span>
            <span className="text-gray-400 font-semibold text-xl">Google</span>
            <span className="text-gray-400 font-semibold text-xl">Amazon</span>
            <span className="text-gray-400 font-semibold text-xl">Uber</span>
            <span className="text-gray-400 font-semibold text-xl">IBM</span>
            <span className="text-gray-400 font-semibold text-xl">Oracle</span>
          </div>
        </div>
      </section>
      
      {/* Features Showcase - Nuevo componente con tabs interactivas */}
      <FeaturesShowcase />

      {/* How It Works - Mejorado con mejor visualización */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Cómo funciona
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Comienza a organizar tus contactos profesionales en tres simples pasos
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
            {/* Step connectors for desktop */}
            <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-purple-200 hidden md:block" />
            
            {[
              {
                icon: <Users className="h-8 w-8 text-white" />,
                title: "Añade tus contactos",
                description: "Importa tus contactos existentes o crea nuevos perfiles organizados por categorías."
              },
              {
                icon: <CheckSquare className="h-8 w-8 text-white" />,
                title: "Organiza tu seguimiento",
                description: "Crea tareas, recordatorios y notas vinculadas a cada contacto importante."
              },
              {
                icon: <Mail className="h-8 w-8 text-white" />,
                title: "Conecta tu correo",
                description: "Integra tus cuentas de email para centralizar toda tu comunicación profesional."
              }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center relative">
                <div className="relative">
                  <div className="bg-gradient-to-br from-purple-600 to-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-lg z-10">
                    {step.icon}
                  </div>
                  <div className="absolute -inset-2 rounded-full bg-purple-100 -z-10 animate-pulse opacity-50" />
                </div>
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full mb-3">
                  Paso {i + 1}
                </span>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                
                {i < 2 && <ArrowRight className="rotate-90 md:rotate-0 my-4 text-purple-300 md:hidden" />}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section - Nuevo componente */}
      <Testimonials />
      
      {/* Stats Section - Nuevo */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <p className="text-4xl font-bold text-purple-600 mb-2">20K+</p>
              <p className="text-gray-600">Usuarios activos</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-purple-600 mb-2">1M+</p>
              <p className="text-gray-600">Contactos gestionados</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-purple-600 mb-2">98%</p>
              <p className="text-gray-600">Satisfacción</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-purple-600 mb-2">24/7</p>
              <p className="text-gray-600">Soporte técnico</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trust Section - Mejorado con iconos y mejor diseño */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Seguridad garantizada</h3>
              <p className="text-gray-600">Tus datos están protegidos con cifrado de extremo a extremo.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Acceso en cualquier lugar</h3>
              <p className="text-gray-600">Utiliza tu CRM desde cualquier dispositivo, en cualquier momento.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center">
              <div className="bg-amber-100 p-3 rounded-full mb-4">
                <BadgeCheck className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Soporte premium</h3>
              <p className="text-gray-600">Nuestro equipo está a tu disposición para ayudarte en todo momento.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section - Nuevo componente */}
      <Faq />
      
      {/* CTA Section - Mejorado con mejor diseño y mensaje */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Empieza a transformar tu networking profesional hoy
            </h2>
            <p className="text-xl mb-8 text-purple-100">
              Une contactos, tareas y comunicaciones en una plataforma intuitiva y potente.
              Sin compromisos, empieza gratis.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="w-full md:w-auto text-lg py-6 px-8 bg-white text-purple-700 hover:bg-gray-100 transition-colors">
                  Crear cuenta gratis <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full md:w-auto text-lg py-6 px-8 border-white text-white hover:bg-purple-700 transition-colors">
                Ver demostración
              </Button>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-2 text-purple-200 text-sm">
              <Heart size={14} className="text-pink-300" />
              <span>No requiere tarjeta de crédito</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer - Mejorado con más información y links */}
      <footer className="py-12 bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white text-lg mb-4">Personal CRM</h3>
              <p className="text-gray-400 text-sm">
                La solución inteligente para gestionar tus contactos profesionales y optimizar tu networking.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Producto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Testimonios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guías</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Soporte</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Términos de servicio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2025 Personal CRM — Todos los derechos reservados</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
