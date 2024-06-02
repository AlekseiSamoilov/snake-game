import { useEffect, useState } from "react";
import Snake from "./components/snake/snake";
import Food from "./components/food/food";
import style from 'app.module.css';

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
  const [food, setFood] = useState<number[]>(getRandomCoordinates);
  const [direction, setDirection] = useState<string>('RIGHT');
  const [speed, setSpeed] = useState<number>(200);
  const [gameOver, setIsGameOver] = useState<boolean>(false);

  useEffect(() => { 
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case "ArrowUp":
          setDirection("UP");
          break;
        case "ArroDown":
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
    if (!gameOver) {
      const interval = setInterval(snakeMove, speed);
      return clearInterval(interval)
    }
  }, [snakeDots, direction, gameOver, speed]);

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
    
  })

}

export default App;
