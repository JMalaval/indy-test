import {
  IsString,
  IsNumber,
  ValidateNested,
  IsISO8601,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

class ComparisonOperator {
  @IsOptional()
  @Min(0)
  @Max(100)
  gt?: number;

  @IsOptional()
  @Min(0)
  @Max(100)
  lt?: number;

  @IsOptional()
  @Min(0)
  @Max(100)
  eq?: number;
}

class Meteo {
  @IsString()
  is: string;

  @ValidateNested()
  temp: ComparisonOperator;
}

class Date {
  @IsOptional()
  @IsISO8601()
  after?: string;

  @IsOptional()
  @IsISO8601()
  before?: string;
}

class Restriction {
  @IsOptional()
  @ValidateNested()
  date?: Date;

  @IsOptional()
  @ValidateNested()
  age?: ComparisonOperator;

  @IsOptional()
  @ValidateNested()
  meteo?: Meteo;

  @IsOptional()
  @ValidateNested()
  or?: Restriction[];

  @IsOptional()
  @ValidateNested()
  and?: Restriction[];
}

class Avantage {
  @IsNumber()
  percent: number;
}

export class CreatePromoCodeDto {
  @IsString()
  name: string;

  @ValidateNested()
  avantage: Avantage;

  @ValidateNested()
  restrictions: Restriction[];
}


