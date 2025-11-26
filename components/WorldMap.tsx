
import React, { useEffect, useRef, useState } from 'react';
import { Country, Player, Army, Unit, CombatLog, PlayerType } from '../types';

// Declare Leaflet global
declare var L: any;

interface WorldMapProps {
  countries: Country[];
  players: Player[];
  units: Unit[];
  armies: Army[];
  combatLogs: CombatLog[];
  onCountryClick: (id: string) => void;
  onBattleClick: (logId: string) => void;
  currentTurn: number;
}

const WorldMap: React.FC<WorldMapProps> = ({ countries, players, units, armies, combatLogs, onCountryClick, onBattleClick, currentTurn }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any | null>(null);
  const layerGroupRef = useRef<any | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Already initialized

    // Create map
    const map = L.map(mapContainerRef.current, {
        center: [25, 10], // Slightly shifted to see Europe/Asia/Africa better
        zoom: 2,
        minZoom: 2,
        maxZoom: 6,
        zoomControl: false,
        attributionControl: false,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0
    });

    // Dark Matter Tile Layer (Political borders, dark theme)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Layer group for game objects to easily clear/redraw
    const layerGroup = L.layerGroup().addTo(map);
    
    mapInstanceRef.current = map;
    layerGroupRef.current = layerGroup;

    return () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }
    };
  }, []);

  // Render Game State
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    // Clear previous layers
    layerGroupRef.current.clearLayers();

    countries.forEach(country => {
        // 1. Ownership Indicator (Circle)
        const owner = players.find(p => p.id === country.ownerId);
        const color = owner ? owner.color : '#475569'; // Slate-600 for neutral
        const isWild = !owner;

        // Radius scaling: Leaflet uses meters for Circle radius
        const radius = Math.sqrt(country.maxPopulation) * 20000; 

        const circle = L.circle([country.center.lat, country.center.lng], {
            color: isWild ? '#64748b' : color,
            weight: 1,
            fillColor: isWild ? '#1e293b' : color,
            fillOpacity: isWild ? 0.2 : 0.4,
            radius: radius
        });

        circle.on('click', () => onCountryClick(country.id));
        circle.on('mouseover', () => circle.setStyle({ fillOpacity: 0.6 }));
        circle.on('mouseout', () => circle.setStyle({ fillOpacity: isWild ? 0.2 : 0.4 }));

        circle.addTo(layerGroupRef.current);

        // 2. Label Marker (Custom DivIcon)
        const labelIcon = L.divIcon({
            className: 'bg-transparent',
            html: `<div class="text-[10px] md:text-xs font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] text-center whitespace-nowrap -translate-x-1/2 -translate-y-1/2 pointer-events-none">${country.name}</div>`
        });

        L.marker([country.center.lat, country.center.lng], { icon: labelIcon, interactive: false }).addTo(layerGroupRef.current);

        // 3. Army Dots
        const localArmies = armies.filter(a => a.locationId === country.id);
        const hasHumanArmy = localArmies.some(a => players.find(p => p.id === a.ownerId)?.type === PlayerType.HUMAN);
        const hasAiArmy = localArmies.some(a => players.find(p => p.id === a.ownerId)?.type === PlayerType.AI);

        if (hasHumanArmy || hasAiArmy) {
            const offsetLat = -2; 
            
            if (hasHumanArmy) {
                const dotIcon = L.divIcon({
                    className: 'bg-blue-500 border-2 border-white rounded-full shadow-lg',
                    iconSize: [12, 12]
                });
                const m = L.marker([country.center.lat + offsetLat, country.center.lng - 2], { icon: dotIcon });
                m.on('click', () => onCountryClick(country.id));
                m.addTo(layerGroupRef.current);
            }

            if (hasAiArmy) {
                const dotIcon = L.divIcon({
                    className: 'bg-red-500 border-2 border-white rounded-full shadow-lg',
                    iconSize: [12, 12]
                });
                const m = L.marker([country.center.lat + offsetLat, country.center.lng + 2], { icon: dotIcon });
                m.on('click', () => onCountryClick(country.id));
                m.addTo(layerGroupRef.current);
            }
        }
    });

    // 4. Battles
    const activeBattles = combatLogs.filter(l => l.turn === currentTurn || l.turn === currentTurn - 1);
    activeBattles.forEach(log => {
        const country = countries.find(c => c.id === log.locationId);
        if (country) {
            const battleIcon = L.divIcon({
                className: 'text-2xl animate-pulse cursor-pointer hover:scale-110 transition-transform',
                html: '⚔️',
                iconSize: [24, 24]
            });
            
            const m = L.marker([country.center.lat + 4, country.center.lng], { icon: battleIcon });
            m.on('click', () => onBattleClick(log.id));
            m.addTo(layerGroupRef.current);
        }
    });

  }, [countries, players, units, armies, combatLogs, currentTurn]);

  return (
    <div className="w-full h-full bg-slate-950 relative">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      
      <div className="absolute bottom-1 right-1 bg-black/60 px-2 py-1 rounded text-[10px] text-slate-400 pointer-events-none z-[1000]">
          Leaflet | &copy; OpenStreetMap & CARTO
      </div>
    </div>
  );
};

export default WorldMap;
