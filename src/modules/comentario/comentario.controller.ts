import { Body, Controller, Delete, Logger, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ComentarioService } from './comentario.service';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApiErrorResponse, ApiStandardResponse } from 'src/common/decorators/api-response.decorator';
import { CriarComentarioDTO } from './dto/comentario-criar.dto';
import { AtualizarComentarioDTO } from './dto/comentario-atualizar.dto';
import { CriarComentarioResponse } from './dto/comentario-response.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiTags('comentario')
@Controller('comentario')
export class ComentarioController {
  constructor(private readonly comentarioService: ComentarioService) {}
  private readonly logger = new Logger(ComentarioController.name);

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Criar um comentario' })
  @ApiStandardResponse(201, 'Comentario criado com sucesso', CriarComentarioResponse)
  @ApiErrorResponse(400, 'Dados inválidos')
  @ApiErrorResponse(401, 'Não autenticado')
  async criarComentario(
    @Body() comentarioDto: CriarComentarioDTO
  ): Promise <CriarComentarioResponse> {
    this.logger.log("Criando comentario")
    return this.comentarioService.criarComentario(comentarioDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Deletar um comentario' })
  @ApiStandardResponse(200, 'Comentario deletado com sucesso')
  @ApiErrorResponse(400, 'Dados inválidos')
  @ApiErrorResponse(401, 'Não autenticado')
  @ApiErrorResponse(404, 'Comentario não encontrada')
  async deletarComentario(@Param('id') id: string): Promise<void> {
    this.logger.log("Deletando comentario")
    return this.comentarioService.deletarComentario(id)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualizar um comentario' })
  @ApiStandardResponse(200, 'Comentario atualizado com sucesso')
  @ApiErrorResponse(400, 'Dados inválidos')
  @ApiErrorResponse(401, 'Não autenticado')
  @ApiErrorResponse(404, 'Comentario não encontrada')
  async atualizarComentario(@Param('id') id: string, @Body() comentarioDto: AtualizarComentarioDTO): Promise<void> {
    this.logger.log("Atualizando comentario")
    return this.comentarioService.atualizarComentario(id, comentarioDto)
  }
}
