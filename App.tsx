
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Player, Country, Design, Unit, Army, CombatLog, PlayerType, CONSTANTS } from './types';
import { INITIAL_COUNTRIES } from './utils/mapData';
import { processTurn, calculateDesignCost } from './utils/gameLogic';
import WorldMap from './components/WorldMap';
import DesignBureau from './components/DesignBureau';
import CountryModal from './components/CountryModal';
import FactoryModal from './components/FactoryModal';
import BattleViewer from './components/BattleViewer';
import TurnReportModal from './components/TurnReportModal';
import RulesModal from './components/RulesModal';
import { v4 as uuidv4 } from 'uuid';

// Ensure full Country object shape to avoid NaN issues
const FULL_INITIAL_COUNTRIES = INITIAL_COUNTRIES.map(c => ({
  ...c,
  population: 100,
  materials: 0,
  colonists: 0,
  factoryQueue: null,
  ownerId: null,
  lastTurnStats: { materialsProduced: 0, materialsConsumed: 0, unitsProduced: 0 }
})) as Country[];

const createInitialState = (): GameState => ({
  turn: 1,
  players: [],
  countries: JSON.parse(JSON.stringify(FULL_INITIAL_COUNTRIES)), // Deep copy
  designs: [],
  units: [],
  armies: [],
  combatLogs: [],
  selectedCountryId: null,
  humanPlayerId: '',
  gameStatus: 'LOBBY',
  winnerId: null
});

export default function App() {
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [activeModal, setActiveModal] = useState<'NONE' | 'BUREAU' | 'COUNTRY' | 'FACTORY' | 'BATTLE' | 'ARMY' | 'REPORT' | 'RULES'>('NONE');
  const [viewingBattleId, setViewingBattleId] = useState<string | null>(null);
  const [turnReportLogs, setTurnReportLogs] = useState<CombatLog[]>([]);

  // Initialize Game
  const startGame = (countryId: string) => {
    const humanId = uuidv4();
    const humanPlayer: Player = { id: humanId, name: 'Human Commander', color: '#3b82f6', type: PlayerType.HUMAN };
    
    // Create AI players for other countries
    const newPlayers = [humanPlayer];
    const newCountries = gameState.countries.map(c => {
       const nc = { ...c };
       if (c.id === countryId) {
         nc.ownerId = humanId;
         nc.population = 100;
       } else {
         const aiId = uuidv4();
         const aiPlayer: Player = { 
            id: aiId, 
            name: `AI ${c.name}`, 
            color: `#${Math.floor(Math.random()*16777215).toString(16)}`, 
            type: PlayerType.AI 
         };
         newPlayers.push(aiPlayer);
         nc.ownerId = aiId;
         nc.population = 100;
       }
       nc.colonists = 0;
       nc.materials = 0;
       nc.lastTurnStats = { materialsProduced: 0, materialsConsumed: 0, unitsProduced: 0 };
       return nc;
    });

    setGameState({
      ...gameState,
      players: newPlayers,
      countries: newCountries,
      humanPlayerId: humanId,
      gameStatus: 'PLAYING'
    });
  };

  const handleNextTurn = () => {
    const newState = processTurn(gameState);
    
    // Check for new combat logs
    const previousLogCount = gameState.combatLogs.length;
    const newLogs = newState.combatLogs.slice(previousLogCount);
    
    setGameState(newState);

    if (newLogs.length > 0) {
       setTurnReportLogs(newLogs);
       setActiveModal('REPORT');
    }
  };

  const handleNewGame = () => {
    if (window.confirm("Are you sure you want to abandon the current game and start over?")) {
        setGameState(createInitialState());
        setActiveModal('NONE');
        setTurnReportLogs([]);
        setViewingBattleId(null);
    }
  };

  const handleCountryClick = (countryId: string) => {
    if (gameState.gameStatus === 'LOBBY') {
      startGame(countryId);
    } else {
      setGameState(prev => ({ ...prev, selectedCountryId: countryId }));
      setActiveModal('COUNTRY');
    }
  };

  // Selectors
  const humanPlayer = gameState.players.find(p => p.id === gameState.humanPlayerId);
  const selectedCountry = gameState.countries.find(c => c.id === gameState.selectedCountryId);

  return (
    <div className="flex h-screen w-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar / Topbar */}
      <div className="absolute top-0 left-0 w-full h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 z-10 shadow-lg">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-wider text-blue-400">TERRA CONFLICT</h1>
          <button 
             onClick={() => setActiveModal('RULES')}
             className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs font-semibold text-slate-300 border border-slate-600"
          >
             Rules
          </button>
          {gameState.gameStatus === 'PLAYING' && (
             <div className="flex items-center gap-4 text-sm ml-4 border-l border-slate-700 pl-4">
                <span className="bg-slate-700 px-3 py-1 rounded">Turn: {gameState.turn}</span>
                <span className="text-slate-400">Player: {humanPlayer?.name}</span>
             </div>
          )}
        </div>

        {gameState.gameStatus === 'PLAYING' && (
          <div className="flex items-center gap-3">
             <button 
                onClick={handleNewGame}
                className="px-4 py-2 bg-red-900/40 hover:bg-red-800 border border-red-900/50 rounded text-sm font-semibold text-red-200 transition-colors mr-4"
             >
               New Game
             </button>
             <button 
                onClick={() => setActiveModal('BUREAU')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm font-semibold transition-colors"
             >
               Design Bureau
             </button>
             <button 
                onClick={handleNextTurn}
                className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded text-sm font-bold shadow-md transition-all hover:scale-105"
             >
               NEXT YEAR &gt;&gt;
             </button>
          </div>
        )}
      </div>

      {/* Main Map Area */}
      <div className="w-full h-full pt-16 relative">
         {gameState.gameStatus === 'LOBBY' && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 bg-slate-800/90 p-6 rounded-xl border border-blue-500 text-center shadow-2xl backdrop-blur-sm max-w-lg">
               <h2 className="text-2xl font-bold mb-2 text-white">Select Your Nation</h2>
               <p className="text-slate-300 mb-4">Click on any country on the map to begin your conquest.</p>
               <button 
                 onClick={() => setActiveModal('RULES')}
                 className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm font-bold text-white border border-slate-500"
               >
                 Read How To Play
               </button>
            </div>
         )}
         
         <WorldMap 
            countries={gameState.countries} 
            players={gameState.players}
            units={gameState.units}
            armies={gameState.armies}
            combatLogs={gameState.combatLogs}
            onCountryClick={handleCountryClick}
            onBattleClick={(logId) => {
              setViewingBattleId(logId);
              setActiveModal('BATTLE');
            }}
            currentTurn={gameState.turn}
         />
      </div>

      {/* Modals */}
      {activeModal === 'RULES' && (
        <RulesModal onClose={() => setActiveModal('NONE')} />
      )}

      {activeModal === 'BUREAU' && (
        <DesignBureau 
          player={humanPlayer!} 
          designs={gameState.designs}
          units={gameState.units}
          onSave={(newDesign) => {
            setGameState(prev => ({
              ...prev,
              designs: [...prev.designs, newDesign]
            }));
          }}
          onDelete={(designId) => {
             // Logic handled inside or passed up. 
             setGameState(prev => ({
                ...prev,
                designs: prev.designs.filter(d => d.id !== designId)
             }));
          }}
          onClose={() => setActiveModal('NONE')} 
        />
      )}

      {activeModal === 'COUNTRY' && selectedCountry && (
        <CountryModal 
           country={selectedCountry}
           player={humanPlayer!}
           isOwner={selectedCountry.ownerId === humanPlayer!.id}
           gameState={gameState}
           setGameState={setGameState}
           onOpenFactory={() => setActiveModal('FACTORY')}
           onOpenBattleHistory={() => {}} // Could open a list
           onClose={() => setActiveModal('NONE')}
        />
      )}

      {activeModal === 'FACTORY' && selectedCountry && (
         <FactoryModal
            country={selectedCountry}
            designs={gameState.designs.filter(d => d.playerId === humanPlayer!.id)}
            onSetQueue={(item) => {
               const newCountries = gameState.countries.map(c => c.id === selectedCountry.id ? { ...c, factoryQueue: item } : c);
               setGameState(prev => ({ ...prev, countries: newCountries }));
            }}
            onClose={() => setActiveModal('COUNTRY')}
         />
      )}

      {activeModal === 'BATTLE' && viewingBattleId && (
        <BattleViewer
          log={gameState.combatLogs.find(l => l.id === viewingBattleId)!}
          designs={gameState.designs}
          players={gameState.players}
          onClose={() => setActiveModal('NONE')}
        />
      )}

      {activeModal === 'REPORT' && (
        <TurnReportModal
           logs={turnReportLogs}
           countries={gameState.countries}
           players={gameState.players}
           myPlayerId={humanPlayer!.id}
           onViewBattle={(logId) => {
              setViewingBattleId(logId);
              setActiveModal('BATTLE');
           }}
           onClose={() => setActiveModal('NONE')}
        />
      )}

    </div>
  );
}
