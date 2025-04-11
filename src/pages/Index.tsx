
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
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
  Heart,
  MousePointer,
  ChevronRight
} from "lucide-react";
import Testimonials from "@/components/landing/Testimonials";
import Faq from "@/components/landing/Faq";
import FeaturesShowcase from "@/components/landing/FeaturesShowcase";

const Index = () => {
  const [scrolled, setScrolled] = useState(false);
  const [animateHero, setAnimateHero] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const timer = setTimeout(() => {
      setAnimateHero(true);
    }, 100);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const handleAccess = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/auth');
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Navbar mejorado */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                CRM Personal
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-700 hover:text-primary transition-colors">Características</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-primary transition-colors">Cómo funciona</a>
              <a href="#testimonials" className="text-gray-700 hover:text-primary transition-colors">Testimonios</a>
              <a href="#faq" className="text-gray-700 hover:text-primary transition-colors">FAQ</a>
            </div>
            <Button 
              variant="outline" 
              className="border-2 border-primary hover:bg-primary/10"
              onClick={handleAccess}
            >
              Acceder
            </Button>
          </div>
        </div>
      </nav>
      
      {/* Hero Section - Mejorado con animaciones y más interactividad */}
      <header className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-purple-50 via-white to-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className={`mb-6 flex justify-center transition-all duration-700 ${animateHero ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
              <div className="rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800 flex items-center gap-2 animate-pulse-subtle">
                <Sparkles size={16} className="inline text-purple-600" />
                <span>La forma inteligente de gestionar tus contactos</span>
              </div>
            </div>
            
            <h1 className={`text-5xl md:text-7xl font-extrabold text-center mb-6 leading-tight transition-all duration-700 delay-100 ${animateHero ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
              <span className="gradient-text">Tu CRM Personal</span> <br className="hidden md:block" />
              <span className="relative">
                Inteligente
                <svg className="absolute -bottom-2 left-0 w-full h-2 text-purple-300 hidden md:block" viewBox="0 0 400 15" preserveAspectRatio="none">
                  <path d="M0,15 Q200,0 400,15" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>
            </h1>
            
            <p className={`text-xl text-gray-700 mb-8 max-w-3xl mx-auto text-center transition-all duration-700 delay-200 ${animateHero ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
              Gestiona tus contactos, tareas y comunicaciones en un solo lugar.
              Diseñado para profesionales que valoran sus relaciones y su tiempo.
            </p>
            
            <div className={`flex flex-wrap justify-center gap-4 transition-all duration-700 delay-300 ${animateHero ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
              <Button 
                size="lg" 
                className="text-lg py-7 px-10 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                onClick={handleAccess}
              >
                Comenzar gratis <ArrowRight className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg py-7 px-10 border-2 hover:bg-gray-50 transition-all duration-300 rounded-xl">
                Ver demostración
              </Button>
            </div>
          </div>
          
          {/* Preview Image - Mejorado con sombra y animaciones */}
          <div className={`mt-16 relative transition-all duration-1000 delay-500 ${animateHero ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-500/20 rounded-xl blur-2xl transform -rotate-1"></div>
            <div className="rounded-xl shadow-2xl overflow-hidden mx-auto max-w-5xl border-8 border-white relative z-10 transform hover:scale-[1.01] transition-all duration-700">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                alt="CRM Preview" 
                className="w-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <h3 className="text-white text-xl font-bold">Gestión inteligente y sencilla</h3>
                <p className="text-white/90 text-sm">Todo lo que necesitas en un solo lugar</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
      </header>
      
      {/* Trusted by Section - Mejorado con logos y mejor espaciado */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-8">UTILIZADO POR PROFESIONALES DE</p>
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8">
            <div className="flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity">
              <span className="text-gray-400 font-semibold text-xl">Microsoft</span>
              <div className="h-1 w-10 bg-purple-200 mt-2 rounded-full"></div>
            </div>
            <div className="flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity">
              <span className="text-gray-400 font-semibold text-xl">Google</span>
              <div className="h-1 w-10 bg-blue-200 mt-2 rounded-full"></div>
            </div>
            <div className="flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity">
              <span className="text-gray-400 font-semibold text-xl">Amazon</span>
              <div className="h-1 w-10 bg-amber-200 mt-2 rounded-full"></div>
            </div>
            <div className="flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity">
              <span className="text-gray-400 font-semibold text-xl">Uber</span>
              <div className="h-1 w-10 bg-green-200 mt-2 rounded-full"></div>
            </div>
            <div className="flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity">
              <span className="text-gray-400 font-semibold text-xl">IBM</span>
              <div className="h-1 w-10 bg-red-200 mt-2 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Showcase - Con ID para navegación */}
      <section id="features" className="scroll-mt-24">
        <FeaturesShowcase />
      </section>

      {/* How It Works - Mejorado con mejor visualización */}
      <section id="how-it-works" className="py-24 bg-white scroll-mt-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 gradient-text">
            Cómo funciona
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Comienza a organizar tus contactos profesionales en tres simples pasos
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto relative">
            {/* Step connectors for desktop */}
            <div className="absolute top-1/4 left-0 right-0 h-1 bg-gradient-to-r from-purple-200 via-blue-200 to-purple-200 hidden md:block"></div>
            
            {[
              {
                icon: <Users className="h-8 w-8 text-white" />,
                title: "Añade tus contactos",
                description: "Importa tus contactos existentes o crea nuevos perfiles organizados por categorías.",
                color: "from-purple-600 to-indigo-600",
                delay: "0"
              },
              {
                icon: <CheckSquare className="h-8 w-8 text-white" />,
                title: "Organiza tu seguimiento",
                description: "Crea tareas, recordatorios y notas vinculadas a cada contacto importante.",
                color: "from-blue-600 to-cyan-600",
                delay: "200"
              },
              {
                icon: <Mail className="h-8 w-8 text-white" />,
                title: "Conecta tu correo",
                description: "Integra tus cuentas de email para centralizar toda tu comunicación profesional.",
                color: "from-violet-600 to-purple-600",
                delay: "400"
              }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center relative animate-slide-up hover-elevate" style={{animationDelay: `${parseInt(step.delay)}ms`}}>
                <div className="relative z-10 mb-6">
                  <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-purple-200 to-blue-200 animate-pulse-subtle"></div>
                  <div className={`bg-gradient-to-br ${step.color} text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg z-20 relative`}>
                    {step.icon}
                  </div>
                </div>
                <span className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 text-primary font-medium px-4 py-2 rounded-full mb-4">
                  Paso {i + 1}
                </span>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                
                {i < 2 && <ChevronRight className="rotate-90 md:rotate-0 my-4 text-purple-300 md:hidden" size={24} />}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="scroll-mt-24">
        <Testimonials />
      </section>
      
      {/* Stats Section - Mejorado con iconos y animaciones */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "20K+", label: "Usuarios activos", icon: <Users className="h-6 w-6 text-purple-500" />, delay: "0" },
              { value: "1M+", label: "Contactos gestionados", icon: <Inbox className="h-6 w-6 text-blue-500" />, delay: "100" },
              { value: "98%", label: "Satisfacción", icon: <Heart className="h-6 w-6 text-rose-500" />, delay: "200" },
              { value: "24/7", label: "Soporte técnico", icon: <Shield className="h-6 w-6 text-green-500" />, delay: "300" }
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up hover-elevate" style={{animationDelay: `${parseInt(stat.delay)}ms`}}>
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-50 rounded-full">
                    {stat.icon}
                  </div>
                </div>
                <p className="text-4xl font-bold gradient-text mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Trust Section - Mejorado con iconos y mejor diseño */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
            Por qué confiar en nosotros
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: <Shield className="h-7 w-7 text-green-600" />,
                title: "Seguridad garantizada",
                description: "Tus datos están protegidos con cifrado de extremo a extremo.",
                color: "green",
                delay: "0"
              },
              {
                icon: <Globe className="h-7 w-7 text-blue-600" />,
                title: "Acceso en cualquier lugar",
                description: "Utiliza tu CRM desde cualquier dispositivo, en cualquier momento.",
                color: "blue",
                delay: "100"
              },
              {
                icon: <BadgeCheck className="h-7 w-7 text-amber-600" />,
                title: "Soporte premium",
                description: "Nuestro equipo está a tu disposición para ayudarte en todo momento.",
                color: "amber",
                delay: "200"
              }
            ].map((feature, i) => (
              <div key={i} className="card-gradient p-8 rounded-xl shadow-lg flex flex-col items-center text-center animate-slide-up hover-elevate" style={{animationDelay: `${parseInt(feature.delay)}ms`}}>
                <div className={`bg-${feature.color}-100 p-4 rounded-full mb-6 animate-pulse-subtle`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="scroll-mt-24">
        <Faq />
      </section>
      
      {/* CTA Section - Mejorado con mejor diseño y mensaje */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-blue-500 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Empieza a transformar tu networking profesional hoy
            </h2>
            <p className="text-xl mb-10 text-purple-100">
              Une contactos, tareas y comunicaciones en una plataforma intuitiva y potente.
              Sin compromisos, empieza gratis.
            </p>
            
            <div className="flex flex-col md:flex-row gap-5 justify-center">
              <Button 
                size="lg" 
                variant="secondary" 
                className="w-full md:w-auto text-lg py-7 px-10 bg-white text-purple-700 hover:bg-gray-100 transition-colors rounded-xl shadow-lg hover:shadow-xl"
                onClick={handleAccess}
              >
                Crear cuenta gratis <ArrowRight className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="w-full md:w-auto text-lg py-7 px-10 border-2 border-white text-white hover:bg-white/10 transition-colors rounded-xl">
                Ver demostración
              </Button>
            </div>
            
            <div className="mt-10 flex items-center justify-center gap-2 text-white text-sm animate-pulse-subtle">
              <Heart size={16} className="text-pink-300" />
              <span>No requiere tarjeta de crédito</span>
            </div>
          </div>
        </div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '1.5s'}}></div>
      </section>
      
      {/* Footer - Mejorado con más información y links */}
      <footer className="py-16 bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="font-bold text-white text-xl mb-4 flex items-center">
                <span className="mr-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-md w-6 h-6 flex items-center justify-center">
                  <Users size={14} className="text-white" />
                </span>
                Personal CRM
              </h3>
              <p className="text-gray-400">
                La solución inteligente para gestionar tus contactos profesionales y optimizar tu networking.
              </p>
              <div className="mt-6 flex space-x-4">
                <a href="#" className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors">
                  <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors">
                  <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="#" className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors">
                  <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Producto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white hover:underline transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-white hover:underline transition-colors">Precios</a></li>
                <li><a href="#testimonials" className="hover:text-white hover:underline transition-colors">Testimonios</a></li>
                <li><a href="#faq" className="hover:text-white hover:underline transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white hover:underline transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white hover:underline transition-colors">Guías</a></li>
                <li><a href="#" className="hover:text-white hover:underline transition-colors">Soporte</a></li>
                <li><a href="#" className="hover:text-white hover:underline transition-colors">Contacto</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white hover:underline transition-colors">Términos de servicio</a></li>
                <li><a href="#" className="hover:text-white hover:underline transition-colors">Política de privacidad</a></li>
                <li><a href="#" className="hover:text-white hover:underline transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2025 Personal CRM — Todos los derechos reservados</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                LinkedIn
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
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
