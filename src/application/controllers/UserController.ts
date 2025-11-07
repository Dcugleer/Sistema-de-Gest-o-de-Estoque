import { NextRequest } from 'next/server'
import { ApiHandler, validateJson, getQueryParams, createPaginationResponse, setCorsHeaders, setSecurityHeaders } from '@/infrastructure/http/middleware'
import { UserService } from '@/application/services/UserService'
import { CreateUserDTO } from '@/shared/types'

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const params = getQueryParams(request)
    const { users, total } = await UserService.getUsers(params.companyId, params.page, params.limit)
    
    const response = ApiHandler.handle(() => 
      createPaginationResponse(users, params.page, params.limit, total)
    )
    
    const finalResponse = setCorsHeaders(setSecurityHeaders(await response))
    
    return finalResponse
  } catch (error) {
    const response = ApiHandler.handle(() => { throw error })
    return setCorsHeaders(setSecurityHeaders(response))
  } finally {
    // Log da requisição
    console.log(`GET /api/users - ${Date.now() - startTime}ms`)
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Rate limiting
    const rateLimitResponse = (await import('@/infrastructure/http/middleware')).rateLimit(10, 60000)(request)
    if (rateLimitResponse) return rateLimitResponse
    
    // Validar JSON
    const body = await validateJson(request)
    
    // Validar DTO
    const userData: CreateUserDTO = {
      email: body.email,
      name: body.name,
      password: body.password,
      role: body.role || 'OPERATOR',
      companyId: body.companyId
    }
    
    // Criar usuário através do service
    const user = await UserService.createUser(userData)
    
    const response = ApiHandler.handle(() => user, { successStatus: 201 })
    const finalResponse = setCorsHeaders(setSecurityHeaders(response))
    
    return finalResponse
  } catch (error) {
    const response = ApiHandler.handle(() => { throw error })
    return setCorsHeaders(setSecurityHeaders(response))
  } finally {
    console.log(`POST /api/users - ${Date.now() - startTime}ms`)
  }
}

// Handler para OPTIONS (CORS preflight)
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 })
  return setCorsHeaders(response)
}