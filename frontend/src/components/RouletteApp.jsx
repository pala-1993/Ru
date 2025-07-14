import React, { useState, useEffect } from "react";
import RouletteWheel from "./RouletteWheel";
import ParticipantEditor from "./ParticipantEditor";
import WinnerHistory from "./WinnerHistory";
import WinnerModal from "./WinnerModal";
import { mockApi } from "../utils/mockApi";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Sparkles, RotateCcw } from "lucide-react";

const RouletteApp = () => {
  const [participants, setParticipants] = useState([]);
  const [winners, setWinners] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentWinner, setCurrentWinner] = useState(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      const participantsData = await mockApi.getParticipants();
      const winnersData = await mockApi.getWinners();
      setParticipants(participantsData);
      setWinners(winnersData);
    };
    loadData();
  }, []);

  const handleParticipantsChange = async (newParticipants) => {
    setParticipants(newParticipants);
    await mockApi.updateParticipants(newParticipants);
  };

  const handleSpin = async () => {
    if (participants.length < 2) {
      alert("Necesitas al menos 2 participantes para hacer un sorteo");
      return;
    }

    setIsSpinning(true);
    
    // Simulate spinning time
    setTimeout(async () => {
      const winner = await mockApi.spin(participants);
      setCurrentWinner(winner);
      setIsSpinning(false);
      setShowWinnerModal(true);
      
      // Update winners history
      const newWinners = [...winners, winner];
      setWinners(newWinners);
      
      // Remove winner from participants
      const remainingParticipants = participants.filter(p => p !== winner.name);
      setParticipants(remainingParticipants);
      await mockApi.updateParticipants(remainingParticipants);
    }, 3000);
  };

  const handleResetGame = async () => {
    const resetData = await mockApi.resetGame();
    setParticipants(resetData.participants);
    setWinners([]);
    setCurrentWinner(null);
  };

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
            <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent mb-4">
              ⚡ RULETA SORTEOS ⚡
            </h1>
            <p className="text-xl text-cyan-200">
              Sorteos electrónicos con estilo futurista
            </p>
          </div>

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
                  disabled={isSpinning || participants.length < 2}
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
                  variant="outline"
                  className="border-purple-400 text-purple-300 hover:bg-purple-500/20 py-2 px-6 rounded-full"
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