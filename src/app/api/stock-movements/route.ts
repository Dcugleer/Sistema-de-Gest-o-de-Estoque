import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const productId = searchParams.get('productId')
    const warehouseId = searchParams.get('warehouseId')
    const type = searchParams.get('type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}
    
    if (companyId) where.companyId = companyId
    if (productId) where.productId = productId
    if (warehouseId) where.warehouseId = warehouseId
    if (type) where.type = type

    const movements = await db.stockMovement.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true
          }
        },
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
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await db.stockMovement.count({ where })

    return NextResponse.json({
      movements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching stock movements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock movements' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      type,
      quantity,
      reason,
      productId,
      warehouseId,
      locationId,
      userId,
      companyId
    } = body

    // Buscar ou criar item de estoque
    const stockItem = await db.stockItem.upsert({
      where: {
        productId_warehouseId_locationId: {
          productId,
          warehouseId,
          locationId: locationId || null
        }
      },
      update: {},
      create: {
        productId,
        warehouseId,
        locationId,
        companyId,
        quantity: 0,
        reserved: 0,
        available: 0
      }
    })

    // Atualizar quantidade do estoque
    let newQuantity = stockItem.quantity
    let newAvailable = stockItem.available

    if (type === 'IN') {
      newQuantity += quantity
      newAvailable += quantity
    } else if (type === 'OUT') {
      if (stockItem.available < quantity) {
        return NextResponse.json(
          { error: 'Insufficient stock available' },
          { status: 400 }
        )
      }
      newQuantity -= quantity
      newAvailable -= quantity
    } else if (type === 'ADJUSTMENT') {
      newQuantity = quantity
      newAvailable = quantity - stockItem.reserved
    }

    await db.stockItem.update({
      where: { id: stockItem.id },
      data: {
        quantity: newQuantity,
        available: newAvailable
      }
    })

    // Criar movimentação
    const movement = await db.stockMovement.create({
      data: {
        type,
        quantity,
        reason,
        productId,
        warehouseId,
        locationId,
        userId,
        companyId
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true
          }
        },
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
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(movement, { status: 201 })
  } catch (error) {
    console.error('Error creating stock movement:', error)
    return NextResponse.json(
      { error: 'Failed to create stock movement' },
      { status: 500 }
    )
  }
}