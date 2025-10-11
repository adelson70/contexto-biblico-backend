# Padronização de Respostas da API

Este diretório contém os componentes centrais para padronização de respostas da API.

## Estrutura

```
common/
├── interfaces/
│   └── api-response.interface.ts    # Interface padrão de resposta
├── interceptors/
│   └── response.interceptor.ts      # Interceptor para respostas de sucesso
├── filters/
│   └── http-exception.filter.ts     # Filter para respostas de erro
└── decorators/
    └── api-response.decorator.ts    # Decoradores para documentação Swagger
```

## Padrão de Resposta

Todas as respostas da API seguem o seguinte formato:

```typescript
{
  status: number,      // Código HTTP (200, 201, 400, 404, etc.)
  message: string,     // Mensagem descritiva
  data: any           // Dados da resposta (ou null para erros)
}
```

## Exemplos

### Resposta de Sucesso - POST /referencia

```json
{
  "status": 201,
  "message": "Referência criada com sucesso",
  "data": {
    "id": 1,
    "referencia": "João 1:1",
    "livroSlug": "joao",
    "capitulo": 1,
    "versiculo": 1
  }
}
```

### Resposta de Sucesso - DELETE /referencia/:id

```json
{
  "status": 200,
  "message": "Referência deletada com sucesso",
  "data": null
}
```

### Resposta de Sucesso - POST /pesquisa

```json
{
  "status": 200,
  "message": "Pesquisa recuperado com sucesso",
  "data": {
    "livro": "Gênesis",
    "abreviacao": "gn",
    "capitulo": 1,
    "versiculos": [
      {
        "numero": 1,
        "texto": "No princípio Deus criou os céus e a terra.",
        "comentarios": [],
        "referencias": []
      }
    ],
    "totalVersiculos": 31
  }
}
```

### Resposta de Erro - Livro não encontrado

```json
{
  "status": 404,
  "message": "Livro \"genesis2\" não encontrado",
  "data": {
    "sugestoes": ["Gênesis", "Efésios", "Neemias"]
  }
}
```

### Resposta de Erro - Capítulo inválido

```json
{
  "status": 400,
  "message": "Capítulo 999 inválido para Gênesis",
  "data": {
    "capituloSolicitado": 999,
    "capitulosDisponiveis": {
      "min": 1,
      "max": 50
    }
  }
}
```

### Resposta de Erro - Validação

```json
{
  "status": 400,
  "message": "livro should not be empty, capitulo should not be empty",
  "data": null
}
```

## Como Usar

### Em Controllers

O padrão é aplicado automaticamente. Basta retornar os dados normalmente:

```typescript
@Post()
async criarReferencia(@Body() dto: CriarReferenciaDTO) {
  return this.service.criarReferencia(dto);
}
```

### Documentação Swagger

Use os decoradores customizados:

```typescript
import { ApiStandardResponse, ApiErrorResponse } from '../../common/decorators/api-response.decorator';

@Post()
@ApiOperation({ summary: 'Criar uma referência' })
@ApiStandardResponse(201, 'Referência criada com sucesso', CriarReferenciaResponse)
@ApiErrorResponse(400, 'Dados inválidos')
async criarReferencia(@Body() dto: CriarReferenciaDTO) {
  return this.service.criarReferencia(dto);
}
```

### Exceções

Exceções customizadas funcionam automaticamente. Basta lançá-las:

```typescript
throw new HttpException(
  {
    statusCode: HttpStatus.NOT_FOUND,
    message: 'Livro não encontrado',
    sugestoes: ['Gênesis', 'Êxodo']  // Dados extras vão para 'data'
  },
  HttpStatus.NOT_FOUND
);
```

## Componentes

### ResponseInterceptor

- Intercepta todas as respostas bem-sucedidas
- Envolve os dados no padrão `{ status, message, data }`
- Gera mensagens dinâmicas baseadas no método HTTP e rota

### HttpExceptionFilter

- Captura todas as `HttpException`
- Padroniza respostas de erro
- Extrai dados extras das exceções para o campo `data`

### ApiStandardResponse / ApiErrorResponse

- Decoradores para documentação Swagger
- Documentam o novo padrão de resposta
- Mantêm a documentação consistente

