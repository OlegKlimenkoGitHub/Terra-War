import React, { useState } from 'react';
import { Design, Player, Unit, CONSTANTS } from '../types';
import { calculateDesignCost } from '../utils/gameLogic';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  player: Player;
  designs: Design[];
  units: Unit[];
  onSave: (d: Design) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const DesignBureau: React.FC<Props> = ({ player, designs, units, onSave, onDelete, onClose }) => {
  const myDesigns = designs.filter(d => d.playerId === player.id);
  
  const [editingDesign, setEditingDesign] = useState<Partial<Design>>({
    name: 'New Project',
    engineCount: 1,
    armor: 1,
    cargoCapacity: 0,
    gunCount: 0,
    gunLength: 0
  });

  const currentCost = calculateDesignCost(editingDesign as Design);
  const isValid = editingDesign.name && editingDesign.name.length > 0;

  const handleSave = () => {
    if (!isValid) return;
    const newDesign: Design = {
       ...editingDesign as Design,
       id: uuidv4(),
       playerId: player.id,
       cost: currentCost
    };
    onSave(newDesign);
    // Reset
    setEditingDesign({ name: 'New Project', engineCount: 1, armor: 1, cargoCapacity: 0, gunCount: 0, gunLength: 0 });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-600 rounded-xl w-full max-w-4xl h-[80vh] flex overflow-hidden shadow-2xl">
        
        {/* Sidebar List */}
        <div className="w-1/3 bg-slate-900 border-r border-slate-700 p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-indigo-400">Blueprints</h2>
          <div className="space-y-2">
            {myDesigns.map(d => {
               const used = units.some(u => u.designId === d.id);
               return (
                 <div key={d.id} className="p-3 bg-slate-800 rounded border border-slate-700 hover:bg-slate-700 flex justify-between items-center group">
                    <div>
                      <div className="font-bold">{d.name}</div>
                      <div className="text-xs text-slate-400">Cost: {d.cost}</div>
                    </div>
                    {!used && (
                       <button onClick={() => onDelete(d.id)} className="text-red-500 opacity-0 group-hover:opacity-100 px-2 hover:bg-red-900/50 rounded">✖</button>
                    )}
                 </div>
               );
            })}
            {myDesigns.length === 0 && <div className="text-slate-500 italic">No designs yet.</div>}
          </div>
        </div>

        {/* Editor */}
        <div className="w-2/3 p-8 flex flex-col relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl">✖</button>
          
          <h2 className="text-2xl font-bold mb-6 text-white border-b border-slate-700 pb-2">Constructors Bureau</h2>
          
          <div className="grid grid-cols-2 gap-8 mb-6">
             <div className="space-y-4">
                <div>
                   <label className="block text-xs uppercase text-slate-400 mb-1">Project Name</label>
                   <input 
                      type="text" 
                      value={editingDesign.name} 
                      onChange={e => setEditingDesign({...editingDesign, name: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white focus:outline-none focus:border-indigo-500"
                   />
                </div>
                
                <div className="space-y-4 pt-4">
                  <Control label="Engines" value={editingDesign.engineCount} onChange={v => setEditingDesign({...editingDesign, engineCount: v})} cost={CONSTANTS.COST_PER_ENGINE} />
                  <Control label="Armor Plates" value={editingDesign.armor} onChange={v => setEditingDesign({...editingDesign, armor: v})} cost={CONSTANTS.COST_PER_ARMOR} />
                  <Control label="Cargo Space" value={editingDesign.cargoCapacity} onChange={v => setEditingDesign({...editingDesign, cargoCapacity: v})} cost={CONSTANTS.COST_PER_CARGO} />
                </div>
             </div>

             <div className="space-y-4">
                <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
                   <h3 className="text-sm font-bold text-red-400 mb-3 uppercase">Weaponry</h3>
                   <Control label="Gun Count" value={editingDesign.gunCount} onChange={v => setEditingDesign({...editingDesign, gunCount: v})} cost={0} />
                   {editingDesign.gunCount! > 0 && (
                      <Control label="Gun Length" value={editingDesign.gunLength} onChange={v => setEditingDesign({...editingDesign, gunLength: v})} cost={CONSTANTS.COST_PER_GUN_LENGTH * editingDesign.gunCount!} />
                   )}
                </div>

                <div className="bg-slate-700/30 p-4 rounded mt-8 text-center">
                   <div className="text-sm text-slate-400 uppercase">Total Production Cost</div>
                   <div className="text-4xl font-mono font-bold text-yellow-400">{currentCost}</div>
                   <div className="text-xs text-slate-500">Materials</div>
                </div>
             </div>
          </div>

          <div className="mt-auto flex justify-end">
             <button 
                onClick={handleSave} 
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded shadow-lg disabled:opacity-50"
                disabled={!isValid}
             >
                SAVE BLUEPRINT
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Control = ({ label, value, onChange, cost }: { label: string, value: number | undefined, onChange: (v: number) => void, cost: number }) => (
  <div className="flex items-center justify-between">
    <div>
      <div className="text-sm font-semibold">{label}</div>
      {cost > 0 && <div className="text-[10px] text-slate-500">+{cost} mat/unit</div>}
    </div>
    <div className="flex items-center bg-slate-900 rounded border border-slate-700">
      <button onClick={() => onChange(Math.max(0, (value || 0) - 1))} className="px-3 py-1 hover:bg-slate-700 text-slate-300">-</button>
      <span className="w-8 text-center font-mono">{value}</span>
      <button onClick={() => onChange((value || 0) + 1)} className="px-3 py-1 hover:bg-slate-700 text-slate-300">+</button>
    </div>
  </div>
);

export default DesignBureau;