import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PromocodeModule } from './promocode/promocode.module';
import { MeteoModule } from './meteo/meteo.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    PromocodeModule,
    MeteoModule,
    HttpModule,
    MongooseModule.forRoot('mongodb://localhost:27017/'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
