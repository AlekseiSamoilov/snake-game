import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameResultModule } from './game-result/game-result.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    GameResultModule,
  ],
})
export class AppModule { }
