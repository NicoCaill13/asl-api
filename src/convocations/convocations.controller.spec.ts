import { Test, TestingModule } from '@nestjs/testing';
import { ConvocationsController } from './convocations.controller';
import { ConvocationsService } from './convocations.service';

describe('ConvocationsController', () => {
  let controller: ConvocationsController;
  let service: ConvocationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConvocationsController],
    }).compile();

    controller = module.get<ConvocationsController>(ConvocationsController);
    service = module.get<ConvocationsService>(ConvocationsService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
