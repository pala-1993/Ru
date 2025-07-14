import React from "react";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { Trophy, Clock, Crown } from "lucide-react";

const WinnerHistory = ({ winners }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getPositionIcon = (position) => {
    switch (position) {
      case 1:
        return <Crown className="h-4 w-4 text-yellow-400" />;
      case 2:
        return <Trophy className="h-4 w-4 text-gray-400" />;
      case 3:
        return <Trophy className="h-4 w-4 text-amber-600" />;
      default:
        return <Trophy className="h-4 w-4 text-fuchsia-400" />;
    }
  };

  const getPositionColor = (position) => {
    switch (position) {
      case 1:
        return "text-yellow-400 bg-yellow-400/20 border-yellow-400/50";
      case 2:
        return "text-gray-400 bg-gray-400/20 border-gray-400/50";
      case 3:
        return "text-amber-600 bg-amber-600/20 border-amber-600/50";
      default:
        return "text-fuchsia-400 bg-fuchsia-400/20 border-fuchsia-400/50";
    }
  };

  return (
    <>
      <CardHeader className="pb-0">
        <CardTitle className="text-xl font-bold text-fuchsia-300 flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Historial de Ganadores
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {winners.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🏆</div>
            <p className="text-gray-400">
              Aún no hay ganadores
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Los resultados aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-fuchsia-300">Total de sorteos: {winners.length}</span>
              <span className="text-gray-400">
                <Clock className="h-4 w-4 inline mr-1" />
                Más reciente primero
              </span>
            </div>
            
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {winners.map((winner, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border backdrop-blur-sm ${getPositionColor(winner.position)} transition-all duration-200 hover:scale-105`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getPositionIcon(winner.position)}
                      <div>
                        <div className="font-bold text-sm">
                          {winner.name}
                        </div>
                        <div className="text-xs opacity-75">
                          Posición #{winner.position}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs opacity-75">
                        {formatTime(winner.timestamp)}
                      </div>
                      <div className="text-xs font-mono">
                        Sorteo #{index + 1}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {winners.length > 5 && (
              <div className="text-center text-xs text-gray-500 mt-2">
                Mostrando todos los {winners.length} resultados
              </div>
            )}
          </div>
        )}
      </CardContent>
    </>
  );
};

export default WinnerHistory;