import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ComentarioService } from './comentario.service';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse, ApiStandardResponse } from 'src/common/decorators/api-response.decorator';
import { CriarComentarioDTO } from './dto/comentario-criar.dto';
import { AtualizarComentarioDTO } from './dto/comentario-atualizar.dto';
import { CriarComentarioResponse } from './dto/comentario-response.dto';
import { ListarComentariosQueryDTO, ListarComentariosResponse } from './dto/comentario-listar.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import type { Request } from 'express';

@ApiTags('Comentário')
@Controller('comentario')
export class ComentarioController {
  constructor(private readonly comentarioService: ComentarioService) {}
  private readonly logger = new Logger(ComentarioController.name);

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar comentários com paginação. Filtra por livro se fornecido.' })
  @ApiStandardResponse(200, 'Comentários listados com sucesso', ListarComentariosResponse)
  @ApiErrorResponse(400, 'Dados inválidos')
  @ApiErrorResponse(401, 'Não autenticado')
  async listarComentarios(
    @Query() queryDto: ListarComentariosQueryDTO,
    @Req() request: Request,
  ): Promise<ListarComentariosResponse> {
    const user = request.user as any;
    this.logger.log(`Listando comentários${queryDto.livro ? ` para livro: ${queryDto.livro}` : ''}`)
    return this.comentarioService.listarComentariosPorLivro(queryDto, user.userId, user.isAdmin)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Criar um comentario' })
  @ApiStandardResponse(201, 'Comentario criado com sucesso', CriarComentarioResponse)
  @ApiErrorResponse(400, 'Dados inválidos')
  @ApiErrorResponse(401, 'Não autenticado')
  async criarComentario(
    @Body() comentarioDto: CriarComentarioDTO,
    @Req() request: Request,
  ): Promise <CriarComentarioResponse> {
    const user = request.user as any;
    // Garantir que isAdmin seja boolean explicitamente
    const isAdmin = user.isAdmin === true || user.isAdmin === 'true' || String(user.isAdmin).toLowerCase() === 'true';
    this.logger.log(`Criando comentario - isAdmin: ${isAdmin}, user.isAdmin: ${user.isAdmin}, type: ${typeof user.isAdmin}`)
    return this.comentarioService.criarComentario(comentarioDto, user.userId, isAdmin)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Deletar um comentario' })
  @ApiStandardResponse(200, 'Comentario deletado com sucesso')
  @ApiErrorResponse(400, 'Dados inválidos')
  @ApiErrorResponse(401, 'Não autenticado')
  @ApiErrorResponse(404, 'Comentario não encontrada')
  async deletarComentario(@Param('id') id: string, @Req() request: Request): Promise<void> {
    const user = request.user as any;
    this.logger.log("Deletando comentario")
    return this.comentarioService.deletarComentario(id, user.userId, user.isAdmin)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualizar um comentario' })
  @ApiStandardResponse(200, 'Comentario atualizado com sucesso')
  @ApiErrorResponse(400, 'Dados inválidos')
  @ApiErrorResponse(401, 'Não autenticado')
  @ApiErrorResponse(404, 'Comentario não encontrada')
  async atualizarComentario(
    @Param('id') id: string, 
    @Body() comentarioDto: AtualizarComentarioDTO,
    @Req() request: Request,
  ): Promise<void> {
    const user = request.user as any;
    this.logger.log("Atualizando comentario")
    return this.comentarioService.atualizarComentario(id, comentarioDto, user.userId, user.isAdmin)
  }

  @Post('sugestao')
  @ApiOperation({ summary: 'Criar uma sugestão de comentário (anônimo)' })
  @ApiStandardResponse(201, 'Sugestão de comentário criada com sucesso', CriarComentarioResponse)
  @ApiErrorResponse(400, 'Dados inválidos')
  async sugerirComentario(
    @Body() comentarioDto: CriarComentarioDTO,
  ): Promise<CriarComentarioResponse> {
    this.logger.log("Criando sugestão de comentário anônimo")
    return this.comentarioService.criarComentario(comentarioDto, 0, false)
  }
}
