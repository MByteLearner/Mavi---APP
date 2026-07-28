import { getRecipeById, getIngredientById, RECIPES } from '@/constants/recipes';

describe('recipes', () => {
  it('exports at least one recipe', () => {
    expect(RECIPES.length).toBeGreaterThan(0);
  });

  it('each recipe has at least one ingredient', () => {
    for (const r of RECIPES) {
      expect(r.ingredients.length).toBeGreaterThan(0);
    }
  });

  it('each ingredient has a valid unit', () => {
    for (const r of RECIPES) {
      for (const ing of r.ingredients) {
        expect(['g', 'ml']).toContain(ing.unit);
      }
    }
  });

  it('getRecipeById finds a recipe by id', () => {
    const r = getRecipeById('1');
    expect(r).toBeDefined();
    expect(r?.name).toBe('Avena con Manzana y Canela');
  });

  it('getRecipeById returns undefined for unknown id', () => {
    expect(getRecipeById('xxx')).toBeUndefined();
  });

  it('getIngredientById finds the ingredient inside a recipe', () => {
    const ing = getIngredientById('1', '1a');
    expect(ing?.name).toBe('Avena');
  });

  it('getIngredientById returns undefined for unknown ingredient', () => {
    expect(getIngredientById('1', 'xxx')).toBeUndefined();
  });
});
