import { SetMetadata } from '@nestjs/common';

export const Role = (...args: string[]) => SetMetadata('role', args);
export const OfficeMember = (...args: boolean[]) => SetMetadata('isOfficeMember', args);
export const Self = (...args: boolean[]) => SetMetadata('isSelf', args);
