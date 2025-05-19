import { Test, TestingModule } from '@nestjs/testing';
import { AssemblyController } from './assembly.controller';
import { assemblyService } from './assembly.service';

describe('AssemblyController', () => {
  let controller: AssemblyController;
  let service: assemblyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssemblyController],
    }).compile();

    controller = module.get<AssemblyController>(AssemblyController);
    service = module.get<assemblyService>(assemblyService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
