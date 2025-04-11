
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonialProps {
  text: string;
  author: string;
  role: string;
  avatar: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ text, author, role, avatar }) => (
  <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 h-full bg-gradient-to-br from-white to-purple-50">
    <CardContent className="p-6 flex flex-col h-full">
      <div className="flex-1">
        <p className="text-gray-700 italic mb-4">"{text}"</p>
      </div>
      <div className="flex items-center mt-4">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={avatar} alt={author} />
          <AvatarFallback>{author.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm">{author}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Testimonials: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Lo que dicen nuestros usuarios
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Profesionales de diversos sectores ya están mejorando su gestión con nuestro CRM personal.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Testimonial 
            text="Este CRM ha transformado cómo gestiono mis contactos profesionales. Todo está organizado y accesible exactamente cuando lo necesito."
            author="María González"
            role="Consultora independiente"
            avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
          />
          <Testimonial 
            text="La integración con el correo electrónico es justo lo que necesitaba. Ahora puedo dar seguimiento a conversaciones importantes sin perderme nada."
            author="Daniel Martínez"
            role="Gerente de ventas"
            avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
          />
          <Testimonial 
            text="La interfaz es tan intuitiva que pude comenzar a usarlo productivamente desde el primer día. Recomiendo este CRM a cualquier profesional."
            author="Laura Rodríguez"
            role="Emprendedora"
            avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb"
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
