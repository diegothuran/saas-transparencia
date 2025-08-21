# 🏗️ Arquitetura do Sistema - Diagramas Técnicos

## 📊 Visão Geral da Arquitetura

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[📱 Next.js 15 UI]
        COMP[🎨 Components]
        HOOKS[🪝 Custom Hooks]
        CTX[⚡ React Context]
    end
    
    subgraph "API Layer"
        NGINX[🌐 Nginx Proxy]
        API[🔧 FastAPI Backend]
        AUTH[🔐 JWT Auth]
        MIDDLE[🛡️ Middleware]
    end
    
    subgraph "Business Layer"
        SERVICES[💼 Service Layer]
        MODELS[🏗️ SQLAlchemy Models]
        SCHEMAS[📝 Pydantic Schemas]
    end
    
    subgraph "Data Layer"
        DB[(🐘 PostgreSQL)]
        MIGRATIONS[🔄 Alembic]
    end
    
    subgraph "Infrastructure"
        DOCKER[🐳 Docker Compose]
        HEROKU[☁️ Heroku]
    end
    
    UI --> COMP
    UI --> HOOKS
    UI --> CTX
    
    HOOKS --> NGINX
    NGINX --> API
    API --> AUTH
    API --> MIDDLE
    
    MIDDLE --> SERVICES
    SERVICES --> MODELS
    SERVICES --> SCHEMAS
    
    MODELS --> DB
    MIGRATIONS --> DB
    
    DOCKER --> NGINX
    DOCKER --> API
    DOCKER --> DB
    HEROKU --> DOCKER
```

## 🔄 Fluxo de Dados CRUD Detalhado

```mermaid
sequenceDiagram
    participant User as 👤 Usuário
    participant UI as 📱 Interface
    participant Hook as 🪝 React Hook
    participant API as 🔧 FastAPI
    participant Auth as 🔐 Auth Middleware
    participant Service as 💼 Service Layer
    participant Model as 🏗️ SQLAlchemy Model
    participant DB as 🐘 PostgreSQL
    
    User->>UI: 1. Ação CRUD (Create/Read/Update/Delete)
    UI->>Hook: 2. Chama função do hook
    
    Note over Hook: 3. Prepara request com JWT token
    Hook->>API: 4. HTTP Request (GET/POST/PUT/DELETE)
    
    API->>Auth: 5. Valida JWT Token
    Auth-->>API: 6. Retorna contexto do usuário
    
    Note over API: 7. Roteamento para endpoint específico
    API->>Service: 8. Chama método do serviço
    
    Service->>Model: 9. Operação no modelo
    Model->>DB: 10. Query SQL (SELECT/INSERT/UPDATE/DELETE)
    DB-->>Model: 11. Resultado da query
    Model-->>Service: 12. Dados processados
    
    Service-->>API: 13. Response com dados
    API-->>Hook: 14. HTTP Response (JSON)
    Hook-->>UI: 15. Atualiza estado React
    UI-->>User: 16. Interface atualizada
    
    Note over User,DB: ✅ Operação CRUD completa
```

## 🔐 Fluxo de Autenticação Completo

```mermaid
stateDiagram-v2
    [*] --> Anonymous: Sistema iniciado
    
    Anonymous --> LoginPage: Usuário acessa /login
    LoginPage --> Authenticating: Submit credentials
    
    state Authenticating {
        ValidateCredentials --> CheckUserExists
        CheckUserExists --> VerifyPassword
        VerifyPassword --> GenerateJWT: ✅ Válido
        VerifyPassword --> LoginFailed: ❌ Inválido
    }
    
    GenerateJWT --> Authenticated: Token criado
    LoginFailed --> LoginPage: Mostrar erro
    
    state Authenticated {
        [*] --> HasValidToken
        HasValidToken --> MakeAPICall: Requisição autorizada
        HasValidToken --> TokenExpired: Token expirou
        MakeAPICall --> ReceiveResponse: ✅ Autorizado
        MakeAPICall --> Unauthorized: ❌ Não autorizado
    }
    
    TokenExpired --> Anonymous: Redirect para login
    Unauthorized --> Anonymous: Redirect para login
    ReceiveResponse --> HasValidToken: Continue autenticado
    
    Authenticated --> [*]: Logout
```

## 🏢 Arquitetura Multi-Tenant

```mermaid
graph TB
    subgraph "Tenant Isolation"
        T1[🏛️ Prefeitura A<br/>tenant_id: 1]
        T2[🏛️ Prefeitura B<br/>tenant_id: 2]
        T3[🏛️ Prefeitura C<br/>tenant_id: 3]
    end
    
    subgraph "Shared Infrastructure"
        APP[🔧 Aplicação FastAPI]
        DB[(🐘 PostgreSQL<br/>Shared Database)]
    end
    
    subgraph "Data Segregation"
        U1[👥 Users tenant_id=1]
        U2[👥 Users tenant_id=2]
        U3[👥 Users tenant_id=3]
        
        E1[💸 Expenses tenant_id=1]
        E2[💸 Expenses tenant_id=2]
        E3[💸 Expenses tenant_id=3]
        
        C1[📄 Contracts tenant_id=1]
        C2[📄 Contracts tenant_id=2]
        C3[📄 Contracts tenant_id=3]
    end
    
    T1 --> APP
    T2 --> APP
    T3 --> APP
    
    APP --> DB
    
    DB --> U1
    DB --> U2
    DB --> U3
    DB --> E1
    DB --> E2
    DB --> E3
    DB --> C1
    DB --> C2
    DB --> C3
    
    Note1[Row Level Security:<br/>WHERE tenant_id = current_tenant]
```

## 📋 Fluxo e-SIC (Lei de Acesso à Informação)

```mermaid
stateDiagram-v2
    [*] --> PedidoRecebido: Cidadão faz solicitação
    
    PedidoRecebido --> ProtocoloGerado: Gerar protocolo único
    ProtocoloGerado --> Triagem: Sistema atribui responsável
    
    state Triagem {
        [*] --> AnaliseComplexidade
        AnaliseComplexidade --> SimpleRequest: Informação disponível
        AnaliseComplexidade --> ComplexRequest: Requer análise
        AnaliseComplexidade --> InvalidRequest: Pedido inválido
    }
    
    SimpleRequest --> EmAndamento: Processamento imediato
    ComplexRequest --> EmAndamento: Análise detalhada
    InvalidRequest --> Negado: Informar motivo
    
    state EmAndamento {
        [*] --> ColetandoInfo
        ColetandoInfo --> PreparandoResposta
        PreparandoResposta --> RevisaoTecnica
        RevisaoTecnica --> AprovacaoFinal
    }
    
    AprovacaoFinal --> Respondido: Informação fornecida
    AprovacaoFinal --> ParcialmenteAtendido: Informação parcial
    
    Respondido --> [*]: Caso encerrado
    ParcialmenteAtendido --> [*]: Caso encerrado
    Negado --> PodeRecorrer: Recurso disponível
    
    state PodeRecorrer {
        [*] --> AguardandoRecurso
        AguardandoRecurso --> RecursoFormalizado: Cidadão recorre
        AguardandoRecurso --> [*]: Prazo expirado
        RecursoFormalizado --> EmAndamento: Reanálise
    }
    
    Note1: Prazos LAI:<br/>20 dias + 10 dias (prorrogação)
    Note2: Recursos: até 2ª instância
```

## 🔄 Deploy e CI/CD Pipeline

```mermaid
graph LR
    subgraph "Development"
        DEV[👨‍💻 Developer]
        GIT[📁 Git Repository]
    end
    
    subgraph "CI/CD Pipeline"
        GHA[🚀 GitHub Actions]
        TEST[🧪 Automated Tests]
        BUILD[🔨 Docker Build]
        DEPLOY[📦 Deploy]
    end
    
    subgraph "Environments"
        STAGING[🔧 Staging]
        PROD[🌟 Production]
    end
    
    subgraph "Infrastructure"
        HEROKU[☁️ Heroku]
        POSTGRES[🐘 PostgreSQL]
        NGINX[🌐 Nginx]
    end
    
    DEV --> GIT: Push code
    GIT --> GHA: Trigger workflow
    GHA --> TEST: Run tests
    TEST --> BUILD: ✅ Tests pass
    BUILD --> DEPLOY: 🐳 Docker image ready
    
    DEPLOY --> STAGING: Deploy to staging
    STAGING --> PROD: Manual approval
    
    PROD --> HEROKU
    HEROKU --> POSTGRES
    HEROKU --> NGINX
    
    Note1[Continuous Integration:<br/>Automated testing<br/>Code quality checks]
    Note2[Continuous Deployment:<br/>Zero-downtime deployment<br/>Rollback capability]
```

## 📊 Modelo de Dados Completo

```mermaid
erDiagram
    TENANTS {
        int id PK
        string name
        string domain UK
        string logo_url
        json settings
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    USERS {
        int id PK
        string username UK
        string email UK
        string hashed_password
        string first_name
        string last_name
        boolean is_active
        boolean is_superuser
        int tenant_id FK
        timestamp last_login
        timestamp created_at
        timestamp updated_at
    }
    
    REVENUES {
        int id PK
        string source
        decimal amount
        date date
        string category
        string subcategory
        string description
        string reference_number
        int tenant_id FK
        int created_by FK
        timestamp created_at
        timestamp updated_at
    }
    
    EXPENSES {
        int id PK
        string supplier_name
        string supplier_document
        decimal amount
        date date
        string category
        string subcategory
        string description
        string process_number
        string payment_method
        int tenant_id FK
        int created_by FK
        timestamp created_at
        timestamp updated_at
    }
    
    CONTRACTS {
        int id PK
        string contract_number UK
        string object
        string supplier_name
        string supplier_document
        decimal value
        date start_date
        date end_date
        string status
        string modality
        string process_number
        text legal_framework
        int tenant_id FK
        int created_by FK
        timestamp created_at
        timestamp updated_at
    }
    
    ESIC_REQUESTS {
        int id PK
        string protocol_number UK
        string subject
        text description
        string requester_name
        string requester_email
        string requester_phone
        date request_date
        date due_date
        string status
        string priority
        text response
        date response_date
        int tenant_id FK
        int assigned_to FK
        timestamp created_at
        timestamp updated_at
    }
    
    %% Relationships
    TENANTS ||--o{ USERS : "has many"
    TENANTS ||--o{ REVENUES : "has many"
    TENANTS ||--o{ EXPENSES : "has many"
    TENANTS ||--o{ CONTRACTS : "has many"
    TENANTS ||--o{ ESIC_REQUESTS : "has many"
    
    USERS ||--o{ REVENUES : "created by"
    USERS ||--o{ EXPENSES : "created by"
    USERS ||--o{ CONTRACTS : "created by"
    USERS ||--o{ ESIC_REQUESTS : "assigned to"
    
    %% Status constraints
    CONTRACTS ||--o{ EXPENSES : "may reference"
```

## 🔒 Camadas de Segurança

```mermaid
graph TD
    subgraph "Security Layers"
        L1[🌐 HTTPS/TLS Layer]
        L2[🛡️ Nginx Security Headers]
        L3[🔐 JWT Authentication]
        L4[👤 User Authorization]
        L5[🏢 Tenant Isolation]
        L6[🗃️ Database Security]
        L7[📊 Audit Logging]
    end
    
    subgraph "Threats Mitigated"
        T1[🚫 Man-in-the-Middle]
        T2[🚫 XSS Attacks]
        T3[🚫 Unauthorized Access]
        T4[🚫 Privilege Escalation]
        T5[🚫 Data Leakage]
        T6[🚫 SQL Injection]
        T7[🚫 Untraced Actions]
    end
    
    L1 --> T1
    L2 --> T2
    L3 --> T3
    L4 --> T4
    L5 --> T5
    L6 --> T6
    L7 --> T7
    
    Note1[Security Best Practices:<br/>• Password hashing with bcrypt<br/>• JWT tokens with expiration<br/>• Input validation with Pydantic<br/>• Row-level security in PostgreSQL<br/>• CORS configuration<br/>• Rate limiting]
```

## 🚀 Performance e Escalabilidade

```mermaid
graph TB
    subgraph "Performance Optimization"
        P1[⚡ Async FastAPI]
        P2[🔄 Connection Pooling]
        P3[📦 Code Splitting]
        P4[🖼️ Image Optimization]
        P5[💾 Browser Caching]
    end
    
    subgraph "Monitoring & Metrics"
        M1[📈 API Response Time]
        M2[🔢 Request Volume]
        M3[❌ Error Rate]
        M4[💾 Database Performance]
        M5[👥 Active Users]
    end
    
    subgraph "Scalability Strategy"
        S1[📈 Horizontal Scaling]
        S2[🔄 Load Balancing]
        S3[💾 Database Optimization]
        S4[📱 CDN Integration]
    end
    
    P1 --> M1
    P2 --> M4
    P3 --> M1
    P4 --> M1
    P5 --> M1
    
    M1 --> S1
    M2 --> S2
    M3 --> S1
    M4 --> S3
    M5 --> S1
    
    Note1[Performance Targets:<br/>• API Response: < 200ms<br/>• Page Load: < 3s<br/>• Database Queries: < 100ms<br/>• Uptime: 99.9%]
```

## 📱 Fluxo de Responsividade

```mermaid
graph LR
    subgraph "Breakpoints"
        MOBILE[📱 Mobile<br/>< 768px]
        TABLET[📟 Tablet<br/>768px - 1024px]
        DESKTOP[🖥️ Desktop<br/>> 1024px]
    end
    
    subgraph "Layout Adaptations"
        M_LAYOUT[📱 Stack Navigation<br/>Single Column<br/>Touch-friendly buttons]
        T_LAYOUT[📟 Sidebar + Content<br/>Two columns<br/>Hybrid navigation]
        D_LAYOUT[🖥️ Full Navigation<br/>Multiple columns<br/>Hover states]
    end
    
    subgraph "Components"
        NAV[🧭 Navigation]
        TABLE[📊 Data Tables]
        FORMS[📝 Forms]
        MODALS[🪟 Modals]
    end
    
    MOBILE --> M_LAYOUT
    TABLET --> T_LAYOUT
    DESKTOP --> D_LAYOUT
    
    M_LAYOUT --> NAV
    T_LAYOUT --> TABLE
    D_LAYOUT --> FORMS
    
    NAV --> MODALS
    TABLE --> MODALS
    FORMS --> MODALS
    
    Note1[Responsive Strategy:<br/>• Mobile-first design<br/>• Progressive enhancement<br/>• Touch-friendly interfaces<br/>• Accessible components]
```

---

Esta documentação arquitetural serve como guia técnico para desenvolvedores, fornecendo uma visão completa dos padrões, fluxos e decisões arquiteturais do sistema SaaS de Transparência Pública.
