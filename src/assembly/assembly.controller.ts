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
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
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
@UsePipes(new ValidationPipe({ transform: true }))
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
  async send(
    @UploadedFile() file: Express.Multer.File,
    @Body('date') dateRaw: string,
    @Body('message') message: string,
    @Body('email') email: string,
    @Body('participants') participantsRaw: string
  ) {
    // 1) Parser manuellement participants (string JSON → string[])
    let participants: string[];
    try {
      const parsed = JSON.parse(participantsRaw);
      participants = Array.isArray(parsed) ? parsed : [];
    } catch {
      participants = [];
    }
    console.log('Parsed participants:', participants);

    // 2) Construire le DTO explicitement
    const Dto: SendAssemblyDto = {
      date: new Date(dateRaw),
      message,
      email,
      participants,
      filePath: undefined,
    };
    // create(@UploadedFile() file: Express.Multer.File, @Body() Dto: SendAssemblyDto) {

    return this.assemblyService.create(Dto, file);
  }

  @Get('assemblies')
  @ApiOperation({ summary: 'Get all assemblies' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized : No token provided' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden : Forbidden resource' })
  @HttpCode(200)
  @OfficeMember(true)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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

  @Get('assembly/:filename/download/')
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @OfficeMember(true)
  async downloadAssembly(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: import('express').Response
  ): Promise<StreamableFile> {
    return this.assemblyService.downloadAssembly(filename, res);
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
    return this.assemblyService.remove(+id);
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
