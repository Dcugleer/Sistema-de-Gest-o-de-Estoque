// Domain Types - Tipos puros do domínio
export interface Company {
  id: string
  cnpj: string
  corporateName: string
  tradeName: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  password: string // Apenas em camadas internas
  role: UserRole
  isActive: boolean
  companyId: string
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  VIEWER = 'VIEWER'
}

export interface Product {
  id: string
  sku: string
  ean?: string
  name: string
  description?: string
  category?: string
  brand?: string
  unit?: string
  weight?: number
  dimensions?: string
  cost?: number
  price?: number
  minStock?: number
  maxStock?: number
  isActive: boolean
  companyId: string
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  number: string
  customerName: string
  customerEmail?: string
  customerPhone?: string
  status: OrderStatus
  priority: OrderPriority
  totalAmount?: number
  notes?: string
  companyId: string
  createdAt: Date
  updatedAt: Date
}

export enum OrderStatus {
  NEW = 'NEW',
  PROCESSING = 'PROCESSING',
  PICKING = 'PICKING',
  PICKED = 'PICKED',
  PACKED = 'PACKED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum OrderPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

// DTOs para transferência de dados
export interface CreateCompanyDTO {
  cnpj: string
  corporateName: string
  tradeName: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
}

export interface CreateUserDTO {
  email: string
  name: string
  password: string
  role: UserRole
  companyId: string
}

export interface CreateProductDTO {
  sku: string
  ean?: string
  name: string
  description?: string
  category?: string
  brand?: string
  unit?: string
  weight?: number
  dimensions?: string
  cost?: number
  price?: number
  minStock?: number
  maxStock?: number
  companyId: string
}

// Tipos de resposta da API
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface ValidationError {
  field: string
  message: string
}