# 🏛️ SaaS Portal de Transparência Municipal

<div align="center">

![Logo](https://img.shields.io/badge/Portal-Transparência-blue?style=for-the-badge&logo=government&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11+-blue?style=for-the-badge&logo=python&logoColor=white)
![NextJS](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-blue?style=for-the-badge&logo=docker&logoColor=white)

</div>

**Sistema SaaS completo para criação e gestão de portais de transparência municipais** em conformidade com a Lei de Acesso à Informação (LAI) e Lei Complementar 131/09. Desenvolvido para municípios brasileiros com **arquitetura moderna, escalável e totalmente containerizada**.

## 📋 Índice

- [🏗️ Arquitetura do Sistema](#️-arquitetura-do-sistema)
- [🚀 Funcionalidades](#-funcionalidades)
- [📊 Diagramas do Sistema](#-diagramas-do-sistema)
- [⚡ Início Rápido](#-início-rápido)
- [🛠️ Instalação Detalhada](#️-instalação-detalhada)
- [🔧 Configuração](#-configuração)
- [📚 Documentação da API](#-documentação-da-api)
- [🏛️ Conformidade Legal](#️-conformidade-legal)
- [🤝 Contribuição](#-contribuição)
- [📄 Licença](#-licença)

## 🏗️ Arquitetura do Sistema

### **Stack Tecnológico**

| Camada | Tecnologia | Versão | Descrição |
|--------|------------|---------|-----------|
| **Frontend** | Next.js + TypeScript | 15.x | Interface moderna e responsiva |
| **Backend** | FastAPI + Python | 3.11+ | API RESTful de alta performance |
| **Banco de Dados** | PostgreSQL | 15+ | Banco relacional robusto |
| **Cache** | Redis | 7+ | Cache distribuído e sessões |
| **Search** | Elasticsearch | 8+ | Busca full-text otimizada |
| **Storage** | MinIO | Latest | Armazenamento de arquivos |
| **Proxy** | Nginx | Latest | Load balancer e proxy reverso |
| **Monitoramento** | Kibana | 8+ | Visualização de logs e métricas |
| **Containerização** | Docker + Compose | Latest | Orquestração de containers |

### **Características Técnicas**

- ✅ **Multi-tenant**: Isolamento completo por município
- ✅ **API-First**: Arquitetura desacoplada e escalável
- ✅ **Real-time**: Atualizações em tempo real via WebSockets
- ✅ **Microservices Ready**: Preparado para arquitetura de microsserviços
- ✅ **Cloud Native**: Deploy em qualquer provedor de nuvem
- ✅ **LGPD Compliant**: Conformidade total com proteção de dados
- ✅ **High Availability**: Arquitetura para alta disponibilidade

## 🚀 Funcionalidades

### 📊 **Dashboard Administrativo**
- **Visão Executiva**: KPIs e métricas em tempo real
- **Gestão de Usuários**: Sistema completo de CRUD de usuários
- **Controle de Acesso**: Permissões granulares por módulo
- **Auditoria**: Log completo de todas as operações

### 💰 **Gestão Financeira Transparente**
- **Receitas Municipais**: Cadastro e acompanhamento detalhado
- **Despesas Públicas**: Controle total de gastos por categoria
- **Execução Orçamentária**: Acompanhamento em tempo real
- **Relatórios Fiscais**: Exportação em formatos legais (PDF, Excel, CSV)
- **Indicadores Fiscais**: Cálculos automáticos de compliance

### 🏛️ **Contratos e Licitações**
- **Gestão de Contratos**: CRUD completo com controle de vigência
- **Processo Licitatório**: Acompanhamento de editais e resultados
- **Fornecedores**: Base de dados integrada
- **Documentos Anexos**: Armazenamento seguro de documentação

### 📝 **Sistema e-SIC Integrado**
- **Portal do Cidadão**: Interface pública para solicitações
- **Gestão de Pedidos**: Workflow completo de atendimento
- **Prazos Legais**: Controle automático de compliance temporal
- **Relatórios LAI**: Dashboards de transparência ativa

### 🌐 **Portal Público Responsivo**
- **Interface Cidadã**: Design moderno e acessível
- **Busca Inteligente**: Full-text search com Elasticsearch
- **Visualizações Gráficas**: Charts interativos com dados públicos
- **Downloads Abertos**: Exportação em formatos padronizados
- **SEO Otimizado**: Indexação completa pelos motores de busca

### 🏢 **Arquitetura Multi-tenant**
- **Isolamento Total**: Dados completamente segregados por município
- **Customização**: Temas e configurações personalizadas
- **Domínios Próprios**: Cada município com sua URL
- **Escalabilidade**: Suporte a milhares de municípios

## � Diagramas do Sistema

### 🏗️ Arquitetura de Alto Nível

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Next.js App] --> B[React Components]
        B --> C[TypeScript Hooks]
        C --> D[API Client]
    end
    
    subgraph "Backend Layer"
        E[FastAPI Server] --> F[Authentication]
        E --> G[CRUD Services]
        E --> H[Business Logic]
    end
    
    subgraph "Data Layer"
        I[(PostgreSQL)] --> J[User Data]
        I --> K[Financial Data]
        I --> L[Contract Data]
        I --> M[ESIC Requests]
        
        N[Redis Cache] --> O[Sessions]
        N --> P[API Cache]
        
        Q[Elasticsearch] --> R[Search Index]
        Q --> S[Analytics]
        
        T[MinIO] --> U[Documents]
        T --> V[Reports]
    end
    
    subgraph "Infrastructure"
        W[Docker Compose] --> X[Container Orchestration]
        Y[Nginx] --> Z[Load Balancer]
    end
    
    D --> E
    E --> I
    E --> N
    E --> Q
    E --> T
```

### 🔄 Fluxo de Dados CRUD

```mermaid
sequenceDiagram
    participant U as User Interface
    participant H as React Hook
    participant A as API Client
    participant B as Backend API
    participant D as Database
    participant C as Cache
    
    Note over U,C: Create Operation
    U->>H: Create Request
    H->>A: POST /api/entity
    A->>B: HTTP Request
    B->>D: INSERT Query
    D-->>B: Success Response
    B->>C: Cache Invalidation
    B-->>A: API Response
    A-->>H: Success Data
    H-->>U: State Update
    
    Note over U,C: Read Operation
    U->>H: Fetch Request
    H->>A: GET /api/entity
    A->>B: HTTP Request
    B->>C: Check Cache
    alt Cache Hit
        C-->>B: Cached Data
    else Cache Miss
        B->>D: SELECT Query
        D-->>B: Query Result
        B->>C: Update Cache
    end
    B-->>A: API Response
    A-->>H: Data Array
    H-->>U: State Update
```

### 🏛️ Arquitetura Multi-tenant

```mermaid
graph LR
    subgraph "Tenant A - Município X"
        A1[Portal A] --> B1[Database Schema A]
        A1 --> C1[Files Bucket A]
    end
    
    subgraph "Tenant B - Município Y"  
        A2[Portal B] --> B2[Database Schema B]
        A2 --> C2[Files Bucket B]
    end
    
    subgraph "Shared Infrastructure"
        D[Load Balancer] --> A1
        D --> A2
        E[Shared Cache] --> A1
        E --> A2
        F[Monitoring] --> A1
        F --> A2
    end
    
    subgraph "Data Isolation"
        B1 --> G[(PostgreSQL)]
        B2 --> G
        C1 --> H[MinIO Storage]
        C2 --> H
    end
```

### 📝 Fluxo do Sistema e-SIC

```mermaid
stateDiagram-v2
    [*] --> Submitted: Cidadão envia solicitação
    Submitted --> InAnalysis: Operador recebe
    InAnalysis --> NeedsInfo: Informações insuficientes
    NeedsInfo --> InAnalysis: Cidadão complementa
    InAnalysis --> Approved: Pedido aprovado
    InAnalysis --> Rejected: Pedido negado
    Approved --> InProgress: Em processamento
    InProgress --> Answered: Resposta enviada
    InProgress --> Extended: Prazo prorrogado
    Extended --> Answered: Resposta enviada
    Answered --> [*]: Processo concluído
    Rejected --> [*]: Processo encerrado
    
    note right of Submitted
        Prazo: 20 dias úteis
        (Lei 12.527/2011)
    end note
```

### 🔐 Fluxo de Autenticação

```mermaid
sequenceDiagram
    participant C as Client
    participant F as Frontend
    participant B as Backend
    participant D as Database
    participant R as Redis
    
    C->>F: Login Form Submit
    F->>B: POST /auth/login
    B->>D: Validate User
    D-->>B: User Data
    B->>R: Store Session
    B-->>F: JWT Token + User Data
    F->>F: Store in Context
    F-->>C: Redirect to Dashboard
    
    Note over C,R: Protected Route Access
    C->>F: Access Admin Page
    F->>F: Check Token
    alt Token Valid
        F->>B: API Request with Bearer Token
        B->>R: Validate Session
        R-->>B: Session Valid
        B-->>F: Protected Data
        F-->>C: Render Page
    else Token Invalid
        F-->>C: Redirect to Login
    end
```

## ⚡ Início Rápido

### 📦 Execução com Docker (Recomendado)

```bash
# 1. Clone o repositório
git clone https://github.com/diegothuran/saas-transparencia.git
cd saas-transparencia

# 2. Inicie todos os serviços
docker-compose up -d

# 3. Aguarde a inicialização (pode levar alguns minutos)
docker-compose logs -f

# 4. Acesse a aplicação
echo "✅ Frontend: http://localhost:3000"
echo "✅ Backend API: http://localhost:8000" 
echo "✅ API Docs: http://localhost:8000/docs"
echo "✅ Kibana: http://localhost:5601"
echo "✅ MinIO: http://localhost:9001"
```

### 🔑 Credenciais Padrão

| Serviço | Usuário | Senha | URL |
|---------|---------|--------|-----|
| **Sistema Admin** | `admin` | `admin123` | http://localhost:3000/login |
| **MinIO Console** | `minioadmin` | `minioadmin` | http://localhost:9001 |
| **Kibana** | - | - | http://localhost:5601 |

## 🛠️ Instalação Detalhada

### Pré-requisitos

- ✅ **Docker**: 20.10+
- ✅ **Docker Compose**: 2.0+
- ✅ **Git**: 2.30+
- ✅ **Memória RAM**: 4GB mínimo (8GB recomendado)
- ✅ **Espaço em Disco**: 10GB livres

### Execução com Docker
```bash
# 1. Clone o repositório
git clone https://github.com/diegothuran/saas-transparencia.git
cd saas-transparencia

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# 3. Construa e inicie os containers
docker-compose build --no-cache
docker-compose up -d

# 4. Execute as migrações do banco
docker-compose exec backend alembic upgrade head

# 5. Crie o usuário administrador
docker-compose exec backend python create_initial_data.py

# 6. Verifique se todos os serviços estão executando
docker-compose ps
```

### 🔧 Desenvolvimento Local

**Backend (FastAPI + Python)**

```bash
cd backend

# Configure ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Instale dependências
pip install -r requirements.txt

# Configure variáveis de ambiente
cp .env.example .env

# Execute migrações
alembic upgrade head

# Inicie o servidor de desenvolvimento
uvicorn app.main:app --reload --port 8000
```

**Frontend (Next.js + TypeScript)**

```bash
cd frontend

# Instale dependências
npm install
# ou
yarn install

# Configure variáveis de ambiente
cp .env.example .env.local

# Inicie o servidor de desenvolvimento
npm run dev
# ou
yarn dev
```

## 🔧 Configuração

### 📋 Variáveis de Ambiente

**Backend (.env)**

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/transparencia
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=transparencia

# Redis Configuration  
REDIS_URL=redis://localhost:6379/0

# Security Configuration
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email Configuration (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com  
SMTP_PASSWORD=your-app-password
EMAILS_FROM_EMAIL=noreply@transparencia.gov.br

# File Storage Configuration
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
MINIO_ENDPOINT=localhost:9000
MINIO_BUCKET=transparencia-files

# Elasticsearch Configuration
ELASTICSEARCH_URL=http://localhost:9200

# Environment
ENVIRONMENT=development
DEBUG=true
```

**Frontend (.env.local)**

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

### 🐳 Configuração Docker

O arquivo `docker-compose.yml` inclui todos os serviços necessários:

- **frontend**: Next.js app (porta 3000)
- **backend**: FastAPI app (porta 8000)  
- **postgres**: Banco de dados PostgreSQL (porta 5433)
- **redis**: Cache e sessões (porta 6379)
- **elasticsearch**: Busca full-text (porta 9200)
- **kibana**: Dashboard de logs (porta 5601)
- **minio**: Armazenamento de arquivos (portas 9000, 9001)
- **nginx**: Proxy reverso (portas 8080, 8443)

## 📚 Documentação da API

### 🔗 Endpoints Principais

A documentação interativa da API está disponível em:
- **Swagger UI**: <http://localhost:8000/docs>
- **ReDoc**: <http://localhost:8000/redoc>

### 📋 Principais Rotas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/auth/login` | Autenticação de usuário |
| `GET` | `/users/` | Listar usuários |
| `POST` | `/users/` | Criar usuário |
| `GET` | `/financial/revenues/` | Listar receitas |
| `POST` | `/financial/revenues/` | Criar receita |
| `GET` | `/financial/expenses/` | Listar despesas |
| `POST` | `/financial/expenses/` | Criar despesa |
| `GET` | `/contracts/` | Listar contratos |
| `POST` | `/contracts/` | Criar contrato |
| `GET` | `/esic/` | Listar solicitações e-SIC |
| `POST` | `/esic/` | Criar solicitação e-SIC |

### 📊 Exemplo de Uso da API

```bash
# 1. Fazer login e obter token
curl -X POST "http://localhost:8000/auth/login" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "username=admin&password=admin123"

# 2. Usar token nas requisições (substitua SEU_TOKEN)
curl -X GET "http://localhost:8000/users/" \
     -H "Authorization: Bearer SEU_TOKEN"

# 3. Criar uma receita
curl -X POST "http://localhost:8000/financial/revenues/" \
     -H "Authorization: Bearer SEU_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "source": "ICMS",
       "amount": 150000.00,
       "date": "2025-01-15",
       "category": "Imposto"
     }'
```

## 🚀 Deploy em Produção

### 🌊 Deploy no Heroku

```bash
# 1. Instale o Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# 2. Faça login
heroku login

# 3. Crie a aplicação
heroku create seu-portal-transparencia

# 4. Configure as variáveis de ambiente
heroku config:set SECRET_KEY=your-production-secret-key
heroku config:set DATABASE_URL=your-postgres-url
heroku config:set REDIS_URL=your-redis-url

# 5. Adicione o buildpack para Docker
heroku stack:set container

# 6. Deploy
git push heroku main
```

### ☁️ Deploy na AWS/Digital Ocean

```yaml
# docker-compose.prod.yml exemplo
version: '3.8'
services:
  frontend:
    build: ./frontend
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_BASE_URL=https://api.seudominio.com
    
  backend:
    build: ./backend
    environment:
      - ENVIRONMENT=production
      - DEBUG=false
      - DATABASE_URL=postgresql://user:pass@rds-endpoint/db
      - REDIS_URL=redis://elasticache-endpoint:6379
```

## 🏛️ Conformidade Legal

### ⚖️ Legislação Atendida

Este sistema foi desenvolvido para **atender integralmente**:

- ✅ **Lei nº 12.527/2011** (Lei de Acesso à Informação - LAI)
- ✅ **Lei Complementar nº 131/2009** (Lei da Transparência)
- ✅ **Decreto nº 7.724/2012** (Regulamentação da LAI)
- ✅ **Lei nº 13.709/2018** (LGPD - Lei Geral de Proteção de Dados)
- ✅ **Diretrizes WCAG 2.1** (Acessibilidade Web)

### 📊 Itens de Transparência Obrigatória

| Item | Status | Localização |
|------|--------|-------------|
| Receitas e despesas | ✅ | `/receitas`, `/despesas` |
| Contratos e licitações | ✅ | `/contratos`, `/licitacoes` |
| Folha de pagamento | ✅ | `/servidores` |
| Estrutura organizacional | ✅ | `/estrutura` |
| e-SIC (Pedidos LAI) | ✅ | `/esic` |
| Agenda de autoridades | ⏳ | Em desenvolvimento |
| Convênios e parcerias | ⏳ | Em desenvolvimento |

### 🔒 Proteção de Dados Pessoais (LGPD)

- **Minimização**: Coleta apenas dados estritamente necessários
- **Finalidade**: Uso exclusivo para transparência pública
- **Adequação**: Processamento adequado aos propósitos informados
- **Necessidade**: Limitação ao mínimo necessário
- **Qualidade**: Dados exatos, claros e atualizados
- **Transparência**: Informações claras sobre tratamento
- **Segurança**: Medidas técnicas e organizacionais
- **Prevenção**: Medidas preventivas de danos

## 🧪 Testes

### 🔍 Executar Testes

```bash
# Backend - Testes unitários e de integração
cd backend
python -m pytest tests/ -v --cov=app

# Frontend - Testes unitários  
cd frontend
npm run test
npm run test:coverage

# Testes E2E com Playwright
npm run test:e2e
```

### 📈 Cobertura de Testes

- **Backend**: >90% cobertura
- **Frontend**: >85% cobertura  
- **E2E**: Fluxos críticos cobertos

## 🤝 Contribuição

Contribuições são bem-vindas! Siga estas etapas:

### 📝 Processo de Contribuição

1. **Fork** o projeto
2. **Clone** seu fork: `git clone https://github.com/seu-usuario/saas-transparencia.git`
3. **Crie uma branch**: `git checkout -b feature/nova-funcionalidade`
4. **Implemente** suas mudanças
5. **Teste** suas alterações: `npm test && python -m pytest`
6. **Commit** suas mudanças: `git commit -m 'feat: adiciona nova funcionalidade'`
7. **Push** para a branch: `git push origin feature/nova-funcionalidade`
8. **Abra um Pull Request**

### 📋 Padrões de Código

- **Commits**: Siga o padrão [Conventional Commits](https://www.conventionalcommits.org/)
- **Code Style**: 
  - Python: `black` + `flake8`
  - TypeScript: `eslint` + `prettier`
- **Documentação**: Mantenha documentação atualizada
- **Testes**: Inclua testes para novas funcionalidades

## 📞 Suporte

### 🐛 Reportar Bugs

Encontrou um bug? [Abra uma issue](https://github.com/diegothuran/saas-transparencia/issues) com:
- Descrição detalhada do problema
- Passos para reproduzir
- Ambiente (OS, versões, etc.)
- Screenshots se aplicável

### 💬 Discussões

Para dúvidas gerais e discussões, utilize as [GitHub Discussions](https://github.com/diegothuran/saas-transparencia/discussions).

## 📄 Licença

Este projeto está licenciado sob a **Licença MIT** - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

**Diego Thuran**
- GitHub: [@diegothuran](https://github.com/diegothuran)
- LinkedIn: [Diego Thuran](https://linkedin.com/in/diegothuran)
- Email: <diego@thuran.dev>

---

<div align="center">

**🏛️ Desenvolvido para a transparência pública brasileira 🇧🇷**

![Footer](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)
![Brasil](https://img.shields.io/badge/Brasil-🇧🇷-green?style=for-the-badge)

*"A transparência é o melhor remédio contra a corrupção"*

</div>

