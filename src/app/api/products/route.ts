import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')

    const where = companyId ? { companyId } : {}

    if (search) {
      where['OR'] = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { ean: { contains: search, mode: 'insensitive' } }
      ]
    }

    const products = await db.product.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            tradeName: true
          }
        },
        stockItems: {
          include: {
            warehouse: {
              select: {
                id: true,
                name: true,
                code: true
              }
            },
            location: {
              select: {
                id: true,
                code: true
              }
            }
          }
        },
        _count: {
          select: {
            orderItems: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await db.product.count({ where })

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      sku,
      ean,
      name,
      description,
      category,
      brand,
      unit,
      weight,
      dimensions,
      cost,
      price,
      minStock,
      maxStock,
      companyId
    } = body

    // Validar SKU único por empresa
    const existingProduct = await db.product.findFirst({
      where: {
        sku,
        companyId
      }
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'SKU already exists for this company' },
        { status: 400 }
      )
    }

    const product = await db.product.create({
      data: {
        sku,
        ean,
        name,
        description,
        category,
        brand,
        unit,
        weight,
        dimensions,
        cost,
        price,
        minStock,
        maxStock,
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

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}