import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OfficeMember } from 'src/auth/role/role.decorator';
import { OfficeMemberGuard } from 'src/auth/role/role.guard';

import { FundCallService } from './fund-call.service';
import { SendFundCallDto } from './dto/create-fund-call.dto';

@ApiTags('FundCalls')
@UsePipes(new ValidationPipe({ transform: true }))
@Controller('')
export class FundCallController {
  constructor(private readonly fundCallService: FundCallService) {}

  @Post('fund-call')
  @ApiOperation({ summary: 'Create and send a Fund Call' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Non authentifié' })
  @ApiForbiddenResponse({ status: 403, description: 'Accès refusé' })
  @ApiBody({ type: SendFundCallDto })
  @HttpCode(201)
  @OfficeMember(true)
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @ApiBearerAuth()
  async create(@Body() Dto: any) {
    console.log('DTO reçu:', Dto);
    const parsedDto = {
      ...Dto,
      date: Dto.date ? new Date(Dto.date) : undefined,
      amount: Dto.amount ? Number(Dto.amount) : undefined,
      // Utilise numberOfPayments si c'est le champ attendu par le service/prisma !
      installment: Dto.installment ? Number(Dto.installment) : undefined,
      // Corrige ici si tu changes le nom du champ !
      coOwners: Array.isArray(Dto.coOwners) ? Dto.coOwners : typeof Dto.coOwners === 'string' ? JSON.parse(Dto.coOwners) : [],
      reference: Dto.reference ? String(Dto.reference) : undefined,
      status: Dto.status ? String(Dto.status) : undefined,
      message: Dto.message ? String(Dto.message) : undefined,
    };

    return this.fundCallService.create(parsedDto);
  }

  @Get('fund-calls')
  @ApiOperation({ summary: 'Get all fund calls' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized : No token provided' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden : Forbidden resource' })
  @HttpCode(200)
  @OfficeMember(true)
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @ApiBearerAuth()
  findAll() {
    return this.fundCallService.findAll();
  }

  @Get('fund-call/:id')
  @ApiOperation({ summary: 'Get one fund call' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized : No token provided' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden : Forbidden resource' })
  @HttpCode(200)
  @OfficeMember(true)
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.fundCallService.findOne(+id);
  }

  @Delete('fund-call/:id')
  @ApiOperation({ summary: 'Delete one fund call' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized : No token provided' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden : Forbidden resource' })
  @HttpCode(200)
  @OfficeMember(true)
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @ApiBearerAuth()
  delete(@Param('id') id: string) {
    return this.fundCallService.remove(+id);
  }

  @Put('fund-call/:id')
  @ApiOperation({ summary: 'Update one fund call' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized : No token provided' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden : Forbidden resource' })
  @HttpCode(200)
  @OfficeMember(true)
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: SendFundCallDto) {
    return this.fundCallService.updateFundCall(+id, dto);
  }
}
