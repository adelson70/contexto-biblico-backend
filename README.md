# Contexto Bíblico - Backend API

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)

API REST para consulta da Bíblia (versão NVI) com recursos avançados de anotações, referências cruzadas e análise estatística de uso.

## Sobre o Projeto

O **Contexto Bíblico** é uma plataforma backend desenvolvida para fornecer acesso à Bíblia Sagrada na versão Nova Versão Internacional (NVI), permitindo que usuários consultem versículos, adicionem comentários pessoais, criem referências cruzadas entre passagens e visualizem estatísticas detalhadas sobre o uso da plataforma.

### Principais Funcionalidades

- **Consulta de Versículos Bíblicos**: Busca completa por livro, capítulo e versículo na Bíblia NVI
- **Sistema de Comentários**: Criação, edição e exclusão de comentários em versículos específicos
- **Referências Cruzadas**: Relacionamento entre passagens bíblicas para estudo aprofundado
- **Autenticação Segura**: Sistema de autenticação JWT com refresh tokens em cookies HttpOnly
- **Estatísticas Avançadas**: 
  - Análise temporal (horário, semanal, mensal)
  - Análise geográfica (por estado e cidade)
  - Livros e capítulos mais pesquisados
  - Comentários e referências mais frequentes
- **Geolocalização**: Rastreamento automático de localização dos usuários via IP

## Tecnologias e Arquitetura

### Stack Principal

- **[NestJS](https://nestjs.com/)**: Framework Node.js progressivo para aplicações server-side
- **[TypeScript](https://www.typescriptlang.org/)**: Superset JavaScript com tipagem estática
- **[Prisma](https://www.prisma.io/)**: ORM moderno para TypeScript e Node.js
- **[PostgreSQL](https://www.postgresql.org/)**: Banco de dados relacional robusto

### Dependências Importantes

- **@nestjs/passport** & **passport-jwt**: Autenticação baseada em JWT
- **@nestjs/swagger**: Documentação automática da API
- **bcrypt**: Hash seguro de senhas
- **geoip-lite**: Geolocalização por endereço IP
- **cookie-parser**: Gerenciamento de cookies para refresh tokens
- **class-validator** & **class-transformer**: Validação e transformação de DTOs

### Padrões e Boas Práticas

- **Guards**: Proteção de rotas com autenticação JWT
- **Interceptors**: Padronização de respostas e registro de pesquisas
- **Filters**: Tratamento global de exceções
- **DTOs**: Validação e documentação de dados de entrada/saída
- **Decorators customizados**: Documentação automática com Swagger

## Módulos da API

### Auth (Autenticação)
Gerenciamento completo de usuários e sessões:
- Criação de usuários (restrito a administradores)
- Login com geração de access token e refresh token
- Renovação automática de tokens
- Logout com limpeza de sessão
- Exclusão de usuários (soft delete)

### Pesquisa
Consulta de versículos bíblicos:
- Busca por livro, capítulo e versículo
- Sugestões de livros similares em caso de erro
- Validação de capítulos e versículos disponíveis
- Registro automático de pesquisas com geolocalização

### Comentário
CRUD completo de comentários:
- Adicionar comentários a versículos específicos
- Atualizar comentários existentes
- Excluir comentários (soft delete)
- Proteção com autenticação JWT

### Referência
Gerenciamento de referências cruzadas:
- Criar referências entre passagens bíblicas
- Excluir referências (soft delete)
- Proteção com autenticação JWT

### Stats (Estatísticas)
Análises detalhadas de uso da plataforma (requer autenticação):
- Pesquisas por horário, dia da semana e mês
- Total de pesquisas realizadas
- Distribuição geográfica (estados e cidades)
- Top N livros, capítulos e versículos mais pesquisados
- Estatísticas de comentários e referências

## Configuração para Desenvolvimento

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **PostgreSQL** (versão 14 ou superior)
- **npm** ou **yarn**

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd contexto-biblico-backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/contexto_biblico"

# JWT
JWT_SECRET="sua-chave-secreta-para-jwt"
JWT_REFRESH_SECRET="sua-chave-secreta-para-refresh-token"

# Servidor
PORT=5000
NODE_ENV=development

# Frontend (CORS)
FRONTEND_URL="http://localhost:3000"
```

4. Configure o banco de dados com Prisma:

```bash
# Gerar o Prisma Client
npm run prisma:generate

# Executar as migrations
npm run prisma:migrate

# (Opcional) Abrir o Prisma Studio para visualizar os dados
npm run prisma:studio
```

5. Execute a aplicação:

```bash
# Modo desenvolvimento (com hot-reload)
npm run start:dev

# Modo debug
npm run start:debug

# Modo produção
npm run build
npm run start:prod
```

A API estará disponível em `http://localhost:5000`

## Documentação da API

A documentação completa da API está disponível via **Swagger UI** após iniciar o servidor:

**URL**: [http://localhost:5000/docs](http://localhost:5000/docs)

### Autenticação

A API utiliza dois métodos de autenticação:

1. **Bearer Token (JWT)**: Access token enviado no header `Authorization: Bearer <token>`
2. **Cookie HttpOnly**: Refresh token armazenado automaticamente em cookie seguro

Para testar a API via Swagger:
1. Faça login através do endpoint `/auth/login`
2. Copie o `accessToken` retornado
3. Clique no botão "Authorize" no Swagger
4. Cole o token e clique em "Authorize"

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run start          # Iniciar em modo normal
npm run start:dev      # Iniciar com hot-reload
npm run start:debug    # Iniciar em modo debug

# Build
npm run build          # Compilar para produção

# Testes
npm run test           # Executar testes unitários
npm run test:watch     # Executar testes em modo watch
npm run test:cov       # Executar testes com cobertura
npm run test:e2e       # Executar testes end-to-end

# Código
npm run format         # Formatar código com Prettier
npm run lint           # Verificar e corrigir problemas com ESLint

# Prisma
npm run prisma:generate  # Gerar Prisma Client
npm run prisma:migrate   # Executar migrations
npm run prisma:deploy    # Deploy de migrations (produção)
npm run prisma:studio    # Abrir Prisma Studio

# Utilitários
npm run normalizar:livros  # Normalizar dados históricos
```

## Estrutura do Banco de Dados

### Modelos Principais

#### usuarios
Armazena informações dos usuários do sistema:
- Dados pessoais (email, nome, senha hash)
- Controle de permissões (is_admin)
- Refresh token para autenticação
- Soft delete (isDeleted)

#### pesquisas
Registra todas as consultas realizadas na Bíblia:
- Livro, capítulo e versículo pesquisados
- Dados de geolocalização (IP, cidade, estado)
- Timestamp da pesquisa

#### comentarios
Armazena comentários dos usuários em versículos:
- Referência do versículo (livro, capítulo, versículo)
- Texto do comentário
- Timestamps de criação e atualização
- Soft delete (isDeleted)

#### referencias
Armazena referências cruzadas entre passagens:
- Referência do versículo (livro, capítulo, versículo)
- Passagem relacionada
- Timestamps de criação e atualização
- Soft delete (isDeleted)

## Estrutura do Projeto

```
src/
├── common/                    # Módulos compartilhados
│   ├── decorators/           # Decorators customizados
│   ├── filters/              # Exception filters
│   ├── interceptors/         # Interceptors globais
│   ├── interfaces/           # Interfaces compartilhadas
│   └── services/             # Serviços compartilhados
├── data/                     # Dados estáticos (Bíblia NVI)
├── guards/                   # Guards de autenticação
├── modules/                  # Módulos da aplicação
│   ├── app/                 # Módulo raiz
│   ├── auth/                # Autenticação e usuários
│   ├── comentario/          # Comentários
│   ├── pesquisa/            # Pesquisa de versículos
│   ├── prisma/              # Integração com Prisma
│   ├── referencia/          # Referências cruzadas
│   └── stats/               # Estatísticas
└── main.ts                   # Entry point da aplicação
```

## Recursos de Segurança

- **Senhas**: Hash com bcrypt (salt rounds configurável)
- **JWT**: Tokens assinados com chaves secretas diferentes para access e refresh
- **Refresh Tokens**: Armazenados em cookies HttpOnly com proteção CSRF
- **CORS**: Configurado para aceitar apenas origens confiáveis
- **Validação**: Validação automática de todos os inputs com class-validator
- **Rate Limiting**: Recomendado para produção (não implementado)
- **Soft Delete**: Exclusão lógica para preservar histórico

## Contribuindo

Este é um projeto privado. Para contribuir, entre em contato com a equipe de desenvolvimento.

## Licença

UNLICENSED - Todos os direitos reservados

## Contato

**Autor**: Adelson de Bittencourt Junior

---

Desenvolvido com NestJS
