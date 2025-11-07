import { db } from '@/lib/db'
import { Company, CreateCompanyDTO, User, CreateUserDTO, Product, CreateProductDTO, Order, OrderStatus, OrderPriority } from '@/shared/types'
import { ValidationError, NotFoundError, ConflictError, validateCNPJ, validateEmail } from '@/shared/utils'

// Repository Pattern para isolamento do banco de dados
export class CompanyRepository {
  static async create(data: CreateCompanyDTO): Promise<Company> {
    // Validações de negócio
    if (!validateCNPJ(data.cnpj)) {
      throw new ValidationError('CNPJ inválido', 'cnpj')
    }
    
    if (!validateEmail(data.email)) {
      throw new ValidationError('Email inválido', 'email')
    }
    
    // Verificar CNPJ único
    const existingCompany = await db.company.findUnique({
      where: { cnpj: data.cnpj }
    })
    
    if (existingCompany) {
      throw new ConflictError('CNPJ já cadastrado')
    }
    
    try {
      const company = await db.company.create({
        data: {
          ...data,
          isActive: true
        }
      })
      
      return company
    } catch (error) {
      throw new Error('Erro ao criar empresa')
    }
  }
  
  static async findById(id: string): Promise<Company | null> {
    try {
      return await db.company.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              users: true,
              products: true,
              orders: true,
              warehouses: true
            }
          }
        }
      })
    } catch (error) {
      throw new Error('Erro ao buscar empresa')
    }
  }
  
  static async findAll(page: number = 1, limit: number = 10): Promise<{ companies: Company[], total: number }> {
    try {
      const skip = (page - 1) * limit
      
      const [companies, total] = await Promise.all([
        db.company.findMany({
          include: {
            _count: {
              select: {
                users: true,
                products: true,
                orders: true,
                warehouses: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        db.company.count()
      ])
      
      return { companies, total }
    } catch (error) {
      throw new Error('Erro ao listar empresas')
    }
  }
  
  static async update(id: string, data: Partial<CreateCompanyDTO>): Promise<Company> {
    const company = await this.findById(id)
    if (!company) {
      throw new NotFoundError('Empresa')
    }
    
    if (data.cnpj && !validateCNPJ(data.cnpj)) {
      throw new ValidationError('CNPJ inválido', 'cnpj')
    }
    
    if (data.email && !validateEmail(data.email)) {
      throw new ValidationError('Email inválido', 'email')
    }
    
    try {
      const updatedCompany = await db.company.update({
        where: { id },
        data
      })
      
      return updatedCompany
    } catch (error) {
      throw new Error('Erro ao atualizar empresa')
    }
  }
  
  static async delete(id: string): Promise<void> {
    const company = await this.findById(id)
    if (!company) {
      throw new NotFoundError('Empresa')
    }
    
    try {
      await db.company.delete({
        where: { id }
      })
    } catch (error) {
      throw new Error('Erro ao excluir empresa')
    }
  }
}

export class UserRepository {
  static async create(data: CreateUserDTO): Promise<Omit<User, 'password'>> {
    // Verificar email único
    const existingUser = await db.user.findUnique({
      where: { email: data.email }
    })
    
    if (existingUser) {
      throw new ConflictError('Email já cadastrado')
    }
    
    // Verificar se empresa existe
    const company = await db.company.findUnique({
      where: { id: data.companyId }
    })
    
    if (!company) {
      throw new ValidationError('Empresa não encontrada', 'companyId')
    }
    
    try {
      const user = await db.user.create({
        data: {
          ...data,
          isActive: true
        }
      })
      
      // Remover senha da resposta
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    } catch (error) {
      throw new Error('Erro ao criar usuário')
    }
  }
  
  static async findById(id: string): Promise<Omit<User, 'password'> | null> {
    try {
      const user = await db.user.findUnique({
        where: { id },
        include: {
          company: {
            select: {
              id: true,
              tradeName: true,
              cnpj: true
            }
          },
          _count: {
            select: {
              stockMovements: true
            }
          }
        }
      })
      
      if (!user) return null
      
      // Remover senha da resposta
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    } catch (error) {
      throw new Error('Erro ao buscar usuário')
    }
  }
  
  static async findByEmail(email: string): Promise<User | null> {
    try {
      return await db.user.findUnique({
        where: { email }
      })
    } catch (error) {
      throw new Error('Erro ao buscar usuário por email')
    }
  }
  
  static async findAll(companyId?: string, page: number = 1, limit: number = 10): Promise<{ users: Omit<User, 'password'>[], total: number }> {
    try {
      const skip = (page - 1) * limit
      const where = companyId ? { companyId } : {}
      
      const [users, total] = await Promise.all([
        db.user.findMany({
          where,
          include: {
            company: {
              select: {
                id: true,
                tradeName: true,
                cnpj: true
              }
            },
            _count: {
              select: {
                stockMovements: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        db.user.count({ where })
      ])
      
      // Remover senhas das respostas
      const usersWithoutPassword = users.map(user => {
        const { password, ...userWithoutPassword } = user
        return userWithoutPassword
      })
      
      return { users: usersWithoutPassword, total }
    } catch (error) {
      throw new Error('Erro ao listar usuários')
    }
  }
}

export class ProductRepository {
  static async create(data: CreateProductDTO): Promise<Product> {
    // Verificar SKU único por empresa
    const existingProduct = await db.product.findFirst({
      where: {
        sku: data.sku,
        companyId: data.companyId
      }
    })
    
    if (existingProduct) {
      throw new ConflictError('SKU já existe para esta empresa')
    }
    
    // Verificar se empresa existe
    const company = await db.company.findUnique({
      where: { id: data.companyId }
    })
    
    if (!company) {
      throw new ValidationError('Empresa não encontrada', 'companyId')
    }
    
    try {
      const product = await db.product.create({
        data: {
          ...data,
          isActive: true
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
      
      return product
    } catch (error) {
      throw new Error('Erro ao criar produto')
    }
  }
  
  static async findById(id: string): Promise<Product | null> {
    try {
      return await db.product.findUnique({
        where: { id },
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
        }
      })
    } catch (error) {
      throw new Error('Erro ao buscar produto')
    }
  }
  
  static async findAll(companyId?: string, search?: string, page: number = 1, limit: number = 10): Promise<{ products: Product[], total: number }> {
    try {
      const skip = (page - 1) * limit
      const where: any = {}
      
      if (companyId) where.companyId = companyId
      
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
          { ean: { contains: search, mode: 'insensitive' } }
        ]
      }
      
      const [products, total] = await Promise.all([
        db.product.findMany({
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
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        db.product.count({ where })
      ])
      
      return { products, total }
    } catch (error) {
      throw new Error('Erro ao listar produtos')
    }
  }
}