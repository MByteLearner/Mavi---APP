import { scanPlan } from '@/services/planParser';
import { RECIPES } from '@/constants/recipes';

jest.mock('@/services/config', () => ({
  API_CONFIG: { baseUrl: 'http://test', useMocks: true, timeoutMs: 1000 },
}));

describe('planParser.scanPlan', () => {
  it('returns a plan and suggested recipes from a PDF input', async () => {
    const result = await scanPlan({
      uri: 'file://plan.pdf',
      mimeType: 'application/pdf',
      fileName: 'plan.pdf',
    });
    expect(result.plan.source).toBe('pdf');
    expect(result.plan.id).toBeTruthy();
    expect(result.suggestedRecipes).toEqual(RECIPES);
  });

  it('infers image source from mime type', async () => {
    const result = await scanPlan({
      uri: 'file://plan.jpg',
      mimeType: 'image/jpeg',
    });
    expect(result.plan.source).toBe('image');
  });
});
