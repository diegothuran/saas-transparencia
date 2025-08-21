// User types
export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  phone?: string;
  department?: string;
  position?: string;
  bio?: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  role: UserRole;
  tenant_id?: number;
  created_at: string;
  updated_at: string;
}

export enum UserRole {
  SUPERUSER = 'superuser',
  ADMIN = 'admin',
  MANAGER = 'manager',
  OPERATOR = 'operator',
  VIEWER = 'viewer',
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

// Tenant types
export interface Tenant {
  id: number;
  name: string;
  slug: string;
  cnpj: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  city: string;
  state: string;
  zip_code?: string;
  mayor_name?: string;
  population?: number;
  area_km2?: string;
  is_active: boolean;
  is_trial: boolean;
  trial_ends_at?: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  custom_css?: string;
  custom_domain?: string;
  subdomain?: string;
  settings: Record<string, any>;
  lai_email?: string;
  ouvidoria_email?: string;
  created_at: string;
  updated_at: string;
}

// Financial types
export enum RevenueCategory {
  TAXES = 'impostos',
  TRANSFERS = 'transferencias',
  SERVICES = 'servicos',
  INVESTMENTS = 'investimentos',
  OTHER = 'outros',
}

export enum ExpenseCategory {
  PERSONNEL = 'pessoal',
  MATERIALS = 'materiais',
  SERVICES = 'servicos',
  INVESTMENTS = 'investimentos',
  DEBT = 'divida',
  OTHER = 'outros',
}

export enum ExpenseType {
  COMMITMENT = 'empenho',
  LIQUIDATION = 'liquidacao',
  PAYMENT = 'pagamento',
}

export interface Revenue {
  id: number;
  description: string;
  category: RevenueCategory;
  subcategory?: string;
  amount: number;
  date: string;
  budget_code?: string;
  source?: string;
  process_number?: string;
  tenant_id: number;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: number;
  description: string;
  category: ExpenseCategory;
  subcategory?: string;
  expense_type: ExpenseType;
  amount: number;
  date: string;
  beneficiary_name: string;
  beneficiary_document: string;
  budget_code?: string;
  function_code?: string;
  subfunction_code?: string;
  process_number: string;
  bidding_process?: string;
  contract_id?: number;
  tenant_id: number;
  created_at: string;
  updated_at: string;
}

export interface BudgetExecution {
  id: number;
  year: number;
  month: number;
  budget_code: string;
  budget_description: string;
  initial_budget: number;
  updated_budget: number;
  committed_amount: number;
  liquidated_amount: number;
  paid_amount: number;
  tenant_id: number;
  available_budget: number;
  execution_percentage: number;
  created_at: string;
  updated_at: string;
}

// e-SIC types
export enum ESICStatus {
  PENDING = 'pendente',
  IN_PROGRESS = 'em_andamento',
  ANSWERED = 'respondida',
  APPEALED = 'recurso',
  APPEAL_ANSWERED = 'recurso_respondido',
  CLOSED = 'encerrada',
  EXPIRED = 'expirada',
}

export enum ESICCategory {
  FINANCIAL = 'financeiro',
  CONTRACTS = 'contratos',
  PERSONNEL = 'pessoal',
  SERVICES = 'servicos',
  INFRASTRUCTURE = 'infraestrutura',
  HEALTH = 'saude',
  EDUCATION = 'educacao',
  OTHER = 'outros',
}

export interface ESICRequest {
  id: number;
  protocol: string;
  requester_name: string;
  requester_email: string;
  requester_phone?: string;
  requester_document?: string;
  subject: string;
  description: string;
  category: ESICCategory;
  status: ESICStatus;
  request_date: string;
  due_date: string;
  response_date?: string;
  response_text?: string;
  response_attachments?: string;
  assigned_user_id?: number;
  assigned_department?: string;
  has_appeal: boolean;
  appeal_date?: string;
  appeal_description?: string;
  appeal_due_date?: string;
  appeal_response?: string;
  appeal_response_date?: string;
  internal_notes?: string;
  tenant_id: number;
  is_overdue: boolean;
  days_remaining: number;
  appeal_days_remaining: number;
  created_at: string;
  updated_at: string;
}

// Contract types
export enum ContractType {
  PURCHASE = 'compra',
  SERVICE = 'servico',
  WORK = 'obra',
  LEASE = 'locacao',
  OTHER = 'outros',
}

export enum ContractStatus {
  ACTIVE = 'ativo',
  SUSPENDED = 'suspenso',
  TERMINATED = 'encerrado',
  CANCELLED = 'cancelado',
}

export enum BiddingModality {
  COMPETITION = 'concorrencia',
  PRICE_TAKING = 'tomada_precos',
  INVITATION = 'convite',
  CONTEST = 'concurso',
  AUCTION = 'leilao',
  DIRECT_CONTRACTING = 'contratacao_direta',
  ELECTRONIC_AUCTION = 'pregao_eletronico',
  PRESENTIAL_AUCTION = 'pregao_presencial',
}

export enum BiddingStatus {
  PUBLISHED = 'publicado',
  IN_PROGRESS = 'em_andamento',
  SUSPENDED = 'suspenso',
  CANCELLED = 'cancelado',
  COMPLETED = 'concluido',
  DESERTED = 'deserto',
  FAILED = 'fracassado',
}

export interface Supplier {
  id: number;
  name: string;
  document: string;
  document_type: string;
  email?: string;
  phone?: string;
  address?: string;
  is_active: boolean;
  is_blocked: boolean;
  tenant_id: number;
  created_at: string;
  updated_at: string;
}

export interface Bidding {
  id: number;
  number: string;
  year: number;
  modality: BiddingModality;
  object: string;
  description?: string;
  publication_date: string;
  opening_date: string;
  estimated_value?: number;
  status: BiddingStatus;
  law_basis?: string;
  notice_file?: string;
  attachments?: string;
  winner_supplier_id?: number;
  winning_value?: number;
  tenant_id: number;
  full_number: string;
  created_at: string;
  updated_at: string;
}

export interface Contract {
  id: number;
  number: string;
  year: number;
  contract_type: ContractType;
  object: string;
  description?: string;
  supplier_id: number;
  original_value: number;
  current_value: number;
  signature_date: string;
  start_date: string;
  end_date: string;
  status: ContractStatus;
  bidding_id?: number;
  legal_basis?: string;
  contract_file?: string;
  attachments?: string;
  executed_value: number;
  tenant_id: number;
  full_number: string;
  remaining_value: number;
  execution_percentage: number;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface ApiError {
  detail: string;
  code?: string;
  field?: string;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: any;
}

// Chart types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

// Dashboard types
export interface DashboardStats {
  total_revenues: number;
  total_expenses: number;
  budget_execution: number;
  pending_esic_requests: number;
  active_contracts: number;
  monthly_revenues: ChartData;
  monthly_expenses: ChartData;
  expense_by_category: ChartData;
  revenue_by_category: ChartData;
}

