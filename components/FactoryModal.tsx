
import React from 'react';
import { Country, Design, FactoryQueueItem } from '../types';

interface Props {
  country: Country;
  designs: Design[];
  onSetQueue: (item: FactoryQueueItem | null) => void;
  onClose: () => void;
}

const FactoryModal: React.FC<Props> = ({ country, designs, onSetQueue, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-md">
       <div className="bg-slate-800 w-full max-w-2xl rounded-xl shadow-2xl border border-slate-600 p-6">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-bold text-amber-500">Heavy Industry: {country.name}</h2>
             <button onClick={onClose} className="text-2xl hover:text-white text-slate-400">✖</button>
          </div>

          <div className="mb-6 bg-slate-900 p-4 rounded border border-slate-700">
             <div className="flex justify-between">
                <div className="text-slate-400 text-sm mb-1">Current Production Line</div>
                {country.lastTurnStats && country.lastTurnStats.unitsProduced > 0 && (
                   <div className="text-green-400 text-xs font-bold animate-pulse">
                      Completed {country.lastTurnStats.unitsProduced} Unit(s) Last Year
                   </div>
                )}
             </div>
             
             {country.factoryQueue ? (
                <div className="flex items-center justify-between">
                   <div>
                      <div className="font-bold text-xl">{designs.find(d => d.id === country.factoryQueue?.designId)?.name || 'Unknown Design'}</div>
                      <div className="text-xs text-slate-400">Progress: {country.factoryQueue.progress} / {country.factoryQueue.totalCost} Materials</div>
                   </div>
                   <div className="flex gap-2">
                     <div className="w-32 h-4 bg-slate-700 rounded-full overflow-hidden mt-2 relative">
                        <div 
                           className="h-full bg-amber-500 transition-all duration-300" 
                           style={{width: `${Math.min(100, (country.factoryQueue.progress / country.factoryQueue.totalCost) * 100)}%`}}
                        />
                     </div>
                     <button onClick={() => onSetQueue(null)} className="text-red-400 text-sm hover:underline">Halt</button>
                   </div>
                </div>
             ) : (
                <div className="text-slate-500 italic">Production lines are idle.</div>
             )}
          </div>

          <h3 className="font-bold mb-3">Available Blueprints</h3>
          <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
             {designs.map(design => (
                <button 
                  key={design.id}
                  onClick={() => onSetQueue({ designId: design.id, progress: 0, totalCost: design.cost })}
                  className="p-3 bg-slate-700 hover:bg-slate-600 rounded text-left border border-transparent hover:border-amber-500 transition-all"
                >
                   <div className="font-bold">{design.name}</div>
                   <div className="text-xs flex justify-between mt-1 text-slate-300">
                      <span>Cost: {design.cost}</span>
                      <span>Stats: {design.gunCount}g/{design.armor}a</span>
                   </div>
                </button>
             ))}
          </div>
       </div>
    </div>
  );
};

export default FactoryModal;
