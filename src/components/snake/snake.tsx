import style from "./Snake.module.css"

interface ISnakeProps {
    snakeDots: number[][];
    isInvisible: boolean;
    isBlinking: boolean;
    isFreez: boolean;
    isHot: boolean;
}

const Snake: React.FC<ISnakeProps> = ({ snakeDots, isInvisible, isBlinking, isFreez, isHot }) => {
    return (
    <div>
        {snakeDots.map((dot, i) => (
            <div 
            className={
            `${style.snake_dot} 
            ${isInvisible ? style.invisible : ''} 
            ${isBlinking ? style.blinking : ''} 
            ${isFreez ? style.freez : ''} 
            ${isHot ? style.hot : ''}`}
            key={i} 
            style={{ top: `${dot[1]}%`, left: `${dot[0]}%`, animationDelay: `${i * 50}ms`}} />
        ))}
    </div>
    )
};

export default Snake; 