import React, { useEffect, useRef, useState } from 'react';
import { Character, Bullet, Position, Explosion } from './types';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const PLAYER_SIZE = 30;
const ENEMY_SIZE = 30;
const BULLET_SIZE = 5;
const BULLET_SPEED = 7;
const ENEMY_SHOOT_INTERVAL = 10000; // Changed to 10 seconds
const EXPLOSION_DURATION = 300;
const EXPLOSION_SIZE = 20;

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState<string | null>(null);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  
  const [player, setPlayer] = useState<Character>({
    x: 50, // Fixed position
    y: CANVAS_HEIGHT / 2,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    color: '#4CAF50',
    health: 20 // Increased to 20
  });

  const [enemy, setEnemy] = useState<Character>({
    x: CANVAS_WIDTH - 80, // Fixed position
    y: CANVAS_HEIGHT / 2,
    width: ENEMY_SIZE,
    height: ENEMY_SIZE,
    color: '#F44336',
    health: 5 // Changed to 5
  });

  const [playerBullets, setPlayerBullets] = useState<Bullet[]>([]);
  const [enemyBullets, setEnemyBullets] = useState<Bullet[]>([]);

  const createExplosion = (x: number, y: number) => {
    const explosion: Explosion = {
      x: x - EXPLOSION_SIZE / 2,
      y: y - EXPLOSION_SIZE / 2,
      width: EXPLOSION_SIZE,
      height: EXPLOSION_SIZE,
      color: '#FFA500',
      duration: EXPLOSION_DURATION,
      timestamp: Date.now()
    };
    setExplosions(prev => [...prev, explosion]);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'x' && !gameOver) {
      setPlayerBullets(prev => [...prev, {
        x: player.x + player.width,
        y: player.y + (player.height / 2) - (BULLET_SIZE / 2),
        width: BULLET_SIZE,
        height: BULLET_SIZE,
        color: '#FFD700',
        direction: 'right'
      }]);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameOver, player.x, player.y]);

  useEffect(() => {
    if (gameOver) return;

    const enemyShootInterval = setInterval(() => {
      setEnemyBullets(prev => [...prev, {
        x: enemy.x,
        y: enemy.y + (enemy.height / 2) - (BULLET_SIZE / 2),
        width: BULLET_SIZE,
        height: BULLET_SIZE,
        color: '#FF5722',
        direction: 'left'
      }]);
    }, ENEMY_SHOOT_INTERVAL);

    return () => clearInterval(enemyShootInterval);
  }, [enemy.x, enemy.y, gameOver]);

  useEffect(() => {
    if (!canvasRef.current || gameOver) return;

    let animationFrameId: number;

    const gameLoop = () => {
      if (gameOver) return;

      // Clean up expired explosions
      setExplosions(prev => 
        prev.filter(explosion => 
          Date.now() - explosion.timestamp < explosion.duration
        )
      );

      // Check bullet collisions with each other
      let bulletsToRemove = new Set<Bullet>();
      
      playerBullets.forEach(playerBullet => {
        enemyBullets.forEach(enemyBullet => {
          if (
            playerBullet.x < enemyBullet.x + enemyBullet.width &&
            playerBullet.x + playerBullet.width > enemyBullet.x &&
            playerBullet.y < enemyBullet.y + enemyBullet.height &&
            playerBullet.y + playerBullet.height > enemyBullet.y
          ) {
            bulletsToRemove.add(playerBullet);
            bulletsToRemove.add(enemyBullet);
            createExplosion(
              (playerBullet.x + enemyBullet.x) / 2,
              (playerBullet.y + enemyBullet.y) / 2
            );
          }
        });
      });

      // Remove collided bullets
      setPlayerBullets(prev => 
        prev
          .filter(bullet => !bulletsToRemove.has(bullet))
          .map(bullet => ({ ...bullet, x: bullet.x + BULLET_SPEED }))
          .filter(bullet => bullet.x < CANVAS_WIDTH)
      );

      setEnemyBullets(prev =>
        prev
          .filter(bullet => !bulletsToRemove.has(bullet))
          .map(bullet => ({ ...bullet, x: bullet.x - BULLET_SPEED }))
          .filter(bullet => bullet.x > 0)
      );

      // Check collisions with enemy
      setPlayerBullets(prev => {
        const remainingBullets = prev.filter(bullet => {
          const collision = 
            bullet.x < enemy.x + enemy.width &&
            bullet.x + bullet.width > enemy.x &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y + bullet.height > enemy.y;
          
          if (collision) {
            setEnemy(prevEnemy => ({
              ...prevEnemy,
              health: prevEnemy.health - 1
            }));
            createExplosion(bullet.x, bullet.y);
            return false;
          }
          return true;
        });
        return remainingBullets;
      });

      // Check collisions with player
      setEnemyBullets(prev => {
        const remainingBullets = prev.filter(bullet => {
          const collision = 
            bullet.x < player.x + player.width &&
            bullet.x + bullet.width > player.x &&
            bullet.y < player.y + player.height &&
            bullet.y + bullet.height > player.y;
          
          if (collision) {
            setPlayer(prevPlayer => ({
              ...prevPlayer,
              health: prevPlayer.health - 1
            }));
            createExplosion(bullet.x, bullet.y);
            return false;
          }
          return true;
        });
        return remainingBullets;
      });

      // Check game over conditions
      if (player.health <= 0) setGameOver('Game Over');
      if (enemy.health <= 0) setGameOver('You Win!');

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameOver, player.x, player.y, player.width, player.height, enemy.x, enemy.y, enemy.width, enemy.height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw enemy
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

    // Draw player bullets
    playerBullets.forEach(bullet => {
      ctx.fillStyle = bullet.color;
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw enemy bullets
    enemyBullets.forEach(bullet => {
      ctx.fillStyle = bullet.color;
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw explosions
    explosions.forEach(explosion => {
      const progress = 1 - (Date.now() - explosion.timestamp) / explosion.duration;
      ctx.fillStyle = explosion.color;
      ctx.globalAlpha = progress;
      ctx.beginPath();
      ctx.arc(
        explosion.x + explosion.width / 2,
        explosion.y + explosion.height / 2,
        explosion.width / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.globalAlpha = 1;
    });

  }, [player, enemy, playerBullets, enemyBullets, explosions]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="relative">
        <div className="absolute top-0 left-0 text-white font-bold p-2">
          Health: {player.health}
        </div>
        <div className="absolute top-0 right-0 text-white font-bold p-2">
          Enemy Health: {enemy.health}
        </div>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="bg-gray-800 rounded-lg"
        />
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-4xl font-bold text-white">{gameOver}</div>
          </div>
        )}
      </div>
      <div className="mt-4 text-white text-center">
        <p>Press 'X' to shoot</p>
      </div>
    </div>
  );
};

export default Game;