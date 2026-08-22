import React, { useState, useEffect, useRef } from 'react';
import { 
  FaEarthAmericas, 
  FaEarthAsia, 
  FaEarthEurope, 
  FaPlaneDeparture 
} from 'react-icons/fa6';
import './HeroGlobeFlight.css';

const DESTINATIONS = [
  { name: 'Dubai', country: 'UAE', icon: 'asia', label: 'DUBAI LUXURY' },
  { name: 'Paris', country: 'France', icon: 'europe', label: 'PARIS HOLIDAYS' },
  { name: 'Maldives', country: 'Tropical', icon: 'asia', label: 'MALDIVES RESORTS' },
  { name: 'Singapore', country: 'Asia', icon: 'asia', label: 'SINGAPORE CITY' },
  { name: 'Bali', country: 'Indonesia', icon: 'asia', label: 'BALI BEACHES' },
  { name: 'Switzerland', country: 'Europe', icon: 'europe', label: 'SWISS ALPS' },
  { name: 'London', country: 'UK', icon: 'europe', label: 'LONDON HERITAGE' },
  { name: 'Tokyo', country: 'Japan', icon: 'asia', label: 'TOKYO VIBES' }
];

export default function HeroGlobeFlight() {
  const containerRef = useRef(null);
  const [destIndex, setDestIndex] = useState(0);
  
  // Globe and Plane Positions in percentages (%)
  const [globePos, setGlobePos] = useState({ x: 82, y: 32 });
  const [planePos, setPlanePos] = useState({ x: 18, y: 78 });
  const [planeAngle, setPlaneAngle] = useState(35);
  const [isFlying, setIsFlying] = useState(false);
  const [hasArrived, setHasArrived] = useState(false);
  const [globePulse, setGlobePulse] = useState(false);

  // Generate random target coordinates covering full height and full width in all views
  const getRandomCoords = (prevX, prevY) => {
    const minX = 6;
    const maxX = 94;
    const minY = 6;
    const maxY = 94;

    let newX, newY, dist;
    let attempts = 0;
    do {
      newX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
      newY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
      const dx = newX - prevX;
      const dy = newY - prevY;
      dist = Math.sqrt(dx * dx + dy * dy);
      attempts++;
    } while (dist < 32 && attempts < 12);

    return { x: newX, y: newY };
  };

  useEffect(() => {
    let timeoutId;
    let animTimer;

    const runFlightSequence = () => {
      // 1. Current globe location is the target.
      // Calculate angle from current planePos to globePos
      const dx = globePos.x - planePos.x;
      const dy = globePos.y - planePos.y;
      const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
      setPlaneAngle(angleDeg);

      // Start Flight
      setIsFlying(true);
      setHasArrived(false);
      setGlobePulse(false);

      // Flight takes 3.4 seconds to reach globe
      timeoutId = setTimeout(() => {
        // Plane reaches the globe
        setPlanePos({ x: globePos.x, y: globePos.y });
        setIsFlying(false);
        setHasArrived(true);
        setGlobePulse(true);

        // Stay at destination for 1.8 seconds celebration
        animTimer = setTimeout(() => {
          // Next destination
          const nextIndex = (destIndex + 1) % DESTINATIONS.length;
          setDestIndex(nextIndex);

          // Previous globe location is now the plane's start
          const oldGlobe = { ...globePos };
          const newGlobe = getRandomCoords(oldGlobe.x, oldGlobe.y);

          setPlanePos(oldGlobe);
          setGlobePos(newGlobe);
          setGlobePulse(false);
          setHasArrived(false);
        }, 1800);
      }, 3400);
    };

    runFlightSequence();

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(animTimer);
    };
  }, [globePos.x, globePos.y]);

  const currentDest = DESTINATIONS[destIndex];

  // SVG curved path calculations
  const p1x = planePos.x;
  const p1y = planePos.y;
  const p2x = globePos.x;
  const p2y = globePos.y;
  const midX = (p1x + p2x) / 2;
  const midY = (p1y + p2y) / 2 - 12; // curve upwards

  const pathD = `M ${p1x} ${p1y} Q ${midX} ${midY} ${p2x} ${p2y}`;

  return (
    <div ref={containerRef} className="hero-globe-flight-canvas" aria-hidden="true">
      {/* SVG Flight Trail Arc */}
      <svg className="flight-trail-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="trailGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glow trajectory line */}
        <path
          d={pathD}
          className={`flight-arc-path ${isFlying ? 'animate-dash' : ''}`}
          fill="none"
          stroke="url(#trailGlowGrad)"
          strokeWidth="0.75"
          strokeDasharray="2 1.5"
          filter="url(#neonGlow)"
        />
      </svg>

      {/* 3D Glowing Globe Target */}
      <div 
        className={`globe-beacon-node ${globePulse ? 'globe-landing-pulse' : ''}`}
        style={{
          left: `${globePos.x}%`,
          top: `${globePos.y}%`
        }}
      >
        {/* Outer Rounder Glow Radar Rings */}
        <div className="glow-rounder-ring ring-1"></div>
        <div className="glow-rounder-ring ring-2"></div>
        <div className="glow-rounder-ring ring-3"></div>

        {/* 3D Earth Globe Icon & Hologram Core */}
        <div className="globe-sphere-wrap">
          <div className="globe-icon-spin">
            {currentDest.icon === 'asia' ? (
              <FaEarthAsia className="globe-3d-icon" />
            ) : currentDest.icon === 'europe' ? (
              <FaEarthEurope className="globe-3d-icon" />
            ) : (
              <FaEarthAmericas className="globe-3d-icon" />
            )}
          </div>
          <div className="globe-radial-glow"></div>
        </div>
      </div>

      {/* Jet Flight Airplane */}
      <div
        className={`jet-flight-node ${isFlying ? 'plane-in-flight' : ''} ${hasArrived ? 'plane-docked' : ''}`}
        style={{
          left: isFlying ? `${globePos.x}%` : `${planePos.x}%`,
          top: isFlying ? `${globePos.y}%` : `${planePos.y}%`,
          transform: `translate(-50%, -50%) rotate(${planeAngle}deg)`
        }}
      >
        {/* Jet Thruster Trail */}
        <div className="jet-thruster-exhaust"></div>
        <div className="jet-trail-particles">
          <span className="particle p1"></span>
          <span className="particle p2"></span>
          <span className="particle p3"></span>
        </div>

        {/* 3rd Party Jet Icon */}
        <div className="jet-plane-body">
          <FaPlaneDeparture className="jet-svg-icon" />
        </div>
      </div>
    </div>
  );
}
