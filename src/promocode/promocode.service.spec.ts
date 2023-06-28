import { Test, TestingModule } from '@nestjs/testing';
import {
  PromocodeService,
  compareRestriction,
  restrictionAge,
  restrictionDate,
  restrictionMeteo,
} from './promocode.service';
import { MeteoService } from '../meteo/meteo.service';
import { MeteoModule } from '../meteo/meteo.module';
import { HttpModule } from '@nestjs/axios';
import {
  PromoCode,
  PromoCodeSchema,
  Restriction,
} from './schema/promocode.schema';
import { MongooseModule } from '@nestjs/mongoose';

describe('PromocodeService', () => {
  let service: PromocodeService;
  let meteo: MeteoService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [PromocodeService, MeteoService],
      imports: [
        MeteoModule,
        HttpModule,
        MongooseModule.forRoot('mongodb://localhost:27017/'),
        MongooseModule.forFeature([
          { name: PromoCode.name, schema: PromoCodeSchema },
        ]),
      ],
    }).compile();

    service = module.get<PromocodeService>(PromocodeService);
    meteo = module.get<MeteoService>(MeteoService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('PromocodeService - age restriction ', () => {
    /** Equal */

    it('should pass if age is equal', () => {
      const ageRestriction: Restriction['@age'] = { eq: 15 };
      const age = 15;
      const error = restrictionAge({ ageRestriction, age });
      expect(error).toBeFalsy();
    });

    it('should fail if age is not equal', () => {
      const ageRestriction: Restriction['@age'] = { eq: 15 };
      const age = 16;
      const error = restrictionAge({ ageRestriction, age });
      expect(error).toBeTruthy();
    });

    /** Less than */

    it('should fail if age is not less than', () => {
      const ageRestriction: Restriction['@age'] = { lt: 15 };
      const age = 16;
      const error = restrictionAge({ ageRestriction, age });
      expect(error).toBeTruthy();
    });

    it('should fail if age is not less than', () => {
      const ageRestriction: Restriction['@age'] = { lt: 15 };
      const age = 14;
      const error = restrictionAge({ ageRestriction, age });
      expect(error).toBeFalsy();
    });

    /** Greather than */

    it('should fail if age is not greather than', () => {
      const ageRestriction: Restriction['@age'] = { gt: 15 };
      const age = 14;
      const error = restrictionAge({ ageRestriction, age });
      expect(error).toBeTruthy();
    });

    it('should fail if age is not greather than', () => {
      const ageRestriction: Restriction['@age'] = { gt: 15 };
      const age = 16;
      const error = restrictionAge({ ageRestriction, age });
      expect(error).toBeFalsy();
    });

    /** Add tests to test several field together */
  });

  describe('PromocodeService - date restriction ', () => {
    /** Before */

    it('should pass if date is before restriction date', () => {
      const dateRestriction: Restriction['@date'] = { before: '2023-06-06' };
      const date = new Date('2023-06-01');
      const error = restrictionDate({ dateRestriction, date });
      expect(error).toBeFalsy();
    });

    it('should pass if date is not before restriction date', () => {
      const dateRestriction: Restriction['@date'] = { before: '2023-06-06' };
      const date = new Date('2023-06-30');
      const error = restrictionDate({ dateRestriction, date });
      expect(error).toBeTruthy();
    });

    /** After */

    it('should pass if date is after restriction date', () => {
      const dateRestriction: Restriction['@date'] = { after: '2023-06-06' };
      const date = new Date('2023-06-30');
      const error = restrictionDate({ dateRestriction, date });
      expect(error).toBeFalsy();
    });

    it('should pass if date is not after restriction date', () => {
      const dateRestriction: Restriction['@date'] = { after: '2023-06-06' };
      const date = new Date('2023-06-01');
      const error = restrictionDate({ dateRestriction, date });
      expect(error).toBeTruthy();
    });

    /** Add tests to test several field together */

    it('should pass if date is after and before restriction date', () => {
      const dateRestriction: Restriction['@date'] = {
        after: '2023-06-06',
        before: '2023-06-30',
      };
      const date = new Date('2023-06-24');
      const error = restrictionDate({ dateRestriction, date });
      expect(error).toBeFalsy();
    });

    it('should pass if date is not after or before restriction date', () => {
      const dateRestriction: Restriction['@date'] = {
        after: '2023-06-06',
        before: '2023-06-30',
      };
      const date = new Date('2023-07-24');
      const error = restrictionDate({ dateRestriction, date });
      expect(error).toBeTruthy();
    });
  });

  describe('PromocodeService - weather restriction ', () => {
    /** Weather */

    it('should pass if weather prevision si equal to weather restriction ', () => {
      const meteoRestriction: Restriction['@meteo'] = { is: 'Clouds' };
      const weather = 'Clouds';
      const temp = 25;
      const error = restrictionMeteo({ meteoRestriction, weather, temp });
      expect(error).toBeFalsy();
    });

    it('should pass if weather prevision si equal to weather restriction ', () => {
      const meteoRestriction: Restriction['@meteo'] = { is: 'Clouds' };
      const weather = 'Sun';
      const temp = 25;
      const error = restrictionMeteo({ meteoRestriction, weather, temp });
      expect(error).toBeTruthy();
    });

    /** Temp */

    it('should pass if temp prevision is equal to temp restriction ', () => {
      const weather = 'Clouds';
      const meteoRestriction: Restriction['@meteo'] = { temp: { eq: 15 } };
      const temp = 15;
      const error = restrictionMeteo({ meteoRestriction, weather, temp });
      expect(error).toBeFalsy();
    });

    it('should pass if temp prevision si less than temp restriction ', () => {
      const weather = 'Sun';
      const meteoRestriction: Restriction['@meteo'] = { temp: { lt: 15 } };
      const temp = 12;
      const error = restrictionMeteo({ meteoRestriction, weather, temp });
      expect(error).toBeFalsy();
    });

    it('should pass if temp prevision is greather than restriction ', () => {
      const weather = 'Sun';
      const meteoRestriction: Restriction['@meteo'] = { temp: { gt: 15 } };
      const temp = 25;
      const error = restrictionMeteo({ meteoRestriction, weather, temp });
      expect(error).toBeFalsy();
    });

    it('should pass if temp prevision is not equal to temp restriction ', () => {
      const weather = 'Clouds';
      const meteoRestriction: Restriction['@meteo'] = { temp: { eq: 15 } };
      const temp = 16;
      const error = restrictionMeteo({ meteoRestriction, weather, temp });
      expect(error).toBeTruthy();
    });

    it('should pass if temp prevision is not less than temp restriction ', () => {
      const weather = 'Sun';
      const meteoRestriction: Restriction['@meteo'] = { temp: { lt: 15 } };
      const temp = 17;
      const error = restrictionMeteo({ meteoRestriction, weather, temp });
      expect(error).toBeTruthy();
    });

    it('should pass if temp prevision is not greather than restriction ', () => {
      const weather = 'Sun';
      const meteoRestriction: Restriction['@meteo'] = { temp: { gt: 15 } };
      const temp = 12;
      const error = restrictionMeteo({ meteoRestriction, weather, temp });
      expect(error).toBeTruthy();
    });
  });

  describe('PromocodeService - or compare ', () => {
    it('should pass if all restriction are ok ', () => {
      const restrictions: Restriction[] = [
        {
          '@age': { eq: 15 },
          '@meteo': { is: 'Sun', temp: { eq: 25 } },
          '@date': { before: '2023-06-30' },
        },
      ];
      const age = 15;
      const weather = 'Sun';
      const temp = 25;
      const date = new Date('2023-06-24');
      const error = compareRestriction({
        date,
        age,
        temp,
        weather,
        restrictions,
        operator: 'or',
      });
      expect(error).toBeFalsy();
    });

    it('should pass if all of restriction is not ok', () => {
      const restrictions: Restriction[] = [
        { '@age': { eq: 15 } },
        {
          '@meteo': { is: 'Sun', temp: { eq: 25 } },
          '@date': { before: '2023-06-30' },
        },
      ];
      const age = 12;
      const weather = 'Clouds';
      const temp = 25;
      const date = new Date('2023-07-24');
      const error = compareRestriction({
        date,
        age,
        temp,
        weather,
        restrictions,
        operator: 'or',
      });
      expect(error).toBeTruthy();
    });
  });

  describe('PromocodeService - and compare ', () => {
    it('should pass if all restriction are ok ', () => {
      const restrictions: Restriction[] = [
        { '@age': { eq: 15 } },
        {
          '@meteo': { is: 'Sun', temp: { eq: 25 } },
          '@date': { before: '2023-06-30' },
        },
      ];
      const age = 15;
      const weather = 'Sun';
      const temp = 25;
      const date = new Date('2023-06-24');
      const error = compareRestriction({
        date,
        age,
        temp,
        weather,
        restrictions,
        operator: 'and',
      });
      expect(error).toBeFalsy();
    });

    it('should pass if one of restriction is not ok ( Weather for this example )', () => {
      const restrictions: Restriction[] = [
        { '@age': { eq: 15 } },
        {
          '@meteo': { is: 'Sun', temp: { eq: 25 } },
          '@date': { before: '2023-06-30' },
        },
      ];
      const age = 15;
      const weather = 'Clouds';
      const temp = 25;
      const date = new Date('2023-06-24');
      const error = compareRestriction({
        date,
        age,
        temp,
        weather,
        restrictions,
        operator: 'and',
      });
      expect(error).toBeTruthy();
    });
  });
});
