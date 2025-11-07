import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}
    
    if (companyId) where.companyId = companyId
    if (status) where.status = status
    if (priority) where.priority = priority

    const orders = await db.order.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            tradeName: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true
              }
            }
          }
        },
        _count: {
          select: {
            items: true
          }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await db.order.count({ where })

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      number,
      customerName,
      customerEmail,
      customerPhone,
      priority,
      totalAmount,
      notes,
      companyId,
      items
    } = body

    // Validar número do pedido único por empresa
    const existingOrder = await db.order.findFirst({
      where: {
        number,
        companyId
      }
    })

    if (existingOrder) {
      return NextResponse.json(
        { error: 'Order number already exists for this company' },
        { status: 400 }
      )
    }

    const order = await db.order.create({
      data: {
        number,
        customerName,
        customerEmail,
        customerPhone,
        priority: priority || 'NORMAL',
        totalAmount,
        notes,
        companyId,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice
          }))
        }
      },
      include: {
        company: {
          select: {
            id: true,
            tradeName: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}