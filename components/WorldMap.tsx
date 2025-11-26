import React from 'react';
import { Country, Player, Army, Unit, CombatLog } from '../types';

interface WorldMapProps {
  countries: Country[];
  players: Player[];
  units: Unit[];
  armies: Army[];
  combatLogs: CombatLog[];
  onCountryClick: (id: string) => void;
  onBattleClick: (logId: string) => void;
  currentTurn: number;
}

const WorldMap: React.FC<WorldMapProps> = ({ countries, players, units, armies, combatLogs, onCountryClick, onBattleClick, currentTurn }) => {
  
  const getCountryColor = (ownerId: string | null) => {
    if (!ownerId) return '#334155'; // Neutral Slate
    const player = players.find(p => p.id === ownerId);
    return player ? player.color : '#334155';
  };

  // Filter logs for current turn
  const activeBattles = combatLogs.filter(l => l.turn === currentTurn || l.turn === currentTurn - 1); 
  // Note: displaying last turn battles too so user can see what happened

  return (
    <div className="w-full h-full bg-slate-950 flex items-center justify-center overflow-auto">
      <svg viewBox="0 0 1000 550" className="w-full h-full max-w-7xl select-none drop-shadow-2xl">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Connection Lines (Adjacency) - Optional visual aid */}
        {countries.map(country => (
           country.neighbors.map(nId => {
              const neighbor = countries.find(c => c.id === nId);
              if(!neighbor) return null;
              return (
                 <line 
                   key={`${country.id}-${nId}`} 
                   x1={country.center[0]} y1={country.center[1]} 
                   x2={neighbor.center[0]} y2={neighbor.center[1]} 
                   stroke="#1e293b" 
                   strokeWidth="2"
                 />
              );
           })
        ))}

        {/* Countries */}
        {countries.map(country => {
          const ownerColor = getCountryColor(country.ownerId);
          const armyCount = armies.filter(a => a.locationId === country.id).length;
          
          return (
            <g key={country.id} onClick={() => onCountryClick(country.id)} className="cursor-pointer transition-opacity hover:opacity-90 group">
              <path
                d={country.path}
                fill={ownerColor}
                stroke="#0f172a"
                strokeWidth="2"
                className="transition-colors duration-500"
              />
              {/* Country Label */}
              <text 
                 x={country.center[0]} 
                 y={country.center[1]} 
                 textAnchor="middle" 
                 fill="white" 
                 fontSize="12" 
                 fontWeight="bold"
                 className="pointer-events-none drop-shadow-md opacity-70 group-hover:opacity-100"
              >
                {country.name}
              </text>
              
              {/* Flag/Army Indicator */}
              {armyCount > 0 && (
                <circle cx={country.center[0] + 10} cy={country.center[1] + 15} r="6" fill="red" stroke="white" strokeWidth="1" />
              )}
            </g>
          );
        })}

        {/* Battles */}
        {activeBattles.map(log => {
           const country = countries.find(c => c.id === log.locationId);
           if (!country) return null;
           return (
             <g key={log.id} onClick={(e) => { e.stopPropagation(); onBattleClick(log.id); }} className="cursor-pointer hover:scale-110 transition-transform">
                <circle cx={country.center[0]} cy={country.center[1] - 20} r="12" fill="#ef4444" stroke="white" strokeWidth="2" />
                <text x={country.center[0]} y={country.center[1] - 16} textAnchor="middle" fill="white" fontSize="10">⚔️</text>
             </g>
           );
        })}
      </svg>
    </div>
  );
};

export default WorldMap;