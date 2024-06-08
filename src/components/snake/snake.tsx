import style from "./Snake.module.css"

interface ISnakeProps {
    snakeDots: number[][];
}

const Snake: React.FC<ISnakeProps> = ({ snakeDots }) => {
    return (
    <div>
        {snakeDots.map((dot, i) => (
            <div className={style.snake_dot} key={i} style={{ top: `${dot[1]}%`, left: `${dot[0]}%`, animationDelay: `${i * 50}ms`}} />
        ))}
    </div>
    )
};

export default Snake; 