import { useEffect, useState, useRef } from "react";
import Snake from "./components/Snake/Snake";
import Food from "./components/Food/Food";
import style from './app.module.css';
import React from "react";
import StartModal from "./components/Modal/StartModal";
import EndModal from "./components/Modal/EndModal";
import ResultModal from "./components/Modal/ResultModal";
import { getRandomCoordinates } from "./constants/constants";
import { getRandomFoodType } from "./constants/constants";
import { effectDuration } from "./constants/constants";
import { useEffectQueue } from "./hooks/useEffectQueue";
import { IFoodEffect } from "./hooks/useEffectQueue";

const App: React.FC = () => {
  const [snakeDots, setSnakeDots] = useState<number[][]>([
    [0, 2],
    [2, 0] 
  ]);
  const [food, setFood] = useState<number[]>(getRandomCoordinates());
  const [direction, setDirection] = useState<string>('RIGHT');
  const [speed, setSpeed] = useState<number>(500);
  const [baseSpeed, setBaseSpeed] = useState<number>(500);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [showStartModal, setShowStartModal] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [path, setPath] = useState<number[][]>([]);
  const [foodType, setFoodType] = useState<string>(getRandomFoodType());
  const [isInvisible, setIsInvisible] = useState<boolean>(false);
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  const [isFreez, setIsFreez] = useState<boolean>(false);
  const [isHot, setIsHot] = useState<boolean>(false);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [isResult, setIsResult] = useState<boolean>(false);

    const addEffectToQueue = useEffectQueue(setActiveEffects);

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
        case "к":
        case "r":
        case "R":
          setIsResult(true);
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
    if (!isGameOver && !showStartModal && !isResult && isPaused) {
      const interval = setInterval(snakeMove, speed);
      return () => clearInterval(interval);
    }
  }, [snakeDots, direction, isGameOver, speed, showStartModal, isPaused]);

  const applyGrowEffect = () => {
    setSnakeDots(prevSnakeDots => {
      let newSnake = [...prevSnakeDots];
      for (let i = 0; i < 5; i++) {
        newSnake.unshift([]);
      }
      return newSnake;
    });
  };
  
  const applyFoodEffect = (type: string): IFoodEffect | null => {
    switch (type) {
      case "blue":
        return { effect: 'speedDown', action: setIsFreez, duration: effectDuration.freeze };
      case "red":
        return { effect: 'speedUp', action: setIsHot, duration: effectDuration.speedUp };
      case "green":
        return { effect: 'blink', action: setIsBlinking, duration: effectDuration.blink };
      case "yellow":
        return { effect: 'grow', action: applyGrowEffect, duration: 0 };
      case "purple":
        return { effect: 'invisible', action: setIsInvisible, duration: effectDuration.invisible };
      default:
        return null;
    }
  }
  
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

    const increaseBaseSpeed = () => {
      setBaseSpeed((prevSpeed) => {
        if (prevSpeed > 300) return prevSpeed - 20;
        if (prevSpeed > 200) return prevSpeed - 10;
        if (prevSpeed > 120) return prevSpeed - 3;
        if (prevSpeed > 50) return prevSpeed - 1;
        return 50; 
      });
    };

    const adjustSpeed = () => { 
      let newSpeed = baseSpeed;
      activeEffects.forEach(effect => {
        if (effect === 'speedUp') {
          newSpeed = 60;
        } else if (effect === 'speedDown') {
          newSpeed = 700; 
        }
      });
      setSpeed(newSpeed); 
    };

    const handleFoodConsumption = (type) => {
      const effect = applyFoodEffect(type);
      if (effect) {
        addEffectToQueue(effect);
      }
    };

    const checkIfEat = () => {
      let head = snakeDots[snakeDots.length - 1];
      if (head[0] === food[0] && head[1] === food[1]) {
        setFood(getRandomCoordinates());
        enlargeSnake();
        setFoodType(getRandomFoodType());
        applyFoodEffect(foodType);
        handleFoodConsumption(foodType);
        increaseBaseSpeed();
      }  

    };

    checkIfCollapsed();
    checkIfEat();
    adjustSpeed();
  }, [snakeDots, food, speed, foodType, activeEffects]);

  // useEffect(() => {
  //   const findPath = () => {
  //     const start = snakeDots[snakeDots.length - 1];
  //     const goal = food;
  //     const queue: number[][][] = [[start]];
  //     const visited: Set<string> = new Set();
  //     visited.add(start.toString());

  //     while (queue.length > 0) {
  //       const path = queue.shift();
  //       if (path) {
  //         const node = path[path.length - 1];

  //         if (node[0] === goal[0] && node[1] === goal[1]) {
  //           setPath(path);
  //           return;
  //         }

  //         const neighbors = [
  //           [node[0] + 2, node[1]],
  //           [node[0] - 2, node[1]],
  //           [node[0], node[1] + 2],
  //           [node[0], node[1] - 2]
  //         ];

  //         for (const neighbor of neighbors) {
  //           if (
  //             neighbor[0] >= 0 && neighbor[0] < 100 &&
  //             neighbor[1] >= 0 && neighbor[1] < 100 &&
  //             !visited.has(neighbor.toString())
  //           ) {
  //             visited.add(neighbor.toString());
  //             queue.push([...path, neighbor]);
  //           }
  //         }
  //       }
  //     }
  //   };

  //   if (!isGameOver && !showStartModal) {
  //     findPath();
  //   }
  // }, [snakeDots, food, isGameOver, showStartModal]);

  
  const startGame = (name: string) => {
    setUserName(name)
    setShowStartModal(false);
    setIsPaused(!isPaused);
    setFoodType(getRandomFoodType());
  };

  const resetGame = () => {
    setSnakeDots([
      [0, 0],
      [2, 0]
    ]);
    setIsPaused(false);
    setFood(getRandomCoordinates());
    setFoodType(getRandomFoodType());
    setDirection('RIGHT');
    setSpeed(500);
    setIsGameOver(false);
    setIsInvisible(false);
    setIsBlinking(false);
    setActiveEffects([]);
    setPath([]);
    setBaseSpeed(500);
  };

  const handleNewUser = () => {
    setUserName(' ');
    setShowStartModal(true);
    resetGame();
  }

  const handleClose = () => {
    setIsResult(false);
    setIsPaused(prev => !prev)
  }

  const handleResultOpen = () => {
    setIsResult(true);
    setIsPaused(true)
  }

  return(
    <div className={style.main_window}>
      <div className={style.game_area}>
      <StartModal
        show={showStartModal}
        onStart={startGame}
      />
      <EndModal
        show={isGameOver}
        score={snakeDots.length - 2}
        onPlayAgain={resetGame}
        onNewUser={handleNewUser}
      />
      <ResultModal 
        show={isResult}
        score={snakeDots.length - 2}
        name={userName}
        onClose={handleClose} />
      {!isGameOver && !showStartModal && (
        <>
         <Snake snakeDots={snakeDots} isInvisible={isInvisible} isBlinking={isBlinking} isFreez={isFreez} isHot={isHot} />
         <Food dot={food} type={foodType} />
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
      {!isPaused && (
        <div className={style.pause}>
          <span>PAUSE</span>
          <span className={style.pause_tip}>press spacebar for continue</span>
          </div>

      )}
      
      </div>
      <div className={style.inform_box}>
        <h4 className={style.info_text}>current result: <span className={style.info_res}>{userName}:{snakeDots.length - 2}</span></h4>
        <h4 className={style.info_text}>best result:</h4>
        <h4 className={style.info_text}>game time: </h4>
        <button className={style.table_button} onClick={handleResultOpen}>results</button>
      </div>
    </div>
    
  );
};

export default App;
