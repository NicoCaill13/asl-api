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
  Put,
  Delete,
  Query,
  StreamableFile,
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
import { UpdateInvoicesStatusDto } from './dto/update-invoice.dto';

@ApiTags('Invoices')
@Controller()
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get('invoices')
  @OfficeMember(true)
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all invoices' })
  @ApiResponse({
    status: 200,
    description: 'The list of all invoices.',
  })
  findAll(
    @Query('contractId') contractId?: string // ← on lit le query-param
  ) {
    const id = contractId ? parseInt(contractId, 10) : undefined;
    return this.invoicesService.getInvoices(id);
  }

  @Get('invoices/:id')
  @ApiOperation({ summary: 'Find an invoice by ID' })
  @ApiResponse({
    status: 200,
    description: 'The invoice with the specified ID.',
  })
  @ApiNotFoundResponse({ status: 404, description: 'invoice with ID :id not found' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized : No token provided' })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.invoicesService.getInvoice(+id);
  }

  @Put('invoice/:id')
  @ApiOperation({ summary: 'Update an invoice by id' })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized : No token provided' })
  @ApiNotFoundResponse({ status: 404, description: 'invoice with ID :id not found' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden : Forbidden resource' })
  @HttpCode(200)
  @OfficeMember(true)
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  updateOne(@Param('id') id: string, @Body() UpdateInvoicesStatusDto: UpdateInvoicesStatusDto) {
    return this.invoicesService.updateInvoiceStatut(+id, UpdateInvoicesStatusDto.status);
  }

  @Delete('invoice/:id')
  @ApiOperation({ summary: 'Delete one quote' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized : No token provided' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden : Forbidden resource' })
  @HttpCode(204)
  @OfficeMember(true)
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.invoicesService.remove(+id);
  }

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

  @Get('invoice/:filename/download/')
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @OfficeMember(true)
  async downloadInvoices(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<StreamableFile> {
    return this.invoicesService.downloadInvoice(filename, res);
  }

  // @Get(':id/download')
  // async downloadInvoiceFile(@Param('id') id: string, @Res() res: Response) {
  //   const file = await this.invoicesService.downloadInvoiceFile(+id);
  //   res.set({
  //     'Content-Type': 'application/pdf',
  //     'Content-Disposition': `attachment; filename="invoice-${id}.pdf"`,
  //   });
  //   res.send(file);
  // }
}
