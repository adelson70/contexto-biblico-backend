import { Controller, Get, Post, Body, Logger, UseInterceptors } from '@nestjs/common';
import { PesquisaService } from './pesquisa.service';
import { PesquisaRequestDto } from './dto/pesquisa-request.dto';
import { PesquisaResponseDto } from './dto/pesquisa-response.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiStandardResponse, ApiErrorResponse } from '../../common/decorators/api-response.decorator';
import { RegistroPesquisaInterceptor } from '../../common/interceptors/registro-pesquisa.interceptor';

@ApiTags('pesquisa')
@Controller('pesquisa')
export class PesquisaController {
  constructor(
    private readonly pesquisaService: PesquisaService,
    private logger: Logger
  ) {}

  @Post()
  @UseInterceptors(RegistroPesquisaInterceptor)
  @ApiOperation({ summary: 'Pesquisar informações sobre um livro bíblico' })
  @ApiStandardResponse(200, 'Pesquisa recuperado com sucesso', PesquisaResponseDto)
  @ApiErrorResponse(
    404,
    'Livro não encontrado',
    { sugestoes: ['Gênesis', 'Efésios', 'Neemias'] }
  )
  @ApiErrorResponse(
    400,
    'Capítulo inválido ou formato incorreto',
    { 
      capituloSolicitado: 999,
      capitulosDisponiveis: { min: 1, max: 50 }
    }
  )
  async buscarVersiculos(@Body() pesquisaDto: PesquisaRequestDto): Promise<PesquisaResponseDto> {
    this.logger.log("Pesquisando versiculos")
    return await this.pesquisaService.buscarVersiculos(pesquisaDto);
  }
}
