import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ICoOwner } from 'src/co-owners/entities/co-owner.entity';

const isUserOfficeMember = (user: ICoOwner) => (user.role === 'OWNER' ? false : true);

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchRoles(roles: string[], userRole: string) {
    return roles.some((role) => role === userRole);
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('role', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return this.matchRoles(roles, user.role);
  }
}

@Injectable()
export class OfficeMemberGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isOfficeMember = this.reflector.get<string[]>('isOfficeMember', context.getHandler());
    if (!isOfficeMember[0]) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const isOffice = isUserOfficeMember(user);
    return isOffice;
  }
}

@Injectable()
export class SelfGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isSelf = this.reflector.get<string[]>('isSelf', context.getHandler());
    if (!isSelf[0]) {
      return false;
    }
    const isOfficeMember = this.reflector.get<string[]>('isOfficeMember', context.getHandler());
    if (!isOfficeMember[0]) {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const isUser = parseInt(user.lotNumber) === parseInt(request.params.id);

    const isOffice = isUserOfficeMember(user);

    return isUser || isOffice;
  }
}
