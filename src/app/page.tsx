'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Warehouse, 
  BarChart3,
  Building2,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Truck,
  AlertCircle,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { useDashboardData } from '@/shared/hooks/useApi'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { data: dashboardData, isLoading, error } = useDashboardData()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800'
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-800'
      case 'PICKING': return 'bg-purple-100 text-purple-800'
      case 'PICKED': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'NORMAL': return 'bg-blue-100 text-blue-800'
      case 'LOW': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Erro ao carregar dados do dashboard</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  const stats = dashboardData?.stats || {
    totalProducts: 0,
    totalOrders: 0,
    activeOrders: 0,
    lowStockItems: 0,
    todayMovements: 0
  }

  const recentOrders = dashboardData?.recentOrders || []
  const criticalStockItems = dashboardData?.criticalStockItems || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Warehouse className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Sistema de Gestão de Estoque
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/companies">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Empresa
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Produto
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo Pedido
              </Button>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nova Movimentação
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="companies">Empresas</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="stock">Estoque</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="flex items-center text-green-600">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      Produtos cadastrados
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pedidos Ativos</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="flex items-center text-blue-600">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      Em processamento
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.lowStockItems}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="flex items-center text-red-600">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      Requer atenção imediata
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Movimentações Hoje</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.todayMovements}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="flex items-center text-green-600">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      Entradas e saídas
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders and Low Stock */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Pedidos Recentes
                  </CardTitle>
                  <CardDescription>
                    Últimos pedidos recebidos no sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="font-medium">#{order.number}</p>
                              <p className="text-sm text-gray-500">{order.customerName}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityColor(order.priority)}>
                              {order.priority}
                            </Badge>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                            <span className="text-sm text-gray-500">{order._count.items} itens</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Nenhum pedido encontrado</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Low Stock Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                    Estoque Crítico
                  </CardTitle>
                  <CardDescription>
                    Produtos com estoque abaixo do mínimo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {criticalStockItems.length > 0 ? (
                      criticalStockItems.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-gray-500">{item.product.sku}</p>
                            <p className="text-xs text-gray-400">{item.warehouse.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-red-600">{item.available} unidades</p>
                            <p className="text-sm text-gray-500">Mín: {item.product.minStock || 0}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Nenhum item com estoque crítico</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="companies">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Building2 className="h-5 w-5 mr-2" />
                      Gestão de Empresas
                    </span>
                    <Link href="/companies">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Empresa
                      </Button>
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    Cadastre e gerencie múltiplas empresas (multi-CNPJ) em um único sistema
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Módulo de Empresas
                </h3>
                <p className="text-gray-500 mb-4">
                  Cadastre empresas com CNPJ, razão social e configure usuários e permissões
                </p>
                <Link href="/companies">
                  <Button>Começar a Cadastrar</Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Gestão de Usuários
                    </span>
                    <Link href="/users">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Usuário
                      </Button>
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    Cadastre usuários com diferentes níveis de permissão e acesso
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Módulo de Usuários
                </h3>
                <p className="text-gray-500 mb-4">
                  Configure usuários com permissões de Administrador, Operador e Visualizador
                </p>
                <Link href="/users">
                  <Button>Começar a Cadastrar</Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Package className="h-5 w-5 mr-2" />
                      Gestão de Produtos
                    </span>
                    <Link href="/products">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Produto
                      </Button>
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    Cadastre e gerencie todos os produtos do seu estoque
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Módulo de Produtos
                </h3>
                <p className="text-gray-500 mb-4">
                  Cadastre produtos com SKU, EAN, descrição e controle de estoque mínimo
                </p>
                <Link href="/products">
                  <Button>Começar a Cadastrar</Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Gestão de Pedidos
                  </span>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Pedido
                  </Button>
                </CardTitle>
                <CardDescription>
                  Controle completo do ciclo de vida dos pedidos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Módulo de Pedidos
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Gerencie pedidos com priorização, status e listas de separação
                  </p>
                  <Button>Começar a Gerenciar</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stock Tab */}
          <TabsContent value="stock">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Warehouse className="h-5 w-5 mr-2" />
                    Controle de Estoque
                  </span>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Movimentação
                  </Button>
                </CardTitle>
                <CardDescription>
                  Gerencie entradas, saídas e transferências de estoque
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Warehouse className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Módulo de Estoque
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Controle manual de entradas, saídas e histórico completo
                  </p>
                  <Button>Começar a Controlar</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Integrações ERP
                  </span>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Integração
                  </Button>
                </CardTitle>
                <CardDescription>
                  Conecte seu sistema com plataformas ERP
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Módulo de Integrações
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Integre com Bling, Tiny e outros ERPs para sincronização automática
                  </p>
                  <Button>Configurar Integração</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}