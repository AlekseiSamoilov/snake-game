import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { GameResultService } from "./game-result.service";
import { CreateGameResultDto } from "./dto/create-game-result.dto";
import { GameResult } from "./schemas/game-result.schema";

@Controller('game-results')
export class GameResultController {
    constructor(private readonly gameResultService: GameResultService) { }

    @Post()
    async create(@Body() createGameResultDto: CreateGameResultDto): Promise<GameResult> {
        return this.gameResultService.create(createGameResultDto);
    }

    @Get('top-scores')
    async getTopScores(@Query('limit') limit: number): Promise<GameResult[]> {
        return this.gameResultService.findTopScores(limit);
    }
}