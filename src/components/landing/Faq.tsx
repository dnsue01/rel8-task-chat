
import React from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

const Faq: React.FC = () => {
  const faqs = [
    {
      question: "¿Cómo puedo empezar a utilizar el CRM?",
      answer: "Simplemente regístrate en nuestra plataforma con tu email y contraseña. Una vez dentro, podrás comenzar a agregar contactos, establecer tareas y organizar toda tu información profesional."
    },
    {
      question: "¿Puedo importar mis contactos existentes?",
      answer: "Sí, nuestro CRM te permite importar contactos desde CSV, archivos Excel o sincronizar directamente con tus cuentas de Google o Microsoft."
    },
    {
      question: "¿La plataforma funciona en dispositivos móviles?",
      answer: "Absolutamente. Nuestra interfaz está completamente optimizada para funcionar en cualquier dispositivo, permitiéndote gestionar tus contactos desde tu computadora, tablet o smartphone."
    },
    {
      question: "¿Cómo funciona la integración con email?",
      answer: "Al conectar tu cuenta de correo, podrás ver, enviar y organizar emails directamente desde la plataforma. Cada email se asociará automáticamente con el contacto correspondiente."
    },
    {
      question: "¿Es segura mi información?",
      answer: "La seguridad es nuestra prioridad. Utilizamos cifrado de extremo a extremo y no compartimos tus datos con terceros bajo ninguna circunstancia."
    }
  ];
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Preguntas frecuentes
        </h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
                <AccordionTrigger className="text-left py-4 hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Faq;
