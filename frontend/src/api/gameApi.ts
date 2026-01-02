const API_URL = 'http://localhost:3000';

export interface IGameResult {
    playerName: string,
    score: number;
    gameDuration: number;
    gameDate?: string;
}

export const saveGameResult = async (result: IGameResult): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/game-results`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(result),
        });

        if (!response.ok) {
            throw new Error('Failed to save game result');
        }
    } catch (err) {
        console.error('Error saving game result:', err);
        throw err;
    }
};

export const getTopScores = async (limit: number = 10): Promise<IGameResult[]> => {
    try {
        const response = await fetch(`${API_URL}/game-results/top-scores?limit=${limit}`);

        if (!response.ok) {
            throw new Error('Failed to fetch top scores');
        }
        return response.json();
    } catch (err) {
        console.error('Error fetching top scores', err);
        throw err;
    }
};

export const getBestScore = async (limit: number = 1): Promise<IGameResult[]> => {
    try {
        const res = await fetch(`${API_URL}/game-results/top-scores?limit=${limit}`);
        if (!res.ok) {
            throw new Error('Failed to fetch top best score');
        }
        return res.json();
    } catch (err) {
        console.log('Error fetching top best score', err);
        throw err;
    }
}
