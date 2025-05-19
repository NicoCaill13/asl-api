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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OfficeMember } from 'src/auth/role/role.decorator';
import { OfficeMemberGuard } from 'src/auth/role/role.guard';

import { FundCallService } from './fund-call.service';
import { SendFundCallDto } from './dto/fund-call.dto';

@ApiTags('FundCalls')
@Controller('fund-calls')
export class FundCallController {
  constructor(private readonly fundCallService: FundCallService) {}

  @Post('send')
  @ApiOperation({ summary: 'Créer et envoyer une convocation' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Non authentifié' })
  @ApiForbiddenResponse({ status: 403, description: 'Accès refusé' })
  @ApiBody({ type: SendFundCallDto })
  @HttpCode(201)
  @OfficeMember(true)
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        // Vérifie si le fichier est un PDF
        if (file.mimetype === 'application/pdf') {
          callback(null, true);
        } else {
          callback(new BadRequestException('Only PDF files are allowed!'), false);
        }
      },
    })
  )
  create(@UploadedFile() file: Express.Multer.File, @Body() Dto: SendFundCallDto) {
    return this.fundCallService.create(Dto, file);
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
