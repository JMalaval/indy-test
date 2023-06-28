import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Meteo } from './interface/meteo.interface';

@Injectable()
export class MeteoService {
    /** A mettre dans un fichier de configuration */
    private readonly apiKey = "d0562f476913da692a065c608d0539f6";

    constructor(private readonly httpService: HttpService) { }

    async findTemperatureByTown({ town }: { town: string }): Promise<{ temp: number; weather: string }> {
        try {

            const { data } = await this.httpService.axiosRef.get<Meteo>(`https://api.openweathermap.org/data/2.5/weather?q=${town}&appid=${this.apiKey}&units=metric`);

            return { temp: data.main.temp, weather: data.weather[0].main };
        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }
}
