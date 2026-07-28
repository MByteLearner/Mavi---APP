import { STRINGS } from '@/constants/strings';

describe('STRINGS', () => {
  it('has all required sections', () => {
    const required = ['home', 'recipes', 'scan', 'preparation', 'validation', 'profile', 'progress', 'errors', 'notFound', 'common'];
    for (const key of required) {
      expect(STRINGS).toHaveProperty(key);
    }
  });

  it('has both title and subtitle for major screens', () => {
    expect(STRINGS.home.title).toBeTruthy();
    expect(STRINGS.home.prompt).toBeTruthy();
    expect(STRINGS.recipes.title).toBeTruthy();
    expect(STRINGS.scan.title).toBeTruthy();
  });
});
