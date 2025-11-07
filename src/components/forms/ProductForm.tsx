'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCreateProduct, useProducts, useCompanies } from '@/shared/hooks/useApi'
import { Loader2, Package } from 'lucide-react'

interface ProductFormData {
  sku: string
  ean: string
  name: string
  description: string
  category: string
  brand: string
  unit: string
  weight: string
  dimensions: string
  cost: string
  price: string
  minStock: string
  maxStock: string
  companyId: string
}

export function ProductForm() {
  const [formData, setFormData] = useState<ProductFormData>({
    sku: '',
    ean: '',
    name: '',
    description: '',
    category: '',
    brand: '',
    unit: '',
    weight: '',
    dimensions: '',
    cost: '',
    price: '',
    minStock: '',
    maxStock: '',
    companyId: ''
  })

  const createProductMutation = useCreateProduct()
  const { data: products } = useProducts()
  const { data: companies } = useCompanies()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.companyId) {
      alert('Por favor, selecione uma empresa')
      return
    }

    try {
      const productData = {
        ...formData,
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        minStock: formData.minStock ? parseInt(formData.minStock) : undefined,
        maxStock: formData.maxStock ? parseInt(formData.maxStock) : undefined,
      }
      
      await createProductMutation.mutateAsync(productData)
      
      // Reset form
      setFormData({
        sku: '',
        ean: '',
        name: '',
        description: '',
        category: '',
        brand: '',
        unit: '',
        weight: '',
        dimensions: '',
        cost: '',
        price: '',
        minStock: '',
        maxStock: '',
        companyId: ''
      })
    } catch (error) {
      console.error('Error creating product:', error)
    }
  }

  const handleChange = (field: keyof ProductFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleSelectChange = (field: keyof ProductFormData) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Cadastrar Novo Produto
          </CardTitle>
          <CardDescription>
            Preencha os dados para cadastrar um novo produto no estoque
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Empresa */}
            <div>
              <Label htmlFor="companyId">Empresa *</Label>
              <Select value={formData.companyId} onValueChange={handleSelectChange('companyId')}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {companies?.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.tradeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={handleChange('sku')}
                  placeholder="SKU do produto"
                  required
                />
              </div>
              <div>
                <Label htmlFor="ean">EAN/Código de Barras</Label>
                <Input
                  id="ean"
                  value={formData.ean}
                  onChange={handleChange('ean')}
                  placeholder="7891234567890"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange('name')}
                placeholder="Nome completo do produto"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleChange('description')}
                placeholder="Descrição detalhada do produto"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={handleChange('category')}
                  placeholder="Categoria do produto"
                />
              </div>
              <div>
                <Label htmlFor="brand">Marca</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={handleChange('brand')}
                  placeholder="Marca do produto"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="unit">Unidade</Label>
                <Select value={formData.unit} onValueChange={handleSelectChange('unit')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UN">Unidade</SelectItem>
                    <SelectItem value="KG">Quilograma</SelectItem>
                    <SelectItem value="LT">Litro</SelectItem>
                    <SelectItem value="CX">Caixa</SelectItem>
                    <SelectItem value="PCT">Pacote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.001"
                  value={formData.weight}
                  onChange={handleChange('weight')}
                  placeholder="0.000"
                />
              </div>
              <div>
                <Label htmlFor="dimensions">Dimensões</Label>
                <Input
                  id="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange('dimensions')}
                  placeholder="10x20x30 cm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cost">Custo (R$)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={handleChange('cost')}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="price">Preço de Venda (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange('price')}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minStock">Estoque Mínimo</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={formData.minStock}
                  onChange={handleChange('minStock')}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="maxStock">Estoque Máximo</Label>
                <Input
                  id="maxStock"
                  type="number"
                  value={formData.maxStock}
                  onChange={handleChange('maxStock')}
                  placeholder="0"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={createProductMutation.isPending}
            >
              {createProductMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                'Cadastrar Produto'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos Cadastrados</CardTitle>
          <CardDescription>
            Lista de produtos já cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {products && products.products.length > 0 ? (
              products.products.map((product) => (
                <div key={product.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                      {product.ean && <p className="text-sm text-gray-500">EAN: {product.ean}</p>}
                      {product.category && <p className="text-sm text-gray-500">Categoria: {product.category}</p>}
                      {product.brand && <p className="text-sm text-gray-500">Marca: {product.brand}</p>}
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-gray-500">
                        {product.company.tradeName}
                      </p>
                      {product.price && (
                        <p className="font-medium">
                          R$ {product.price.toFixed(2)}
                        </p>
                      )}
                      <p className="text-gray-500">
                        {product._count.orderItems} pedidos
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nenhum produto cadastrado ainda</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}