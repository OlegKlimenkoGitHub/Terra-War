
import React, { useState, useEffect } from 'react';
import { CombatLog, Design, Player } from '../types';

interface Props {
  log: CombatLog;
  designs: Design[];
  players: Player[];
  onClose: () => void;
}

interface BattleUnit {
    id: string;
    designName: string;
    isDead: boolean;
    hasFired: boolean;
    wasHit: boolean;
    icon: string;
    stats: {
        armor: number;
        gunCount: number;
        gunLength: number;
        hp: number;
    }
}

const BattleViewer: React.FC<Props> = ({ log, designs, players, onClose }) => {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [deadUnitIds, setDeadUnitIds] = useState<Set<string>>(new Set());

  // Effect to play through rounds
  useEffect(() => {
    let interval: any;
    if (isPlaying && currentRoundIndex < log.rounds.length) {
       interval = setInterval(() => {
          // Process deaths in this round
          const round = log.rounds[currentRoundIndex];
          const newDeaths = new Set<string>();
          if (round.attackerShot?.destroyed) newDeaths.add(round.attackerShot.targetId);
          if (round.defenderShot?.destroyed) newDeaths.add(round.defenderShot.targetId);
          
          setDeadUnitIds(prev => {
              const next = new Set(prev);
              newDeaths.forEach(id => next.add(id));
              return next;
          });

          setCurrentRoundIndex(prev => prev + 1);
       }, 1000); // 1 sec per round
    } else if (currentRoundIndex >= log.rounds.length && log.rounds.length > 0) {
       setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentRoundIndex, log.rounds]);

  // Reset state when log changes or manual reset
  const handleReset = () => {
      setIsPlaying(false);
      setCurrentRoundIndex(0);
      setDeadUnitIds(new Set());
  };

  const attacker = players.find(p => p.id === log.attackerId);
  const defender = players.find(p => p.id === log.defenderId);
  const winner = players.find(p => p.id === log.winnerId);
  const isUnopposed = log.rounds.length === 0;

  const getUnitVisuals = (side: 'ATTACKER' | 'DEFENDER'): BattleUnit[] => {
      const roster = side === 'ATTACKER' ? (log.attackerUnits || []) : (log.defenderUnits || []);
      const currentRound = log.rounds[currentRoundIndex]; 
      
      const activeRound = currentRoundIndex < log.rounds.length ? log.rounds[currentRoundIndex] : null;

      return roster.map(u => {
          const design = designs.find(d => d.id === u.designId);
          const icon = getDesignIcon(design);
          
          let isDead = deadUnitIds.has(u.id);
          let hasFired = false;
          let wasHit = false;

          if (isPlaying && activeRound) {
              if (side === 'ATTACKER') {
                  if (activeRound.attackerShot?.unitId === u.id) hasFired = true;
                  if (activeRound.defenderShot?.targetId === u.id) {
                      wasHit = true;
                      if (activeRound.defenderShot.destroyed) isDead = true; 
                  }
              } else {
                  if (activeRound.defenderShot?.unitId === u.id) hasFired = true;
                  if (activeRound.attackerShot?.targetId === u.id) {
                      wasHit = true;
                      if (activeRound.attackerShot.destroyed) isDead = true;
                  }
              }
          }

          return {
              id: u.id,
              designName: design?.name || 'Unknown',
              isDead,
              hasFired,
              wasHit,
              icon,
              stats: {
                  armor: design?.armor || 0,
                  gunCount: design?.gunCount || 0,
                  gunLength: design?.gunLength || 0,
                  hp: 1 // Standard HP
              }
          };
      });
  };

  const attackerVisuals = getUnitVisuals('ATTACKER');
  const defenderVisuals = getUnitVisuals('DEFENDER');

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[60]">
       <div className="w-full max-w-7xl h-[95vh] flex flex-col relative bg-slate-900 rounded-xl overflow-hidden border-2 border-slate-700">
          <button onClick={onClose} className="absolute top-4 right-4 z-20 text-white hover:text-red-500 text-2xl">✖</button>
          
          {/* Header */}
          <div className="h-16 bg-slate-950 flex justify-between items-center px-10 border-b border-slate-800 shrink-0">
             <div className="flex items-center gap-4">
                 <div className="text-right">
                    <div className="text-xs text-red-500 uppercase font-bold tracking-widest">Attacker</div>
                    <div style={{color: attacker?.color}} className="font-bold text-lg leading-none">{attacker?.name}</div>
                 </div>
                 <div className="text-2xl font-black text-slate-700">VS</div>
                 <div>
                    <div className="text-xs text-blue-500 uppercase font-bold tracking-widest">Defender</div>
                    <div style={{color: defender?.color}} className="font-bold text-lg leading-none">{defender?.name}</div>
                 </div>
             </div>

             <div className="flex items-center gap-4">
                 {!isUnopposed && (
                    <>
                        <div className="text-slate-500 font-mono text-sm">Round {Math.min(currentRoundIndex + 1, log.rounds.length)}/{log.rounds.length}</div>
                        <button onClick={handleReset} className="px-3 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700">⏮ Reset</button>
                        <button onClick={() => setIsPlaying(!isPlaying)} className={`px-6 py-1 rounded font-bold w-24 ${isPlaying ? 'bg-yellow-600' : 'bg-green-600 hover:bg-green-500'}`}>
                            {isPlaying ? 'PAUSE' : 'PLAY'}
                        </button>
                    </>
                 )}
             </div>
          </div>

          {/* Main Stage */}
          <div className="flex-1 flex overflow-hidden relative">
             
             {/* Attacker Col */}
             <div className="w-1/2 bg-slate-900/50 border-r border-slate-800 flex flex-col">
                <div className="p-2 bg-red-900/10 text-center text-red-500 text-xs font-bold uppercase border-b border-red-900/20">Assault Force</div>
                <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 overflow-y-auto content-start">
                    {attackerVisuals.map(u => <UnitCard key={u.id} unit={u} side="ATTACKER" />)}
                </div>
             </div>

             {/* Defender Col */}
             <div className="w-1/2 bg-slate-900/50 flex flex-col">
                <div className="p-2 bg-blue-900/10 text-center text-blue-500 text-xs font-bold uppercase border-b border-blue-900/20">Defense Force</div>
                <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 overflow-y-auto content-start">
                    {defenderVisuals.map(u => <UnitCard key={u.id} unit={u} side="DEFENDER" />)}
                </div>
             </div>

             {/* Status Overlay (Center) */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center justify-center">
                 {isUnopposed && (
                    <div className="bg-black/80 backdrop-blur p-8 rounded-xl border border-yellow-500 text-center">
                        <div className="text-3xl font-bold text-yellow-400 mb-2">UNOPPOSED</div>
                        <div className="text-slate-300">No enemy units encountered.</div>
                    </div>
                 )}
                 
                 {!isPlaying && currentRoundIndex >= log.rounds.length && !isUnopposed && (
                    <div className="bg-black/80 backdrop-blur p-8 rounded-xl border border-white/20 text-center animate-in fade-in zoom-in duration-300">
                        <div className="text-4xl font-black text-white mb-2 shadow-black drop-shadow-lg">
                            {winner?.id === log.attackerId ? <span className="text-red-500">ATTACKER WINS</span> : <span className="text-blue-500">DEFENDER WINS</span>}
                        </div>
                        {log.bombardmentResult && (
                             <div className="text-orange-400 font-mono mt-2 bg-black/40 p-2 rounded">
                                 <div>Casualties: {Math.floor(log.bombardmentResult.populationKilled + log.bombardmentResult.colonistsKilled)}</div>
                                 {log.bombardmentResult.invaded && <div className="text-green-500 font-bold uppercase mt-1">Territory Captured</div>}
                             </div>
                        )}
                    </div>
                 )}
             </div>

          </div>
       </div>
    </div>
  );
};

const UnitCard = ({ unit, side }: { unit: BattleUnit, side: 'ATTACKER' | 'DEFENDER' }) => {
    let statusClass = "border-slate-700 bg-slate-800";
    let iconClass = "text-slate-400";
    
    if (unit.isDead) {
        statusClass = "border-slate-800 bg-slate-900/50 opacity-50 grayscale";
        iconClass = "text-slate-600";
    } else if (unit.hasFired) {
        statusClass = "border-yellow-500 bg-yellow-900/30 shadow-[0_0_15px_rgba(234,179,8,0.5)] scale-105 z-10";
        iconClass = "text-yellow-400";
    } else if (unit.wasHit) {
        statusClass = "border-red-500 bg-red-900/50 shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse";
        iconClass = "text-red-400";
    }

    return (
        <div className={`relative p-2 rounded border transition-all duration-300 flex flex-col items-center text-center ${statusClass}`}>
            {/* Main Visual */}
            <div className={`text-2xl mb-1 ${iconClass}`}>
                {unit.isDead ? '💀' : unit.icon}
            </div>
            
            {/* Name */}
            <div className="text-[10px] font-bold text-slate-300 truncate w-full mb-1" title={unit.designName}>
                {unit.designName}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-1 w-full text-[9px] font-mono text-slate-400 bg-black/20 rounded p-1">
                <div title={`Guns: ${unit.stats.gunCount} x Size ${unit.stats.gunLength} (Must > Armor)`} className="flex flex-col items-center">
                    <span>🔫</span>
                    <span className={unit.stats.gunCount > 0 ? "text-red-300" : ""}>
                        {unit.stats.gunCount > 0 ? `${unit.stats.gunCount}x${unit.stats.gunLength}` : '-'}
                    </span>
                </div>
                <div title={`Armor: ${unit.stats.armor}`} className="flex flex-col items-center">
                    <span>🛡️</span>
                    <span className={unit.stats.armor > 0 ? "text-blue-300" : ""}>{unit.stats.armor}</span>
                </div>
                <div title="Hit Points" className="flex flex-col items-center">
                    <span>❤️</span>
                    <span>1</span>
                </div>
            </div>

            {/* Effects */}
            {unit.hasFired && (
                <div className={`absolute top-1/2 ${side === 'ATTACKER' ? '-right-4' : '-left-4'} -translate-y-1/2 text-2xl animate-ping`}>💥</div>
            )}
            {unit.wasHit && !unit.isDead && (
                <div className="absolute inset-0 bg-red-500/20 animate-pulse rounded"></div>
            )}
        </div>
    );
};

const getDesignIcon = (design: Design | undefined) => {
    if (!design) return '❓';
    if (design.cargoCapacity > 0 && design.gunCount === 0) return '🚚';
    if (design.gunCount > 1) return '🦾'; // Heavy
    if (design.gunLength > 5) return '💥'; // Artillery
    if (design.armor > 5) return '🛡️'; // Heavy Armor
    return '🚜'; // Light/Standard
};

export default BattleViewer;
