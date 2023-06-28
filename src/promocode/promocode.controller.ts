import { Body, Controller, Post, UsePipes, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePromoCodeDto } from './dto/createPromocode.dto';
import { ValidatePromoCodeDto } from './dto/validatePromocode.dto';
import { PromocodeService } from './promocode.service';
import { PromocodeResponse } from './interface/promocode.interface';

@Controller('promocode')
export class PromocodeController {
    constructor(private readonly service: PromocodeService) { }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() createPromoCode: CreatePromoCodeDto): Promise<PromocodeResponse> {
        try {
            return this.service.create(createPromoCode);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
            }, HttpStatus.INTERNAL_SERVER_ERROR, {
                cause: error
            });
        }
    }

    @Post("/validate")
    @UsePipes(new ValidationPipe({ transform: true }))
    async validatePromocode(@Body() promoCode: ValidatePromoCodeDto): Promise<PromocodeResponse> {
        try {
            return this.service.validatePromocode(promoCode);
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
            }, HttpStatus.INTERNAL_SERVER_ERROR, {
                cause: error
            });
        }
    }
}


