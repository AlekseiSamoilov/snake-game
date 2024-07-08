import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type GameResultDocument = GameResult & Document;

@Schema()
export class GameResult {
    @Prop({ required: true })
    palyerName: string;

    @Prop({ required: true })
    gameTime: number;

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    score: number;
}

export const GameResultSchema = SchemaFactory.createForClass(GameResult);
