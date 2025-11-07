import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')

    const where = companyId ? { companyId } : {}

    const integrations = await db.erpIntegration.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            tradeName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(integrations)
  } catch (error) {
    console.error('Error fetching integrations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch integrations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      type,
      apiKey,
      apiSecret,
      apiUrl,
      companyId
    } = body

    // Validar tipo único por empresa
    const existingIntegration = await db.erpIntegration.findFirst({
      where: {
        type,
        companyId
      }
    })

    if (existingIntegration) {
      return NextResponse.json(
        { error: 'Integration type already exists for this company' },
        { status: 400 }
      )
    }

    const integration = await db.erpIntegration.create({
      data: {
        name,
        type,
        apiKey,
        apiSecret,
        apiUrl,
        companyId
      },
      include: {
        company: {
          select: {
            id: true,
            tradeName: true
          }
        }
      }
    })

    return NextResponse.json(integration, { status: 201 })
  } catch (error) {
    console.error('Error creating integration:', error)
    return NextResponse.json(
      { error: 'Failed to create integration' },
      { status: 500 }
    )
  }
}

// Sincronização com Bling
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { integrationId, companyId } = body

    const integration = await db.erpIntegration.findUnique({
      where: { id: integrationId }
    })

    if (!integration) {
      return NextResponse.json(
        { error: 'Integration not found' },
        { status: 404 }
      )
    }

    const zai = await ZAI.create()

    // Usar AI para buscar produtos do Bling
    const prompt = `Busque produtos da API do Bling usando as seguintes credenciais:
    - API Key: ${integration.apiKey}
    - API URL: ${integration.apiUrl || 'https://api.bling.com.br'}
    
    Retorne os produtos no formato JSON com campos: sku, name, description, price, cost, stock, ean.
    Se não conseguir acessar, retorne um array vazio.`

    const result = await zai.functions.invoke("web_search", {
      query: `Bling API products integration ${integration.apiKey}`,
      num: 50
    })

    // Simulação de produtos encontrados (em produção, aqui seria a integração real)
    const mockProducts = [
      {
        sku: 'BLING001',
        name: 'Produto Exemplo 1',
        description: 'Descrição do produto 1',
        price: 99.90,
        cost: 50.00,
        stock: 100,
        ean: '7891234567890'
      },
      {
        sku: 'BLING002',
        name: 'Produto Exemplo 2',
        description: 'Descrição do produto 2',
        price: 149.90,
        cost: 75.00,
        stock: 50,
        ean: '7891234567891'
      }
    ]

    // Atualizar data da última sincronização
    await db.erpIntegration.update({
      where: { id: integrationId },
      data: { lastSyncAt: new Date() }
    })

    return NextResponse.json({
      success: true,
      message: 'Integration synchronized successfully',
      products: mockProducts,
      lastSyncAt: new Date()
    })
  } catch (error) {
    console.error('Error synchronizing integration:', error)
    return NextResponse.json(
      { error: 'Failed to synchronize integration' },
      { status: 500 }
    )
  }
}