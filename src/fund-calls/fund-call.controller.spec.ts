import { Test, TestingModule } from '@nestjs/testing';
import { FundCallController } from './fund-call.controller';
import { FundCallService } from './fund-call.service';

describe('FundCallController', () => {
  let controller: FundCallController;
  let service: FundCallService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FundCallController],
    }).compile();

    controller = module.get<FundCallController>(FundCallController);
    service = module.get<FundCallService>(FundCallService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
