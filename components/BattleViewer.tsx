
import React, { useState, useEffect } from 'react';
import { CombatLog, Design, Player } from '../types';

interface Props {
  log: CombatLog;
  designs: Design[];
  players: Player[];
  onClose: () => void;
}

const BattleViewer: React.FC<Props> = ({ log, designs, players, onClose }) => {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isPlaying && currentRoundIndex < log.rounds.length - 1) {
       interval = setInterval(() => {
          setCurrentRoundIndex(prev => prev + 1);
       }, 800);
    } else if (currentRoundIndex >= log.rounds.length - 1 && log.rounds.length > 0) {
       setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentRoundIndex, log.rounds.length]);

  const attacker = players.find(p => p.id === log.attackerId);
  const defender = players.find(p => p.id === log.defenderId);
  const winner = players.find(p => p.id === log.winnerId);

  const currentRound = log.rounds[currentRoundIndex];

  // If there are no rounds, it means no defenders were present (Unopposed)
  const isUnopposed = log.rounds.length === 0;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60]">
       <div className="w-full max-w-5xl h-[90vh] flex flex-col relative bg-slate-900 rounded-xl overflow-hidden border border-red-900">
          <button onClick={onClose} className="absolute top-4 right-4 z-10 text-white hover:text-red-500 text-2xl">✖</button>
          
          {/* Header */}
          <div className="h-20 bg-slate-950 flex justify-between items-center px-10 border-b border-slate-800">
             <div className="text-center">
                <div className="text-2xl font-black text-red-500 uppercase">Attacker</div>
                <div style={{color: attacker?.color}} className="font-bold">{attacker?.name}</div>
             </div>
             <div className="text-3xl font-black text-slate-700">VS</div>
             <div className="text-center">
                <div className="text-2xl font-black text-blue-500 uppercase">Defender</div>
                <div style={{color: defender?.color}} className="font-bold">{defender?.name}</div>
             </div>
          </div>

          {/* Visual Stage */}
          <div className="flex-1 bg-slate-800 relative flex items-center justify-center overflow-hidden">
             {/* Simple visualization of shots */}
             <div className="absolute inset-0 flex">
                <div className="w-1/2 flex items-center justify-center border-r border-slate-700/50">
                   {/* Attacker Side */}
                   <div className="text-red-500 opacity-20 text-9xl">⚔️</div>
                </div>
                <div className="w-1/2 flex items-center justify-center">
                   {/* Defender Side */}
                   <div className="text-blue-500 opacity-20 text-9xl">🛡️</div>
                </div>
             </div>

             {/* Log Feed */}
             <div className="z-10 bg-black/50 p-6 rounded-xl backdrop-blur max-w-lg w-full text-center min-h-[200px] flex flex-col justify-center">
                
                {isUnopposed ? (
                    <div className="space-y-4">
                        <div className="text-2xl font-bold text-yellow-400">UNOPPOSED APPROACH</div>
                        <div className="text-slate-300">No defensive units encountered.</div>
                    </div>
                ) : (
                    <>
                        {currentRound ? (
                        <div className="space-y-4">
                            <div className="text-slate-400 text-xs uppercase tracking-widest">Exchange #{currentRoundIndex + 1}</div>
                            
                            {currentRound.attackerShot && (
                                <div className="animate-pulse">
                                    <span className="text-red-400 font-bold">Attacker</span> fired! 
                                    {currentRound.attackerShot.destroyed ? <span className="text-red-600 font-black ml-2 text-xl">TARGET DESTROYED 💥</span> : <span className="text-slate-500 ml-2">Armor held.</span>}
                                </div>
                            )}
                            
                            {currentRound.defenderShot && (
                                <div className="animate-pulse delay-75">
                                    <span className="text-blue-400 font-bold">Defender</span> fired! 
                                    {currentRound.defenderShot.destroyed ? <span className="text-red-600 font-black ml-2 text-xl">TARGET DESTROYED 💥</span> : <span className="text-slate-500 ml-2">Armor held.</span>}
                                </div>
                            )}
                        </div>
                        ) : (
                        <div className="text-xl font-bold">Battle Start</div>
                        )}
                    </>
                )}

                {/* Results shown if Unopposed OR at end of rounds */}
                {(isUnopposed || currentRoundIndex >= log.rounds.length - 1) && (
                   <div className="mt-6 pt-6 border-t border-white/10">
                      <div className="text-2xl font-bold text-yellow-400">VICTORY: {winner?.name || 'Draw'}</div>
                      {log.bombardmentResult && (
                         <div className="text-sm mt-2 text-orange-300">
                            Casualties: {Math.floor(log.bombardmentResult.populationKilled + log.bombardmentResult.colonistsKilled)} civilians.
                            {log.bombardmentResult.invaded && <div className="text-red-500 font-bold text-lg mt-1">REGION CAPTURED</div>}
                         </div>
                      )}
                   </div>
                )}
             </div>
          </div>

          {/* Controls */}
          <div className="h-16 bg-slate-950 flex items-center justify-center gap-4">
             {!isUnopposed && (
                <>
                <button onClick={() => { setIsPlaying(false); setCurrentRoundIndex(0); }} className="px-4 py-1 rounded bg-slate-800 text-slate-300">Reset</button>
                <button onClick={() => setIsPlaying(!isPlaying)} className="px-6 py-2 rounded bg-indigo-600 text-white font-bold w-32">
                    {isPlaying ? 'PAUSE' : 'PLAY'}
                </button>
                <div className="text-slate-500 text-sm">Round {currentRoundIndex + 1} / {log.rounds.length}</div>
                </>
             )}
          </div>
       </div>
    </div>
  );
};

export default BattleViewer;
