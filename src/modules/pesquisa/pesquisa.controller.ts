import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { PesquisaService } from './pesquisa.service';
import { PesquisaRequestDto } from './dto/pesquisa-request.dto';
import { PesquisaResponseDto } from './dto/pesquisa-response.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('pesquisa')
@Controller('pesquisa')
export class PesquisaController {
  constructor(
    private readonly pesquisaService: PesquisaService,
    private logger: Logger
  ) {}

  @Post()
  @ApiOperation({ summary: 'Pesquisar informações sobre um livro bíblico' })
  @ApiResponse({ 
    status: 200, 
    description: 'Retorna as informações do livro bíblico',
    type: PesquisaResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Livro não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Livro "genesis2" não encontrado' },
        sugestoes: { type: 'array', items: { type: 'string' }, example: ['Gênesis', 'Efésios', 'Neemias'] },
        error: { type: 'string', example: 'Livro não encontrado' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Capítulo inválido ou formato incorreto',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Capítulo 999 inválido para Gênesis' },
        capituloSolicitado: { type: 'number', example: 999 },
        capitulosDisponiveis: { type: 'object', properties: { min: { type: 'number' }, max: { type: 'number' } }, example: { min: 1, max: 50 } },
        error: { type: 'string', example: 'Capítulo inválido' }
      }
    }
  })
  async buscarVersiculos(@Body() pesquisaDto: PesquisaRequestDto): Promise<PesquisaResponseDto> {
    this.logger.log("Pesquisando versiculos")
    return await this.pesquisaService.buscarVersiculos(pesquisaDto);
  }
}
