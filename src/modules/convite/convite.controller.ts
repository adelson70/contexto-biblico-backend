import { Controller, Delete, Get, Logger, Param, Post, Body, UseGuards, Put, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { ConviteService } from './convite.service';
import { CriarConviteDto } from './dto/criar-convite.dto';
import { CriarConviteResponseDto } from './dto/criar-convite-response.dto';
import { AtualizarConviteDto } from './dto/atualizar-convite.dto';
import { AtualizarConviteResponseDto } from './dto/atualizar-convite-response.dto';
import { ListarConvitesQueryDto } from './dto/listar-convites.dto';
import { ListarConvitesResponseDto } from './dto/listar-convites-response.dto';
import { DeletarConviteResponseDto } from './dto/deletar-convite-response.dto';
import { ValidarConviteResponseDto } from './dto/validar-convite-response.dto';
import { AdminGuard } from '../../guards/admin.guard';

@ApiTags('Convites')
@Controller('convites')
export class ConviteController {
  constructor(
    private readonly conviteService: ConviteService,
    private logger: Logger,
  ) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Criar um novo convite (somente admin)' })
  @ApiResponse({
    status: 201,
    description: 'Convite criado com sucesso',
    type: CriarConviteResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - somente administradores',
  })
  @ApiResponse({
    status: 409,
    description: 'Slug personalizado já está em uso',
  })
  async criarConvite(
    @Body() criarConviteDto: CriarConviteDto,
    @Req() request: Request,
  ): Promise<CriarConviteResponseDto> {
    const user = request.user as any;
    this.logger.log(`Criando convite: ${criarConviteDto.nome}`);
    return this.conviteService.criarConvite(criarConviteDto, user.userId);
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar todos os convites com paginação (somente admin)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de convites retornada com sucesso',
    type: ListarConvitesResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - somente administradores',
  })
  async listarConvites(@Query() query: ListarConvitesQueryDto): Promise<ListarConvitesResponseDto> {
    this.logger.log(`Listando convites - página ${query.page}, limite ${query.limit}, nome: ${query.nome || 'N/A'}`);
    return this.conviteService.listarConvites(query.page, query.limit, query.nome);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualizar um convite (somente admin)' })
  @ApiResponse({
    status: 200,
    description: 'Convite atualizado com sucesso',
    type: AtualizarConviteResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - somente administradores',
  })
  @ApiResponse({
    status: 404,
    description: 'Convite não encontrado',
  })
  async atualizarConvite(
    @Param('id') id: string,
    @Body() atualizarConviteDto: AtualizarConviteDto,
  ): Promise<AtualizarConviteResponseDto> {
    this.logger.log(`Atualizando convite: ${id}`);
    return this.conviteService.atualizarConvite(parseInt(id, 10), atualizarConviteDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Deletar um convite (soft delete) (somente admin)' })
  @ApiResponse({
    status: 200,
    description: 'Convite deletado com sucesso',
    type: DeletarConviteResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - somente administradores',
  })
  @ApiResponse({
    status: 404,
    description: 'Convite não encontrado',
  })
  async deletarConvite(@Param('id') id: string): Promise<DeletarConviteResponseDto> {
    this.logger.log(`Deletando convite: ${id}`);
    return this.conviteService.deletarConvite(parseInt(id, 10));
  }

  @Get('validar/:hashOuSlug')
  @ApiOperation({ summary: 'Validar um convite pelo hash ou slug (público)' })
  @ApiResponse({
    status: 200,
    description: 'Convite validado com sucesso',
    type: ValidarConviteResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Convite inválido, expirado ou deletado',
  })
  @ApiResponse({
    status: 404,
    description: 'Convite não encontrado',
  })
  async validarConvite(@Param('hashOuSlug') hashOuSlug: string): Promise<ValidarConviteResponseDto> {
    this.logger.log(`Validando convite: ${hashOuSlug}`);
    return this.conviteService.validarConvite(hashOuSlug);
  }
}

