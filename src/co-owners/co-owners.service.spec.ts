import { Test, TestingModule } from '@nestjs/testing';
import { CoOwnersService } from './co-owners.service';

describe('CoOwnersService', () => {
  let service: CoOwnersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoOwnersService],
    }).compile();

    service = module.get<CoOwnersService>(CoOwnersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
