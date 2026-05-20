import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const searchQuery = searchParams.get('search') || ''
    const categoryName = searchParams.get('category') || ''
    const categoryId = searchParams.get('categoryId') || ''

    // Build the query where parameters
    const where: any = {}

    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery } },
        { subtitle: { contains: searchQuery } },
        { authorName: { contains: searchQuery } }
      ]
    }

    if (categoryId) {
      where.categoryId = categoryId
    } else if (categoryName) {
      where.category = {
        name: { equals: categoryName }
      }
    }

    let recipes = await prisma.recipe.findMany({
      where,
      include: {
        category: true,
        creator: {
          select: { id: true, name: true, avatar: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    let seeded = false
    // Auto-seed: Add missing sample recipes per category (like categories do)
    // Only run on full recipe list requests (no filters)
    if (!searchQuery && !categoryId && !categoryName) {
      const dbCategories = await prisma.category.findMany()

      const sampleRecipesByCategory: Record<string, Omit<typeof sampleRecipes[0], 'categoryId'>[]> = {
        Soup: [
          { title: 'Beef Ramen', subtitle: '62K Views', estimatedTime: '20 Min', quantity: '1 Serving', imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop', authorName: 'Chef Adams', ingredients: JSON.stringify(['200g Ramen noodles', '100g Beef tenderloin', '1 Soft-boiled egg', 'Soy sauce broth', 'Scallions']), steps: JSON.stringify(['Boil water and cook ramen noodles for 3 minutes.', 'Sear sliced beef in a hot pan for 2 minutes per side.', 'Heat the soy broth in a separate pot.', 'Assemble noodles and sliced beef in a bowl, pour hot broth, top with boiled egg halves and scallions.']), views: 62000, rating: 4.8 },
          { title: 'Tomato Soup', subtitle: '12K Views', estimatedTime: '15 Min', quantity: '2 Servings', imageUrl: 'https://images.unsplash.com/photo-1547592165-e1d17fed6006?w=800&h=600&fit=crop', authorName: 'Chef Gordon', ingredients: JSON.stringify(['500g Fresh tomatoes', '1 Onion, chopped', '2 Garlic cloves', '200ml Vegetable broth', 'Fresh basil']), steps: JSON.stringify(['Sauté onion and garlic in olive oil until soft.', 'Add chopped tomatoes and vegetable broth, bring to a boil.', 'Simmer for 10 minutes, then blend until smooth.', 'Garnish with fresh basil and black pepper.']), views: 12000, rating: 4.5 }
        ],
        Grill: [
          { title: 'Ribeye Steak', subtitle: '85K Views', estimatedTime: '25 Min', quantity: '1 Serving', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop', authorName: 'Chef Bobby', ingredients: JSON.stringify(['300g Ribeye steak', '2 Sprigs rosemary', '3 Garlic cloves', '50g Butter', 'Sea salt and black pepper']), steps: JSON.stringify(['Season steak generously with sea salt and black pepper.', 'Heat cast iron skillet until smoking hot, sear steak for 3 minutes.', 'Flip steak, add butter, garlic, and rosemary, and baste continuously for another 3 minutes.', 'Let steak rest for 5 minutes before slicing.']), views: 85000, rating: 4.9 }
        ],
        Dessert: [
          { title: 'Strawberry Cake', subtitle: '45K Views', estimatedTime: '45 Min', quantity: '8 Servings', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop', authorName: 'Chef Marie', ingredients: JSON.stringify(['250g Flour', '200g Sugar', '3 Eggs', '150g Fresh strawberries', '100g Whipped cream']), steps: JSON.stringify(['Preheat oven to 180°C (350°F).', 'Mix flour, sugar, and eggs until smooth, then fold in chopped strawberries.', 'Bake for 30 minutes in a greased cake tin.', 'Allow cake to cool, then layer with whipped cream and sliced strawberries.']), views: 45000, rating: 4.7 }
        ],
        Salad: [
          { title: 'Caesar Salad', subtitle: '30K Views', estimatedTime: '10 Min', quantity: '2 Servings', imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&h=600&fit=crop', authorName: 'Chef Caesar', ingredients: JSON.stringify(['1 Romaine lettuce head', '50g Croutons', '30g Parmesan cheese', 'Caesar dressing', '100g Grilled chicken breast']), steps: JSON.stringify(['Wash and chop Romaine lettuce into bite-size pieces.', 'Slice grilled chicken breast.', 'Toss lettuce, chicken, and croutons together in a bowl with Caesar dressing.', 'Shave fresh parmesan cheese on top before serving.']), views: 30000, rating: 4.6 }
        ],
        Breakfast: [
          { title: 'Avocado Toast', subtitle: '18K Views', estimatedTime: '8 Min', quantity: '1 Serving', imageUrl: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=800&h=600&fit=crop', authorName: 'Chef Oliver', ingredients: JSON.stringify(['1 Ripe avocado', '2 Slices sourdough bread', '1 Egg', 'Chili flakes', 'Cherry tomatoes']), steps: JSON.stringify(['Toast sourdough bread until crispy golden brown.', 'Mash avocado with a squeeze of lemon juice, salt, and pepper.', 'Fry or poach the egg to your liking.', 'Spread avocado on toast, top with the egg, chili flakes, and cherry tomatoes.']), views: 18000, rating: 4.8 }
        ],
        Drink: [
          { title: 'Mango Smoothie', subtitle: '22K Views', estimatedTime: '5 Min', quantity: '2 Glasses', imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=800&h=600&fit=crop', authorName: 'Chef Fresh', ingredients: JSON.stringify(['1 Ripe mango', '200ml Orange juice', '100ml Yogurt', '1 tbsp Honey', 'Ice cubes']), steps: JSON.stringify(['Peel and chop the mango into cubes.', 'Add mango, orange juice, yogurt, and honey to a blender.', 'Blend until smooth, adding ice cubes as needed.', 'Pour into glasses and serve immediately.']), views: 22000, rating: 4.6 }
        ],
        Pasta: [
          { title: 'Spaghetti Carbonara', subtitle: '55K Views', estimatedTime: '25 Min', quantity: '2 Servings', imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&h=600&fit=crop', authorName: 'Chef Marco', ingredients: JSON.stringify(['200g Spaghetti', '100g Pancetta', '2 Egg yolks', '50g Pecorino cheese', 'Black pepper']), steps: JSON.stringify(['Cook spaghetti according to package directions.', 'Fry pancetta until crispy.', 'Mix egg yolks with grated pecorino.', 'Toss hot pasta with pancetta, then quickly mix in egg mixture.', 'Season with black pepper and serve immediately.']), views: 55000, rating: 4.7 }
        ],
        Pizza: [
          { title: 'Margherita Pizza', subtitle: '72K Views', estimatedTime: '30 Min', quantity: '4 Slices', imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop', authorName: 'Chef Antonio', ingredients: JSON.stringify(['250g Pizza dough', '100g Tomato sauce', '150g Fresh mozzarella', 'Fresh basil leaves', 'Olive oil']), steps: JSON.stringify(['Preheat oven to 250°C (480°F).', 'Roll out pizza dough on a floured surface.', 'Spread tomato sauce evenly, leaving a border.', 'Add mozzarella slices and bake for 10-12 minutes.', 'Top with fresh basil and drizzle with olive oil.']), views: 72000, rating: 4.8 }
        ],
        Burger: [
          { title: 'Classic Cheeseburger', subtitle: '90K Views', estimatedTime: '20 Min', quantity: '1 Serving', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop', authorName: 'Chef John', ingredients: JSON.stringify(['150g Ground beef', '1 Burger bun', '1 Slice cheddar cheese', 'Lettuce', 'Tomato', 'Onion', 'Ketchup']), steps: JSON.stringify(['Form beef into a patty and season with salt and pepper.', 'Grill or pan-fry patty for 3-4 minutes per side.', 'Add cheese on top during the last minute.', 'Toast the bun and assemble with lettuce, tomato, onion, and ketchup.']), views: 90000, rating: 4.9 }
        ],
        Sushi: [
          { title: 'Salmon Sushi Roll', subtitle: '38K Views', estimatedTime: '35 Min', quantity: '8 Pieces', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&h=600&fit=crop', authorName: 'Chef Yuki', ingredients: JSON.stringify(['200g Sushi rice', '4 Nori sheets', '150g Fresh salmon', '1 Cucumber', 'Soy sauce', 'Wasabi']), steps: JSON.stringify(['Cook sushi rice and season with rice vinegar.', 'Place nori sheet on bamboo mat, spread thin layer of rice.', 'Add sliced salmon and cucumber in the center.', 'Roll tightly using the bamboo mat.', 'Cut into 8 pieces and serve with soy sauce and wasabi.']), views: 38000, rating: 4.7 }
        ],
        Curry: [
          { title: 'Chicken Tikka Masala', subtitle: '65K Views', estimatedTime: '40 Min', quantity: '4 Servings', imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop', authorName: 'Chef Priya', ingredients: JSON.stringify(['500g Chicken breast', '200g Yogurt', '200g Tomato puree', '100ml Cream', 'Garam masala', 'Turmeric', 'Ginger', 'Garlic']), steps: JSON.stringify(['Marinate chicken in yogurt and spices for 30 minutes.', 'Grill or bake marinated chicken until cooked.', 'Sauté ginger and garlic, add tomato puree and spices.', 'Add cream and simmer for 10 minutes.', 'Add cooked chicken and simmer for another 5 minutes.']), views: 65000, rating: 4.8 }
        ],
        Seafood: [
          { title: 'Garlic Butter Shrimp', subtitle: '48K Views', estimatedTime: '15 Min', quantity: '2 Servings', imageUrl: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=800&h=600&fit=crop', authorName: 'Chef Seafood', ingredients: JSON.stringify(['300g Shrimp', '4 Garlic cloves', '50g Butter', '100ml White wine', 'Fresh parsley', 'Lemon juice']), steps: JSON.stringify(['Heat butter in a large skillet over medium heat.', 'Add minced garlic and sauté for 30 seconds.', 'Add shrimp and cook until pink, about 2 minutes per side.', 'Pour in white wine and lemon juice, simmer for 2 minutes.', 'Garnish with fresh parsley and serve immediately.']), views: 48000, rating: 4.6 }
        ],
        Vegan: [
          { title: 'Buddha Bowl', subtitle: '25K Views', estimatedTime: '20 Min', quantity: '1 Serving', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop', authorName: 'Chef Green', ingredients: JSON.stringify(['100g Quinoa', '100g Chickpeas', '50g Kale', '100g Roasted sweet potato', '50g Avocado', 'Tahini dressing']), steps: JSON.stringify(['Cook quinoa according to package directions.', 'Roast chickpeas with olive oil and spices at 200°C for 20 minutes.', 'Massage kale with olive oil and lemon juice.', 'Arrange quinoa, chickpeas, kale, sweet potato, and avocado in a bowl.', 'Drizzle with tahini dressing and serve.']), views: 25000, rating: 4.5 }
        ],
        Snack: [
          { title: 'Crispy Nachos', subtitle: '35K Views', estimatedTime: '15 Min', quantity: '4 Servings', imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&h=600&fit=crop', authorName: 'Chef Snack', ingredients: JSON.stringify(['200g Tortilla chips', '200g Cheddar cheese', '100g Black beans', '50g Jalapeños', 'Sour cream', 'Guacamole']), steps: JSON.stringify(['Preheat oven to 180°C (350°F).', 'Spread tortilla chips on a baking sheet.', 'Top with shredded cheese, black beans, and jalapeños.', 'Bake for 8-10 minutes until cheese is melted.', 'Serve with sour cream and guacamole.']), views: 35000, rating: 4.4 }
        ],
        Bakery: [
          { title: 'Croissants', subtitle: '28K Views', estimatedTime: '3 Hours', quantity: '8 Pieces', imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=600&fit=crop', authorName: 'Chef Baker', ingredients: JSON.stringify(['500g Flour', '280g Cold butter', '7g Instant yeast', '50g Sugar', '300ml Milk', 'Egg for wash']), steps: JSON.stringify(['Mix flour, yeast, sugar, and milk to form a dough.', 'Refrigerate dough and butter separately for 1 hour.', 'Wrap butter in dough and fold multiple times (lamination).', 'Refrigerate between folds for 30 minutes.', 'Shape into croissants, proof for 1 hour, and bake at 200°C for 15 minutes.']), views: 28000, rating: 4.7 }
        ]
      }

      for (const cat of dbCategories) {
        const recipesInCategory = await prisma.recipe.findMany({ where: { categoryId: cat.id } })
        if (recipesInCategory.length === 0) {
          const samples = sampleRecipesByCategory[cat.name]
          if (samples && samples.length > 0) {
            seeded = true
            for (const sample of samples) {
              await prisma.recipe.create({
                data: { ...sample, categoryId: cat.id }
              })
            }
          }
        }
      }

      if (seeded) {
        recipes = await prisma.recipe.findMany({
          where,
          include: {
            category: true,
            creator: {
              select: { id: true, name: true, avatar: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        })
      }
    }

    return NextResponse.json(recipes)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { title, subtitle, estimatedTime, quantity, imageUrl, categoryId, authorName, creatorId, ingredients, steps, status } = await request.json()

    if (!title || !estimatedTime || !quantity || !categoryId || !authorName) {
      return NextResponse.json(
        { error: 'Required fields: title, estimatedTime, quantity, categoryId, authorName' },
        { status: 400 }
      )
    }

    const recipe = await prisma.recipe.create({
      data: {
        title,
        subtitle: subtitle || '0 Views',
        estimatedTime,
        quantity,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
        authorName,
        categoryId,
        creatorId,
        ingredients: ingredients ? JSON.stringify(ingredients) : '',
        steps: steps ? JSON.stringify(steps) : '',
        status: status || 'PUBLISHED'
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(recipe, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
