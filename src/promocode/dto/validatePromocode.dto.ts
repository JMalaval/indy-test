import {
  IsString,
  IsNumber,
  ValidateNested,
  Max,
  Min,
  IsOptional,
} from 'class-validator';

class Meteo {
  @IsString()
  town: string;
}

class Arguments {
  @IsNumber()
  @Min(0)
  @Max(120)
  age: number;

  @ValidateNested()
  meteo: Meteo;
}

export class ValidatePromoCodeDto {
  @IsString()
  name: string;

  @IsOptional()
  @ValidateNested()
  arguments?: Arguments;
}


