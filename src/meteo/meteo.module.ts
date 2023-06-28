import { Module } from '@nestjs/common';
import { MeteoService } from './meteo.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    providers: [MeteoService],
    imports: [HttpModule],
})
export class MeteoModule { }
