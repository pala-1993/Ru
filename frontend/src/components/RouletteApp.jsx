import React, { useState, useEffect } from "react";
import RouletteWheel from "./RouletteWheel";
import ParticipantEditor from "./ParticipantEditor";
import WinnerHistory from "./WinnerHistory";
import WinnerModal from "./WinnerModal";
import { rouletteApi } from "../services/api";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Sparkles, RotateCcw, Wifi, WifiOff } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const RouletteApp = () => {
  const [participants, setParticipants] = useState([]);
  const [winners, setWinners] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentWinner, setCurrentWinner] = useState(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = async () => {
    try {
      setIsLoading(true);
      setIsOnline(true);
      
      // Check API health first
      await rouletteApi.healthCheck();
      
      const game = await rouletteApi.getCurrentGame();
      setParticipants(game.participants || []);
      setWinners(game.winners || []);
      
      console.log("✅ Game data loaded successfully");
    } catch (error) {
      console.error("❌ Error loading game data:", error);
      setIsOnline(false);
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor. Verifica tu conexión.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleParticipantsChange = async (newParticipants) => {
    try {
      setParticipants(newParticipants);
      await rouletteApi.updateParticipants(newParticipants);
      console.log("✅ Participants updated successfully");
    } catch (error) {
      console.error("❌ Error updating participants:", error);
      toast({
        title: "Error",
        description: "No se pudieron actualizar los participantes",
        variant: "destructive"
      });
    }
  };

  const handleSpin = async () => {
    if (participants.length < 2) {
      toast({
        title: "Participantes insuficientes",
        description: "Necesitas al menos 2 participantes para hacer un sorteo",
        variant: "destructive"
      });
      return;
    }

    setIsSpinning(true);
    
    try {
      // Simulate spinning time
      setTimeout(async () => {
        try {
          const spinResult = await rouletteApi.spin();
          
          setCurrentWinner(spinResult.winner);
          setIsSpinning(false);
          setShowWinnerModal(true);
          
          // Update local state
          setParticipants(spinResult.remaining_participants);
          setWinners(prev => [...prev, spinResult.winner]);
          
          console.log("✅ Spin completed successfully");
        } catch (error) {
          console.error("❌ Error during spin:", error);
          setIsSpinning(false);
          toast({
            title: "Error en el sorteo",
            description: "Ocurrió un error durante el sorteo. Inténtalo de nuevo.",
            variant: "destructive"
          });
        }
      }, 3000);
    } catch (error) {
      console.error("❌ Error starting spin:", error);
      setIsSpinning(false);
    }
  };

  const handleResetGame = async () => {
    try {
      const game = await rouletteApi.resetGame();
      setParticipants(game.participants || []);
      setWinners([]);
      setCurrentWinner(null);
      
      toast({
        title: "Juego reiniciado",
        description: "El juego se ha reiniciado correctamente",
      });
      
      console.log("✅ Game reset successfully");
    } catch (error) {
      console.error("❌ Error resetting game:", error);
      toast({
        title: "Error",
        description: "No se pudo reiniciar el juego",
        variant: "destructive"
      });
    }
  };

  const handleRetry = () => {
    loadGameData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mb-4"></div>
          <p className="text-xl text-cyan-200">Cargando ruleta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-fuchsia-400 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-purple-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-1/3 w-28 h-28 bg-cyan-300 rounded-full opacity-20 animate-bounce"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
                ⚡ RULETA SORTEOS ⚡
              </h1>
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <Wifi className="h-6 w-6 text-green-400" />
                ) : (
                  <WifiOff className="h-6 w-6 text-red-400" />
                )}
              </div>
            </div>
            <p className="text-xl text-cyan-200">
              Sorteos electrónicos con estilo futurista
            </p>
          </div>

          {!isOnline && (
            <div className="mb-8 text-center">
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-red-200 mb-2">Sin conexión al servidor</p>
                <Button 
                  onClick={handleRetry}
                  variant="outline"
                  className="border-red-400 text-red-300 hover:bg-red-400/20"
                >
                  Reintentar conexión
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Participant Editor */}
            <div className="lg:col-span-1">
              <Card className="bg-black/40 border-cyan-400/50 backdrop-blur-lg">
                <ParticipantEditor
                  participants={participants}
                  onParticipantsChange={handleParticipantsChange}
                />
              </Card>
            </div>

            {/* Middle Column - Roulette */}
            <div className="lg:col-span-1 flex flex-col items-center">
              <RouletteWheel
                participants={participants}
                isSpinning={isSpinning}
                winner={currentWinner}
              />
              
              <div className="mt-8 space-y-4">
                <Button
                  onClick={handleSpin}
                  disabled={isSpinning || participants.length < 2 || !isOnline}
                  className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-600 hover:to-fuchsia-600 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSpinning ? (
                    <>
                      <RotateCcw className="animate-spin mr-2" />
                      GIRANDO...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2" />
                      ¡GIRAR RULETA!
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleResetGame}
                  disabled={!isOnline}
                  variant="outline"
                  className="border-purple-400 text-purple-300 hover:bg-purple-500/20 py-2 px-6 rounded-full disabled:opacity-50"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reiniciar Juego
                </Button>
              </div>
            </div>

            {/* Right Column - Winner History */}
            <div className="lg:col-span-1">
              <Card className="bg-black/40 border-fuchsia-400/50 backdrop-blur-lg">
                <WinnerHistory winners={winners} />
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Winner Modal */}
      {showWinnerModal && (
        <WinnerModal
          winner={currentWinner}
          onClose={() => setShowWinnerModal(false)}
        />
      )}
    </div>
  );
};

export default RouletteApp;