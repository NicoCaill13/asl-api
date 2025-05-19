import { Test, TestingModule } from '@nestjs/testing';
import { FundCallService } from './fund-call.service';

describe('FundCallService', () => {
  let service: FundCallService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FundCallService],
    }).compile();

    service = module.get<FundCallService>(FundCallService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
