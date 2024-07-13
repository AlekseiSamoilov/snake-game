import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type GameResultDocument = GameResult & Document;

@Schema()
export class GameResult {
    @Prop({ required: true })
    palyerName: string;

    @Prop({ required: true })
    gameDuration: number;

    @Prop({ required: true })
    gameDate: Date;

    @Prop({ required: true, default: Date.now })
    score: number;
}

export const GameResultSchema = SchemaFactory.createForClass(GameResult);
