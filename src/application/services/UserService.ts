import bcrypt from 'bcryptjs'
import { UserRepository } from '@/infrastructure/database/repositories'
import { CreateUserDTO, User } from '@/shared/types'
import { ValidationError } from '@/shared/utils'

// Service Layer - Lógica de negócio
export class UserService {
  static async createUser(data: CreateUserDTO): Promise<Omit<User, 'password'>> {
    // Validações de negócio
    this.validateUserData(data)
    
    // Hash da senha (feito no backend, não no frontend)
    const hashedPassword = await this.hashPassword(data.password)
    
    // Criar usuário através do repository
    const user = await UserRepository.create({
      ...data,
      password: hashedPassword
    })
    
    return user
  }
  
  static async getUserById(id: string): Promise<Omit<User, 'password'> | null> {
    return await UserRepository.findById(id)
  }
  
  static async getUsers(companyId?: string, page: number = 1, limit: number = 10) {
    return await UserRepository.findAll(companyId, page, limit)
  }
  
  static async authenticateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await UserRepository.findByEmail(email)
    
    if (!user || !user.isActive) {
      return null
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if (!isPasswordValid) {
      return null
    }
    
    // Remover senha da resposta
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  
  private static validateUserData(data: CreateUserDTO): void {
    // Validação de força de senha
    if (data.password.length < 6) {
      throw new ValidationError('Senha deve ter pelo menos 6 caracteres', 'password')
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
      throw new ValidationError('Senha deve conter letra maiúscula, minúscula e número', 'password')
    }
    
    // Validação de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new ValidationError('Email inválido', 'email')
    }
    
    // Validação de nome
    if (data.name.length < 3) {
      throw new ValidationError('Nome deve ter pelo menos 3 caracteres', 'name')
    }
    
    if (data.name.length > 100) {
      throw new ValidationError('Nome deve ter no máximo 100 caracteres', 'name')
    }
  }
  
  private static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return await bcrypt.hash(password, saltRounds)
  }
  
  static async updateUserPassword(userId: string, newPassword: string): Promise<void> {
    // Validar nova senha
    if (newPassword.length < 6) {
      throw new ValidationError('Senha deve ter pelo menos 6 caracteres', 'password')
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      throw new ValidationError('Senha deve conter letra maiúscula, minúscula e número', 'password')
    }
    
    // Hash da nova senha
    const hashedPassword = await this.hashPassword(newPassword)
    
    // Atualizar no banco (precisa ser implementado no repository)
    // await UserRepository.updatePassword(userId, hashedPassword)
  }
}