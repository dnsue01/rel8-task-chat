
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

interface TestimonialProps {
  text: string;
  author: string;
  role: string;
  avatar: string;
  company?: string;
  delay?: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ text, author, role, avatar, company, delay = "0" }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, parseInt(delay));
    
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Card 
      className={`border-none shadow-lg hover:shadow-xl transition-all duration-500 h-full bg-gradient-to-br from-white to-purple-50 rounded-xl hover-elevate transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} 
      style={{transitionDelay: `${parseInt(delay) + 100}ms`}}
    >
      <CardContent className="p-8 flex flex-col h-full relative">
        <Quote className="absolute top-6 right-6 text-purple-200 h-12 w-12 opacity-50" />
        <div className="flex-1">
          <p className="text-gray-700 italic mb-6 text-lg relative z-10">{text}</p>
        </div>
        <div className="flex items-center mt-6 pt-6 border-t border-gray-100">
          <Avatar className="h-12 w-12 mr-4 ring-2 ring-purple-100">
            <AvatarImage src={avatar} alt={author} />
            <AvatarFallback>{author.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{author}</p>
            <p className="text-sm text-gray-500">{role}{company && `, ${company}`}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-purple-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 gradient-text">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-gray-600 text-lg">
            Profesionales de diversos sectores ya están mejorando su gestión con nuestro CRM personal.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Testimonial 
            text="Este CRM ha transformado cómo gestiono mis contactos profesionales. Todo está organizado y accesible exactamente cuando lo necesito. La integración con el correo es simplemente perfecta."
            author="María González"
            role="Consultora independiente"
            company="MG Consulting"
            avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
            delay="0"
          />
          <Testimonial 
            text="La integración con el correo electrónico es justo lo que necesitaba. Ahora puedo dar seguimiento a conversaciones importantes sin perderme nada, y todo desde una interfaz intuitiva."
            author="Daniel Martínez"
            role="Gerente de ventas"
            company="TechSolutions"
            avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
            delay="200"
          />
          <Testimonial 
            text="La interfaz es tan intuitiva que pude comenzar a usarlo productivamente desde el primer día. El asistente IA me ayuda a priorizar contactos y seguimientos de forma eficiente."
            author="Laura Rodríguez"
            role="Emprendedora"
            company="Creative Hub"
            avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb"
            delay="400"
          />
        </div>
        
        {/* Segundo grupo de testimonios - Visibles solo en pantallas más grandes */}
        <div className="hidden lg:grid grid-cols-2 gap-8 max-w-4xl mx-auto mt-8">
          <Testimonial 
            text="Como freelancer, necesitaba una herramienta que me permitiera gestionar mis clientes sin complicaciones. Este CRM ha simplificado mi día a día enormemente."
            author="Carlos Vega"
            role="Diseñador UX/UI"
            avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
            delay="300"
          />
          <Testimonial 
            text="La posibilidad de vincular correos y eventos de calendario a cada contacto me permite tener un contexto completo antes de cada reunión. Ha aumentado mi eficacia de forma notable."
            author="Sofía Morales"
            role="Directora de Marketing"
            company="AgencyOne"
            avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
            delay="500"
          />
        </div>
        
        {/* Logos de empresas cuyos empleados usan el producto */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 mb-6">EMPRESAS CUYOS PROFESIONALES CONFÍAN EN NOSOTROS</p>
          <div className="flex flex-wrap justify-center items-center gap-10 opacity-60">
            <div className="flex flex-col items-center p-4 rounded-xl hover:bg-white hover:shadow-md transition-all">
              <span className="text-gray-400 font-semibold">Adobe</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl hover:bg-white hover:shadow-md transition-all">
              <span className="text-gray-400 font-semibold">Slack</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl hover:bg-white hover:shadow-md transition-all">
              <span className="text-gray-400 font-semibold">Spotify</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl hover:bg-white hover:shadow-md transition-all">
              <span className="text-gray-400 font-semibold">Netflix</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl hover:bg-white hover:shadow-md transition-all">
              <span className="text-gray-400 font-semibold">Airbnb</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
