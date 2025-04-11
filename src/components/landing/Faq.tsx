
import React, { useState } from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HelpCircle, MessageCircle, ArrowRight } from "lucide-react";

const Faq: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  
  const handleAccordionChange = (value: string) => {
    setActiveItem(value === activeItem ? null : value);
  };
  
  const faqs = [
    {
      question: "¿Cómo puedo empezar a utilizar el CRM?",
      answer: "Simplemente regístrate en nuestra plataforma con tu email y contraseña. Una vez dentro, podrás comenzar a agregar contactos, establecer tareas y organizar toda tu información profesional. El proceso de configuración toma menos de 2 minutos."
    },
    {
      question: "¿Puedo importar mis contactos existentes?",
      answer: "Sí, nuestro CRM te permite importar contactos desde CSV, archivos Excel o sincronizar directamente con tus cuentas de Google o Microsoft. Todos tus contactos estarán organizados automáticamente sin esfuerzo manual."
    },
    {
      question: "¿La plataforma funciona en dispositivos móviles?",
      answer: "Absolutamente. Nuestra interfaz está completamente optimizada para funcionar en cualquier dispositivo, permitiéndote gestionar tus contactos desde tu computadora, tablet o smartphone. Tenemos aplicaciones nativas para iOS y Android además de la versión web responsiva."
    },
    {
      question: "¿Cómo funciona la integración con email?",
      answer: "Al conectar tu cuenta de correo, podrás ver, enviar y organizar emails directamente desde la plataforma. Cada email se asociará automáticamente con el contacto correspondiente, creando un historial completo de comunicación que te ayudará a mantener el contexto de tus relaciones profesionales."
    },
    {
      question: "¿Es segura mi información?",
      answer: "La seguridad es nuestra prioridad. Utilizamos cifrado de extremo a extremo y no compartimos tus datos con terceros bajo ninguna circunstancia. Cumplimos con todas las regulaciones de protección de datos como GDPR y CCPA, y realizamos auditorías de seguridad periódicas."
    },
    {
      question: "¿Existe un plan gratuito disponible?",
      answer: "Sí, ofrecemos un plan gratuito con funcionalidades básicas que te permitirán gestionar hasta 100 contactos. Para necesidades más avanzadas, nuestros planes de suscripción incluyen características adicionales como integración con Google Calendar, asistente IA y capacidad ilimitada."
    }
  ];
  
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-purple-100 text-primary font-medium rounded-full px-4 py-1 text-sm mb-4">PREGUNTAS FRECUENTES</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 gradient-text">
              ¿Tienes dudas?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Estas son las preguntas más comunes sobre nuestro CRM personal. Si no encuentras lo que buscas, no dudes en contactarnos.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg">
            <Accordion 
              type="single" 
              collapsible 
              className="w-full"
              value={activeItem || undefined}
              onValueChange={handleAccordionChange}
            >
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`} 
                  className={`border-b border-gray-200 last:border-b-0 data-[state=open]:bg-white data-[state=open]:rounded-xl data-[state=open]:shadow-sm data-[state=open]:px-4`}
                >
                  <AccordionTrigger className={`text-left py-5 hover:text-primary group ${activeItem === `item-${index}` ? 'font-semibold text-primary' : ''}`}>
                    <div className="flex items-start">
                      {activeItem === `item-${index}` && (
                        <span className="text-primary mr-3 mt-1">
                          <HelpCircle size={18} />
                        </span>
                      )}
                      <span className="text-lg">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-5 px-2">
                    <div className="pl-0 lg:pl-8 border-l-0 lg:border-l-2 border-purple-100 animation-slide-up">
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          <div className="mt-12 text-center">
            <p className="mb-6 text-gray-600">¿No encontraste lo que buscabas?</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="outline" className="flex gap-2 border-2 px-6 py-5 rounded-xl">
                <MessageCircle size={18} />
                Contactar con soporte
              </Button>
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-5 rounded-xl">
                  Probar ahora <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
