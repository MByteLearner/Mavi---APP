import type { Recipe, Ingredient } from '@/types/recipe';

export const RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Avena con Manzana y Canela',
    description: 'Desayuno balanceado — 320 cal',
    emoji: '🥣',
    calories: 320,
    ingredients: [
      { id: '1a', name: 'Avena', targetWeight: 40, unit: 'g' },
      { id: '1b', name: 'Manzana', targetWeight: 150, unit: 'g' },
      { id: '1c', name: 'Leche', targetWeight: 200, unit: 'ml' },
      { id: '1d', name: 'Canela', targetWeight: 2, unit: 'g' },
    ],
  },
  {
    id: '2',
    name: 'Pollo a la Plancha con Verduras',
    description: 'Almuerzo proteico — 450 cal',
    emoji: '🍗',
    calories: 450,
    ingredients: [
      { id: '2a', name: 'Pechuga de pollo', targetWeight: 200, unit: 'g' },
      { id: '2b', name: 'Brócoli', targetWeight: 120, unit: 'g' },
      { id: '2c', name: 'Zanahoria', targetWeight: 80, unit: 'g' },
      { id: '2d', name: 'Aceite de oliva', targetWeight: 10, unit: 'ml' },
    ],
  },
  {
    id: '3',
    name: 'Bowl de Quinoa y Palta',
    description: 'Almuerzo vegetariano — 380 cal',
    emoji: '🥗',
    calories: 380,
    ingredients: [
      { id: '3a', name: 'Quinoa', targetWeight: 60, unit: 'g' },
      { id: '3b', name: 'Palta', targetWeight: 80, unit: 'g' },
      { id: '3c', name: 'Tomate cherry', targetWeight: 100, unit: 'g' },
      { id: '3d', name: 'Espinaca', targetWeight: 40, unit: 'g' },
    ],
  },
  {
    id: '4',
    name: 'Salmón con Espárragos',
    description: 'Cena ligera — 410 cal',
    emoji: '🐟',
    calories: 410,
    ingredients: [
      { id: '4a', name: 'Salmón', targetWeight: 180, unit: 'g' },
      { id: '4b', name: 'Espárragos', targetWeight: 120, unit: 'g' },
      { id: '4c', name: 'Limón', targetWeight: 30, unit: 'g' },
      { id: '4d', name: 'Aceite de oliva', targetWeight: 10, unit: 'ml' },
    ],
  },
];

export function getRecipeById(id: string): Recipe | undefined {
  return RECIPES.find((r) => r.id === id);
}

export function getIngredientById(
  recipeId: string,
  ingredientId: string,
): Ingredient | undefined {
  return getRecipeById(recipeId)?.ingredients.find((i) => i.id === ingredientId);
}
