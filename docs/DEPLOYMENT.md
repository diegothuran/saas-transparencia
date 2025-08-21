# Guia de Deploy - SaaS de Portais de Transparência

## 🚀 Deploy no Heroku

### Pré-requisitos

1. **Heroku CLI** instalado
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Ubuntu/Debian
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Git** configurado
3. **Conta no Heroku** criada

### Deploy Automático

Execute o script de deploy:

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

O script irá:
- Criar o app no Heroku (se não existir)
- Configurar add-ons (PostgreSQL, Redis)
- Definir variáveis de ambiente
- Fazer o deploy
- Executar migrações
- Criar usuário administrador

### Deploy Manual

#### 1. Criar App no Heroku

```bash
heroku create seu-app-name --region us
heroku stack:set container -a seu-app-name
```

#### 2. Adicionar Add-ons

```bash
# PostgreSQL
heroku addons:create heroku-postgresql:essential-0 -a seu-app-name

# Redis
heroku addons:create heroku-redis:mini -a seu-app-name

# Elasticsearch (opcional)
heroku addons:create bonsai:sandbox -a seu-app-name
```

#### 3. Configurar Variáveis de Ambiente

```bash
heroku config:set \
  SECRET_KEY=$(openssl rand -base64 32) \
  ALGORITHM=HS256 \
  ACCESS_TOKEN_EXPIRE_MINUTES=30 \
  ENVIRONMENT=production \
  FIRST_SUPERUSER=admin@transparencia.gov.br \
  FIRST_SUPERUSER_PASSWORD=$(openssl rand -base64 12) \
  CORS_ORIGINS=https://seu-app-name.herokuapp.com \
  NEXT_PUBLIC_API_URL=https://seu-app-name.herokuapp.com \
  -a seu-app-name
```

#### 4. Deploy

```bash
git add .
git commit -m "Deploy to Heroku"
heroku git:remote -a seu-app-name
git push heroku main
```

#### 5. Executar Migrações

```bash
heroku run python -m alembic upgrade head -a seu-app-name
```

## 🐳 Deploy com Docker

### Desenvolvimento Local

```bash
# Setup inicial
chmod +x scripts/setup.sh
./scripts/setup.sh

# Ou manualmente
docker-compose up -d
```

### Produção com Docker

```bash
# Build para produção
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## ☁️ Deploy na AWS

### Usando ECS (Elastic Container Service)

1. **Criar repositório ECR**
   ```bash
   aws ecr create-repository --repository-name transparencia-backend
   aws ecr create-repository --repository-name transparencia-frontend
   ```

2. **Build e push das imagens**
   ```bash
   # Login no ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
   
   # Build e tag
   docker build -t transparencia-backend ./backend
   docker tag transparencia-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/transparencia-backend:latest
   
   # Push
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/transparencia-backend:latest
   ```

3. **Criar task definition e service no ECS**

### Usando Elastic Beanstalk

1. **Instalar EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Inicializar aplicação**
   ```bash
   eb init transparencia-saas
   eb create production
   ```

## 🔧 Configurações de Produção

### Variáveis de Ambiente Obrigatórias

```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# Security
SECRET_KEY=your-secret-key-32-chars-minimum
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=https://yourdomain.com

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Storage (AWS S3)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET_NAME=your-bucket
AWS_REGION=us-east-1

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

### Configurações de Segurança

1. **HTTPS obrigatório**
2. **Firewall configurado**
3. **Backup automático do banco**
4. **Monitoramento de logs**
5. **Rate limiting ativo**

## 📊 Monitoramento

### Logs

```bash
# Heroku
heroku logs --tail -a seu-app-name

# Docker
docker-compose logs -f [service]
```

### Métricas

- **Heroku Metrics**: Dashboard nativo
- **New Relic**: APM completo
- **Sentry**: Error tracking
- **Grafana + Prometheus**: Métricas customizadas

### Health Checks

- **Backend**: `GET /health`
- **Frontend**: `GET /`
- **Database**: Connection pool status
- **Redis**: Ping command

## 🔄 CI/CD

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Heroku

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "seu-app-name"
          heroku_email: "seu-email@gmail.com"
          usedocker: true
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - build
  - deploy

deploy:
  stage: deploy
  script:
    - git push https://heroku:$HEROKU_API_KEY@git.heroku.com/$HEROKU_APP_NAME.git HEAD:main
  only:
    - main
```

## 🛠️ Troubleshooting

### Problemas Comuns

1. **Erro de migração**
   ```bash
   heroku run python -m alembic upgrade head -a seu-app-name
   ```

2. **Timeout na aplicação**
   - Verificar configuração do gunicorn
   - Aumentar timeout do Heroku

3. **Erro de memória**
   - Upgrade do dyno type
   - Otimizar queries do banco

4. **Erro de conexão com banco**
   - Verificar DATABASE_URL
   - Verificar SSL settings

### Comandos Úteis

```bash
# Heroku
heroku ps -a seu-app-name                    # Status dos dynos
heroku config -a seu-app-name                # Variáveis de ambiente
heroku pg:info -a seu-app-name               # Info do PostgreSQL
heroku redis:info -a seu-app-name            # Info do Redis

# Docker
docker-compose ps                            # Status dos containers
docker-compose logs -f [service]             # Logs em tempo real
docker-compose exec [service] bash           # Acesso ao container
```

## 📋 Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Add-ons provisionados
- [ ] Migrações executadas
- [ ] Usuário admin criado
- [ ] HTTPS configurado
- [ ] Domínio customizado (se aplicável)
- [ ] Backup configurado
- [ ] Monitoramento ativo
- [ ] Testes de fumaça executados
- [ ] Documentação atualizada

## 🔐 Segurança

### SSL/TLS
- Heroku fornece SSL automático
- Para domínio customizado, configure certificado

### Firewall
- Configure regras de acesso
- Bloqueie IPs suspeitos
- Rate limiting ativo

### Backup
- Backup automático do PostgreSQL
- Backup de arquivos no S3
- Teste de restore regular

### Compliance
- LGPD: Proteção de dados pessoais
- LAI: Transparência obrigatória
- LC 131/09: Tempo real fiscal

