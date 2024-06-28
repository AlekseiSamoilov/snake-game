

export const getRandomFoodType = () => {
    const foodTypes = ["blue", "red", "green", "yellow", "purple"];
    const randomType = Math.floor(Math.random() * foodTypes.length);
    return foodTypes[randomType];
}

export const effectDuration = {
    // speedDown: 5000,
    speedUp: 5000,
    freeze: 3000,
    blink: 10000,
    invisible: 10000
};

export const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

