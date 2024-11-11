import { Test, TestingModule } from '@nestjs/testing';
import { CoOwnersController } from './co-owners.controller';
import { CoOwnersService } from './co-owners.service';

describe('CoOwnersController', () => {
  let controller: CoOwnersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoOwnersController],
      providers: [CoOwnersService],
    }).compile();

    controller = module.get<CoOwnersController>(CoOwnersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
