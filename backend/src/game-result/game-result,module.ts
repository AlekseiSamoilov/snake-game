import { MongooseModule } from "@nestjs/mongoose";
import { GameResult, GameResultSchema } from "./schemas/game-result.schema";
import { GameResultController } from "./game-result.controller";
import { GameResultService } from "./game-result.service";
import { Module } from "@nestjs/common";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: GameResult.name, schema: GameResultSchema }]),
    ],
    controllers: [GameResultController],
    providers: [GameResultService],
})

export class GameResultModule { }