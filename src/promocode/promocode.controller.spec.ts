import { Test, TestingModule } from '@nestjs/testing';
import { PromocodeController } from './promocode.controller';
import { MeteoModule } from '../meteo/meteo.module';
import { MeteoService } from '../meteo/meteo.service';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { PromoCode, PromoCodeSchema } from './schema/promocode.schema';
import { PromocodeService } from './promocode.service';

describe('PromocodeController', () => {
  let controller: PromocodeController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [PromocodeController],
      providers: [PromocodeService, MeteoService],
      imports: [
        MeteoModule,
        HttpModule,
        MongooseModule.forRoot('mongodb+srv://indy-test:OdgTxqQraigxzr7y@cluster0.qxqnd.mongodb.net/test'),
        MongooseModule.forFeature([{ name: PromoCode.name, schema: PromoCodeSchema }]),
      ],

    }).compile();

    controller = module.get<PromocodeController>(PromocodeController);
  });

  afterEach(async () => {
    await module.close();
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
