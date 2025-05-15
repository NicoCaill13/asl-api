import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OfficeMemberGuard } from 'src/auth/role/role.guard';
import { OfficeMember } from 'src/auth/role/role.decorator';
import { AssemblyService } from './assembly.service';
import { SendAssemblyDto } from './dto/send-assembly.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Assembly')
@Controller('assembly')
export class AssemblyController {
  constructor(private readonly service: AssemblyService) {}

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
  create(@Body() dto: SendAssemblyDto, @UploadedFile() file: Express.Multer.File) {
    return this.service.generateAndSend(dto.html, dto.email);
  }
}
