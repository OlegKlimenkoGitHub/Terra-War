

import { GameState, Player, Country, Unit, Design, Army, CombatLog, CONSTANTS, PlayerType, FactoryQueueItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const calculateDesignCost = (design: Design): number => {
  let cost = 0;
  cost += design.engineCount * CONSTANTS.COST_PER_ENGINE;
  cost += design.armor * CONSTANTS.COST_PER_ARMOR;
  cost += design.cargoCapacity * CONSTANTS.COST_PER_CARGO;
  if (design.gunCount > 0) {
    cost += design.gunCount * design.gunLength * CONSTANTS.COST_PER_GUN_LENGTH;
  }
  return Math.max(1, cost); // Minimum cost 1
};

// AI Name Generators
const AI_PREFIXES = ['Iron', 'Steel', 'Crimson', 'Shadow', 'Royal', 'Atomic', 'Cyber', 'Vanguard'];
const AI_NOUNS = ['Fist', 'Eagle', 'Guard', 'Storm', 'Blade', 'Wall', 'Hauler', 'Walker'];

const generateAiDesign = (playerId: string, turn: number): Design => {
  const isTransport = Math.random() > 0.7;
  const isHeavy = Math.random() > 0.6;
  const name = `${AI_PREFIXES[Math.floor(Math.random() * AI_PREFIXES.length)]} ${AI_NOUNS[Math.floor(Math.random() * AI_NOUNS.length)]} Mk-${Math.ceil(turn / 5)}`;
  
  // Tech scaling: As turns progress, AI builds bigger things
  const scale = Math.min(5, 1 + Math.floor(turn / 10)); 

  let design: Partial<Design> = {
    id: uuidv4(),
    playerId,
    name,
    gunCount: 0,
    gunLength: 0,
    armor: 0,
    cargoCapacity: 0,
    engineCount: 1
  };

  if (isTransport) {
    // Transport Focus
    design.cargoCapacity = 20 * scale;
    design.engineCount = 1 + Math.floor(scale / 2);
    design.armor = Math.floor(scale / 2); // Light armor
    design.name += " (T)";
  } else if (isHeavy) {
    // Heavy Tank Focus
    design.armor = 2 * scale + Math.floor(Math.random() * 2);
    design.gunCount = 1 + Math.floor(Math.random() * 2);
    design.gunLength = 2 * scale + Math.floor(Math.random() * 2);
    design.engineCount = Math.max(1, scale); 
  } else {
    // Standard/Scout Focus
    design.armor = scale;
    design.gunCount = 1;
    design.gunLength = scale;
    design.engineCount = scale + 1; // Faster
  }

  // Calculate cost
  const fullDesign = design as Design;
  fullDesign.cost = calculateDesignCost(fullDesign);
  return fullDesign;
};

export const resolveCombat = (
  attackerArmy: Army, 
  defenderArmy: Army, 
  attackerUnits: Unit[], 
  defenderUnits: Unit[], 
  attackerDesignMap: Record<string, Design>, 
  defenderDesignMap: Record<string, Design>,
  locationId: string,
  turn: number
): { combatLog: CombatLog, survivingAttackerIds: string[], survivingDefenderIds: string[] } => {
  
  const log: CombatLog = {
    id: uuidv4(),
    locationId,
    turn,
    attackerId: attackerArmy.ownerId,
    defenderId: defenderArmy.ownerId,
    winnerId: '',
    rounds: []
  };

  let activeAttackers = [...attackerUnits];
  let activeDefenders = [...defenderUnits];

  // Combat Loop
  while (activeAttackers.length > 0 && activeDefenders.length > 0) {
    const roundDetails: any = {};
    
    // Attacker shoots
    if (activeAttackers.length > 0) {
      const shooter = activeAttackers[Math.floor(Math.random() * activeAttackers.length)];
      const target = activeDefenders[Math.floor(Math.random() * activeDefenders.length)];
      const shooterDesign = attackerDesignMap[shooter.designId];
      const targetDesign = defenderDesignMap[target.designId];

      let destroyed = false;
      // All guns shoot
      if (shooterDesign.gunCount > 0) {
         // Check penetration
         if (shooterDesign.gunLength >= targetDesign.armor) {
            destroyed = true;
         }
      }

      roundDetails.attackerShot = {
        unitId: shooter.id,
        targetId: target.id,
        hit: true,
        destroyed,
        damage: destroyed ? 1 : 0
      };

      if (destroyed) {
        activeDefenders = activeDefenders.filter(u => u.id !== target.id);
      }
    }

    // Defender shoots (if any left and not just destroyed)
    if (activeDefenders.length > 0) {
      const shooter = activeDefenders[Math.floor(Math.random() * activeDefenders.length)];
      const target = activeAttackers[Math.floor(Math.random() * activeAttackers.length)];
      const shooterDesign = defenderDesignMap[shooter.designId];
      const targetDesign = attackerDesignMap[target.designId];

      let destroyed = false;
      if (shooterDesign.gunCount > 0) {
         if (shooterDesign.gunLength >= targetDesign.armor) {
            destroyed = true;
         }
      }

      roundDetails.defenderShot = {
        unitId: shooter.id,
        targetId: target.id,
        hit: true,
        destroyed,
        damage: destroyed ? 1 : 0
      };

      if (destroyed) {
        activeAttackers = activeAttackers.filter(u => u.id !== target.id);
      }
    }
    
    log.rounds.push(roundDetails);

    // Stalemate check
    const attackerCanHurt = activeAttackers.some(u => {
        const d = attackerDesignMap[u.designId];
        return activeDefenders.some(def => d.gunCount > 0 && d.gunLength >= defenderDesignMap[def.designId].armor);
    });
    const defenderCanHurt = activeDefenders.some(u => {
        const d = defenderDesignMap[u.designId];
        return activeAttackers.some(att => d.gunCount > 0 && d.gunLength >= attackerDesignMap[att.designId].armor);
    });

    if (!attackerCanHurt && !defenderCanHurt) {
      break; 
    }
  }

  // Determine Winner
  if (activeDefenders.length > 0) {
    log.winnerId = defenderArmy.ownerId; // Defender wins ties
  } else if (activeAttackers.length > 0) {
    log.winnerId = attackerArmy.ownerId;
  } else {
    log.winnerId = defenderArmy.ownerId; 
  }

  return {
    combatLog: log,
    survivingAttackerIds: activeAttackers.map(u => u.id),
    survivingDefenderIds: activeDefenders.map(u => u.id)
  };
};

export const processTurn = (currentState: GameState): GameState => {
  const nextState = JSON.parse(JSON.stringify(currentState)) as GameState;
  nextState.turn += 1;

  // 1. AI Logic: Design & Move
  nextState.players.filter(p => p.type === PlayerType.AI).forEach(ai => {
    // A. AI Design Phase
    // Chance to design a new unit: 15% per turn, OR if they have 0 designs
    const myDesigns = nextState.designs.filter(d => d.playerId === ai.id);
    if (myDesigns.length === 0 || Math.random() < 0.15) {
       const newDesign = generateAiDesign(ai.id, nextState.turn);
       nextState.designs.push(newDesign);
    }

    // B. AI Production & Movement
    const aiCountries = nextState.countries.filter(c => c.ownerId === ai.id);
    aiCountries.forEach(country => {
       // Production: If queue empty, pick a design
       if (!country.factoryQueue) {
          const availableDesigns = nextState.designs.filter(d => d.playerId === ai.id);
          if (availableDesigns.length > 0) {
             // Pick random design (could be improved to pick best counter)
             const chosenDesign = availableDesigns[Math.floor(Math.random() * availableDesigns.length)];
             country.factoryQueue = {
                designId: chosenDesign.id,
                progress: 0,
                totalCost: chosenDesign.cost
             };
          }
       }
       
       // Move armies randomly
       const armies = nextState.armies.filter(a => a.ownerId === ai.id && a.locationId === country.id && !a.destinationId);
       armies.forEach(army => {
          if (Math.random() > 0.7) { // 30% chance to move
             const targetId = country.neighbors[Math.floor(Math.random() * country.neighbors.length)];
             army.destinationId = targetId;
          }
       });
    });
  });

  // Re-index designs for lookup
  const designMap = nextState.designs.reduce((acc, d) => ({...acc, [d.id]: d}), {} as Record<string, Design>);

  // 2. Movement
  const movingArmies = nextState.armies.filter(a => a.destinationId);
  const handledArmyIds = new Set<string>();

  movingArmies.forEach(army => {
    if (handledArmyIds.has(army.id)) return;
    
    const destId = army.destinationId!;
    
    // Move army to destination
    army.locationId = destId;
    army.destinationId = null;

    // Update location of all units in this army
    army.unitIds.forEach(uid => {
      const u = nextState.units.find(unit => unit.id === uid);
      if(u) u.locationId = destId;
    });
  });

  // 3. Combat & Bombardment & Occupation
  nextState.countries.forEach(country => {
    const armiesHere = nextState.armies.filter(a => a.locationId === country.id);
    if (armiesHere.length === 0) return;

    // Group by owner
    const owners = Array.from(new Set(armiesHere.map(a => a.ownerId)));
    
    let currentCombatLog: CombatLog | null = null;
    let dominantPlayerId: string | null = null;
    let survivingUnits: Unit[] = [];

    // --- PHASE A: BATTLE ---
    // Battle occurs if more than 1 player is present
    if (owners.length > 1) {
      const ownerId = country.ownerId;
      // If the owner is one of the armies, they are defender.
      const defenderId = owners.find(id => id === ownerId) || owners[0];
      const defenders = armiesHere.filter(a => a.ownerId === defenderId);
      const attackers = armiesHere.filter(a => a.ownerId !== defenderId); 
      
      // Merge all defender armies for the battle
      const defenderUnits = defenders.flatMap(a => a.unitIds.map(uid => nextState.units.find(u => u.id === uid)!));
      const attackerUnits = attackers.flatMap(a => a.unitIds.map(uid => nextState.units.find(u => u.id === uid)!));
      
      // Use the first attacking army as the "lead" for the log
      const attackerArmy = attackers[0];
      const consolidatedDefenderArmy: Army = {
         id: 'defense_force', ownerId: defenderId || 'neutral', locationId: country.id, destinationId: null, unitIds: defenderUnits.map(u => u.id)
      };

      const result = resolveCombat(
         attackerArmy, 
         consolidatedDefenderArmy,
         attackerUnits,
         defenderUnits,
         designMap,
         designMap,
         country.id,
         nextState.turn
      );

      currentCombatLog = result.combatLog;
      dominantPlayerId = result.combatLog.winnerId;

      // Remove dead units
      const survivorIds = new Set([...result.survivingAttackerIds, ...result.survivingDefenderIds]);
      nextState.units = nextState.units.filter(u => survivorIds.has(u.id));
      
      // Update armies
      nextState.armies.forEach(a => {
         a.unitIds = a.unitIds.filter(uid => survivorIds.has(uid));
      });
      nextState.armies = nextState.armies.filter(a => a.unitIds.length > 0);
      
      survivingUnits = nextState.units.filter(u => survivorIds.has(u.id) && u.locationId === country.id && u.ownerId === dominantPlayerId);

    } else {
      // Only one army owner present - they are automatically dominant
      dominantPlayerId = owners[0];
      survivingUnits = armiesHere.flatMap(a => a.unitIds.map(uid => nextState.units.find(u => u.id === uid)!));
    }


    // --- PHASE B: BOMBARDMENT / OCCUPATION ---
    // If the dominant army is NOT the country owner, they bombard/occupy
    // This happens if they won the battle OR if they walked in unopposed
    if (dominantPlayerId && dominantPlayerId !== country.ownerId) {
        let totalGunPower = 0;
        
        // Calculate power of all units belonging to dominant player in this country
        survivingUnits.forEach(u => {
            if (u.ownerId === dominantPlayerId) {
                const des = designMap[u.designId];
                if (des && des.gunCount > 0) {
                    totalGunPower += (des.gunCount * des.gunLength);
                }
            }
        });

        // Bombardment Damage
        let killPower = totalGunPower;
        const colonistsKilled = Math.min(country.colonists || 0, killPower);
        if (country.colonists) country.colonists -= colonistsKilled;
        killPower -= colonistsKilled;

        const popKilled = Math.min(country.population, killPower);
        country.population -= popKilled;
        
        const bombardmentResult = {
            colonistsKilled,
            populationKilled: popKilled,
            invaded: false
        };

        // Invasion Check (Capture)
        if (country.population <= 0 && (!country.colonists || country.colonists <= 0)) {
            let landedColonists = 0;
            survivingUnits.forEach(u => {
                if (u.ownerId === dominantPlayerId) {
                    if (u.cargo.colonists > 0) {
                        landedColonists += u.cargo.colonists;
                        u.cargo.colonists = 0; 
                    }
                    if (u.cargo.population > 0) {
                        landedColonists += u.cargo.population; 
                        u.cargo.population = 0;
                    }
                }
            });

            if (landedColonists > 0) {
                country.ownerId = dominantPlayerId;
                country.factoryQueue = null; 
                const space = country.maxPopulation; 
                const newPop = Math.min(landedColonists, space);
                country.population = newPop;
                country.colonists = landedColonists - newPop;
                bombardmentResult.invaded = true;
            }
        }

        // --- LOGGING ---
        if (currentCombatLog) {
            // Append to battle log
            currentCombatLog.bombardmentResult = bombardmentResult;
            nextState.combatLogs.push(currentCombatLog);
        } else {
            // Create a Siege Log (No battle, just bombardment)
            // Only log if something actually happened (damage dealt OR invaded)
            // Or if an army moved in unopposed, we want to know
            const siegeLog: CombatLog = {
                id: uuidv4(),
                locationId: country.id,
                turn: nextState.turn,
                attackerId: dominantPlayerId,
                defenderId: country.ownerId || 'neutral',
                winnerId: dominantPlayerId,
                rounds: [], // Siege/Unopposed
                bombardmentResult
            };
            nextState.combatLogs.push(siegeLog);
        }
    } else {
        // If battle happened but Defender won, we still need to save the log
        if (currentCombatLog) {
            nextState.combatLogs.push(currentCombatLog);
        }
    }
  });


  // 4. Production & Resources
  nextState.countries.forEach(country => {
    if (country.ownerId) {
        // Init stats for this turn
        country.lastTurnStats = { materialsProduced: 0, materialsConsumed: 0, unitsProduced: 0 };

        const currentWorkforce = country.population;

        // --- Material Production ---
        // "One unit of population produces one unit of material"
        const production = Number(currentWorkforce);
        country.materials = Number(country.materials || 0) + production;
        country.lastTurnStats.materialsProduced = production;

        // --- Factory Production ---
        if (country.factoryQueue) {
            const queue = country.factoryQueue;
            const productionSpeed = currentWorkforce; // Speed depends on population
            
            // Available materials for this turn (current stock)
            const materialsAvailable = country.materials;
            
            // Production is limited by Speed AND Materials
            let buildCapacity = Math.min(productionSpeed, materialsAvailable);
            
            if (buildCapacity > 0) {
                while (buildCapacity > 0) {
                    const neededForCurrent = queue.totalCost - queue.progress;
                    
                    if (buildCapacity >= neededForCurrent) {
                        // Finish Unit
                        country.materials -= neededForCurrent;
                        country.lastTurnStats.materialsConsumed += neededForCurrent;
                        buildCapacity -= neededForCurrent;
                        
                        // Create Unit
                        const newUnit: Unit = {
                            id: uuidv4(),
                            designId: queue.designId,
                            ownerId: country.ownerId,
                            locationId: country.id, // Produced at country
                            hp: 1,
                            cargo: { colonists: 0, materials: 0, population: 0 }
                        };
                        nextState.units.push(newUnit);
                        country.lastTurnStats.unitsProduced += 1;
                        
                        // Reset queue progress (keep design active for next one)
                        queue.progress = 0;
                    } else {
                        // Partial Progress
                        country.materials -= buildCapacity;
                        country.lastTurnStats.materialsConsumed += buildCapacity;
                        queue.progress += buildCapacity;
                        buildCapacity = 0; // Exhausted capacity
                    }
                }
            }
        }

        // --- Population Growth ---
        // "Every turn population grows with coefficient 1.5"
        let newPop = Math.floor(country.population * CONSTANTS.POPULATION_GROWTH);
        
        // "If population exceeds country size, excess becomes colonists"
        if (newPop > country.maxPopulation) {
            const overflow = newPop - country.maxPopulation;
            country.colonists = (country.colonists || 0) + overflow;
            newPop = country.maxPopulation;
        }
        country.population = newPop;
    }
  });

  return nextState;
};
