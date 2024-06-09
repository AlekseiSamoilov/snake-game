import { useEffect, useRef, useState } from "react";
import Snake from "./components/Snake/Snake";
import Food from "./components/Food/Food";
import style from './app.module.css';
import Modal from "./components/Modal/modal";

const getRandomCoordinates = () => {
  const min = 1;
  const max = 98;
  const x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  const y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  return [x, y];
}

const App: React.FC = () => {
  const [snakeDots, setSnakeDots] = useState<number[][]>([
    [0, 2],
    [2, 0] 
  ]);
  const [food, setFood] = useState<number[]>(getRandomCoordinates());
  const [direction, setDirection] = useState<string>('RIGHT');
  const [speed, setSpeed] = useState<number>(200);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [showStartModal, setShowStartModal] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const originalSpeedRef = useRef<number>(speed); 
  const speedTimeoutRef = useRef<number | null>(null); 
  const [addpoint, setaddPoint] = useState<number>(0)

  useEffect(() => { 
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case "ArrowUp":
          if (direction !== 'DOWN')
          setDirection("UP");
          break;
        case "ArrowDown" || "S":
          if (direction !== "UP")
          setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== 'RIGHT')
          setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== 'LEFT')
          setDirection("RIGHT");
          break;
        case " ":
          setIsPaused(!isPaused);
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [direction, isPaused])

  useEffect(() => {
    const snakeMove = () => {
      let dots = [...snakeDots];
      let head = dots[dots.length - 1];
      switch (direction) {
        case "RIGHT":
          head = [head[0] + 2, head[1]];
          break;
        case "LEFT": 
          head = [head[0] - 2, head[1]];
          break;
        case "UP":
          head = [head[0], head[1] - 2];
          break;
        case "DOWN":
          head = [head[0], head[1] + 2];
          break;
      }

      dots.push(head);
      dots.shift();
      setSnakeDots(dots);
    };
    if (!isGameOver && !showStartModal && isPaused) {
      const interval = setInterval(snakeMove, speed);
      return () => clearInterval(interval);
    }
  }, [snakeDots, direction, isGameOver, speed, showStartModal, isPaused]);

  useEffect(() => {
    const checkIfOutOfBorders = () => {
      let head = snakeDots[snakeDots.length - 1];
      if (head[0] >= 100 || head[0] < 0 || head[1] >= 100 || head[1] < 0) {
        if (speed !== 50) {
          originalSpeedRef.current = speed; 
          setSpeed(50); 
        }
        if (speedTimeoutRef.current !== null) {
          clearTimeout(speedTimeoutRef.current);
          speedTimeoutRef.current = null;
        }
      } else {
        if (speed === 50) {
          if (speedTimeoutRef.current === null) {
            speedTimeoutRef.current = window.setTimeout(() => {
              setSpeed(originalSpeedRef.current); 
              speedTimeoutRef.current = null;
            }, 2000); 
          }
        }
      }
    };

    const checkIfCollapsed = () => {
      let snake = [...snakeDots];
      let head = snake[snake.length - 1];
      snake.pop();
      snake.forEach(dot => {
        if(head[0] === dot[0] && head[1] === dot[1]) {
          setIsGameOver(true);
        }
      });
    };

    const enlargeSnake = () => {
      let newSkake = [...snakeDots];
      newSkake.unshift([]);
      setSnakeDots(newSkake);
    }

    const increaseSpeed = () => {
      if (speed > 10) {
        setSpeed(speed - 3);
      };
    }

    const checkIfEat = () => {
      let head = snakeDots[snakeDots.length - 1];
      if (head[0] === food[0] && head[1] === food[1]) {
        setFood(getRandomCoordinates());
        enlargeSnake();
        increaseSpeed();
        setaddPoint(addpoint + 1);
      } 
    }
    checkIfOutOfBorders();
    checkIfCollapsed();
    checkIfEat();
  }, [snakeDots, food, speed]);
  
  const startGame = () => {
    setShowStartModal(false);
    setIsPaused(!isPaused);
  };

  const resetGame = () => {
    setSnakeDots([
      [0, 0],
      [2, 0]
    ]);
    setIsPaused(false);
    setFood(getRandomCoordinates());
    setDirection('RIGHT');
    setSpeed(200);
    setIsGameOver(false);
    setaddPoint(0)
    
  };
  return(
    <div className={style.game_area}>
      <Modal
        show={showStartModal}
        title="Start Game"
        buttonText="Start"
        onClick={startGame}
      />
      <Modal
        show={isGameOver}
        title="Game Over"
        buttonText="Play Again"
        onClick={resetGame}
      />
      {!isGameOver && !showStartModal && (
        <>
          <Snake snakeDots={snakeDots} />
          <Food dot={food} />
        </>
      )}
      <div className={style.point_window}>{addpoint}</div>
      <div className={style.speed_window}>{speed}</div>
    </div>
    
  );
};

export default App;
