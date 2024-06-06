import { useEffect, useState } from "react";
import Snake from "./components/snake/snake";
import Food from "./components/food/food";
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

  useEffect(() => { 
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case "ArrowUp":
          setDirection("UP");
          break;
        case "ArrowDown":
          setDirection("DOWN");
          break;
        case "ArrowLeft":
          setDirection("LEFT");
          break;
        case "ArrowRight":
          setDirection("RIGHT");
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [])

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
    if (!isGameOver && !showStartModal) {
      const interval = setInterval(snakeMove, speed);
      return () => clearInterval(interval);
    }
  }, [snakeDots, direction, isGameOver, speed, showStartModal]);

  useEffect(() => {
    const chekIfOutOfBorders = () => {
      let head = snakeDots[snakeDots.length - 1];
      if (head[0] >= 100 || head[0] < 0 || head[1] >= 100 || head[1] < 0) {
        setIsGameOver(true);
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
        setSpeed(speed - 10);
      };
    }

    const checkIfEat = () => {
      let head = snakeDots[snakeDots.length - 1];
      if (head[0] === food[0] && head[1] === food[1]) {
        setFood(getRandomCoordinates());
        enlargeSnake();
        increaseSpeed();
      } 
    }
    chekIfOutOfBorders();
    checkIfCollapsed();
    checkIfEat();
  }, [snakeDots, food, speed]);
  
  const startGame = () => {
    setShowStartModal(false);
  };

  const resetGame = () => {
    setSnakeDots([
      [0, 0],
      [2, 0]
    ]);

    setFood(getRandomCoordinates());
    setDirection('RIGHT');
    setSpeed(200);
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
        </>
      )}
    </div>
  );
};

export default App;
