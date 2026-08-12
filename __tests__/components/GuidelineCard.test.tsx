import { render } from '@testing-library/react-native';
import { GuidelineCard } from '@/components/ui/GuidelineCard';

describe('<GuidelineCard />', () => {
  it('renders active state when plan is scanned', () => {
    const { getByText } = render(
      <GuidelineCard
        hasScannedPlan={true}
        allowedIngredients={['Pollo', 'Arroz']}
        restrictions={['Sin TACC']}
      />,
    );
    expect(getByText('Guía Nutricional Médica')).toBeTruthy();
    expect(getByText('Activa')).toBeTruthy();
    expect(getByText('Pollo')).toBeTruthy();
    expect(getByText('Sin TACC')).toBeTruthy();
  });

  it('renders empty state when no plan is scanned', () => {
    const { getByText } = render(<GuidelineCard hasScannedPlan={false} />);
    expect(getByText('Sin Guía Médica activa')).toBeTruthy();
    expect(getByText('Escanear plan médico')).toBeTruthy();
  });
});
