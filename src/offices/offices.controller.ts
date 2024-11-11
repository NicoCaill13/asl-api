import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OfficesService } from './offices.service';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { OfficeEntity } from './entities/office.entity';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OfficeMemberGuard } from 'src/auth/role/role.guard';
import { OfficeMember } from 'src/auth/role/role.decorator';

@Controller('offices')
export class OfficesController {
  constructor(private readonly officesService: OfficesService) {}

  @Post()
  @OfficeMember(true)
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @ApiBearerAuth()
  create(@Body() createOfficeDto: CreateOfficeDto) {
    return this.officesService.create(createOfficeDto);
  }

  @Get()
  @OfficeMember(true)
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: OfficeEntity, isArray: true })
  findAll() {
    return this.officesService.findAll();
  }

  @Get(':id')
  @OfficeMember(true)
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.officesService.findOne(+id);
  }

  @Patch(':id')
  @OfficeMember(true)
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateOfficeDto: UpdateOfficeDto) {
    return this.officesService.update(+id, updateOfficeDto);
  }

  @Delete(':id')
  @OfficeMember(true)
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.officesService.remove(+id);
  }
}
