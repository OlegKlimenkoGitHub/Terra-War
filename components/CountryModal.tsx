

import React, { useState } from 'react';
import { Country, Player, GameState, Army, Unit } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  country: Country;
  player: Player;
  isOwner: boolean;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onOpenFactory: () => void;
  onOpenBattleHistory: () => void;
  onClose: () => void;
}

const CountryModal: React.FC<Props> = ({ country, player, isOwner, gameState, setGameState, onOpenFactory, onOpenBattleHistory, onClose }) => {
  const [selectedArmyId, setSelectedArmyId] = useState<string | null>(null);

  // My armies in this country
  const localArmies = gameState.armies.filter(a => a.locationId === country.id && a.ownerId === player.id);
  
  // Hostile armies in this country (for intel)
  const hostileArmies = gameState.armies.filter(a => a.locationId === country.id && a.ownerId !== player.id);

  // Intel check: I own it OR I have an army here
  const hasPresence = isOwner || localArmies.length > 0;

  // Get units currently in my armies
  const unitsInArmies = new Set(localArmies.flatMap(a => a.unitIds));
  
  // Loose units: Owned by player, at this location, not in any army
  const looseUnits = gameState.units.filter(u => 
    u.ownerId === player.id && 
    u.locationId === country.id && 
    !unitsInArmies.has(u.id)
  );

  const countryOwner = gameState.players.find(p => p.id === country.ownerId);

  const handleCreateArmy = () => {
    const newArmy: Army = {
       id: uuidv4(),
       ownerId: player.id,
       locationId: country.id,
       destinationId: null,
       unitIds: []
    };
    setGameState(prev => ({
       ...prev,
       armies: [...prev.armies, newArmy]
    }));
    setSelectedArmyId(newArmy.id);
  };

  const handleDeleteArmy = (armyId: string) => {
    setGameState(prev => ({
        ...prev,
        armies: prev.armies.filter(a => a.id !== armyId)
    }));
    setSelectedArmyId(null);
  };

  const handleMoveArmy = (armyId: string, neighborId: string) => {
     setGameState(prev => ({
        ...prev,
        armies: prev.armies.map(a => a.id === armyId ? { ...a, destinationId: neighborId } : a)
     }));
  };

  const handleTransfer = (unitId: string, targetArmyId: string | null) => {
    setGameState(prev => {
        const nextArmies = [...prev.armies];
        // Remove from source army if present
        nextArmies.forEach(a => {
            if (a.unitIds.includes(unitId)) {
                a.unitIds = a.unitIds.filter(id => id !== unitId);
            }
        });
        // Add to target army if specified
        if (targetArmyId) {
            const army = nextArmies.find(a => a.id === targetArmyId);
            if (army) {
                army.unitIds.push(unitId);
            }
        }
        return { ...prev, armies: nextArmies };
    });
  };

  // --- Cargo Logic ---

  const handleLoadUnit = (unitId: string) => {
    setGameState(prev => {
        const newState = JSON.parse(JSON.stringify(prev)) as GameState;
        const cIdx = newState.countries.findIndex(c => c.id === country.id);
        const uIdx = newState.units.findIndex(u => u.id === unitId);
        
        if (cIdx === -1 || uIdx === -1) return prev;
        
        const c = newState.countries[cIdx];
        const u = newState.units[uIdx];
        const design = newState.designs.find(d => d.id === u.designId);
        
        if (!design || design.cargoCapacity === 0) return prev;
        
        const currentLoad = (u.cargo.colonists || 0) + (u.cargo.materials || 0) + (u.cargo.population || 0);
        const space = design.cargoCapacity - currentLoad;
        
        if (space <= 0) return prev;
        
        // 1. Take from available colonists
        let takeCol = Math.min(space, c.colonists);
        c.colonists -= takeCol;
        u.cargo.colonists = (u.cargo.colonists || 0) + takeCol;
        
        // 2. If space remains, convert population to colonists
        const remainingSpace = space - takeCol;
        if (remainingSpace > 0 && c.population > 0) {
            // Can take population up to 0? Yes.
            let takePop = Math.min(remainingSpace, c.population);
            c.population -= takePop;
            u.cargo.colonists += takePop; 
        }
        
        return newState;
    });
  };

  const handleUnloadUnit = (unitId: string) => {
    setGameState(prev => {
        const newState = JSON.parse(JSON.stringify(prev)) as GameState;
        const cIdx = newState.countries.findIndex(c => c.id === country.id);
        const uIdx = newState.units.findIndex(u => u.id === unitId);
        
        if (cIdx === -1 || uIdx === -1) return prev;
        
        const c = newState.countries[cIdx];
        const u = newState.units[uIdx];
        
        const amount = u.cargo.colonists || 0;
        if (amount === 0) return prev;
        
        // Convert back to population if space allows
        const popSpace = Math.max(0, c.maxPopulation - c.population);
        const toPop = Math.min(amount, popSpace);
        const toCol = amount - toPop;
        
        c.population += toPop;
        c.colonists += toCol;
        u.cargo.colonists = 0; // Empty colonists
        
        return newState;
    });
  };

  const handleLoadArmy = (armyId: string) => {
      const army = gameState.armies.find(a => a.id === armyId);
      if (!army) return;
      // We can iterate unit IDs, but we must do it inside the state update to ensure resource consistency
      // Simplest way is to run the logic for each unit in sequence inside one state update
      setGameState(prev => {
        const newState = JSON.parse(JSON.stringify(prev)) as GameState;
        const cIdx = newState.countries.findIndex(c => c.id === country.id);
        const armyIdx = newState.armies.findIndex(a => a.id === armyId);
        if (cIdx === -1 || armyIdx === -1) return prev;

        const c = newState.countries[cIdx];
        const a = newState.armies[armyIdx];

        a.unitIds.forEach(uid => {
             const u = newState.units.find(unit => unit.id === uid);
             const design = newState.designs.find(d => d.id === u?.designId);
             
             if (u && design && design.cargoCapacity > 0) {
                const currentLoad = (u.cargo.colonists || 0) + (u.cargo.materials || 0) + (u.cargo.population || 0);
                const space = design.cargoCapacity - currentLoad;
                if (space > 0) {
                     let takeCol = Math.min(space, c.colonists);
                     c.colonists -= takeCol;
                     u.cargo.colonists = (u.cargo.colonists || 0) + takeCol;
                     
                     const remSpace = space - takeCol;
                     if (remSpace > 0 && c.population > 0) {
                         let takePop = Math.min(remSpace, c.population);
                         c.population -= takePop;
                         u.cargo.colonists += takePop;
                     }
                }
             }
        });

        return newState;
      });
  };

  const handleUnloadArmy = (armyId: string) => {
      setGameState(prev => {
        const newState = JSON.parse(JSON.stringify(prev)) as GameState;
        const cIdx = newState.countries.findIndex(c => c.id === country.id);
        const armyIdx = newState.armies.findIndex(a => a.id === armyId);
        if (cIdx === -1 || armyIdx === -1) return prev;

        const c = newState.countries[cIdx];
        const a = newState.armies[armyIdx];

        a.unitIds.forEach(uid => {
             const u = newState.units.find(unit => unit.id === uid);
             if (u && u.cargo.colonists > 0) {
                 const amount = u.cargo.colonists;
                 const popSpace = Math.max(0, c.maxPopulation - c.population);
                 const toPop = Math.min(amount, popSpace);
                 const toCol = amount - toPop;
                 
                 c.population += toPop;
                 c.colonists += toCol;
                 u.cargo.colonists = 0;
             }
        });

        return newState;
      });
  };

  const getArmyColonistCount = (army: Army) => {
      let total = 0;
      army.unitIds.forEach(uid => {
          const u = gameState.units.find(unit => unit.id === uid);
          if (u) total += (u.cargo.colonists || 0);
      });
      return total;
  };

  // Helper to render unit list item
  const renderUnitItem = (unitId: string, location: 'ARMY' | 'RESERVES', armyId?: string) => {
     const unit = gameState.units.find(u => u.id === unitId);
     const design = gameState.designs.find(d => d.id === unit?.designId);
     if (!unit || !design) return null;

     const hasCargo = design.cargoCapacity > 0;
     const cargoCount = (unit.cargo.colonists || 0);

     return (
        <div key={unitId} className="flex justify-between items-center bg-slate-700 p-2 rounded text-sm group">
            {location === 'RESERVES' && (
                <button 
                onClick={() => handleTransfer(unit.id, selectedArmyId)}
                className="text-green-400 hover:text-white px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Add to Army"
                >
                ⬅
                </button>
            )}

            <div className="flex-1 flex items-center gap-2">
                <span className="font-semibold">{design.name}</span>
                {hasCargo && (
                    <span className="text-[10px] bg-black/30 px-1 rounded text-slate-300">
                        {cargoCount}/{design.cargoCapacity} Col
                    </span>
                )}
            </div>

            {hasCargo && (
                <div className="flex gap-1 mr-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleLoadUnit(unit.id)} className="bg-slate-600 hover:bg-slate-500 px-1 rounded text-[10px]" title="Load Max">Load</button>
                    <button onClick={() => handleUnloadUnit(unit.id)} className="bg-slate-600 hover:bg-slate-500 px-1 rounded text-[10px]" title="Unload All">Drop</button>
                </div>
            )}

            {location === 'ARMY' && (
                <button 
                onClick={() => handleTransfer(unit.id, null)}
                className="text-red-400 hover:text-white px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove from Army"
                >
                ➜
                </button>
            )}
        </div>
     );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 backdrop-blur-sm" onClick={onClose}>
       <div className="bg-slate-900 border border-slate-600 rounded-xl w-full max-w-6xl h-[85vh] flex overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
          
          {/* Info Panel */}
          <div className="w-1/4 bg-slate-800 p-6 border-r border-slate-700 overflow-y-auto">
             <h2 className="text-3xl font-bold mb-1">{country.name}</h2>
             <div className="text-sm text-slate-400 mb-6">Controlled by <span style={{color: countryOwner?.color}}>{isOwner ? "YOU" : (countryOwner?.name || "Neutral")}</span></div>
             
             {hasPresence ? (
                 <div className="space-y-4">
                    <Stat label="Population" value={country.population} max={country.maxPopulation} />
                    <Stat label="Colonists" value={country.colonists} />
                    
                    <div className="bg-slate-700 p-3 rounded">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-slate-300 font-medium">Materials</span>
                            <span className="font-mono font-bold text-yellow-400 text-xl">{Math.floor(country.materials)}</span>
                        </div>
                        {country.lastTurnStats && (
                        <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-600 mt-2">
                            <div className="flex justify-between text-green-400">
                                <span>Income (Pop):</span>
                                <span>+{country.lastTurnStats.materialsProduced}</span>
                            </div>
                            <div className="flex justify-between text-red-400">
                                <span>Used (Factory):</span>
                                <span>-{country.lastTurnStats.materialsConsumed}</span>
                            </div>
                        </div>
                        )}
                    </div>

                    {country.lastTurnStats && country.lastTurnStats.unitsProduced > 0 && (
                    <div className="bg-green-900/40 border border-green-800 p-2 rounded text-center text-green-300 text-sm">
                        Produced {country.lastTurnStats.unitsProduced} units last year.
                    </div>
                    )}

                    {!isOwner && (
                        <div className="mt-4 border-t border-slate-600 pt-4">
                            <h4 className="text-red-400 font-bold mb-2 uppercase text-xs">Hostile Forces</h4>
                            <div className="space-y-1">
                                {hostileArmies.length === 0 && <div className="text-xs text-slate-500 italic">No visible armies.</div>}
                                {hostileArmies.map(a => (
                                    <div key={a.id} className="text-xs bg-red-900/20 text-red-200 p-2 rounded border border-red-900/50">
                                        <div className="font-bold">Army {a.id.slice(0,4)}</div>
                                        <div>{a.unitIds.length} Unit(s)</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
             ) : (
                 <div className="mt-10 text-center text-slate-500 bg-black/20 p-4 rounded border border-slate-700/50">
                     <div className="text-2xl mb-2">👁️‍🗨️</div>
                     <div>Intel Unavailable</div>
                     <div className="text-xs mt-2">Deploy an army here to gather intelligence.</div>
                 </div>
             )}

             {isOwner && (
                <div className="mt-8 space-y-3">
                   <button onClick={onOpenFactory} className="w-full py-3 bg-amber-600 hover:bg-amber-500 rounded font-bold shadow-lg flex justify-between px-6">
                      <span>🏭 FACTORY</span>
                      {country.factoryQueue && <span className="text-xs bg-black/20 px-2 rounded pt-1">ACTIVE</span>}
                   </button>
                   <button onClick={onOpenBattleHistory} className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded border border-slate-500">History of Battles</button>
                </div>
             )}
          </div>

          {/* Military Management */}
          <div className="w-3/4 p-6 bg-slate-900 relative flex flex-col">
             <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl">✖</button>
             <h3 className="text-xl font-bold mb-4 text-slate-200">Military Presence</h3>
             
             {!hasPresence ? (
                <div className="text-center mt-20 text-slate-500">
                    <div className="text-4xl mb-4">🌫️</div>
                    <div>Fog of War active.</div>
                </div>
             ) : (
                <div className="flex h-full gap-4 overflow-hidden">
                   
                   {/* Left Col: Army List */}
                   <div className="w-1/3 flex flex-col border-r border-slate-700 pr-4">
                      <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-slate-300">My Armies</span>
                          <button onClick={handleCreateArmy} className="text-xs bg-indigo-600 hover:bg-indigo-500 px-2 py-1 rounded text-white">+ New</button>
                      </div>
                      <div className="overflow-y-auto flex-1 space-y-2">
                          {localArmies.length === 0 && <div className="text-slate-500 text-sm italic">No active armies.</div>}
                          {localArmies.map(army => (
                             <div 
                               key={army.id} 
                               onClick={() => setSelectedArmyId(army.id)}
                               className={`p-3 rounded border cursor-pointer transition-colors ${selectedArmyId === army.id ? 'bg-indigo-900/50 border-indigo-500' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}
                             >
                                <div className="flex justify-between items-center">
                                   <span className="font-bold text-sm">Army {army.id.slice(0,4)}</span>
                                   <span className="text-xs bg-slate-700 px-2 rounded-full">{army.unitIds.length} Units</span>
                                </div>
                                <div className="text-xs text-slate-400 mt-1">Carrying: {getArmyColonistCount(army)} Col</div>
                                {army.destinationId && <div className="text-xs text-yellow-400 mt-1">Moving to {army.destinationId}</div>}
                             </div>
                          ))}
                      </div>
                   </div>

                   {/* Right Col: Detail View */}
                   <div className="w-2/3 flex flex-col pl-2">
                       {selectedArmyId ? (
                           <>
                             {(() => {
                                 const army = localArmies.find(a => a.id === selectedArmyId);
                                 if (!army) return <div>Army disbanded or not found</div>;
                                 
                                 return (
                                     <div className="flex flex-col h-full">
                                         
                                         {/* Army Header */}
                                         <div className="flex justify-between items-center mb-3">
                                            <h4 className="font-bold text-xl text-white">Command: Army {army.id.slice(0,4)}</h4>
                                            {army.unitIds.length === 0 && (
                                                <button 
                                                    onClick={() => handleDeleteArmy(army.id)}
                                                    className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1 rounded font-bold shadow-md uppercase tracking-wider"
                                                >
                                                    Disband Army
                                                </button>
                                            )}
                                         </div>

                                         {/* Movement Orders */}
                                         <div className="mb-4 bg-slate-800 p-3 rounded border border-slate-700">
                                            <div className="text-xs text-slate-400 uppercase mb-2">Strategic Orders</div>
                                            <div className="flex flex-wrap gap-2">
                                                {country.neighbors.map(nId => {
                                                    const nName = gameState.countries.find(c => c.id === nId)?.name || nId;
                                                    return (
                                                        <button 
                                                            key={nId}
                                                            onClick={() => handleMoveArmy(army.id, nId)}
                                                            className={`text-xs py-1 px-3 rounded border transition-colors ${army.destinationId === nId ? 'bg-green-600 border-green-500 text-white' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}
                                                        >
                                                            To {nName}
                                                        </button>
                                                    );
                                                })}
                                                <button onClick={() => handleMoveArmy(army.id, '')} className="text-xs py-1 px-3 bg-red-900/30 text-red-300 rounded hover:bg-red-900/50">Stop</button>
                                            </div>
                                         </div>

                                         {/* Unit Transfer Interface */}
                                         <div className="flex-1 flex gap-4 overflow-hidden">
                                             {/* Army Composition */}
                                             <div className="flex-1 bg-slate-800/50 rounded border border-slate-700 flex flex-col">
                                                 <div className="p-2 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                                                     <span className="font-bold text-sm">In Army</span>
                                                     <div className="flex gap-1">
                                                        <button onClick={() => handleLoadArmy(army.id)} className="text-[10px] bg-indigo-600 px-2 rounded hover:bg-indigo-500">Load All</button>
                                                        <button onClick={() => handleUnloadArmy(army.id)} className="text-[10px] bg-slate-600 px-2 rounded hover:bg-slate-500">Drop All</button>
                                                     </div>
                                                 </div>
                                                 <div className="overflow-y-auto p-2 space-y-1 flex-1">
                                                     {army.unitIds.map(uid => renderUnitItem(uid, 'ARMY'))}
                                                     {army.unitIds.length === 0 && <div className="text-center text-slate-500 text-xs mt-4">Army Empty</div>}
                                                 </div>
                                             </div>

                                             {/* Reserves */}
                                             <div className="flex-1 bg-slate-800/50 rounded border border-slate-700 flex flex-col">
                                                 <div className="p-2 bg-slate-800 border-b border-slate-700 font-bold text-sm text-center">Reserves (Unassigned)</div>
                                                 <div className="overflow-y-auto p-2 space-y-1 flex-1">
                                                     {looseUnits.map(unit => renderUnitItem(unit.id, 'RESERVES'))}
                                                     {looseUnits.length === 0 && <div className="text-center text-slate-500 text-xs mt-4">No Reserves</div>}
                                                 </div>
                                             </div>
                                         </div>
                                     </div>
                                 );
                             })()}
                           </>
                       ) : (
                           /* No Army Selected State - Show summary of reserves */
                           <div className="h-full flex flex-col items-center justify-center text-slate-500">
                               <div className="mb-4">Select an Army to manage units</div>
                               <div className="bg-slate-800 p-4 rounded border border-slate-700 w-full max-w-sm">
                                   <div className="text-center font-bold text-slate-300 mb-2">Available Reserves</div>
                                   <div className="max-h-64 overflow-y-auto space-y-1">
                                       {looseUnits.length > 0 ? looseUnits.map(unit => renderUnitItem(unit.id, 'RESERVES')) : <div className="text-xs italic">None</div>}
                                   </div>
                               </div>
                           </div>
                       )}
                   </div>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

const Stat = ({ label, value, max, highlight }: { label: string, value: number, max?: number, highlight?: boolean }) => (
   <div className={`flex justify-between items-center p-3 rounded ${highlight ? 'bg-slate-700' : 'bg-slate-900/50'}`}>
      <span className="text-slate-400 font-medium">{label}</span>
      <span className={`font-mono font-bold ${highlight ? 'text-yellow-400' : 'text-white'}`}>
         {Math.floor(value)}{max ? <span className="text-slate-500 text-sm">/{max}</span> : ''}
      </span>
   </div>
);

export default CountryModal;

