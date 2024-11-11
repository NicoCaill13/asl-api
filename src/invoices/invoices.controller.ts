import {
  Controller,
  Get,
  Post,
  Param,
  Res,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
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
import { Prisma } from '@prisma/client';

@ApiTags('Invoices')
@Controller()
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post('invoice')
  @ApiOperation({ summary: 'Create one invoice' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized : No token provided' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden : Forbidden resource' })
  @ApiBody({ type: CreateInvoiceDto })
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @OfficeMember(true)
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
  async createInvoice(
    @Body() createInvoiceDto: CreateInvoiceDto, // Remplace par un DTO si nécessaire
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.invoicesService.createInvoice(createInvoiceDto, file);
  }

  @Get(':id/download')
  async downloadInvoiceFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.invoicesService.downloadInvoiceFile(+id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${id}.pdf"`,
    });
    res.send(file);
  }
}
