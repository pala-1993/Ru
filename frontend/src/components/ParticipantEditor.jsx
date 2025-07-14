import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Users, Plus, Trash2 } from "lucide-react";

const ParticipantEditor = ({ participants, onParticipantsChange }) => {
  const [textValue, setTextValue] = useState(participants.join('\n'));

  const handleTextChange = (e) => {
    const newValue = e.target.value;
    setTextValue(newValue);
    
    // Convert text to array of participants
    const participantsList = newValue
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    onParticipantsChange(participantsList);
  };

  const addSampleParticipants = () => {
    const samples = [
      "Ana García",
      "Carlos Rodríguez",
      "María López",
      "José Martínez",
      "Laura González",
      "Pablo Sánchez"
    ];
    
    const newText = samples.join('\n');
    setTextValue(newText);
    onParticipantsChange(samples);
  };

  const clearAll = () => {
    setTextValue('');
    onParticipantsChange([]);
  };

  return (
    <>
      <CardHeader className="pb-0">
        <CardTitle className="text-xl font-bold text-cyan-300 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Participantes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-cyan-200">
          Escribe un participante por línea:
        </label>
        <textarea
          value={textValue}
          onChange={handleTextChange}
          placeholder="Escribe los nombres de los participantes...
Ejemplo:
Ana García
Carlos Rodríguez
María López"
          className="w-full h-64 p-3 bg-black/30 border border-cyan-400/30 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none resize-none font-mono text-sm"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#00FFFF #1a1a1a'
          }}
        />
      </div>

      <div className="flex justify-between text-sm text-cyan-200">
        <span>Participantes: {participants.length}</span>
        <span className={participants.length >= 2 ? "text-green-400" : "text-red-400"}>
          {participants.length >= 2 ? "✓ Listo para sortear" : "⚠ Mínimo 2 participantes"}
        </span>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={addSampleParticipants}
          variant="outline"
          size="sm"
          className="flex-1 border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10"
        >
          <Plus className="h-4 w-4 mr-1" />
          Agregar ejemplos
        </Button>
        <Button
          onClick={clearAll}
          variant="outline"
          size="sm"
          className="flex-1 border-red-400/50 text-red-300 hover:bg-red-400/10"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Limpiar todo
        </Button>
      </div>

      {participants.length > 0 && (
        <div className="mt-4 p-3 bg-black/20 rounded-lg border border-cyan-400/20">
          <h4 className="text-sm font-medium text-cyan-300 mb-2">Vista previa:</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {participants.map((participant, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-cyan-400 font-mono">{(index + 1).toString().padStart(2, '0')}.</span>
                <span>{participant}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </CardContent>
  );
};

export default ParticipantEditor;