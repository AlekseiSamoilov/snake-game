import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type GameResultDocument = GameResult & Document;

@Schema()
export class GameResult {
    @Prop({ required: true })
    playerName: string;

    @Prop({ required: true })
    gameDuration: number;

    @Prop({ required: true, default: Date.now })
    gameDate: Date;

    @Prop({ required: true })
    score: number;
}

export const GameResultSchema = SchemaFactory.createForClass(GameResult);
