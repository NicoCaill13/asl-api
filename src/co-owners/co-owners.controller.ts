import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { CoOwnersService } from './co-owners.service';
import { CreateCoOwnerDto } from './dto/create-co-owner.dto';
import { UpdateCoOwnerDto } from './dto/update-co-owner.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
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
import { OfficeMemberGuard, SelfGuard } from 'src/auth/role/role.guard';
import { OfficeMember, Self } from 'src/auth/role/role.decorator';

@ApiTags('Co-owner')
@Controller()
export class CoOwnersController {
  constructor(private readonly coOwnersService: CoOwnersService) {}

  @Post('co-owner')
  @ApiOperation({ summary: 'Create one co owner' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized : No token provided' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden : Forbidden resource' })
  @ApiBody({ type: CreateCoOwnerDto })
  @HttpCode(201)
  @OfficeMember(true)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createCoOwnerDto: CreateCoOwnerDto) {
    return this.coOwnersService.create(createCoOwnerDto);
  }

  @Get('co-owners')
  @ApiOperation({ summary: 'Get all co owners' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized : No token provided' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden : Forbidden resource' })
  @HttpCode(200)
  @OfficeMember(true)
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @ApiBearerAuth()
  findAll() {
    return this.coOwnersService.findAll();
  }

  @Get('co-owner/:id')
  @ApiOperation({ summary: 'Get one co owner' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized : No token provided' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden : Forbidden resource' })
  @HttpCode(200)
  @Self(true)
  @OfficeMember(true)
  @UseGuards(JwtAuthGuard, SelfGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.coOwnersService.findOne(+id);
  }

  @Put('co-owner/:id')
  @ApiOperation({ summary: 'Update one co owner' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized : No token provided' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden : Forbidden resource' })
  @ApiBody({ type: UpdateCoOwnerDto })
  @HttpCode(200)
  @Self(true)
  @OfficeMember(true)
  @UseGuards(JwtAuthGuard, SelfGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateCoOwnerDto: UpdateCoOwnerDto) {
    return this.coOwnersService.update(+id, updateCoOwnerDto);
  }

  @Delete('co-owner/:id')
  @ApiOperation({ summary: 'Delete one co owner' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized : No token provided' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden : Forbidden resource' })
  @HttpCode(204)
  @OfficeMember(true)
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.coOwnersService.remove(+id);
  }
}
