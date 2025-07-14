import React, { useState, useEffect } from "react";

const RouletteWheel = ({ participants, isSpinning, winner }) => {
  const [rotation, setRotation] = useState(0);
  const [finalRotation, setFinalRotation] = useState(0);

  useEffect(() => {
    if (isSpinning) {
      // Generate random rotation for spinning effect
      const spins = 5 + Math.random() * 5; // 5-10 full rotations
      const randomAngle = Math.random() * 360;
      const totalRotation = spins * 360 + randomAngle;
      
      setFinalRotation(totalRotation);
      setRotation(prev => prev + totalRotation);
    }
  }, [isSpinning]);

  const colors = [
    "#00FFFF", // Cyan
    "#FF00FF", // Fuchsia
    "#8B00FF", // Purple
    "#00CED1", // Dark Turquoise
    "#DA70D6", // Orchid
    "#40E0D0", // Turquoise
    "#FF1493", // Deep Pink
    "#9370DB", // Medium Purple
  ];

  const getSliceAngle = () => {
    return participants.length > 0 ? 360 / participants.length : 0;
  };

  const getSliceColor = (index) => {
    return colors[index % colors.length];
  };

  const createSlicePath = (index, sliceAngle) => {
    const startAngle = (index * sliceAngle * Math.PI) / 180;
    const endAngle = ((index + 1) * sliceAngle * Math.PI) / 180;
    const radius = 180;
    const centerX = 200;
    const centerY = 200;

    const startX = centerX + radius * Math.cos(startAngle);
    const startY = centerY + radius * Math.sin(startAngle);
    const endX = centerX + radius * Math.cos(endAngle);
    const endY = centerY + radius * Math.sin(endAngle);

    const largeArcFlag = sliceAngle > 180 ? 1 : 0;

    return `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
  };

  const getTextPosition = (index, sliceAngle) => {
    const angle = (index * sliceAngle + sliceAngle / 2) * Math.PI / 180;
    const radius = 120;
    const centerX = 200;
    const centerY = 200;

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    return { x, y, angle: (index * sliceAngle + sliceAngle / 2) };
  };

  const truncateText = (text, maxLength = 12) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + "...";
  };

  if (participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="w-96 h-96 border-4 border-dashed border-cyan-400/50 rounded-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-cyan-300 text-lg">
              Añade participantes para comenzar
            </p>
          </div>
        </div>
      </div>
    );
  }

  const sliceAngle = getSliceAngle();

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Wheel container */}
        <div className="relative w-96 h-96">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-fuchsia-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
          
          {/* Main wheel */}
          <svg
            width="400"
            height="400"
            className="absolute inset-0 drop-shadow-2xl"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 3s cubic-bezier(0.23, 1, 0.320, 1)' : 'none',
            }}
          >
            {/* Wheel slices */}
            {participants.map((participant, index) => {
              const path = createSlicePath(index, sliceAngle);
              const textPos = getTextPosition(index, sliceAngle);
              const color = getSliceColor(index);

              return (
                <g key={index}>
                  {/* Slice */}
                  <path
                    d={path}
                    fill={color}
                    stroke="#000"
                    strokeWidth="2"
                    className="hover:brightness-110 transition-all duration-200"
                  />
                  
                  {/* Text */}
                  <text
                    x={textPos.x}
                    y={textPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-black font-bold text-sm"
                    transform={`rotate(${textPos.angle}, ${textPos.x}, ${textPos.y})`}
                  >
                    {truncateText(participant)}
                  </text>
                </g>
              );
            })}
            
            {/* Center circle */}
            <circle
              cx="200"
              cy="200"
              r="20"
              fill="url(#centerGradient)"
              stroke="#000"
              strokeWidth="3"
            />
            
            {/* Gradients */}
            <defs>
              <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00FFFF" />
                <stop offset="100%" stopColor="#FF00FF" />
              </radialGradient>
            </defs>
          </svg>

          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[40px] border-l-transparent border-r-transparent border-b-yellow-400 drop-shadow-lg"></div>
          </div>
        </div>

        {/* Participant count indicator */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-black/50 rounded-full border border-cyan-400/50">
            <span className="text-cyan-300 font-medium">
              {participants.length} participantes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouletteWheel;