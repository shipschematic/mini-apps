import { z } from 'zod'

// Auth validations
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  avatar: z.string().url().optional(),
  region: z.enum(['EN', 'CN']).default('EN'),
  authProvider: z.enum(['email', 'google', 'wechat']).default('email')
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

export const verifyEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(6, 'Verification code must be 6 digits')
})

export const sendVerificationSchema = z.object({
  email: z.string().email('Invalid email address')
})

// User validations
export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional()
})

export const followUserSchema = z.object({
  userId: z.string().uuid('Invalid user ID')
})

// Recipe validations
export const createRecipeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  subtitle: z.string().max(500).optional(),
  estimatedTime: z.string().optional(),
  quantity: z.string().optional(),
  imageUrl: z.string().url().optional(),
  categoryId: z.string().uuid('Invalid category ID'),
  ingredients: z.array(z.string()).optional(),
  steps: z.array(z.string()).optional(),
  status: z.enum(['PUBLISHED', 'DRAFT']).default('PUBLISHED')
})

export const updateRecipeSchema = createRecipeSchema.partial()

export const likeRecipeSchema = z.object({
  recipeId: z.string().uuid('Invalid recipe ID')
})

export const addCommentSchema = z.object({
  recipeId: z.string().uuid('Invalid recipe ID'),
  text: z.string().min(1, 'Comment text is required').max(1000)
})

export const addReviewSchema = z.object({
  recipeId: z.string().uuid('Invalid recipe ID'),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  text: z.string().min(1, 'Review text is required').max(2000)
})

// Payment validations
export const createPaymentIntentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().max(500).optional(),
  currency: z.enum(['usd', 'cny', 'eur', 'gbp']).default('usd')
})

// Category validations
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  icon: z.string().optional()
})

// Saved recipe validations
export const saveRecipeSchema = z.object({
  recipeId: z.string().uuid('Invalid recipe ID')
})

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type CreateRecipeInput = z.infer<typeof createRecipeSchema>
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>
export type AddCommentInput = z.infer<typeof addCommentSchema>
export type AddReviewInput = z.infer<typeof addReviewSchema>
export type CreatePaymentIntentInput = z.infer<typeof createPaymentIntentSchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
