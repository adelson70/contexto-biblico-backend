# Documentação de Rotas de Estatísticas - Atualizada

## Rotas de Pesquisa por Estado e Cidade

### 1. GET /stats/pesquisa-estado

Recupera os estados com mais pesquisas realizadas.

#### Query Parameters

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|-----------|------|-------------|--------|-----------|
| `top` | number | Não | 10 | Quantidade de estados a retornar |

#### Request

**Sem parâmetro `top` (retorna top 10 por padrão):**
```
GET /stats/pesquisa-estado
```

**Com parâmetro `top` customizado:**
```
GET /stats/pesquisa-estado?top=5
```

#### Response

**Status:** 200 OK

**Exemplo de resposta (sem `top` - retorna top 10):**
```json
{
  "dados": [
    {
      "estado": "SP",
      "quantidade": 245
    },
    {
      "estado": "RJ",
      "quantidade": 189
    },
    {
      "estado": "MG",
      "quantidade": 123
    },
    {
      "estado": "RS",
      "quantidade": 87
    },
    {
      "estado": "BA",
      "quantidade": 65
    },
    {
      "estado": "PR",
      "quantidade": 54
    },
    {
      "estado": "SC",
      "quantidade": 43
    },
    {
      "estado": "GO",
      "quantidade": 38
    },
    {
      "estado": "CE",
      "quantidade": 32
    },
    {
      "estado": "ES",
      "quantidade": 28
    }
  ],
  "message": "Top 10 estados com mais pesquisas recuperado com sucesso"
}
```

**Exemplo de resposta (com `top=5`):**
```json
{
  "dados": [
    {
      "estado": "SP",
      "quantidade": 245
    },
    {
      "estado": "RJ",
      "quantidade": 189
    },
    {
      "estado": "MG",
      "quantidade": 123
    },
    {
      "estado": "RS",
      "quantidade": 87
    },
    {
      "estado": "BA",
      "quantidade": 65
    }
  ],
  "message": "Top 5 estados com mais pesquisas recuperado com sucesso"
}
```

---

### 2. GET /stats/pesquisa-cidade

Recupera as cidades com mais pesquisas realizadas.

#### Query Parameters

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|-----------|------|-------------|--------|-----------|
| `top` | number | Não | 10 | Quantidade de cidades a retornar |

#### Request

**Sem parâmetro `top` (retorna top 10 por padrão):**
```
GET /stats/pesquisa-cidade
```

**Com parâmetro `top` customizado:**
```
GET /stats/pesquisa-cidade?top=20
```

#### Response

**Status:** 200 OK

**Exemplo de resposta (sem `top` - retorna top 10):**
```json
{
  "dados": [
    {
      "cidade": "São Paulo",
      "quantidade": 142
    },
    {
      "cidade": "Rio de Janeiro",
      "quantidade": 98
    },
    {
      "cidade": "Belo Horizonte",
      "quantidade": 76
    },
    {
      "cidade": "Porto Alegre",
      "quantidade": 54
    },
    {
      "cidade": "Curitiba",
      "quantidade": 48
    },
    {
      "cidade": "Brasília",
      "quantidade": 43
    },
    {
      "cidade": "Salvador",
      "quantidade": 39
    },
    {
      "cidade": "Fortaleza",
      "quantidade": 35
    },
    {
      "cidade": "Recife",
      "quantidade": 32
    },
    {
      "cidade": "Manaus",
      "quantidade": 28
    }
  ],
  "message": "Top 10 cidades com mais pesquisas recuperado com sucesso"
}
```

**Exemplo de resposta (com `top=3`):**
```json
{
  "dados": [
    {
      "cidade": "São Paulo",
      "quantidade": 142
    },
    {
      "cidade": "Rio de Janeiro",
      "quantidade": 98
    },
    {
      "cidade": "Belo Horizonte",
      "quantidade": 76
    }
  ],
  "message": "Top 3 cidades com mais pesquisas recuperado com sucesso"
}
```

---

## Resumo das Mudanças

### O que foi implementado:

1. **Parâmetro `top` opcional** - Permite limitar a quantidade de resultados retornados
2. **Valor padrão** - Se não informado, retorna os top 10 por padrão
3. **Ordenação** - Os resultados são sempre ordenados por quantidade em ordem decrescente
4. **Mensagem dinâmica** - A mensagem de resposta informa quantos resultados foram retornados
5. **Documentação Swagger** - O parâmetro está documentado automaticamente na API

### Exemplos de uso no Frontend:

```typescript
// Buscar top 10 estados (padrão)
const estados = await api.get('/stats/pesquisa-estado');

// Buscar top 5 estados
const top5Estados = await api.get('/stats/pesquisa-estado?top=5');

// Buscar top 20 cidades
const top20Cidades = await api.get('/stats/pesquisa-cidade?top=20');

// Buscar apenas a cidade mais pesquisada
const topCidade = await api.get('/stats/pesquisa-cidade?top=1');
```

### Notas importantes:

- O parâmetro `top` é opcional
- Se for informado um valor menor que 1, o padrão (10) será usado
- Os resultados são filtrados automaticamente, excluindo valores como "Localhost" e "Desconhecido"
- A rota requer autenticação JWT (Bearer token)

