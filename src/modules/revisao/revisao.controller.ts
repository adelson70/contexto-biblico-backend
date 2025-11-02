import { Controller, Get, Patch, Query, Param, Body, Req, UseGuards, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RevisaoService } from './revisao.service';
import { 
  ListarRevisaoQueryDTO, 
  ListarRevisaoResponse,
  TipoRevisaoEnum 
} from './dto/listar-revisao.dto';
import { ObterRevisaoResponse } from './dto/obter-revisao.dto';
import { AprovarRevisaoDTO, AprovarRevisaoResponse } from './dto/aprovar-revisao.dto';
import { ReprovarRevisaoDTO, ReprovarRevisaoResponse } from './dto/reprovar-revisao.dto';
import { AtualizarComentarioRevisaoDTO, AtualizarReferenciaRevisaoDTO, AtualizarRevisaoResponse } from './dto/atualizar-revisao.dto';
import { AdminGuard } from '../../guards/admin.guard';
import { ApiStandardResponse, ApiErrorResponse } from '../../common/decorators/api-response.decorator';
import type { Request } from 'express';

@ApiTags('Revisão')
@Controller('revisao')
@UseGuards(AdminGuard)
@ApiBearerAuth('JWT-auth')
export class RevisaoController {
  constructor(private readonly revisaoService: RevisaoService) {}
  private readonly logger = new Logger(RevisaoController.name);

  @Get()
  @ApiOperation({ summary: 'Listar revisões com filtros e paginação' })
  @ApiStandardResponse(200, 'Revisões listadas com sucesso', ListarRevisaoResponse)
  @ApiErrorResponse(400, 'Dados inválidos')
  @ApiErrorResponse(401, 'Não autenticado')
  @ApiErrorResponse(403, 'Acesso negado - apenas administradores')
  async listarRevisoes(
    @Query() queryDto: ListarRevisaoQueryDTO,
  ): Promise<ListarRevisaoResponse> {
    this.logger.log('Listando revisões');
    return this.revisaoService.listarRevisoes(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de uma revisão por ID' })
  @ApiQuery({ name: 'tipo', enum: TipoRevisaoEnum, description: 'Tipo da revisão', required: true })
  @ApiStandardResponse(200, 'Revisão obtida com sucesso', ObterRevisaoResponse)
  @ApiErrorResponse(400, 'Dados inválidos')
  @ApiErrorResponse(401, 'Não autenticado')
  @ApiErrorResponse(403, 'Acesso negado - apenas administradores')
  @ApiErrorResponse(404, 'Revisão não encontrada')
  async obterRevisao(
    @Param('id') id: string,
    @Query('tipo') tipo: TipoRevisaoEnum,
  ): Promise<ObterRevisaoResponse> {
    this.logger.log(`Obtendo revisão ${id} do tipo ${tipo}`);
    return this.revisaoService.obterRevisaoPorId(parseInt(id), tipo);
  }

  @Patch(':id/aprovar')
  @ApiOperation({ summary: 'Aprovar uma revisão e publicar o conteúdo' })
  @ApiQuery({ name: 'tipo', enum: TipoRevisaoEnum, description: 'Tipo da revisão', required: true })
  @ApiStandardResponse(200, 'Revisão aprovada com sucesso', AprovarRevisaoResponse)
  @ApiErrorResponse(400, 'Dados inválidos ou revisão já foi revisada')
  @ApiErrorResponse(401, 'Não autenticado')
  @ApiErrorResponse(403, 'Acesso negado - apenas administradores')
  @ApiErrorResponse(404, 'Revisão não encontrada')
  async aprovarRevisao(
    @Param('id') id: string,
    @Query('tipo') tipo: TipoRevisaoEnum,
    @Body() dto: AprovarRevisaoDTO,
    @Req() request: Request,
  ): Promise<AprovarRevisaoResponse> {
    const user = request.user as any;
    this.logger.log(`Aprovando revisão ${id} do tipo ${tipo}`);
    return this.revisaoService.aprovarRevisao(parseInt(id), tipo, dto, user.userId);
  }

  @Patch(':id/reprovar')
  @ApiOperation({ summary: 'Reprovar uma revisão' })
  @ApiQuery({ name: 'tipo', enum: TipoRevisaoEnum, description: 'Tipo da revisão', required: true })
  @ApiStandardResponse(200, 'Revisão reprovada com sucesso', ReprovarRevisaoResponse)
  @ApiErrorResponse(400, 'Dados inválidos ou revisão já foi revisada')
  @ApiErrorResponse(401, 'Não autenticado')
  @ApiErrorResponse(403, 'Acesso negado - apenas administradores')
  @ApiErrorResponse(404, 'Revisão não encontrada')
  async reprovarRevisao(
    @Param('id') id: string,
    @Query('tipo') tipo: TipoRevisaoEnum,
    @Body() dto: ReprovarRevisaoDTO,
    @Req() request: Request,
  ): Promise<ReprovarRevisaoResponse> {
    const user = request.user as any;
    this.logger.log(`Reprovando revisão ${id} do tipo ${tipo}`);
    return this.revisaoService.reprovarRevisao(parseInt(id), tipo, dto, user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar conteúdo de uma revisão antes da aprovação' })
  @ApiQuery({ name: 'tipo', enum: TipoRevisaoEnum, description: 'Tipo da revisão', required: true })
  @ApiStandardResponse(200, 'Revisão atualizada com sucesso', AtualizarRevisaoResponse)
  @ApiErrorResponse(400, 'Dados inválidos ou revisão já foi revisada')
  @ApiErrorResponse(401, 'Não autenticado')
  @ApiErrorResponse(403, 'Acesso negado - apenas administradores')
  @ApiErrorResponse(404, 'Revisão não encontrada')
  async atualizarRevisao(
    @Param('id') id: string,
    @Query('tipo') tipo: TipoRevisaoEnum,
    @Body() dto: AtualizarComentarioRevisaoDTO | AtualizarReferenciaRevisaoDTO,
  ): Promise<AtualizarRevisaoResponse> {
    this.logger.log(`Atualizando revisão ${id} do tipo ${tipo}`);
    return this.revisaoService.atualizarRevisao(parseInt(id), tipo, dto);
  }
}
