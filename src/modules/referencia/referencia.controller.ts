import { Controller, Body, Post, Patch, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ReferenciaService } from './referencia.service';
import { CriarReferenciaDTO } from './dto/referencia-criar.dto';
import { CriarReferenciaResponse } from './dto/referencia-response.dto';
import { ListarReferenciasDTO } from './dto/listar-referencias.dto';
import { ListarReferenciasResponseDTO } from './dto/listar-referencias-response.dto';
import { VincularReferenciaDTO } from './dto/vincular-referencia.dto';
import { VincularReferenciaResponseDTO } from './dto/vincular-referencia-response.dto';
import { DesvincularReferenciaResponseDTO } from './dto/desvincular-referencia-response.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { ApiStandardResponse, ApiErrorResponse } from '../../common/decorators/api-response.decorator';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiTags('Referência')
@Controller('referencia')
export class ReferenciaController {
  constructor(private readonly referenciaService: ReferenciaService, private logger: Logger) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Criar uma referência' })
  @ApiStandardResponse(201, 'Referência criada com sucesso', CriarReferenciaResponse)
  @ApiErrorResponse(400, 'Dados inválidos')
  @ApiErrorResponse(401, 'Não autenticado')
  async criarReferencia(
    @Body() referenciaDto: CriarReferenciaDTO
  ): Promise <CriarReferenciaResponse> {
    this.logger.log("Criando referência")
    return this.referenciaService.criarReferencia(referenciaDto)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar referências' })
  @ApiStandardResponse(200, 'Referências recuperadas com sucesso', ListarReferenciasResponseDTO)
  @ApiErrorResponse(401, 'Não autenticado')
  async listarReferencias(
    @Query() query: ListarReferenciasDTO
  ): Promise<ListarReferenciasResponseDTO> {
    this.logger.log("Listando referências")
    return this.referenciaService.listarReferencias(query)
  }

  @Post('vincular')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Vincular uma referência' })
  @ApiStandardResponse(201, 'Referência vinculada com sucesso', VincularReferenciaResponseDTO)
  @ApiErrorResponse(400, 'Dados inválidos')
  @ApiErrorResponse(401, 'Não autenticado')
  async vincularReferencia(
    @Body() referenciaDto: VincularReferenciaDTO
  ): Promise<VincularReferenciaResponseDTO> {
    this.logger.log("Vinculando referência")
    return this.referenciaService.vincularReferencia(referenciaDto)
  }

  @Patch(':id/desvincular')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Desvincular uma referência' })
  @ApiStandardResponse(200, 'Referência desvinculada com sucesso', DesvincularReferenciaResponseDTO)
  @ApiErrorResponse(400, 'Dados inválidos')
  @ApiErrorResponse(401, 'Não autenticado')
  @ApiErrorResponse(404, 'Referência não encontrada')
  async desvincularReferencia(@Param('id') id: string): Promise<DesvincularReferenciaResponseDTO> {
    this.logger.log("Desvinculando referência")
    return this.referenciaService.desvincularReferencia(id)
  }
}
