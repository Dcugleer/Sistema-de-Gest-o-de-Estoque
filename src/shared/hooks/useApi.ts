import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query'
import { useState, useCallback } from 'react'
import { Company, User, Product, Order, CreateCompanyDTO, CreateUserDTO, CreateProductDTO, ApiResponse } from '@/shared/types'
import { SimpleCache } from '@/shared/utils'

// Cache local para otimização
const apiCache = new SimpleCache<any>(300000) // 5 minutos

// Configuração do QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minuto
      retry: (failureCount, error) => {
        // Não retry para erros de validação
        if (error && typeof error === 'object' && 'field' in error) {
          return false
        }
        return failureCount < 3
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
})

// Hook personalizado para chamadas API com tratamento de erros
function useApiCall<T = any>() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const execute = useCallback(async (apiCall: () => Promise<T>): Promise<T | null> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await apiCall()
      return result
    } catch (err: any) {
      const errorMessage = err?.error || err?.message || 'Erro desconhecido'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  return { execute, isLoading, error, clearError: () => setError(null) }
}

// Hook para Companies
export function useCompanies(params?: { page?: number; limit?: number }) {
  const cacheKey = `companies-${JSON.stringify(params || {})}`
  
  return useQuery({
    queryKey: ['companies', params],
    queryFn: async (): Promise<ApiResponse<Company[]>> => {
      // Verificar cache primeiro
      const cached = apiCache.get(cacheKey)
      if (cached) return cached
      
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      
      const response = await fetch(`/api/companies?${queryParams}`)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch companies')
      }
      
      const data = await response.json()
      apiCache.set(cacheKey, data)
      return data
    },
    staleTime: 60000, // 1 minuto
    enabled: true,
  })
}

export function useCreateCompany() {
  const queryClient = useQueryClient()
  const { execute, isLoading, error } = useApiCall()
  
  const mutation = useMutation({
    mutationFn: async (companyData: CreateCompanyDTO): Promise<Company> => {
      return await execute(async () => {
        const response = await fetch('/api/companies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(companyData),
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to create company')
        }
        
        const result = await response.json()
        return result.data
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      apiCache.clear() // Limpar cache após mutação
    },
    onError: (error) => {
      console.error('Error creating company:', error)
    },
  })
  
  return {
    createCompany: mutation.mutateAsync,
    isLoading: isLoading || mutation.isPending,
    error: error || mutation.error,
  }
}

// Hook para Users
export function useUsers(params?: { companyId?: string; page?: number; limit?: number }) {
  const cacheKey = `users-${JSON.stringify(params || {})}`
  
  return useQuery({
    queryKey: ['users', params],
    queryFn: async (): Promise<ApiResponse<User[]>> => {
      const cached = apiCache.get(cacheKey)
      if (cached) return cached
      
      const queryParams = new URLSearchParams()
      if (params?.companyId) queryParams.append('companyId', params.companyId)
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      
      const response = await fetch(`/api/users?${queryParams}`)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch users')
      }
      
      const data = await response.json()
      apiCache.set(cacheKey, data)
      return data
    },
    staleTime: 60000,
    enabled: true,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  const { execute, isLoading, error } = useApiCall()
  
  const mutation = useMutation({
    mutationFn: async (userData: CreateUserDTO): Promise<User> => {
      return await execute(async () => {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to create user')
        }
        
        const result = await response.json()
        return result.data
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      apiCache.clear()
    },
    onError: (error) => {
      console.error('Error creating user:', error)
    },
  })
  
  return {
    createUser: mutation.mutateAsync,
    isLoading: isLoading || mutation.isPending,
    error: error || mutation.error,
  }
}

// Hook para Products
export function useProducts(params?: { 
  companyId?: string; 
  search?: string; 
  page?: number; 
  limit?: number 
}) {
  const cacheKey = `products-${JSON.stringify(params || {})}`
  
  return useQuery({
    queryKey: ['products', params],
    queryFn: async (): Promise<ApiResponse<Product[]>> => {
      const cached = apiCache.get(cacheKey)
      if (cached) return cached
      
      const queryParams = new URLSearchParams()
      if (params?.companyId) queryParams.append('companyId', params.companyId)
      if (params?.search) queryParams.append('search', params.search)
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      
      const response = await fetch(`/api/products?${queryParams}`)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch products')
      }
      
      const data = await response.json()
      apiCache.set(cacheKey, data)
      return data
    },
    staleTime: 60000,
    enabled: true,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  const { execute, isLoading, error } = useApiCall()
  
  const mutation = useMutation({
    mutationFn: async (productData: CreateProductDTO): Promise<Product> => {
      return await execute(async () => {
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to create product')
        }
        
        const result = await response.json()
        return result.data
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      apiCache.clear()
    },
    onError: (error) => {
      console.error('Error creating product:', error)
    },
  })
  
  return {
    createProduct: mutation.mutateAsync,
    isLoading: isLoading || mutation.isPending,
    error: error || mutation.error,
  }
}

// Hook para Dashboard
export function useDashboardData(companyId?: string) {
  const cacheKey = `dashboard-${companyId || 'all'}`
  
  return useQuery({
    queryKey: ['dashboard', companyId],
    queryFn: async (): Promise<any> => {
      const cached = apiCache.get(cacheKey)
      if (cached) return cached
      
      const params = companyId ? `?companyId=${companyId}` : ''
      const response = await fetch(`/api/dashboard${params}`)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch dashboard data')
      }
      
      const data = await response.json()
      apiCache.set(cacheKey, data)
      return data
    },
    refetchInterval: 30000, // Atualizar a cada 30 segundos
    staleTime: 25000, // Considerar obsoleto após 25 segundos
  })
}

// Hook para limpar cache
export function useClearCache() {
  const queryClient = useQueryClient()
  
  return useCallback(() => {
    queryClient.clear()
    apiCache.clear()
  }, [queryClient])
}