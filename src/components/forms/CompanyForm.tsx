'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCreateCompany, useCompanies } from '@/shared/hooks/useApi'
import { Loader2, Building2, CheckCircle, AlertCircle } from 'lucide-react'
import { CreateCompanyDTO } from '@/shared/types'
import { formatCNPJ, formatPhone, formatZipCode, validateCNPJ, validateEmail } from '@/shared/utils'
import { useToast } from '@/shared/components/Toast'

export function CompanyForm() {
  const [formData, setFormData] = useState<CreateCompanyDTO>({
    cnpj: '',
    corporateName: '',
    tradeName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CreateCompanyDTO, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { createCompany } = useCreateCompany()
  const { data: companies } = useCompanies()
  const { success, error } = useToast()

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateCompanyDTO, string>> = {}

    // Validação CNPJ
    const cleanCNPJ = formData.cnpj.replace(/\D/g, '')
    if (!cleanCNPJ) {
      newErrors.cnpj = 'CNPJ é obrigatório'
    } else if (cleanCNPJ.length !== 14) {
      newErrors.cnpj = 'CNPJ deve ter 14 dígitos'
    } else if (!validateCNPJ(cleanCNPJ)) {
      newErrors.cnpj = 'CNPJ inválido'
    }

    // Validação Razão Social
    if (!formData.corporateName.trim()) {
      newErrors.corporateName = 'Razão Social é obrigatória'
    } else if (formData.corporateName.length < 3) {
      newErrors.corporateName = 'Razão Social deve ter pelo menos 3 caracteres'
    } else if (formData.corporateName.length > 200) {
      newErrors.corporateName = 'Razão Social deve ter no máximo 200 caracteres'
    }

    // Validação Nome Fantasia
    if (!formData.tradeName.trim()) {
      newErrors.tradeName = 'Nome Fantasia é obrigatório'
    } else if (formData.tradeName.length < 3) {
      newErrors.tradeName = 'Nome Fantasia deve ter pelo menos 3 caracteres'
    } else if (formData.tradeName.length > 100) {
      newErrors.tradeName = 'Nome Fantasia deve ter no máximo 100 caracteres'
    }

    // Validação Email
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    // Validação Telefone (opcional)
    if (formData.phone) {
      const cleanPhone = formData.phone.replace(/\D/g, '')
      if (cleanPhone.length < 10 || cleanPhone.length > 11) {
        newErrors.phone = 'Telefone deve ter 10 ou 11 dígitos'
      }
    }

    // Validação CEP (opcional)
    if (formData.zipCode) {
      const cleanZipCode = formData.zipCode.replace(/\D/g, '')
      if (cleanZipCode.length !== 8) {
        newErrors.zipCode = 'CEP deve ter 8 dígitos'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      error('Erros de validação', 'Por favor, corrija os campos destacados')
      return
    }

    setIsSubmitting(true)

    try {
      const companyData: CreateCompanyDTO = {
        cnpj: formData.cnpj.replace(/\D/g, ''),
        corporateName: formData.corporateName.trim(),
        tradeName: formData.tradeName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone ? formData.phone.replace(/\D/g, '') : undefined,
        address: formData.address?.trim() || undefined,
        city: formData.city?.trim() || undefined,
        state: formData.state?.trim().toUpperCase() || undefined,
        zipCode: formData.zipCode ? formData.zipCode.replace(/\D/g, '') : undefined
      }

      await createCompany(companyData)
      
      // Reset form
      setFormData({
        cnpj: '',
        corporateName: '',
        tradeName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
      })
      setErrors({})
      
      success('Empresa cadastrada com sucesso!', `${companyData.tradeName} foi adicionada ao sistema.`)
    } catch (err: any) {
      console.error('Error creating company:', err)
      error('Erro ao cadastrar empresa', err.message || 'Tente novamente mais tarde.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof CreateCompanyDTO) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value = e.target.value
    
    // Aplicar formatação para campos específicos
    if (field === 'cnpj') {
      value = formatCNPJ(value)
    } else if (field === 'phone') {
      value = formatPhone(value)
    } else if (field === 'zipCode') {
      value = formatZipCode(value)
    } else if (field === 'state') {
      value = value.toUpperCase()
    }

    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Limpar erro do campo quando usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Cadastrar Nova Empresa
          </CardTitle>
          <CardDescription>
            Preencha os dados para cadastrar uma nova empresa no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={handleChange('cnpj')}
                  placeholder="00.000.000/0000-00"
                  className={errors.cnpj ? 'border-red-500 focus:border-red-500' : ''}
                  maxLength={18}
                />
                {errors.cnpj && (
                  <p className="text-sm text-red-500 mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.cnpj}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="tradeName">Nome Fantasia *</Label>
                <Input
                  id="tradeName"
                  value={formData.tradeName}
                  onChange={handleChange('tradeName')}
                  placeholder="Nome Fantasia"
                  className={errors.tradeName ? 'border-red-500 focus:border-red-500' : ''}
                  maxLength={100}
                />
                {errors.tradeName && (
                  <p className="text-sm text-red-500 mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.tradeName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="corporateName">Razão Social *</Label>
              <Input
                id="corporateName"
                value={formData.corporateName}
                onChange={handleChange('corporateName')}
                placeholder="Razão Social completa"
                className={errors.corporateName ? 'border-red-500 focus:border-red-500' : ''}
                maxLength={200}
              />
              {errors.corporateName && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.corporateName}
                </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  placeholder="empresa@exemplo.com"
                  className={errors.email ? 'border-red-500 focus:border-red-500' : ''}
                  maxLength={255}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  placeholder="(00) 00000-0000"
                  className={errors.phone ? 'border-red-500 focus:border-red-500' : ''}
                  maxLength={15}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={handleChange('address')}
                placeholder="Rua, número, complemento"
                maxLength={255}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={handleChange('city')}
                  placeholder="Cidade"
                  maxLength={100}
                />
              </div>
              <div>
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={handleChange('state')}
                  placeholder="UF"
                  maxLength={2}
                  className="uppercase"
                />
              </div>
              <div>
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange('zipCode')}
                  placeholder="00000-000"
                  className={errors.zipCode ? 'border-red-500 focus:border-red-500' : ''}
                  maxLength={9}
                />
                {errors.zipCode && (
                  <p className="text-sm text-red-500 mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.zipCode}
                  </p>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Cadastrar Empresa
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Companies List */}
      <Card>
        <CardHeader>
          <CardTitle>Empresas Cadastradas</CardTitle>
          <CardDescription>
            Lista de empresas já cadastradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {companies?.data && companies.data.length > 0 ? (
              companies.data.map((company: any) => (
                <div key={company.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{company.tradeName}</h4>
                      <p className="text-sm text-gray-500">{company.corporateName}</p>
                      <p className="text-sm text-gray-500">{company.cnpj}</p>
                      <p className="text-sm text-gray-500">{company.email}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-gray-500">
                        {company.pagination?.total || 0} usuários
                      </p>
                      <p className="text-gray-500">
                        {company.pagination?.total || 0} produtos
                      </p>
                      <p className="text-gray-500">
                        {company.pagination?.total || 0} pedidos
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nenhuma empresa cadastrada ainda</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}