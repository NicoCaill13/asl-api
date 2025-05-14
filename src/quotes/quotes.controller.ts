import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  HttpCode,
  UseGuards,
  Delete,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { QuotesService } from './quotes.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteStatusDto } from './dto/update-quote-status.dto';
import { QuoteStatus } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OfficeMemberGuard } from 'src/auth/role/role.guard';
import { OfficeMember } from 'src/auth/role/role.decorator';

@ApiTags('Quotes')
@Controller()
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post('quote')
  @ApiOperation({ summary: 'Create one quote' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized : No token provided' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden : Forbidden resource' })
  @ApiBody({ type: CreateQuoteDto })
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @OfficeMember(true)
  @Post()
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
  async createQuote(@Body() createQuoteDto: CreateQuoteDto, @UploadedFile() file: Express.Multer.File) {
    return this.quotesService.createQuote(createQuoteDto, file);
  }

  @Get('quotes')
  @ApiOperation({ summary: 'Get all quotes' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized : No token provided' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden : Forbidden resource' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async findAll() {
    return this.quotesService.findAll();
  }

  @Get('quote/:id')
  @ApiOperation({ summary: 'Get one quote' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized : No token provided' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden : Forbidden resource' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async findOne(@Param('id') id: string) {
    return this.quotesService.findOne(+id);
  }

  @Put('quote/:id')
  @ApiOperation({ summary: 'Update one quote' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized : No token provided' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden : Forbidden resource' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async updateStatus(@Param('id') id: string, @Body() updateQuoteStatusDto: UpdateQuoteStatusDto) {
    return this.quotesService.updateQuoteStatus(+id, updateQuoteStatusDto.status);
  }

  @Delete('quote/:id')
  @ApiOperation({ summary: 'Delete one quote' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized : No token provided' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden : Forbidden resource' })
  @HttpCode(204)
  @OfficeMember(true)
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.quotesService.remove(+id);
  }

  @Get('quote/:filename/download/')
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @OfficeMember(true)
  async downloadQuote(@Param('filename') filename: string, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
    return this.quotesService.downloadQuote(filename, res);
  }
}
