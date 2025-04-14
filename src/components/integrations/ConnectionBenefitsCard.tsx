
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckSquare, ChevronRight, Globe, Mail, RefreshCw } from "lucide-react";

interface ConnectionBenefitsCardProps {
  connecting: boolean;
  onConnect: () => void;
}

const ConnectionBenefitsCard: React.FC<ConnectionBenefitsCardProps> = ({
  connecting,
  onConnect,
}) => {
  return (
    <Card className="mb-8 bg-white border shadow-sm overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/2 p-6">
          <h2 className="text-xl font-bold mb-3">¿Por qué conectar Google?</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span>
                Sincroniza tu <strong>calendario</strong> y mantén tus eventos
                organizados
              </span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span>
                Gestiona tus <strong>tareas</strong> desde una única interfaz
              </span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span>
                Vincula tus <strong>correos</strong> con contactos para un
                seguimiento eficiente
              </span>
            </li>
            <li className="flex items-start">
              <ChevronRight className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span>
                Automatiza el <strong>registro de interacciones</strong> con tus
                contactos
              </span>
            </li>
          </ul>

          <Button
            onClick={onConnect}
            className="mt-6 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={connecting}
          >
            {!connecting ? (
              <>
                <Globe className="h-4 w-4" /> Conectar con Google
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" /> Conectando...
              </>
            )}
          </Button>
        </div>

        <div className="md:w-1/2 bg-gradient-to-br from-purple-50 to-blue-50 p-6 flex items-center justify-center">
          <div className="max-w-xs text-center">
            <div className="mx-auto w-32 h-32 bg-white rounded-full shadow-md flex items-center justify-center mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-8 w-8 text-blue-500" />
                <CheckSquare className="h-7 w-7 text-green-500" />
                <Mail className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">Integración completa</h3>
            <p className="text-sm text-gray-600">
              Conéctate una vez y mantén toda tu información sincronizada
              automáticamente.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ConnectionBenefitsCard;
