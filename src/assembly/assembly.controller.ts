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
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OfficeMemberGuard } from 'src/auth/role/role.guard';
import { OfficeMember } from 'src/auth/role/role.decorator';

import { SendAssemblyDto } from './dto/send-assembly.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { assemblyService } from './assembly.service';

@ApiTags('Assembly')
@Controller('')
export class AssemblyController {
  constructor(private readonly service: assemblyService) {}

  private get assemblyService(): assemblyService {
    return this.service;
  }

  @Post('send')
  @ApiOperation({ summary: 'Créer et envoyer une convocation' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Non authentifié' })
  @ApiForbiddenResponse({ status: 403, description: 'Accès refusé' })
  @ApiBody({ type: SendAssemblyDto })
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
  create(@UploadedFile() file: Express.Multer.File, @Body() Dto: SendAssemblyDto) {
    return this.assemblyService.create(Dto, file);
  }

  @Get('assemblies')
  @ApiOperation({ summary: 'Récupérer toutes les convocations envoyées' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Non authentifié' })
  @ApiForbiddenResponse({ status: 403, description: 'Accès refusé' })
  @HttpCode(200)
  @OfficeMember(true)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @ApiOkResponse({ status: 200, description: 'Récupération réussie' })
  findAll() {
    return this.assemblyService.findAll();
  }

  @Get('assembly/:id')
  @ApiOperation({ summary: 'Récupérer une convocation envoyée' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Non authentifié' })
  @ApiForbiddenResponse({ status: 403, description: 'Accès refusé' })
  @HttpCode(200)
  @OfficeMember(true)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @ApiOkResponse({ status: 200, description: 'Récupération réussie' })
  findOne(@Param('id') id: number) {
    return this.assemblyService.findOne(id);
  }

  @Delete('assembly/:id')
  @ApiOperation({ summary: 'Supprimer une convocation envoyée' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Non authentifié' })
  @ApiForbiddenResponse({ status: 403, description: 'Accès refusé' })
  @HttpCode(200)
  @OfficeMember(true)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @ApiOkResponse({ status: 200, description: 'Suppression réussie' })
  remove(@Param('id') id: number) {
    return this.assemblyService.remove(id);
  }

  @Put('assembly/:id')
  @ApiOperation({ summary: 'Mettre à jour une convocation envoyée' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Non authentifié' })
  @ApiForbiddenResponse({ status: 403, description: 'Accès refusé' })
  @HttpCode(200)
  @OfficeMember(true)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @ApiOkResponse({ status: 200, description: 'Mise à jour réussie' })
  update(@Param('id') id: number, @Body() dto: SendAssemblyDto) {
    return this.assemblyService.updateAssembly(id, dto);
  }
}
