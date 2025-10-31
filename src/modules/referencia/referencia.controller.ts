import { Controller, Body, Post, Patch, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
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
import { Request } from 'express';

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
    @Body() referenciaDto: CriarReferenciaDTO,
    @Req() request: Request,
  ): Promise <CriarReferenciaResponse> {
    const user = request.user as any;
    this.logger.log("Criando referência")
    return this.referenciaService.criarReferencia(referenciaDto, user.userId, user.isAdmin)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar referências' })
  @ApiStandardResponse(200, 'Referências recuperadas com sucesso', ListarReferenciasResponseDTO)
  @ApiErrorResponse(401, 'Não autenticado')
  async listarReferencias(
    @Query() query: ListarReferenciasDTO,
    @Req() request: Request,
  ): Promise<ListarReferenciasResponseDTO> {
    const user = request.user as any;
    this.logger.log("Listando referências")
    return this.referenciaService.listarReferencias(query, user.userId, user.isAdmin)
  }

  @Post('vincular')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Vincular uma referência' })
  @ApiStandardResponse(201, 'Referência vinculada com sucesso', VincularReferenciaResponseDTO)
  @ApiErrorResponse(400, 'Dados inválidos')
  @ApiErrorResponse(401, 'Não autenticado')
  async vincularReferencia(
    @Body() referenciaDto: VincularReferenciaDTO,
    @Req() request: Request,
  ): Promise<VincularReferenciaResponseDTO> {
    const user = request.user as any;
    this.logger.log("Vinculando referência")
    return this.referenciaService.vincularReferencia(referenciaDto, user.userId, user.isAdmin)
  }

  @Patch(':id/desvincular')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Desvincular uma referência' })
  @ApiStandardResponse(200, 'Referência desvinculada com sucesso', DesvincularReferenciaResponseDTO)
  @ApiErrorResponse(400, 'Dados inválidos')
  @ApiErrorResponse(401, 'Não autenticado')
  @ApiErrorResponse(404, 'Referência não encontrada')
  async desvincularReferencia(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<DesvincularReferenciaResponseDTO> {
    const user = request.user as any;
    this.logger.log("Desvinculando referência")
    return this.referenciaService.desvincularReferencia(id, user.userId, user.isAdmin)
  }
}
