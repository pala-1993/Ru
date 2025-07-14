import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Crown, Sparkles, X } from "lucide-react";

const WinnerModal = ({ winner, onClose }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);

  useEffect(() => {
    // Start confetti animation
    setShowConfetti(true);
    
    // Generate confetti pieces
    const pieces = [];
    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        color: ['#00FFFF', '#FF00FF', '#8B00FF', '#40E0D0', '#FF1493'][Math.floor(Math.random() * 5)],
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2
      });
    }
    setConfettiPieces(pieces);

    // Auto close modal after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getPositionText = (position) => {
    switch (position) {
      case 1:
        return "🥇 PRIMER LUGAR";
      case 2:
        return "🥈 SEGUNDO LUGAR";
      case 3:
        return "🥉 TERCER LUGAR";
      default:
        return `🏆 POSICIÓN #${position}`;
    }
  };

  const getPositionColor = (position) => {
    switch (position) {
      case 1:
        return "from-yellow-400 to-yellow-600";
      case 2:
        return "from-gray-400 to-gray-600";
      case 3:
        return "from-amber-500 to-amber-700";
      default:
        return "from-fuchsia-400 to-purple-600";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="absolute w-3 h-3 animate-bounce"
              style={{
                left: `${piece.x}%`,
                top: `${piece.y}%`,
                backgroundColor: piece.color,
                transform: `rotate(${piece.rotation}deg)`,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-purple-900/90 to-pink-900/90 border-2 border-cyan-400 rounded-2xl p-8 max-w-md w-full text-center backdrop-blur-lg shadow-2xl animate-pulse">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Winner announcement */}
        <div className="space-y-6">
          {/* Crown icon */}
          <div className="flex justify-center">
            <Crown className="h-20 w-20 text-yellow-400 animate-bounce" />
          </div>

          {/* Winner title */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              ¡TENEMOS GANADOR!
            </h2>
            <div className={`text-lg font-semibold bg-gradient-to-r ${getPositionColor(winner.position)} bg-clip-text text-transparent`}>
              {getPositionText(winner.position)}
            </div>
          </div>

          {/* Winner name */}
          <div className="py-6">
            <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              {winner.name}
            </div>
          </div>

          {/* Congratulations message */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-yellow-400">
              <Sparkles className="h-5 w-5" />
              <span className="text-lg font-semibold">¡Felicitaciones!</span>
              <Sparkles className="h-5 w-5" />
            </div>
            
            <p className="text-gray-300">
              Has sido seleccionado en el sorteo
            </p>
            
            <div className="text-sm text-gray-400">
              Hora del sorteo: {new Date(winner.timestamp).toLocaleString('es-ES')}
            </div>
          </div>

          {/* Action button */}
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-600 hover:to-fuchsia-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            ¡Continuar Sorteo!
          </Button>
        </div>

        {/* Animated border */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-400 opacity-75 animate-pulse -z-10"></div>
      </div>
    </div>
  );
};

export default WinnerModal;