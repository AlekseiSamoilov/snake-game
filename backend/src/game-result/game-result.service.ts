import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GameResult } from "./schemas/game-result.schema";
import { Model } from "mongoose";
import { CreateGameResultDto } from "./dto/create-game-result.dto";

@Injectable()
export class GameResultService {
    constructor(
        @InjectModel(GameResult.name) private gameResultModel: Model<GameResult>,
    ) { }

    async create(createGameResultDto: CreateGameResultDto): Promise<GameResult> {
        const createGameResult = new this.gameResultModel(createGameResultDto);
        return createGameResult.save()
    }

    async findTopScores(limit: number = 10): Promise<GameResult[]> {
        return this.gameResultModel
            .find()
            .sort({ score: -1, gameDate: -1 })
            .limit(limit)
            .exec();
    }
}
