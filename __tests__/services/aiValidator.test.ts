jest.mock('@/services/config', () => ({
  API_CONFIG: { baseUrl: 'http://test', useMocks: true, timeoutMs: 1000 },
}));

import { validateMeal } from '@/services/aiValidator';

describe('aiValidator.validateMeal', () => {
  it('returns a result with success and confidence', async () => {
    const result = await validateMeal({
      capture: { uri: 'file://photo.jpg', width: 100, height: 100, mimeType: 'image/jpeg' },
      recipeId: '1',
    });
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('confidence');
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });
});
