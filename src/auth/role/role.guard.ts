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
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.role) {
      console.warn('❌ Aucun utilisateur ou rôle dans la requête');
      return false;
    }

    return this.matchRoles(roles, user.role);
  }
}

@Injectable()
export class OfficeMemberGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isOfficeMember = this.reflector.get<boolean[]>('isOfficeMember', context.getHandler());
    if (!isOfficeMember || !isOfficeMember[0]) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.role) {
      console.warn('❌ Aucun utilisateur ou rôle dans la requête');
      return false;
    }

    const allowedForOwner = ['/invoices', '/co-owners'];
    const currentPath = request.route.path;

    if (user.role === 'OWNER') {
      return allowedForOwner.includes(currentPath);
    }

    return isUserOfficeMember(user);
  }
}

@Injectable()
export class SelfGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isSelf = this.reflector.get<boolean[]>('isSelf', context.getHandler());
    const isOfficeMember = this.reflector.get<boolean[]>('isOfficeMember', context.getHandler());

    if (!isSelf?.[0] || !isOfficeMember?.[0]) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.lotNumber || !request.params?.id) {
      console.warn('❌ Données manquantes pour SelfGuard');
      return false;
    }

    const isUser = parseInt(user.lotNumber) === parseInt(request.params.id);
    const isOffice = isUserOfficeMember(user);

    return isUser || isOffice;
  }
}
