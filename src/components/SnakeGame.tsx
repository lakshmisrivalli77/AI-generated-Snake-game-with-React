import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Point, Direction } from '../types';
import { Trophy, RotateCcw, Play, Pause } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 100;

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const scoreEl = document.getElementById('current-score-display');
    const highEl = document.getElementById('high-score-display');
    if (scoreEl) scoreEl.textContent = score.toLocaleString('en-US', { minimumIntegerDigits: 5 });
    if (highEl) highEl.textContent = highScore.toLocaleString('en-US', { minimumIntegerDigits: 5 });
  }, [score, highScore]);

  const update = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      // Update direction from buffer
      setDirection(nextDirection);

      switch (nextDirection) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, isGameOver, isPaused, nextDirection, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setNextDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setNextDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setNextDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setNextDirection('RIGHT'); break;
        case ' ': setIsPaused((p) => !p); break;
        case 'r':
        case 'R': resetGame(); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const animate = (time: number) => {
      if (time - lastUpdateTimeRef.current > GAME_SPEED) {
        update();
        lastUpdateTimeRef.current = time;
      }
      gameLoopRef.current = requestAnimationFrame(animate);
    };

    gameLoopRef.current = requestAnimationFrame(animate);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [update]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw food (Neon Purple)
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#BC13FE';
    ctx.fillStyle = '#BC13FE';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw snake (Neon Green)
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#39FF14';
    ctx.fillStyle = '#39FF14';
    
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      if (isHead) {
        ctx.fillStyle = '#39FF14';
        ctx.shadowBlur = 20;
      } else {
        ctx.fillStyle = '#22cc00';
        ctx.shadowBlur = 10;
      }
      
      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
    });

    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded-xl border-2 border-border shadow-[0_0_50px_-12px_rgba(57,255,20,0.1)] bg-black"
        />
        
        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-xl transition-all duration-300">
            {isGameOver ? (
              <>
                <h2 className="text-4xl font-black text-neon-green mb-2 tracking-tighter uppercase italic drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]">Game Over</h2>
                <p className="text-text-dim mb-6 font-mono">Final Score: {score}</p>
                <Button 
                  onClick={resetGame}
                  className="bg-neon-green hover:bg-neon-green/80 text-black px-8 py-6 rounded-full text-lg font-bold shadow-lg shadow-neon-green/20"
                >
                  <RotateCcw className="mr-2 h-5 w-5" /> Try Again
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-black text-neon-cyan mb-6 tracking-tighter uppercase italic drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">Paused</h2>
                <Button 
                  onClick={() => setIsPaused(false)}
                  className="bg-neon-cyan hover:bg-neon-cyan/80 text-black px-8 py-6 rounded-full text-lg font-bold shadow-lg shadow-neon-cyan/20"
                >
                  <Play className="mr-2 h-5 w-5" /> Resume
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
