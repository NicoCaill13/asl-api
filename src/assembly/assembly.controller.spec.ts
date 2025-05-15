import { Test, TestingModule } from '@nestjs/testing';
import { AssemblyController } from './assembly.controller';
import { AssemblyService } from './assembly.service';

describe('AssemblyController', () => {
  let controller: AssemblyController;
  let service: AssemblyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssemblyController],
    }).compile();

    controller = module.get<AssemblyController>(AssemblyController);
    service = module.get<AssemblyService>(AssemblyService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
