import { Controller, Get, Post, UseGuards, Query, Body, BadRequestException } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { PicoPesquisaResponseDTO, PicoPesquisaSemanalResponseDTO, PicoPesquisaMensalResponseDTO, PicoPesquisaTotalResponseDTO, PicoPesquisaEstadoResponseDTO, PicoPesquisaCidadeResponseDTO, PicoPesquisaHorarioRequestDTO, PicoPesquisaHorarioResponseDTO } from './dto/pico-pesquisa.dto';
import { LivrosPesquisadosResponseDTO } from './dto/livros-pesquisados.dto';
import { LivrosCapituloPesquisadosResponseDTO } from './dto/livros-capitulo-pesquisados.dto';
import { ComentariosTotalResponseDTO, ComentariosPorLivroResponseDTO, ComentariosPorCapituloResponseDTO, ComentariosPorVersiculoResponseDTO } from './dto/livro-comentarios.dto';
import { ReferenciasTotalResponseDTO, ReferenciasPorLivroResponseDTO, ReferenciasPorCapituloResponseDTO, ReferenciasPorVersiculoResponseDTO } from './dto/livro-referencias.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiStandardResponse } from 'src/common/decorators/api-response.decorator';

@ApiTags('Estatística')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService, private logger: Logger) {}

  @Post('pesquisa-horario')
  @ApiStandardResponse(200, 'Pesquisas por horário recuperado com sucesso', PicoPesquisaHorarioResponseDTO)
  async picoPesquisa(@Body() requestData: PicoPesquisaHorarioRequestDTO): Promise<PicoPesquisaHorarioResponseDTO> {
    this.logger.log("Buscando pesquisas por horário")
    
    // Validação: data_inicio não pode ser maior que data_fim
    if (requestData.data_inicio && requestData.data_fim) {
      const dataInicio = new Date(requestData.data_inicio + 'T00:00:00.000Z');
      const dataFim = new Date(requestData.data_fim + 'T23:59:59.999Z');
      
      if (dataInicio > dataFim) {
        throw new BadRequestException('A data de início não pode ser maior que a data de fim');
      }
    }
    
    return this.statsService.picoPesquisaComPeriodo(requestData.data_inicio, requestData.data_fim)
  }

  @Get('pesquisa-semanal')
  @ApiStandardResponse(200, 'Pesquisas por semana recuperado com sucesso', PicoPesquisaSemanalResponseDTO)
  async picoPesquisaSemanal(): Promise <PicoPesquisaSemanalResponseDTO> {
    this.logger.log("Buscando pesquisas por semana")
    return this.statsService.picoPesquisaSemanal()
  }

  @Get('pesquisa-mensal')
  @ApiStandardResponse(200, 'Pesquisas por mês recuperado com sucesso', PicoPesquisaMensalResponseDTO)
  async picoPesquisaMensal(): Promise <PicoPesquisaMensalResponseDTO> {
    this.logger.log("Buscando pesquisas por mês")
    return this.statsService.picoPesquisaMensal()
  }

  @Get('pesquisa-total')
  @ApiStandardResponse(200, 'Pesquisas totais recuperado com sucesso', PicoPesquisaTotalResponseDTO)
  async picoPesquisaTotal(): Promise <PicoPesquisaTotalResponseDTO> {
    this.logger.log("Buscando pesquisas totais")
    return this.statsService.picoPesquisaTotal()
  }

  @Get('pesquisa-estado')
  @ApiStandardResponse(200, 'Pesquisas por estado recuperado com sucesso', PicoPesquisaEstadoResponseDTO)
  async picoPesquisaEstado(): Promise <PicoPesquisaEstadoResponseDTO> {
    this.logger.log("Buscando pesquisas por região")
    return this.statsService.picoPesquisaEstado()
  }

  @Get('pesquisa-cidade')
  @ApiStandardResponse(200, 'Pesquisas por cidade recuperado com sucesso', PicoPesquisaCidadeResponseDTO)
  async picoPesquisaCidade(): Promise <PicoPesquisaCidadeResponseDTO> {
    this.logger.log("Buscando pesquisas por cidade")
    return this.statsService.picoPesquisaCidade()
  }

  @Get('livros-pesquisados')
  @ApiQuery({ name: 'top', required: false, type: Number, description: 'Quantidade de livros a retornar (padrão: 10)', example: 10 })
  @ApiStandardResponse(200, 'Top N livros mais pesquisados recuperado com sucesso', LivrosPesquisadosResponseDTO)
  async livrosPesquisados(@Query('top') top?: string): Promise <LivrosPesquisadosResponseDTO> {
    const topNumber = top ? parseInt(top, 10) : 10;
    this.logger.log(`Buscando top ${topNumber} livros mais pesquisados`)
    return this.statsService.livrosPesquisados(topNumber)
  }

  @Get('livros-capitulos-pesquisados')
  @ApiQuery({ name: 'top', required: false, type: Number, description: 'Quantidade de livros e capítulos a retornar (padrão: 10)', example: 10 })
  @ApiStandardResponse(200, 'Pesquisas por livro e capitulo recuperado com sucesso', LivrosCapituloPesquisadosResponseDTO)
  async livroCapituloPesquisados(@Query('top') top?: string): Promise <LivrosCapituloPesquisadosResponseDTO> {
    const topNumber = top ? parseInt(top, 10) : 10;
    this.logger.log(`Buscando top ${topNumber} livros e capítulos mais pesquisados`)
    return this.statsService.livrosCapitulosPesquisados(topNumber)
  }

  @Get('comentarios-total')
  @ApiStandardResponse(200, 'Comentarios totais recuperado com sucesso', ComentariosTotalResponseDTO)
  async comentariosTotal(): Promise <ComentariosTotalResponseDTO> {
    this.logger.log("Buscando comentarios totais")
    return this.statsService.comentariosTotal()
  }

  @Get('comentarios-por-livro')
  @ApiQuery({ name: 'top', required: false, type: Number, description: 'Quantidade de livros a retornar (padrão: 10)', example: 10 })
  @ApiStandardResponse(200, 'Comentarios por livro recuperado com sucesso', ComentariosPorLivroResponseDTO)
  async comentariosPorLivro(@Query('top') top?: string): Promise <ComentariosPorLivroResponseDTO> {
    const topNumber = top ? parseInt(top, 10) : 10;
    this.logger.log(`Buscando top ${topNumber} livros com mais comentarios`)
    return this.statsService.comentariosPorLivro(topNumber)
  }

  @Get('comentarios-por-capitulo')
  @ApiQuery({ name: 'top', required: false, type: Number, description: 'Quantidade de livros e capítulos a retornar (padrão: 10)', example: 10 })
  @ApiStandardResponse(200, 'Comentarios por capitulo recuperado com sucesso', ComentariosPorCapituloResponseDTO)
  async comentariosPorCapitulo(@Query('top') top?: string): Promise <ComentariosPorCapituloResponseDTO> {
    const topNumber = top ? parseInt(top, 10) : 10;
    this.logger.log(`Buscando top ${topNumber} livros e capítulos com mais comentarios`)
    return this.statsService.comentariosPorCapitulo(topNumber)
  }

  @Get('comentarios-por-versiculo')
  @ApiQuery({ name: 'top', required: false, type: Number, description: 'Quantidade de livros, capítulos e versículos a retornar (padrão: 10)', example: 10 })
  @ApiStandardResponse(200, 'Comentarios por versiculo recuperado com sucesso', ComentariosPorVersiculoResponseDTO)
  async comentariosPorVersiculo(@Query('top') top?: string): Promise <ComentariosPorVersiculoResponseDTO> {
    const topNumber = top ? parseInt(top, 10) : 10;
    this.logger.log(`Buscando top ${topNumber} livros, capítulos e versículos com mais comentarios`)
    return this.statsService.comentariosPorVersiculo(topNumber)
  }

  @Get('referencias-total')
  @ApiStandardResponse(200, 'Referencias totais recuperado com sucesso', ReferenciasTotalResponseDTO)
  async referenciasTotal(): Promise <ReferenciasTotalResponseDTO> {
    this.logger.log("Buscando referencias totais")
    return this.statsService.referenciasTotal()
  }

  @Get('referencias-por-livro')
  @ApiQuery({ name: 'top', required: false, type: Number, description: 'Quantidade de livros a retornar (padrão: 10)', example: 10 })
  @ApiStandardResponse(200, 'Referencias por livro recuperado com sucesso', ReferenciasPorLivroResponseDTO)
  async referenciasPorLivro(@Query('top') top?: string): Promise <ReferenciasPorLivroResponseDTO> {
    const topNumber = top ? parseInt(top, 10) : 10;
    this.logger.log(`Buscando top ${topNumber} livros com mais referencias`)
    return this.statsService.referenciasPorLivro(topNumber)
  }

  @Get('referencias-por-capitulo')
  @ApiQuery({ name: 'top', required: false, type: Number, description: 'Quantidade de livros e capítulos a retornar (padrão: 10)', example: 10 })
  @ApiStandardResponse(200, 'Referencias por capitulo recuperado com sucesso', ReferenciasPorCapituloResponseDTO)
  async referenciasPorCapitulo(@Query('top') top?: string): Promise <ReferenciasPorCapituloResponseDTO> {
    const topNumber = top ? parseInt(top, 10) : 10;
    this.logger.log(`Buscando top ${topNumber} livros e capítulos com mais referencias`)
    return this.statsService.referenciasPorCapitulo(topNumber)
  }

  @Get('referencias-por-versiculo')
  @ApiQuery({ name: 'top', required: false, type: Number, description: 'Quantidade de livros, capítulos e versículos a retornar (padrão: 10)', example: 10 })
  @ApiStandardResponse(200, 'Referencias por versiculo recuperado com sucesso', ReferenciasPorVersiculoResponseDTO)
  async referenciasPorVersiculo(@Query('top') top?: string): Promise <ReferenciasPorVersiculoResponseDTO> {
    const topNumber = top ? parseInt(top, 10) : 10;
    this.logger.log(`Buscando top ${topNumber} livros, capítulos e versículos com mais referencias`)
    return this.statsService.referenciasPorVersiculo(topNumber)
  }

}
