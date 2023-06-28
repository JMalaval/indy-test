import { Module } from '@nestjs/common';
import { PromocodeService } from './promocode.service';
import { PromocodeController } from './promocode.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MeteoModule } from '../meteo/meteo.module';
import { MeteoService } from '../meteo/meteo.service';
import { HttpModule } from '@nestjs/axios';
import { PromoCode, PromoCodeSchema } from './schema/promocode.schema';

@Module({
  providers: [PromocodeService, MeteoService],
  controllers: [PromocodeController],
  imports: [
    MeteoModule,
    HttpModule,
    MongooseModule.forFeature([{ name: PromoCode.name, schema: PromoCodeSchema }]),
  ],
})
export class PromocodeModule { }
