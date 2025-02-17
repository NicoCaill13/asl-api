import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, HttpCode, Put } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
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
import { OfficeMemberGuard } from 'src/auth/role/role.guard';
import { OfficeMember } from 'src/auth/role/role.decorator';

@ApiTags('Contracts')
@Controller()
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) { }

  @Post('contract')
  @ApiOperation({ summary: 'Create one contract' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized : No token provided' })
  @ApiBody({ type: CreateContractDto })
  @HttpCode(201)
  @OfficeMember(true)
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  @ApiBearerAuth()
  create(@Body() createContractDto: CreateContractDto) {
    return this.contractsService.create(createContractDto);
  }

  @Get('contracts')
  @ApiOperation({ summary: 'List all contracts' })
  @ApiResponse({
    status: 200,
    description: 'The list of all contracts.',
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized : No token provided' })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.contractsService.findAll();
  }

  @Get('contract/:id')
  @ApiOperation({ summary: 'Find a contract by ID' })
  @ApiResponse({
    status: 200,
    description: 'The contract with the specified ID.',
  })
  @ApiNotFoundResponse({ status: 404, description: 'contract with ID :id not found' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized : No token provided' })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.contractsService.findOne(+id);
  }

  @Put('contract/:id')
  @ApiOperation({ summary: 'Update an article' })
  @ApiResponse({
    status: 200,
    description: 'The article has been successfully updated.',
  })
  @ApiNotFoundResponse({ status: 404, description: `Contract with ID :id not found` })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized : No token provided' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden : Forbidden resource' })
  @HttpCode(200)
  @OfficeMember(true)
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  update(@Param('id') id: string, @Body() updateContractDto: UpdateContractDto) {
    return this.contractsService.update(+id, updateContractDto);
  }

  @Delete('contract/:id')
  @ApiOperation({ summary: 'Delete an article' })
  @ApiNotFoundResponse({ status: 404, description: `Contract with ID :id not found` })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized : No token provided' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden : Forbidden resource' })
  @HttpCode(204)
  @OfficeMember(true)
  @UseGuards(JwtAuthGuard, OfficeMemberGuard)
  delete(@Param('id') id: string) {
    return this.contractsService.delete(+id);
  }
}
