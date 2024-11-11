import { PartialType } from '@nestjs/swagger';
import { CreateCoOwnerDto } from './create-co-owner.dto';

export class UpdateCoOwnerDto extends PartialType(CreateCoOwnerDto) {}
