
import React from 'react';
import { CombatLog, Country, Player } from '../types';

interface Props {
  logs: CombatLog[];
  countries: Country[];
  players: Player[];
  myPlayerId: string;
  onViewBattle: (logId: string) => void;
  onClose: () => void;
}

const TurnReportModal: React.FC<Props> = ({ logs, countries, players, myPlayerId, onViewBattle, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-600 rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        
        <div className="bg-slate-900 p-4 border-b border-slate-700 flex justify-between items-center">
           <h2 className="text-xl font-bold text-slate-100">Annual Military Report</h2>
           <button onClick={onClose} className="text-slate-400 hover:text-white">✖</button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3 flex-1">
           {logs.length === 0 && <div className="text-slate-500 italic text-center p-4">No conflicts reported this year.</div>}
           
           {logs.map(log => {
              const country = countries.find(c => c.id === log.locationId);
              const attacker = players.find(p => p.id === log.attackerId);
              const defender = players.find(p => p.id === log.defenderId);
              const amIAttacker = log.attackerId === myPlayerId;
              const amIDefender = log.defenderId === myPlayerId;
              const iWon = log.winnerId === myPlayerId;
              
              const isWin = iWon; // Simplification
              
              // If I am involved, color code it. If I'm not involved (AI vs AI), generic.
              const involveMe = amIAttacker || amIDefender;
              
              let statusText = "Conflict";
              let statusColor = "text-slate-300";
              let bgColor = "bg-slate-700";

              if (involveMe) {
                 if (isWin) {
                     statusText = "VICTORY";
                     statusColor = "text-green-400";
                     bgColor = "bg-green-900/20 border-green-800";
                 } else {
                     statusText = "DEFEAT";
                     statusColor = "text-red-400";
                     bgColor = "bg-red-900/20 border-red-800";
                 }
              }

              return (
                 <div key={log.id} className={`p-4 rounded border ${bgColor} flex flex-col gap-2`}>
                    <div className="flex justify-between items-start">
                       <div>
                          <div className={`font-black tracking-widest ${statusColor}`}>{statusText}</div>
                          <div className="text-lg font-bold text-white">Battle of {country?.name}</div>
                          <div className="text-xs text-slate-400 mt-1">
                             <span style={{color: attacker?.color}}>{attacker?.name}</span> (Attacker) 
                             <span className="mx-2">vs</span> 
                             <span style={{color: defender?.color}}>{defender?.name}</span> (Defender)
                          </div>
                       </div>
                       <button 
                         onClick={() => onViewBattle(log.id)}
                         className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-2 rounded font-bold shadow"
                       >
                         REPLAY 🎥
                       </button>
                    </div>

                    {/* Bombardment Summary */}
                    {log.bombardmentResult && (log.bombardmentResult.colonistsKilled > 0 || log.bombardmentResult.populationKilled > 0) && (
                       <div className="bg-black/20 p-2 rounded text-sm text-slate-300 mt-2">
                          <div className="font-semibold text-orange-400 text-xs uppercase mb-1">Bombardment Report</div>
                          <div className="flex gap-4">
                             <span>☠️ {Math.floor(log.bombardmentResult.colonistsKilled)} Colonists</span>
                             <span>☠️ {Math.floor(log.bombardmentResult.populationKilled)} Civilians</span>
                          </div>
                          {log.bombardmentResult.invaded && (
                             <div className="text-green-400 font-bold mt-1 uppercase">Region Secured & Occupied</div>
                          )}
                       </div>
                    )}
                 </div>
              );
           })}
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-700 text-right">
           <button onClick={onClose} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white font-bold">Acknowledge</button>
        </div>

      </div>
    </div>
  );
};

export default TurnReportModal;
