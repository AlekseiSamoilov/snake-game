import { useEffect, useState } from "react";
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
  const [speed, setSpeed] = useState<number>(500);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [showStartModal, setShowStartModal] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [path, setPath] = useState<number[][]>([]);

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

      if (head[0] >= 100) head[0] = 0;
      if (head[0] < 0) head[0] = 98;
      if (head[1] >= 100) head[1] = 0;
      if (head[1] < 0) head[1] = 98;


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
      let newSnake = [...snakeDots];
      newSnake.unshift([]);
      setSnakeDots(newSnake);
    };

    const increaseSpeed = () => {
      switch(true) {
        case (speed > 300):
          setSpeed(speed - 20);
          break;
        case (speed > 200):
          setSpeed(speed - 5);
          break;
        case (speed > 120):
          setSpeed(speed - 1);
          break;
        case (speed === 10):
          setSpeed(10);
          break;
      }
    };

    const checkIfEat = () => {
      let head = snakeDots[snakeDots.length - 1];
      if (head[0] === food[0] && head[1] === food[1]) {
        setFood(getRandomCoordinates());
        enlargeSnake();
        increaseSpeed();
      } 
    };

    
    checkIfCollapsed();
    checkIfEat();
  }, [snakeDots, food, speed]);

  useEffect(() => {
    const findPath = () => {
      const start = snakeDots[snakeDots.length - 1];
      const goal = food;
      const queue: number[][][] = [[start]];
      const visited: Set<string> = new Set();
      visited.add(start.toString());

      while (queue.length > 0) {
        const path = queue.shift();
        if (path) {
          const node = path[path.length - 1];

          if (node[0] === goal[0] && node[1] === goal[1]) {
            setPath(path);
            return;
          }

          const neighbors = [
            [node[0] + 2, node[1]],
            [node[0] - 2, node[1]],
            [node[0], node[1] + 2],
            [node[0], node[1] - 2]
          ];

          for (const neighbor of neighbors) {
            if (
              neighbor[0] >= 0 && neighbor[0] < 100 &&
              neighbor[1] >= 0 && neighbor[1] < 100 &&
              !visited.has(neighbor.toString())
            ) {
              visited.add(neighbor.toString());
              queue.push([...path, neighbor]);
            }
          }
        }
      }
    };

    if (!isGameOver && !showStartModal) {
      findPath();
    }
    console.log('path callig')
  }, [snakeDots, food, isGameOver, showStartModal]);

  
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
    setSpeed(500);
    setIsGameOver(false);
    
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
          <svg className={style.path_svg}>
            {path.map((step, index) => {
              if (index === 0) return null;
              const prevStep = path[index - 1];
              const offset = 1
              return (
                <line
                  key={index}
                  x1={`${prevStep[0] + offset}%`}
                  y1={`${prevStep[1] + offset}%`}
                  x2={`${step[0] + offset}%`}
                  y2={`${step[1] + offset}%`}
                  stroke="rgba(10, 58, 10, 0.1)"
                  strokeWidth="3"
                  strokeDasharray="5, 5"
                />
              );
            })}
          </svg>
        </>
      )}
      <div className={style.speed_window}>{speed}</div>
      <div className={style.point_window}>{snakeDots.length - 2}</div>
    </div>
    
  );
};

export default App;
