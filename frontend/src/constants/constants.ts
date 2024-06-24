
export const getRandomCoordinates = () => {
    const min = 1;
    const max = 98;
    const x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
    const y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
    return [x, y];
}

export const getRandomFoodType = () => {
    const foodTypes = ["blue", "red", "green", "yellow", "purple"];
    const randomType = Math.floor(Math.random() * foodTypes.length);
    return foodTypes[randomType];
}

export const effectDuration = {
    speedDown: 5000,
    speedUp: 5000,
    freeze: 5000,
    blink: 7000,
    invisible: 6000
};

export const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};