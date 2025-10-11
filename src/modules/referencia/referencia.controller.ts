import { Controller, Body, Post, Delete, Param } from '@nestjs/common';
import { ReferenciaService } from './referencia.service';
import { CriarReferenciaDTO } from './dto/referencia-criar.dto';
import { CriarReferenciaResponse } from './dto/referencia-response.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { ApiStandardResponse, ApiErrorResponse } from '../../common/decorators/api-response.decorator';

@ApiTags('referencia')
@Controller('referencia')
export class ReferenciaController {
  constructor(private readonly referenciaService: ReferenciaService, private logger: Logger) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma referência' })
  @ApiStandardResponse(201, 'Referência criada com sucesso', CriarReferenciaResponse)
  @ApiErrorResponse(400, 'Dados inválidos')
  async criarReferencia(
    @Body() referenciaDto: CriarReferenciaDTO
  ): Promise <CriarReferenciaResponse> {
    this.logger.log("Criando referência")
    return this.referenciaService.criarReferencia(referenciaDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar uma referência' })
  @ApiStandardResponse(200, 'Referência deletada com sucesso')
  @ApiErrorResponse(400, 'Dados inválidos')
  @ApiErrorResponse(404, 'Referência não encontrada')
  async deletarReferencia(@Param('id') id: string): Promise<void> {
    this.logger.log("Deletando referência")
    return this.referenciaService.deletarReferencia(id)
  }
}
