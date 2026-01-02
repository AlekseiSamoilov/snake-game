import { useEffect, useState, useRef, useCallback } from "react";
import Snake from "./components/Snake/Snake";
import Food from "./components/Food/Food";
import style from './app.module.css';
import React from "react";
import StartModal from "./components/Modal/StartModal";
import EndModal from "./components/Modal/EndModal";
import ResultModal from "./components/Modal/ResultModal";
import { getRandomFoodType } from "./constants/constants";
import { effectDuration } from "./constants/constants";
import { useEffectQueue } from "./hooks/useEffectQueue";
import { IFoodEffect } from "./hooks/useEffectQueue";
import InfoBox from "./components/InfoBox/InfoBox";
import { getBestScore, IGameResult } from "./api/gameApi";

const App: React.FC = () => {
  const FOOD_INTERVAL = 12;

  const [snakeDots, setSnakeDots] = useState<number[][]>([
    [0, 2],
    [2, 0]
  ]);
  const [direction, setDirection] = useState<string>('RIGHT');
  const [speed, setSpeed] = useState<number>(400);
  const [baseSpeed, setBaseSpeed] = useState<number>(400);
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
  const [isPathFindingEnabled, setIsPathFindingEnabled] = useState<boolean>(false);
  const [gameTime, setGameTime] = useState<number>(0);
  const [cutTails, setCutTails] = useState<number[][][]>([]);
  const [isInvulnerable, setIsInvulnerable] = useState<boolean>(false);
  const [result, setResult] = useState<number>(0)
  const [foodTimer, setFoodTimer] = useState(FOOD_INTERVAL);
  const [bestScore, setBestScore] = useState<IGameResult | null>(null);

  const isCoordinateOccupied = (x: number, y: number): boolean => {
    if (snakeDots.some(dot => dot[0] === x && dot[1] === y)) {
      return true;
    }
    return cutTails.some(tail =>
      tail.some(dot => dot[0] === x && dot[1] === y)
    );
  };

  const getRandomCoordinates = (): number[] => {
    let newCoord: number[];
    do {
      newCoord = [
        Math.floor((Math.random() * 49)) * 2,
        Math.floor((Math.random() * 49)) * 2
      ];
    } while (isCoordinateOccupied(newCoord[0], newCoord[1]));

    return newCoord;
  };

  const [food, setFood] = useState<number[]>(getRandomCoordinates());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "W":
        case "w":
          if (direction !== 'DOWN')
            setDirection("UP");
          break;
        case "ArrowDown":
        case "S":
        case "s":
          if (direction !== "UP")
            setDirection("DOWN");
          break;
        case "ArrowLeft":
        case "A":
        case "a":
          if (direction !== 'RIGHT')
            setDirection("LEFT");
          break;
        case "ArrowRight":
        case "D":
        case "d":
          if (direction !== 'LEFT')
            setDirection("RIGHT");
          break;
        case " ":
          setIsPaused(!isPaused);
          break;
        case "Shift":
          setIsPaused(!isPaused)
          setIsResult(prev => !prev);
          break;

      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [direction, isPaused])

  useEffect(() => {
    const fetchBestScore = async () => {
      try {
        const [bestResult] = await getBestScore(1);
        setBestScore(bestResult ?? null);
      } catch (error) {
        console.log('Failed to fetch best score', error);
      }
    };
    if (!showStartModal) {
      fetchBestScore();
    }
  }, [showStartModal]);

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
    if (!isGameOver && !showStartModal && !isPaused) {
      const interval = setInterval(snakeMove, speed);
      return () => clearInterval(interval);
    }
  }, [snakeDots, direction, isGameOver, speed, showStartModal, isPaused]);

  const applyGrowEffect = () => {
    const getRandomGrowth = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    const growth = getRandomGrowth(2, 10);
    setSnakeDots(prevSnakeDots => {
      let newSnake = [...prevSnakeDots];
      for (let i = 0; i < growth; i++) {
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

  const resetFood = useCallback(() => {
    setFood(getRandomCoordinates());
    setFoodType(getRandomFoodType());
    setFoodTimer(FOOD_INTERVAL);
  }, []);

  const startFoodTimer = useCallback(() => {
    if (!isGameOver && !showStartModal && !isPaused) {
      const timer = setInterval(() => {
        setFoodTimer((prevTimer) => {
          if (prevTimer <= 1) {
            resetFood();
            return FOOD_INTERVAL;
          }
          return prevTimer - 1;
        });
      }, 1000);

      return timer;
    }
  }, [resetFood, isGameOver, showStartModal, isPaused]);

  useEffect(() => {
    const foodTimer = startFoodTimer();
    return () => {
      if (foodTimer) clearInterval(foodTimer);
    };
  }, [startFoodTimer]);

  useEffect(() => {
    const enlargeSnake = () => {
      let newSnake = [...snakeDots];
      newSnake.unshift([], []);
      setSnakeDots(newSnake);
    };

    const increaseBaseSpeed = () => {
      setBaseSpeed((prevSpeed) => {
        if (prevSpeed > 300) return prevSpeed - 20;
        if (prevSpeed > 200) return prevSpeed - 7;
        if (prevSpeed > 120) return prevSpeed - 2;
        if (prevSpeed > 50) return prevSpeed - 1;
        return 50;
      });
    };

    const adjustSpeed = () => {
      let newSpeed = baseSpeed;
      activeEffects.forEach(effect => {
        if (effect === 'speedUp') {
          newSpeed = 75;
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
        enlargeSnake();
        applyFoodEffect(foodType);
        handleFoodConsumption(foodType);
        increaseBaseSpeed();
        setResult(result + 1);
        resetFood();
      }
    };

    const checkIfCollapsed = () => {
      let snake = [...snakeDots];
      let head = snake[snake.length - 1];
      if (!isInvulnerable) {
        for (let tail of cutTails) {
          for (let segment of tail) {
            if (head[0] === segment[0] && head[1] === segment[1]) {
              setIsGameOver(true);
              return true;
            }
          }
        }
      }
      for (let i = 0; i < snake.length - 1; i++) {
        if (head[0] === snake[i][0] && head[1] === snake[i][1]) {
          const newTail = snake.slice(0, i + 1);
          setCutTails(prevTails => [...prevTails, newTail]);
          setSnakeDots(prevDots => prevDots.slice(i + 1));
          setIsInvulnerable(true);
          setTimeout(() => setIsInvulnerable(false), 1500);
          return true;
        }
      }
      return false;
    };

    checkIfCollapsed();
    checkIfEat();
    adjustSpeed();
  }, [snakeDots, food, speed, foodType, activeEffects]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isPaused && !isGameOver && !showStartModal && !isResult) {
      timer = setInterval(() => {
        setGameTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (isPaused || isGameOver || showStartModal || isResult) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isPaused, isGameOver, showStartModal, isResult, cutTails]);


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

    if (!isGameOver && !showStartModal && isPathFindingEnabled) {
      findPath();
    }
  }, [snakeDots, food, isGameOver, showStartModal, isPathFindingEnabled]);

  useEffect(() => {
    if (isCoordinateOccupied(food[0], food[1])) {
      setFood(getRandomCoordinates());
    }
  }, [snakeDots, cutTails]);


  const startGame = (name: string, enablePathFinding: boolean) => {
    setUserName(name)
    setShowStartModal(false);
    setIsPaused(!isPaused);
    setFoodType(getRandomFoodType());
    setIsPathFindingEnabled(enablePathFinding);
    setGameTime(0);
    setResult(0)
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
    setSpeed(400);
    setIsGameOver(false);
    setIsInvisible(false);
    setIsBlinking(false);
    setActiveEffects([]);
    setPath([]);
    setBaseSpeed(400);
    setGameTime(0);
    setCutTails([]);
    setIsInvulnerable(false);
    setResult(0)
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

  return (
    <div className={style.main_window}>
      <div className={style.game_area}>
        <StartModal
          show={showStartModal}
          onStart={startGame}
        />
        <EndModal
          show={isGameOver}
          score={result}
          onPlayAgain={resetGame}
          onNewUser={handleNewUser}
          playerName={userName}
          gameDuration={gameTime}
        />
        <ResultModal
          show={isResult}
          score={result}
          name={userName}
          onClose={handleClose} />
        {!isGameOver && !showStartModal && (
          <>
            <Snake snakeDots={snakeDots} isInvisible={isInvisible} isBlinking={isBlinking} isFreez={isFreez} isHot={isHot} cutTails={cutTails} isInvulnerable={isInvulnerable} />
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
                    stroke="yellow"
                    strokeWidth="3"
                    strokeDasharray="5, 5"
                  />
                );
              })}
            </svg>
          </>
        )}
        {/* <div className={style.speed_window}>{speed}</div> */}
      {isPaused && (
        <div className={style.pause}>
          <div className={style.pause_panel}>
            <span className={style.pause_title}>PAUSE</span>
            <span className={style.pause_tip}>press spacebar for continue</span>
          </div>
          </div>

      )}

      </div>
      <InfoBox
        userName={userName}
        score={result}
        gameTime={gameTime}
        bestResult={bestScore ? `${bestScore.playerName}:${bestScore.score}` : '-'}
        onResultOpne={handleResultOpen}
      />
    </div>

  );
};

export default App;
