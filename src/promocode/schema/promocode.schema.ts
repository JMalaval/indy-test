import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'Avantage', _id: false })
export class Avantage {
    @Prop()
    percent: number;
};

@Schema({ collection: 'Date', _id: false })
export class DateRestriction {
    @Prop()
    before?: string;

    @Prop()
    after?: string;
};

@Schema({ collection: 'ComparisonOperator', _id: false })
export class ComparisonOperator {
    @Prop({ required: false })
    gt?: number;

    @Prop({ required: false })
    lt?: number;

    @Prop({ required: false })
    eq?: number;
};

@Schema({ collection: 'Meteo', _id: false })
export class Meteo {
    @Prop({ required: false })
    is?: string;

    @Prop({ required: false })
    temp?: ComparisonOperator;
};

@Schema({ collection: 'Restriction', _id: false })
export class Restriction {
    @Prop({ required: false })
    "@date"?: DateRestriction;

    @Prop({ required: false })
    "@age"?: ComparisonOperator;

    @Prop({ required: false })
    "@meteo"?: Meteo;

    @Prop({ required: false })
    "@or"?: Restriction[];

    @Prop({ required: false })
    "@and"?: Restriction[];
};


@Schema({ collection: 'PromoCode' })
export class PromoCode {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true })
    avantage: Avantage;

    @Prop({ required: true })
    restrictions: Restriction[];
};

export type PromoCodeDocument = HydratedDocument<PromoCode>;
export const PromoCodeSchema = SchemaFactory.createForClass(PromoCode);