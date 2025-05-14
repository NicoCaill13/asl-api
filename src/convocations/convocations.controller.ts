import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ConvocationsService } from './convocations.service';
import { SendConvocationDto } from './dto/send-convocation.dto';
import { ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { OfficeMember } from 'src/auth/role/role.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OfficeMemberGuard } from 'src/auth/role/role.guard';

@ApiTags('Convocations')
@Controller('convocations')
export class ConvocationsController {
  constructor(private readonly service: ConvocationsService) {}

  @Post('send')
  @ApiOperation({ summary: 'Create a convocation' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized : No token provided' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden : Forbidden resource' })
  @ApiBody({ type: SendConvocationDto })
  @HttpCode(201)
  @OfficeMember(true)
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @ApiBearerAuth()
  create(@Body() dto: SendConvocationDto) {
    return this.service.generateAndSend(dto.html, dto.email);
  }
}
