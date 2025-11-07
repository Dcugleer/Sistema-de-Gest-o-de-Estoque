import { z } from 'zod'

// Schemas de validação com Zod
export const createCompanySchema = z.object({
  cnpj: z.string()
    .min(14, 'CNPJ deve ter 14 dígitos')
    .regex(/^\d{14}$/, 'CNPJ deve conter apenas números'),
  corporateName: z.string()
    .min(2, 'Razão Social deve ter pelo menos 2 caracteres')
    .max(200, 'Razão Social deve ter no máximo 200 caracteres'),
  tradeName: z.string()
    .min(2, 'Nome Fantasia deve ter pelo menos 2 caracteres')
    .max(100, 'Nome Fantasia deve ter no máximo 100 caracteres'),
  email: z.string()
    .email('Email inválido')
    .max(255, 'Email deve ter no máximo 255 caracteres'),
  phone: z.string()
    .regex(/^\d{10,11}$/, 'Telefone deve ter 10 ou 11 dígitos')
    .optional(),
  address: z.string()
    .max(255, 'Endereço deve ter no máximo 255 caracteres')
    .optional(),
  city: z.string()
    .max(100, 'Cidade deve ter no máximo 100 caracteres')
    .optional(),
  state: z.string()
    .length(2, 'Estado deve ter 2 caracteres')
    .optional(),
  zipCode: z.string()
    .regex(/^\d{8}$/, 'CEP deve ter 8 dígitos')
    .optional()
})

export const createUserSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .max(255, 'Email deve ter no máximo 255 caracteres'),
  name: z.string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  password: z.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter letra maiúscula, minúscula e número'),
  role: z.enum(['ADMIN', 'OPERATOR', 'VIEWER']),
  companyId: z.string()
    .min(1, 'Empresa é obrigatória')
})

export const createProductSchema = z.object({
  sku: z.string()
    .min(1, 'SKU é obrigatório')
    .max(50, 'SKU deve ter no máximo 50 caracteres'),
  ean: z.string()
    .regex(/^\d{8,14}$/, 'EAN deve ter entre 8 e 14 dígitos')
    .optional(),
  name: z.string()
    .min(1, 'Nome do produto é obrigatório')
    .max(200, 'Nome deve ter no máximo 200 caracteres'),
  description: z.string()
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
    .optional(),
  category: z.string()
    .max(100, 'Categoria deve ter no máximo 100 caracteres')
    .optional(),
  brand: z.string()
    .max(100, 'Marca deve ter no máximo 100 caracteres')
    .optional(),
  unit: z.enum(['UN', 'KG', 'LT', 'CX', 'PCT'])
    .optional(),
  weight: z.number()
    .min(0, 'Peso deve ser positivo')
    .max(999999, 'Peso deve ser menor que 999999')
    .optional(),
  dimensions: z.string()
    .max(50, 'Dimensões devem ter no máximo 50 caracteres')
    .optional(),
  cost: z.number()
    .min(0, 'Custo deve ser positivo')
    .max(999999999, 'Custo deve ser menor que 999999999')
    .optional(),
  price: z.number()
    .min(0, 'Preço deve ser positivo')
    .max(999999999, 'Preço deve ser menor que 999999999')
    .optional(),
  minStock: z.number()
    .min(0, 'Estoque mínimo deve ser positivo')
    .max(999999, 'Estoque mínimo deve ser menor que 999999')
    .optional(),
  maxStock: z.number()
    .min(0, 'Estoque máximo deve ser positivo')
    .max(999999, 'Estoque máximo deve ser menor que 999999')
    .optional(),
  companyId: z.string()
    .min(1, 'Empresa é obrigatória')
})

// Funções de formatação
export const formatCNPJ = (value: string): string => {
  const numbers = value.replace(/\D/g, '')
  return numbers
    .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    .slice(0, 18)
}

export const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '')
  return numbers
    .replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    .slice(0, 15)
}

export const formatZipCode = (value: string): string => {
  const numbers = value.replace(/\D/g, '')
  return numbers
    .replace(/(\d{5})(\d{3})/, '$1-$2')
    .slice(0, 9)
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Funções de validação
export const validateCNPJ = (cnpj: string): boolean => {
  const numbers = cnpj.replace(/\D/g, '')
  
  if (numbers.length !== 14) return false
  
  // Elimina CNPJs inválidos conhecidos
  if (/^(\d)\1{13}$/.test(numbers)) return false
  
  // Validação do dígito verificador
  let length = numbers.length - 2
  let numbersArray = numbers.substring(0, length)
  const digits = numbers.substring(length)
  let sum = 0
  let pos = length - 7
  
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbersArray.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(0))) return false
  
  length = length + 1
  numbersArray = numbers.substring(0, length)
  sum = 0
  pos = length - 7
  
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbersArray.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  
  return result === parseInt(digits.charAt(1))
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Funções de tratamento de erros
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code?: string
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} não encontrado`)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConflictError'
  }
}

// Rate limiting
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  
  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 60000 // 1 minuto
  ) {}
  
  isAllowed(key: string): boolean {
    const now = Date.now()
    const requests = this.requests.get(key) || []
    
    // Remove requests antigas
    const validRequests = requests.filter(time => now - time < this.windowMs)
    
    if (validRequests.length >= this.maxRequests) {
      return false
    }
    
    validRequests.push(now)
    this.requests.set(key, validRequests)
    return true
  }
}

// Cache simples
export class SimpleCache<T> {
  private cache: Map<string, { data: T; expires: number }> = new Map()
  
  constructor(private ttl: number = 300000) {} // 5 minutos
  
  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + this.ttl
    })
  }
  
  get(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null
    
    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }
  
  clear(): void {
    this.cache.clear()
  }
}