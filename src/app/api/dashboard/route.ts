import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')

    const where = companyId ? { companyId } : {}

    // Contagem total de produtos
    const totalProducts = await db.product.count({ where })

    // Contagem de pedidos por status
    const ordersByStatus = await db.order.groupBy({
      by: ['status'],
      where,
      _count: {
        id: true
      }
    })

    // Contagem de itens com estoque baixo
    const lowStockItems = await db.stockItem.count({
      where: {
        ...where,
        available: {
          lt: 10 // Considera baixo se tiver menos de 10 unidades
        }
      }
    })

    // Movimentações hoje
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayMovements = await db.stockMovement.count({
      where: {
        ...where,
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    // Pedidos recentes
    const recentOrders = await db.order.findMany({
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
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    })

    // Itens com estoque crítico
    const criticalStockItems = await db.stockItem.findMany({
      where: {
        ...where,
        available: {
          lt: 5
        }
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            minStock: true
          }
        },
        warehouse: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      },
      orderBy: {
        available: 'asc'
      },
      take: 10
    })

    // Movimentações recentes
    const recentMovements = await db.stockMovement.findMany({
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
      take: 10
    })

    // Estatísticas de pedidos
    const totalOrders = ordersByStatus.reduce((sum, status) => sum + status._count.id, 0)
    const activeOrders = ordersByStatus
      .filter(status => ['NEW', 'PROCESSING', 'PICKING'].includes(status.status))
      .reduce((sum, status) => sum + status._count.id, 0)

    const dashboardData = {
      stats: {
        totalProducts,
        totalOrders,
        activeOrders,
        lowStockItems,
        todayMovements
      },
      ordersByStatus,
      recentOrders,
      criticalStockItems,
      recentMovements
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}