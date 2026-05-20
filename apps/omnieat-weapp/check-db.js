const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany({
    include: {
      recipes: true,
      _count: {
        select: { recipes: true }
      }
    }
  });

  console.log('--- CATEGORIES IN DB ---');
  for (const c of categories) {
    console.log(`- Category: ${c.name} (ID: ${c.id})`);
    console.log(`  Count of recipes in DB: ${c.recipes.length}`);
    console.log(`  _count.recipes: ${c._count.recipes}`);
  }

  const recipes = await prisma.recipe.findMany();
  console.log('\n--- RECIPES IN DB ---');
  console.log(`Total recipes in DB: ${recipes.length}`);
  for (const r of recipes) {
    console.log(`- Recipe: ${r.title} (CategoryID: ${r.categoryId})`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
