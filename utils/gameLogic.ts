
import { GameState, Player, Country, Unit, Design, Army, CombatLog, CONSTANTS, PlayerType, FactoryQueueItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const calculateDesignCost = (design: Design): number => {
  let cost = 0;
  cost += (design.engineCount || 0) * CONSTANTS.COST_PER_ENGINE;
  cost += (design.armor || 0) * CONSTANTS.COST_PER_ARMOR;
  cost += (design.cargoCapacity || 0) * CONSTANTS.COST_PER_CARGO;
  if ((design.gunCount || 0) > 0) {
    cost += (design.gunCount || 0) * (design.gunLength || 0) * CONSTANTS.COST_PER_GUN_LENGTH;
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

// Helper to calculate army speed (min engine count of units)
const getArmySpeed = (army: Army, units: Unit[], designMap: Record<string, Design>): number => {
    if (army.unitIds.length === 0) return 0;
    let minSpeed = 999;
    let hasUnits = false;
    army.unitIds.forEach(uid => {
        const u = units.find(unit => unit.id === uid);
        if (u) {
            hasUnits = true;
            const d = designMap[u.designId];
            if (d && d.engineCount < minSpeed) minSpeed = d.engineCount;
        }
    });
    return hasUnits ? (minSpeed === 999 ? 0 : minSpeed) : 0;
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
    // Snapshot rosters
    attackerUnits: attackerUnits.map(u => ({ id: u.id, designId: u.designId })),
    defenderUnits: defenderUnits.map(u => ({ id: u.id, designId: u.designId })),
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
  const designMap = nextState.designs.reduce((acc, d) => ({...acc, [d.id]: d}), {} as Record<string, Design>);

  // 1. AI Logic: Design & Move
  nextState.players.filter(p => p.type === PlayerType.AI).forEach(ai => {
    // A. AI Design Phase
    const myDesigns = nextState.designs.filter(d => d.playerId === ai.id);
    if (myDesigns.length === 0 || Math.random() < 0.15) {
       const newDesign = generateAiDesign(ai.id, nextState.turn);
       nextState.designs.push(newDesign);
    }

    // B. AI Production & Movement
    const aiCountries = nextState.countries.filter(c => c.ownerId === ai.id);
    aiCountries.forEach(country => {
       // Production
       if (!country.factoryQueue) {
          const availableDesigns = nextState.designs.filter(d => d.playerId === ai.id);
          if (availableDesigns.length > 0) {
             const chosenDesign = availableDesigns[Math.floor(Math.random() * availableDesigns.length)];
             country.factoryQueue = {
                designId: chosenDesign.id,
                progress: 0,
                totalCost: chosenDesign.cost
             };
          }
       }
       
       // Schedule Movement
       const armies = nextState.armies.filter(a => a.ownerId === ai.id && a.locationId === country.id && !a.destinationId);
       armies.forEach(army => {
          if (Math.random() > 0.8) { 
             const targetId = country.neighbors[Math.floor(Math.random() * country.neighbors.length)];
             army.destinationId = targetId;
          }
       });
    });
  });

  // 2. Movement
  const movingArmies = nextState.armies.filter(a => a.destinationId);
  const handledArmyIds = new Set<string>();

  movingArmies.forEach(army => {
    if (handledArmyIds.has(army.id)) return;
    
    // Check engines for all units in army. If any unit has 0 engines, army cannot move.
    const canMove = army.unitIds.every(uid => {
        const u = nextState.units.find(unit => unit.id === uid);
        const d = u ? designMap[u.designId] : null;
        return d && d.engineCount > 0;
    });

    if (!canMove) {
        // Cancel move if engines are missing
        army.destinationId = null;
        return;
    }

    const destId = army.destinationId!;
    army.locationId = destId;
    army.destinationId = null;
    army.unitIds.forEach(uid => {
      const u = nextState.units.find(unit => unit.id === uid);
      if(u) u.locationId = destId;
    });
  });

  // 2.5 AI Muster Forces (Before combat)
  nextState.countries.forEach(country => {
     if (country.ownerId) {
        const owner = nextState.players.find(p => p.id === country.ownerId);
        if (owner && owner.type === PlayerType.AI) {
            // Find loose units that are NOT in an army
            const armyUnitIds = new Set(nextState.armies.flatMap(a => a.unitIds));
            const looseUnits = nextState.units.filter(u => u.ownerId === owner.id && u.locationId === country.id && !armyUnitIds.has(u.id));
            
            if (looseUnits.length > 0) {
                // Find existing army in this country to add to, or create new one
                let army = nextState.armies.find(a => a.ownerId === owner.id && a.locationId === country.id);
                if (!army) {
                    army = {
                        id: uuidv4(),
                        ownerId: owner.id,
                        locationId: country.id,
                        destinationId: null,
                        unitIds: []
                    };
                    nextState.armies.push(army);
                }
                army.unitIds.push(...looseUnits.map(u => u.id));
            }
        }
     }
  });

  // 3. Combat & Bombardment & Occupation
  
  // Track units to destroy globally after all battles resolve
  const unitsToDestroy = new Set<string>();

  nextState.countries.forEach(country => {
    const armiesHere = nextState.armies.filter(a => a.locationId === country.id);
    if (armiesHere.length === 0) return;

    // --- SEQUENTIAL COMBAT LOGIC ---
    
    // 1. Identify Defenders (Country Owner's Armies)
    const defenderArmies = armiesHere.filter(a => a.ownerId === country.ownerId);
    let kingArmy: Army | null = null;
    
    // Merge all defender armies into one force if present
    if (defenderArmies.length > 0) {
        const primary = defenderArmies[0];
        primary.unitIds = defenderArmies.flatMap(a => a.unitIds); // Merge IDs
        kingArmy = primary; 
        
        // Remove other defender armies from the local calculation list to prevent dupes, 
        // effectively they are merged into 'primary'.
        // In the global 'nextState.armies', we will clean up empty armies later.
        for (let i = 1; i < defenderArmies.length; i++) {
            defenderArmies[i].unitIds = []; // Empty them out
        }
    }

    // 2. Identify Invaders
    const invaderArmies = armiesHere.filter(a => a.ownerId !== country.ownerId && a.unitIds.length > 0);
    
    // 3. Sort Invaders by Speed (Fastest First), then Random
    const invaderSpecs = invaderArmies.map(army => ({
        army,
        speed: getArmySpeed(army, nextState.units, designMap)
    }));

    invaderSpecs.sort((a, b) => {
        if (b.speed !== a.speed) return b.speed - a.speed; // Descending Speed
        return Math.random() - 0.5; // Random Tiebreaker
    });

    const battleQueue = invaderSpecs.map(s => s.army);

    // 4. Determine Initial King (if no defender existed)
    if (!kingArmy) {
        if (battleQueue.length > 0) {
            kingArmy = battleQueue.shift()!;
        } else {
            // Nothing to do
            return;
        }
    }

    // 5. Combat Loop (King vs Queue)
    while (battleQueue.length > 0) {
        const challenger = battleQueue.shift()!;
        
        // Ensure King has units (might have died in previous loop iteration logic if swapped)
        const kingHasUnits = kingArmy.unitIds.some(uid => !unitsToDestroy.has(uid));
        if (!kingHasUnits) {
            // If King is dead/empty, Challenger takes the hill without fight
            kingArmy = challenger;
            continue;
        }
        
        // Check for Friendly Merge (Same Owner)
        if (kingArmy.ownerId === challenger.ownerId) {
            // Merge challenger into King
            const challengerUnits = challenger.unitIds.filter(uid => !unitsToDestroy.has(uid));
            kingArmy.unitIds.push(...challengerUnits);
            challenger.unitIds = []; // Empty the challenger army
            continue;
        }

        // --- FIGHT ---
        const kingUnits = nextState.units.filter(u => kingArmy!.unitIds.includes(u.id) && !unitsToDestroy.has(u.id));
        const challengerUnits = nextState.units.filter(u => challenger.unitIds.includes(u.id) && !unitsToDestroy.has(u.id));

        if (kingUnits.length === 0 || challengerUnits.length === 0) continue; // Should be covered, but safety first

        const result = resolveCombat(
            challenger, // Attacker (Challenger)
            kingArmy,   // Defender (King)
            challengerUnits,
            kingUnits,
            designMap,
            designMap,
            country.id,
            nextState.turn
        );

        nextState.combatLogs.push(result.combatLog);

        // Mark deaths
        const survivors = new Set([...result.survivingAttackerIds, ...result.survivingDefenderIds]);
        [...kingUnits, ...challengerUnits].forEach(u => {
            if (!survivors.has(u.id)) {
                unitsToDestroy.add(u.id);
            }
        });

        // Update Army Unit Lists immediately for next iteration logic
        kingArmy.unitIds = kingArmy.unitIds.filter(uid => result.survivingDefenderIds.includes(uid));
        challenger.unitIds = challenger.unitIds.filter(uid => result.survivingAttackerIds.includes(uid));

        // Winner Check
        if (kingArmy.unitIds.length === 0) {
            if (challenger.unitIds.length > 0) {
                // Challenger Wins and becomes King
                kingArmy = challenger;
            } else {
                // Mutual Destruction
                // Pick next from queue if available
                if (battleQueue.length > 0) {
                    kingArmy = battleQueue.shift()!;
                } else {
                    kingArmy = null;
                }
            }
        }
        // If King survives, they remain King and fight the next challenger.
    }


    // --- PHASE B: BOMBARDMENT / OCCUPATION (by the final King) ---
    if (kingArmy && kingArmy.unitIds.length > 0) {
        const dominantPlayerId = kingArmy.ownerId;
        
        // Check if hostile to country
        if (dominantPlayerId !== country.ownerId) {
            const survivingLocalUnits = nextState.units.filter(u => 
                kingArmy!.unitIds.includes(u.id) && !unitsToDestroy.has(u.id)
            );

            let totalGunPower = 0;
            survivingLocalUnits.forEach(u => {
                const des = designMap[u.designId];
                if (des && des.gunCount > 0) {
                    totalGunPower += (des.gunCount * des.gunLength);
                }
            });

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

            // Invasion Logic (Desant)
            if (country.population <= 0 && (!country.colonists || country.colonists <= 0)) {
                let landedColonists = 0;
                survivingLocalUnits.forEach(u => {
                    if (u.cargo.colonists > 0) {
                        landedColonists += u.cargo.colonists;
                        u.cargo.colonists = 0; 
                    }
                    if (u.cargo.population > 0) {
                        landedColonists += u.cargo.population; 
                        u.cargo.population = 0;
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

            // Append bombardment result to the LAST log if it exists, or create a siege log
            const lastLog = nextState.combatLogs[nextState.combatLogs.length - 1];
            if (lastLog && lastLog.locationId === country.id && lastLog.turn === nextState.turn) {
                lastLog.bombardmentResult = bombardmentResult;
            } else {
                // Unopposed Siege/Bombardment Log
                const siegeLog: CombatLog = {
                    id: uuidv4(),
                    locationId: country.id,
                    turn: nextState.turn,
                    attackerId: dominantPlayerId,
                    defenderId: country.ownerId || 'neutral',
                    winnerId: dominantPlayerId,
                    rounds: [], 
                    attackerUnits: survivingLocalUnits.map(u => ({ id: u.id, designId: u.designId })),
                    defenderUnits: [],
                    bombardmentResult
                };
                nextState.combatLogs.push(siegeLog);
            }
        }
    }
  });

  // 4. Cleanup Dead Units & Empty Armies globally
  nextState.units = nextState.units.filter(u => !unitsToDestroy.has(u.id));
  nextState.armies.forEach(a => {
      a.unitIds = a.unitIds.filter(uid => !unitsToDestroy.has(uid));
  });
  nextState.armies = nextState.armies.filter(a => a.unitIds.length > 0);


  // 5. Production & Resources
  nextState.countries.forEach(country => {
    if (country.ownerId) {
        country.lastTurnStats = { materialsProduced: 0, materialsConsumed: 0, unitsProduced: 0 };
        const currentWorkforce = country.population;
        const production = Number(currentWorkforce);
        country.materials = Number(country.materials || 0) + production;
        country.lastTurnStats.materialsProduced = production;

        if (country.factoryQueue) {
            const queue = country.factoryQueue;
            const productionSpeed = currentWorkforce; 
            const materialsAvailable = country.materials;
            let buildCapacity = Math.min(productionSpeed, materialsAvailable);
            
            if (buildCapacity > 0) {
                while (buildCapacity > 0) {
                    const neededForCurrent = queue.totalCost - queue.progress;
                    
                    if (buildCapacity >= neededForCurrent) {
                        country.materials -= neededForCurrent;
                        country.lastTurnStats.materialsConsumed += neededForCurrent;
                        buildCapacity -= neededForCurrent;
                        
                        const newUnit: Unit = {
                            id: uuidv4(),
                            designId: queue.designId,
                            ownerId: country.ownerId,
                            locationId: country.id, 
                            hp: 1,
                            cargo: { colonists: 0, materials: 0, population: 0 }
                        };
                        nextState.units.push(newUnit);
                        country.lastTurnStats.unitsProduced += 1;
                        queue.progress = 0;
                    } else {
                        country.materials -= buildCapacity;
                        country.lastTurnStats.materialsConsumed += buildCapacity;
                        queue.progress += buildCapacity;
                        buildCapacity = 0; 
                    }
                }
            }
        }

        let newPop = Math.floor(country.population * CONSTANTS.POPULATION_GROWTH);
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
