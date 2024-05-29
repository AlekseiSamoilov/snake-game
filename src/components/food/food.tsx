import style from "snake.module.css"

interface IFoodProps {
    dot: number[];
}

const Food: React.FC<IFoodProps> = ({ dot }) => {
    return (
        <div className={style.snake_food} style={{ top: `${dot[1]}%`, left: `${dot[0]}%` }}>

        </div>
    )
}

export default Food;