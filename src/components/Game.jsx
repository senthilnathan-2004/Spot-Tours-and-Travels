import React, { useState, useEffect } from 'react';
import { FaPlane, FaGlobeAsia, FaSuitcase, FaCamera, FaAward, FaRedo } from 'react-icons/fa';
import './Game.css';

const travelIcons = [
  { icon: <FaPlane />, label: "Flight" },
  { icon: <FaGlobeAsia />, label: "World" },
  { icon: <FaSuitcase />, label: "Bags" },
  { icon: <FaCamera />, label: "Snap" }
];

const Game = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [targetPos, setTargetPos] = useState({ top: '50%', left: '50%' });
  const [currentIconIdx, setCurrentIconIdx] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(25);
    setGameOver(false);
    moveTarget();
  };

  const moveTarget = () => {
    const top = Math.floor(Math.random() * 70) + 15;
    const left = Math.floor(Math.random() * 75) + 12;
    setTargetPos({ top: `${top}%`, left: `${left}%` });
    setCurrentIconIdx(Math.floor(Math.random() * travelIcons.length));
  };

  const hitTarget = () => {
    if (!isPlaying) return;
    setScore(score + 1);
    moveTarget();
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isPlaying && timeLeft === 0) {
      setIsPlaying(false);
      setGameOver(true);
    }
  }, [timeLeft, isPlaying]);

  return (
    <section id="game" className="game-section">
      <div className="container">
        <div style={{ textAlign: 'center' }}>
          <div className="section-tag">INTERACTIVE FUN</div>
          <h2 className="section-title">CATCH THE <span>FLIGHT!</span></h2>
          <p className="game-description">
            Test your quick reflexes before your vacation! Tap the destination pins as fast as you can in 25 seconds.
          </p>
        </div>
        
        <div className="game-board">
          {!isPlaying && !gameOver && (
            <div className="game-start-screen">
              <div className="game-intro-icon">
                <FaPlane />
              </div>
              <h3>Ready for Takeoff?</h3>
              <p className="game-subtext">Tap flying landmarks & flight pins to score travel points!</p>
              <button className="btn-primary" onClick={startGame}>Start Travel Challenge</button>
            </div>
          )}

          {isPlaying && (
            <>
              <div className="game-hud">
                <div className="hud-item">Time: <span>{timeLeft}s</span></div>
                <div className="hud-item">Points: <span>{score}</span></div>
              </div>
              <div 
                className="game-target" 
                style={{ top: targetPos.top, left: targetPos.left }}
                onClick={hitTarget}
              >
                <div className="target-inner">
                  {travelIcons[currentIconIdx].icon}
                </div>
              </div>
            </>
          )}

          {gameOver && (
            <div className="game-over-screen">
              <div className="game-trophy-icon">
                <FaAward />
              </div>
              <h3>Challenge Completed!</h3>
              <p>Your Travel Score: <span>{score} Points</span></p>
              <p className="game-message">
                {score >= 20 ? "🌟 Master Traveler! You're ready to explore the globe with Spot Tours and Travels! Mention code 'SPOTEXPLORER' for special trip perks." : 
                 score >= 12 ? "✈️ Great Explorer! Packed and ready for your next getaway." :
                 "🌴 Nice try! Every great trip begins with a single step. Plan your vacation with us!"}
              </p>
              <div className="game-over-actions">
                <button className="btn-primary" onClick={startGame}>
                  <FaRedo /> Play Again
                </button>
                <a href="#membership" className="btn-secondary">
                  View Tour Packages
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Game;

