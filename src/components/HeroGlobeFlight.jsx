import React, { useState, useEffect, useRef } from 'react';
import { 
  FaEarthAmericas, 
  FaEarthAsia, 
  FaEarthEurope 
} from 'react-icons/fa6';
import logoImg from '../assets/logo.jpg';
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
  
  // Start and Target positions in percentages
  const [startPos, setStartPos] = useState({ x: 15, y: 75 });
  const [targetPos, setTargetPos] = useState({ x: 80, y: 28 });
  const [currentPlane, setCurrentPlane] = useState({ x: 15, y: 75, angle: 30 });
  const [isFlying, setIsFlying] = useState(false);
  const [hasArrived, setHasArrived] = useState(false);
  const [globePulse, setGlobePulse] = useState(false);

  // Generate random target coordinates covering full height and full width
  const getRandomCoords = (prevX, prevY) => {
    const minX = 8;
    const maxX = 92;
    const minY = 8;
    const maxY = 92;

    let newX, newY, dist;
    let attempts = 0;
    do {
      newX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
      newY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
      const dx = newX - prevX;
      const dy = newY - prevY;
      dist = Math.sqrt(dx * dx + dy * dy);
      attempts++;
    } while (dist < 35 && attempts < 15);

    return { x: newX, y: newY };
  };

  // Compute control point for nice arching bezier curve
  const dx = targetPos.x - startPos.x;
  const dy = targetPos.y - startPos.y;
  const midX = (startPos.x + targetPos.x) / 2;
  const midY = (startPos.y + targetPos.y) / 2;
  // Perpendicular curve offset
  const norm = Math.sqrt(dx * dx + dy * dy) || 1;
  const curveOffset = Math.min(Math.max(norm * 0.35, 12), 24);
  const ctrlX = midX - (dy / norm) * curveOffset;
  const ctrlY = midY + (dx / norm) * curveOffset;

  const pathD = `M ${startPos.x} ${startPos.y} Q ${ctrlX} ${ctrlY} ${targetPos.x} ${targetPos.y}`;

  // Bezier evaluation helper
  const getBezierPoint = (t, p0, p1, p2) => {
    const inv = 1 - t;
    const x = inv * inv * p0.x + 2 * inv * t * p1.x + t * t * p2.x;
    const y = inv * inv * p0.y + 2 * inv * t * p1.y + t * t * p2.y;

    // Tangent derivative for exact nose angle
    const tx = 2 * inv * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
    const ty = 2 * inv * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
    const angle = (Math.atan2(ty, tx) * 180) / Math.PI;

    return { x, y, angle };
  };

  useEffect(() => {
    let animFrame;
    let pauseTimer;
    let startTime = null;
    const flightDuration = 3200; // 3.2s flight time

    setIsFlying(true);
    setHasArrived(false);
    setGlobePulse(false);

    const animateFlight = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / flightDuration, 1);

      // Smooth ease-in-out curve
      const easeT = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const pt = getBezierPoint(
        easeT,
        startPos,
        { x: ctrlX, y: ctrlY },
        targetPos
      );

      setCurrentPlane(pt);

      if (progress < 1) {
        animFrame = requestAnimationFrame(animateFlight);
      } else {
        // Plane arrived at the globe
        setIsFlying(false);
        setHasArrived(true);
        setGlobePulse(true);

        // Pause at the destination for 1.8 seconds then choose next destination
        pauseTimer = setTimeout(() => {
          setDestIndex((prev) => (prev + 1) % DESTINATIONS.length);
          const nextStart = { ...targetPos };
          const nextTarget = getRandomCoords(nextStart.x, nextStart.y);

          setStartPos(nextStart);
          setTargetPos(nextTarget);
          setGlobePulse(false);
          setHasArrived(false);
        }, 1800);
      }
    };

    animFrame = requestAnimationFrame(animateFlight);

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(pauseTimer);
    };
  }, [startPos.x, startPos.y, targetPos.x, targetPos.y]);

  const currentDest = DESTINATIONS[destIndex];

  return (
    <div ref={containerRef} className="hero-globe-flight-canvas" aria-hidden="true">
      {/* SVG Flight Trail Arc */}
      <svg className="flight-trail-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="trailGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.85" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glow trajectory line */}
        <path
          d={pathD}
          className="flight-arc-path"
          fill="none"
          stroke="url(#trailGlowGrad)"
          strokeWidth="0.8"
          strokeDasharray="2.5 2"
          filter="url(#neonGlow)"
        />
      </svg>

      {/* 3D Glowing Globe Target */}
      <div 
        className={`globe-beacon-node ${globePulse ? 'globe-landing-pulse' : ''}`}
        style={{
          left: `${targetPos.x}%`,
          top: `${targetPos.y}%`
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

      {/* Brand Logo Orbiting Traveler - Travels on curved trajectory and hides behind globe */}
      <div
        className={`jet-flight-node ${isFlying ? 'plane-in-flight' : ''} ${hasArrived ? 'plane-docked' : ''}`}
        style={{
          left: `${currentPlane.x}%`,
          top: `${currentPlane.y}%`,
          transform: `translate(-50%, -50%) rotate(${currentPlane.angle}deg)`
        }}
      >
        {/* Jet Thruster Trail */}
        <div className="jet-thruster-exhaust"></div>
        <div className="jet-trail-particles">
          <span className="particle p1"></span>
          <span className="particle p2"></span>
          <span className="particle p3"></span>
        </div>

        {/* Brand Logo Emblem */}
        <div className="travel-logo-emblem">
          <img src={logoImg} alt="Spot Tours" className="travel-logo-img" />
          <div className="logo-glow-ring"></div>
        </div>
      </div>
    </div>
  );
}
