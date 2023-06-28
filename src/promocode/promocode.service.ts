import { Injectable } from '@nestjs/common';
import { CreatePromoCodeDto } from './dto/createPromocode.dto';
import { Model } from 'mongoose';
import { ComparisonOperator, DateRestriction, Meteo, PromoCode, PromoCodeDocument, Restriction } from './schema/promocode.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ValidatePromoCodeDto } from './dto/validatePromocode.dto';
import { MeteoService } from '../meteo/meteo.service';
import { PromocodeResponse, ResponseStatus } from './interface/promocode.interface';

export const restrictionAge = ({ ageRestriction, age }: { age: number; ageRestriction: ComparisonOperator }) => {

    let error = false;
    if (ageRestriction) {
        /** If age is not equal age restriction */
        if (ageRestriction.eq && ageRestriction?.eq !== age) error = true;
        /** If age is not less than age restriction */
        if (ageRestriction?.lt && !(age < ageRestriction.lt)) error = true;
        /** If age is not greather than age restriction */
        if (ageRestriction?.gt && !(age > ageRestriction.gt)) error = true;
    }
    return error;
}

export const restrictionDate = ({ dateRestriction, date }: { date: Date; dateRestriction: DateRestriction }) => {
    let error = false;
    if (dateRestriction) {
        /** If date is less than restriction date after */
        if (dateRestriction.after && !(date.getTime() > new Date(dateRestriction.after).getTime())) error = true;
        /** If date is less than restriction date after */
        if (dateRestriction.before && !(date.getTime() < new Date(dateRestriction.before).getTime())) error = true;
    }
    return error;
}

export const restrictionMeteo = ({ meteoRestriction, weather, temp }: { weather: string; temp: number; meteoRestriction: Meteo }) => {
    let error = false;
    if (meteoRestriction) {
        /** If weather prevision is not equal to weather restriction */
        if (meteoRestriction.is && meteoRestriction.is !== weather) error = true;

        if (meteoRestriction.temp) {
            /** If temp prevision is not equal to temperature restriction */
            if (meteoRestriction.temp.eq && meteoRestriction.temp.eq !== temp) error = true;
            /** If temp prevision is not less than temperature restriction */
            if (meteoRestriction.temp.lt && !(temp < meteoRestriction.temp.lt)) error = true;
            /** If temp prevision is not greather than temperature restriction */
            if (meteoRestriction.temp.gt && !(temp > meteoRestriction.temp.gt)) error = true;
        }
    }

    return error;
}


export const compareRestriction = ({ date, age, temp, weather, restrictions, operator }: { date: Date; age: number; temp: number; weather: string; restrictions: Restriction[], operator: 'or' | 'and' }): boolean => {

    const errors = restrictions.map((restriction) => {
        let orError = false
        let andError = false
        const ageError = restrictionAge({ ageRestriction: restriction['@age'], age });
        const dateError = restrictionDate({ dateRestriction: restriction['@date'], date })
        const meteoError = restrictionMeteo({ meteoRestriction: restriction['@meteo'], weather, temp })

        if (restriction['@and']) andError = compareRestriction({ date, age, temp, weather, restrictions: restriction['@and'], operator: 'and' });
        if (restriction['@or']) orError = compareRestriction({ date, age, temp, weather, restrictions: restriction["@or"], operator: 'or' });

        return ageError || dateError || meteoError || andError || orError;
    })

    /** 
     * For and operator if we have at least one error to true we return true
     * For or operator if we have only error to true we return true
     */
    return operator === 'and' ? errors.some(error => error) : errors.every((error) => error);
}

@Injectable()
export class PromocodeService {
    constructor(@InjectModel(PromoCode.name) private readonly model: Model<PromoCodeDocument>, private readonly meteoService: MeteoService) { };

    async validatePromocode(validatePromocode: ValidatePromoCodeDto): Promise<PromocodeResponse> {
        const promocode = await this.model.findOne({ name: validatePromocode.name }).exec();
        const { restrictions, name, avantage } = promocode;

        if (!promocode) {
            return {
                "promocode_name": validatePromocode.name,
                "status": ResponseStatus.Denied,
                "reasons": ["Promocode not found"],
            }
        };

        const { temp, weather } = await this.meteoService.findTemperatureByTown({ town: validatePromocode.arguments?.meteo.town })
        const age = validatePromocode.arguments?.age;
        const date = new Date();

        const error = compareRestriction({ restrictions, date, age, temp, weather, operator: 'and' });

        if (error) {
            return {
                "promocode_name": validatePromocode.name,
                "status": ResponseStatus.Denied,
                "reasons": ["Arguments are not matching Promocode restriction"],
            }
        }

        return {
            "promocode_name": name,
            "status": ResponseStatus.Accepted,
            "avantage": avantage
        }
    };

    async create(createPromocodeDto: CreatePromoCodeDto): Promise<PromocodeResponse> {
        const promocode = await new this.model({
            ...createPromocodeDto,
        }).save();

        if (!promocode) {
            return {
                "promocode_name": promocode.name,
                "status": ResponseStatus.Denied,
                "reasons": ['Cannot create promocode']
            }
        }

        return {
            "promocode_name": promocode.name,
            "status": ResponseStatus.Created,
            "avantage": promocode.avantage
        }
    };

}
