import { NextRequest } from 'next/server'
import { ApiHandler, validateJson, getQueryParams, createPaginationResponse, setCorsHeaders, setSecurityHeaders } from '@/infrastructure/http/middleware'
import { CompanyService } from '@/application/services/CompanyService'
import { CreateCompanyDTO } from '@/shared/types'

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const params = getQueryParams(request)
    const { companies, total } = await CompanyService.getCompanies(params.page, params.limit)
    
    const response = ApiHandler.handle(() => 
      createPaginationResponse(companies, params.page, params.limit, total)
    )
    
    return setCorsHeaders(setSecurityHeaders(response))
  } catch (error) {
    const response = ApiHandler.handle(() => { throw error })
    return setCorsHeaders(setSecurityHeaders(response))
  } finally {
    console.log(`GET /api/companies - ${Date.now() - startTime}ms`)
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const rateLimitResponse = (await import('@/infrastructure/http/middleware')).rateLimit(10, 60000)(request)
    if (rateLimitResponse) return rateLimitResponse
    
    const body = await validateJson(request)
    
    const companyData: CreateCompanyDTO = {
      cnpj: body.cnpj?.replace(/\D/g, ''), // Remover formatação
      corporateName: body.corporateName,
      tradeName: body.tradeName,
      email: body.email,
      phone: body.phone?.replace(/\D/g, ''), // Remover formatação
      address: body.address,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode?.replace(/\D/g, '') // Remover formatação
    }
    
    const company = await CompanyService.createCompany(companyData)
    
    const response = ApiHandler.handle(() => company, { successStatus: 201 })
    return setCorsHeaders(setSecurityHeaders(response))
  } catch (error) {
    const response = ApiHandler.handle(() => { throw error })
    return setCorsHeaders(setSecurityHeaders(response))
  } finally {
    console.log(`POST /api/companies - ${Date.now() - startTime}ms`)
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 })
  return setCorsHeaders(response)
}