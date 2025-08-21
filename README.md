# SaaS de Portais de Transparência Pública

Sistema completo para criação e gestão de portais de transparência municipais em conformidade com a Lei de Acesso à Informação (LAI) e Lei Complementar 131/09.

## 🏗️ Arquitetura

- **Backend**: Python + FastAPI
- **Frontend**: Next.js + TypeScript
- **Banco de Dados**: PostgreSQL
- **Cache**: Redis
- **Containerização**: Docker + Docker Compose
- **Deploy**: Heroku

## 🚀 Funcionalidades

### ✅ Conformidade Legal
- Lei de Acesso à Informação (LAI - 12.527/2011)
- Lei Complementar 131/09 (Transparência Fiscal)
- Sistema e-SIC integrado
- Relatórios de conformidade automáticos

### 💰 Gestão Financeira
- Receitas e despesas em tempo real
- Execução orçamentária
- Relatórios fiscais
- Integração com sistemas contábeis

### 🏛️ Gestão Pública
- Licitações e contratos
- Folha de pagamento
- Recursos humanos
- Estrutura organizacional

### 🌐 Portal Público
- Interface responsiva e acessível
- Busca avançada
- Visualizações gráficas
- Downloads em formatos abertos
- SEO otimizado

### 🏢 Multi-tenancy
- Múltiplos municípios
- Isolamento de dados
- Customização por cliente
- Domínios personalizados

## 🛠️ Instalação e Execução

### Pré-requisitos
- Docker e Docker Compose
- Node.js 18+ (para desenvolvimento)
- Python 3.11+ (para desenvolvimento)

### Execução com Docker
```bash
# Clone o repositório
git clone <repository-url>
cd saas-transparencia

# Execute com Docker Compose
docker-compose up -d

# Acesse:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Docs API: http://localhost:8000/docs
```

### Desenvolvimento Local
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

## 📦 Deploy no Heroku

```bash
# Configure as variáveis de ambiente
heroku config:set DATABASE_URL=<postgresql-url>
heroku config:set REDIS_URL=<redis-url>
heroku config:set SECRET_KEY=<secret-key>

# Deploy
git push heroku main
```

## 🔧 Configuração

### Variáveis de Ambiente
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/transparencia
REDIS_URL=redis://localhost:6379

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-password

# Storage
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_BUCKET_NAME=your-bucket
```

## 📚 Documentação

- [API Documentation](http://localhost:8000/docs)
- [Guia de Desenvolvimento](./docs/development.md)
- [Guia de Deploy](./docs/deployment.md)
- [Conformidade Legal](./docs/legal-compliance.md)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🏛️ Conformidade Legal

Este sistema foi desenvolvido para atender integralmente:
- Lei nº 12.527/2011 (Lei de Acesso à Informação)
- Lei Complementar nº 131/2009 (Lei da Transparência)
- Decreto nº 7.724/2012 (Regulamentação da LAI)
- LGPD (Lei Geral de Proteção de Dados)
- Diretrizes de Acessibilidade (WCAG 2.1)

