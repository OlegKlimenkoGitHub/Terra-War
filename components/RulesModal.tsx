
import React from 'react';

interface Props {
  onClose: () => void;
}

const RulesModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-800 border border-slate-600 rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="bg-slate-900 p-6 border-b border-slate-700 flex justify-between items-center">
           <h2 className="text-3xl font-bold text-blue-400">Terra Conflict Field Manual</h2>
           <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">✖</button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto space-y-8 text-slate-300 leading-relaxed">
           
           <section>
              <h3 className="text-xl font-bold text-white mb-2 border-b border-slate-600 pb-1">🎯 Objective</h3>
              <p>
                 You are the supreme commander of a nation. Your goal is to <strong className="text-yellow-400">conquer the entire world</strong>. 
                 Eliminate all other factions by capturing their territories. The game ends when one player owns all countries.
              </p>
           </section>

           <section>
              <h3 className="text-xl font-bold text-white mb-2 border-b border-slate-600 pb-1">🏭 Economy & Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-slate-700/30 p-4 rounded">
                    <div className="font-bold text-green-400 mb-1">Population</div>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                       <li>Grows by <strong>x1.5</strong> every year (turn).</li>
                       <li>Produces <strong>Materials</strong> (1 Pop = 1 Material/Year).</li>
                       <li>Determines <strong>Production Speed</strong> in factories.</li>
                    </ul>
                 </div>
                 <div className="bg-slate-700/30 p-4 rounded">
                    <div className="font-bold text-orange-400 mb-1">Colonists</div>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                       <li>Created when Population exceeds Country Size.</li>
                       <li>Required to <strong>capture</strong> empty enemy lands.</li>
                       <li>Can be transported in units with Cargo Capacity.</li>
                    </ul>
                 </div>
              </div>
           </section>

           <section>
              <h3 className="text-xl font-bold text-white mb-2 border-b border-slate-600 pb-1">🛠️ Engineering & Production</h3>
              <p className="mb-3">
                 Victory requires superior machinery. Visit the <strong className="text-indigo-400">Design Bureau</strong> to create custom units.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                 <li><strong className="text-white">Engines:</strong> Required to move.</li>
                 <li><strong className="text-white">Armor:</strong> Defends against enemy fire. Higher armor requires longer enemy guns to penetrate.</li>
                 <li><strong className="text-white">Guns:</strong> <strong>Length</strong> determines penetration power. <strong>Count</strong> increases fire rate.</li>
                 <li><strong className="text-white">Cargo:</strong> Allows transport of Colonists (for invasion) or extra Population.</li>
              </ul>
              <p className="mt-3 text-sm italic text-slate-400">
                 Once designed, units are built in your Country's Factory. Production speed is limited by your Population count and available Materials.
              </p>
           </section>

           <section>
              <h3 className="text-xl font-bold text-white mb-2 border-b border-slate-600 pb-1">⚔️ Combat & Conquest</h3>
              <ol className="list-decimal pl-5 space-y-2">
                 <li><strong>Deploy:</strong> Create an Army in your country and add units to it.</li>
                 <li><strong>Move:</strong> Send armies to neighboring countries. Combat happens instantly at the end of the turn.</li>
                 <li><strong>Battle:</strong> Units fire at random targets. A unit is destroyed if the attacker's <strong>Gun Length ≥ Target's Armor</strong>.</li>
                 <li><strong>Bombardment:</strong> If you win the battle (or find no army), your surviving guns will kill enemy Colonists and Population.</li>
                 <li><strong>Capture:</strong> If the enemy country is depopulated (0 Pop, 0 Col), your army automatically unloads its <strong>Cargo Colonists</strong> to claim the land.</li>
              </ol>
           </section>

           <div className="bg-indigo-900/30 border border-indigo-500/30 p-4 rounded text-center">
              <strong className="text-indigo-300">Pro Tip:</strong> Don't forget to design a Transport vehicle and load it with Colonists! Tanks alone can destroy a country, but they cannot capture it without settlers.
           </div>

        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-900 border-t border-slate-700 text-right">
           <button onClick={onClose} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow-lg transition-transform hover:scale-105">
              Understood, Commander
           </button>
        </div>

      </div>
    </div>
  );
};

export default RulesModal;
