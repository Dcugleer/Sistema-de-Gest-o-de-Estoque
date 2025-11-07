import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse, ValidationError, NotFoundError, ConflictError } from '@/shared/types'

// Handler padrão para tratamento de erros
export class ApiHandler {
  static async handle<T>(
    handler: () => Promise<T>,
    options: {
      successStatus?: number
      errorMessage?: string
    } = {}
  ): Promise<NextResponse<ApiResponse<T>>> {
    try {
      const data = await handler()
      
      return NextResponse.json({
        data,
        message: 'Operação realizada com sucesso'
      }, { 
        status: options.successStatus || 200 
      })
    } catch (error) {
      return this.handleError(error, options.errorMessage)
    }
  }
  
  private static handleError(error: unknown, customMessage?: string): NextResponse<ApiResponse<never>> {
    console.error('API Error:', error)
    
    if (error instanceof ValidationError) {
      return NextResponse.json({
        error: error.message,
        field: error.field
      }, { status: 400 })
    }
    
    if (error instanceof NotFoundError) {
      return NextResponse.json({
        error: error.message
      }, { status: 404 })
    }
    
    if (error instanceof ConflictError) {
      return NextResponse.json({
        error: error.message
      }, { status: 409 })
    }
    
    // Erros genéricos
    const message = customMessage || 'Erro interno do servidor'
    const status = error instanceof Error ? 500 : 400
    
    return NextResponse.json({
      error: message,
      ...(process.env.NODE_ENV === 'development' && { 
        details: error instanceof Error ? error.message : String(error) 
      })
    }, { status })
  }
}

// Middleware de validação de conteúdo
export async function validateJson(request: NextRequest): Promise<any> {
  try {
    const contentType = request.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      throw new ValidationError('Content-Type deve ser application/json')
    }
    
    const body = await request.json()
    if (!body || typeof body !== 'object') {
      throw new ValidationError('Corpo da requisição inválido')
    }
    
    return body
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error
    }
    throw new ValidationError('JSON inválido')
  }
}

// Middleware de rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(
  requests: number = 100,
  windowMs: number = 60000 // 1 minuto
) {
  return (request: NextRequest) => {
    const ip = request.ip || 'unknown'
    const now = Date.now()
    
    const clientData = rateLimitStore.get(ip)
    
    if (!clientData || now > clientData.resetTime) {
      rateLimitStore.set(ip, {
        count: 1,
        resetTime: now + windowMs
      })
      return null
    }
    
    if (clientData.count >= requests) {
      return NextResponse.json({
        error: 'Muitas requisições. Tente novamente mais tarde.'
      }, { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil((clientData.resetTime - now) / 1000).toString()
        }
      })
    }
    
    clientData.count++
    return null
  }
}

// Middleware de CORS
export function setCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Max-Age', '86400')
  
  return response
}

// Middleware de segurança
export function setSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  return response
}

// Função para extrair parâmetros de query
export function getQueryParams(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  return {
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '10'),
    search: searchParams.get('search') || undefined,
    companyId: searchParams.get('companyId') || undefined,
    status: searchParams.get('status') || undefined,
    priority: searchParams.get('priority') || undefined,
    type: searchParams.get('type') || undefined
  }
}

// Função para criar resposta de paginação
export function createPaginationResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
) {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

// Middleware de logging
export function logRequest(request: NextRequest, startTime: number) {
  const duration = Date.now() - startTime
  const method = request.method
  const url = request.url
  const ip = request.ip || 'unknown'
  
  console.log(`${method} ${url} - ${duration}ms - IP: ${ip}`)
  
  // Log em arquivo em produção
  if (process.env.NODE_ENV === 'production') {
    // Implementar logging em arquivo
  }
}