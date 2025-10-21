import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsInt, IsPositive, IsDateString, ValidateIf } from "class-validator";
import { Type } from "class-transformer";
import { Optional } from "@nestjs/common";


class HorarioPesquisaDTO {
  @ApiProperty({
    description: 'Horário do dia (00 a 23)',
    example: '14',
    type: String,
  })
  horario: string;

  @ApiProperty({
    description: 'Quantidade de pesquisas neste horário',
    example: 42,
    type: Number,
  })
  quantidade: number;
}

export class PicoPesquisaResponseDTO {
  @ApiProperty({
    description: 'Array de objetos contendo horários (00-23) e suas respectivas quantidades de pesquisas',
    type: [HorarioPesquisaDTO],
    example: [
      { horario: '00', quantidade: 5 },
      { horario: '01', quantidade: 12 },
      { horario: '02', quantidade: 3 },
      { horario: '14', quantidade: 45 },
      { horario: '23', quantidade: 8 },
    ],
  })
  dados: HorarioPesquisaDTO[];

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Pico de horário de pesquisa recuperado com sucesso',
  })
  @Optional()
  message?: string;
}

class DiaPesquisaDTO {
  @ApiProperty({
    description: 'Dia da semana',
    example: 'Segunda-feira',
    type: String,
  })
  dia: string;

  @ApiProperty({
    description: 'Quantidade de pesquisas neste dia',
    example: 42,
    type: Number,
  })
  quantidade: number;
}

export class PicoPesquisaSemanalResponseDTO {
  @ApiProperty({
    description: 'Array de objetos contendo dias da semana e suas respectivas quantidades de pesquisas',
    type: [DiaPesquisaDTO],
    example: [
      { dia: 'Segunda-feira', quantidade: 5 },
      { dia: 'Terça-feira', quantidade: 12 },
      { dia: 'Quarta-feira', quantidade: 3 },
      { dia: 'Quinta-feira', quantidade: 45 },
      { dia: 'Sexta-feira', quantidade: 8 },
    ],
  })
  dados: DiaPesquisaDTO[];

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Pico de semana de pesquisa recuperado com sucesso',
  })
  @Optional()
  message?: string;
}

class MesPesquisaDTO {
  @ApiProperty({
    description: 'Mês do ano',
    example: 'Janeiro',
    type: String,
  })
  mes: string;

  @ApiProperty({
    description: 'Quantidade de pesquisas neste mês',
    example: 150,
    type: Number,
  })
  quantidade: number;
}

export class PicoPesquisaMensalResponseDTO {
  @ApiProperty({
    description: 'Array de objetos contendo meses do ano e suas respectivas quantidades de pesquisas',
    type: [MesPesquisaDTO],
    example: [
      { mes: 'Janeiro', quantidade: 120 },
      { mes: 'Fevereiro', quantidade: 95 },
      { mes: 'Março', quantidade: 145 },
      { mes: 'Abril', quantidade: 87 },
      { mes: 'Maio', quantidade: 203 },
    ],
  })
  dados: MesPesquisaDTO[];

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Pico mensal de pesquisa recuperado com sucesso',
  })
  @Optional()
  message?: string;
}

export class PicoPesquisaTotalResponseDTO {
  @ApiProperty({
    description: 'Quantidade total de pesquisas realizadas',
    example: 1523,
    type: Number,
  })
  total: number;

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Pesquisas totais recuperado com sucesso',
  })
  @Optional()
  message?: string;
}

class EstadoPesquisaDTO {
  @ApiProperty({
    description: 'Estado',
    example: 'SP',
    type: String,
  })
  estado: string;

  @ApiProperty({
    description: 'Quantidade de pesquisas neste estado',
    example: 245,
    type: Number,
  })
  quantidade: number;
}

export class PicoPesquisaEstadoResponseDTO {
  @ApiProperty({
    description: 'Array de objetos contendo estados e suas respectivas quantidades de pesquisas',
    type: [EstadoPesquisaDTO],
    example: [
      { estado: 'SP', quantidade: 245 },
      { estado: 'RJ', quantidade: 189 },
      { estado: 'MG', quantidade: 123 },
      { estado: 'RS', quantidade: 87 },
    ],
  })
  dados: EstadoPesquisaDTO[];

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Pesquisas por estado recuperado com sucesso',
  })
  @Optional()
  message?: string;
}

class CidadePesquisaDTO {
  @ApiProperty({
    description: 'Cidade',
    example: 'São Paulo',
    type: String,
  })
  cidade: string;

  @ApiProperty({
    description: 'Quantidade de pesquisas nesta cidade',
    example: 142,
    type: Number,
  })
  quantidade: number;
}

export class PicoPesquisaCidadeResponseDTO {
  @ApiProperty({
    description: 'Array de objetos contendo cidades e suas respectivas quantidades de pesquisas',
    type: [CidadePesquisaDTO],
    example: [
      { cidade: 'São Paulo', quantidade: 142 },
      { cidade: 'Rio de Janeiro', quantidade: 98 },
      { cidade: 'Belo Horizonte', quantidade: 76 },
      { cidade: 'Porto Alegre', quantidade: 54 },
    ],
  })
  dados: CidadePesquisaDTO[];

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Pesquisas por cidade recuperado com sucesso',
  })
  @Optional()
  message?: string;
}

export class PicoPesquisaHorarioRequestDTO {
  @ApiProperty({
    description: 'Data de início do período (formato YYYY-MM-DD)',
    example: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    type: String,
    required: false,
  })
  @IsDateString({}, { message: 'data_inicio deve ser uma data válida no formato ISO 8601' })
  @ValidateIf((o) => o.data_inicio !== undefined)
  data_inicio?: string;

  @ApiProperty({
    description: 'Data de fim do período (formato YYYY-MM-DD)',
    example: new Date().toISOString().split('T')[0],
    type: String,
    required: false,
  })
  @IsDateString({}, { message: 'data_fim deve ser uma data válida no formato ISO 8601' })
  @ValidateIf((o) => o.data_fim !== undefined)
  data_fim?: string;
}

export class PicoPesquisaHorarioResponseDTO {
  @ApiProperty({
    description: 'Array de objetos contendo horários (00-23) e suas respectivas quantidades de pesquisas',
    type: [HorarioPesquisaDTO],
    example: [
      { horario: '00', quantidade: 5 },
      { horario: '01', quantidade: 12 },
      { horario: '02', quantidade: 3 },
      { horario: '14', quantidade: 45 },
      { horario: '23', quantidade: 8 },
    ],
  })
  dados: HorarioPesquisaDTO[];

  @ApiProperty({
    description: 'Quantidade total de pesquisas no período especificado',
    example: 1250,
    type: Number,
  })
  total_periodo: number;

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Pico de horário de pesquisa recuperado com sucesso',
  })
  @Optional()
  message?: string;
}