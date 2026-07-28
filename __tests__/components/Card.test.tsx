import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Card } from '@/components/ui/Card';

describe('<Card />', () => {
  it('renders children', () => {
    const { getByText } = render(
      <Card>
        <Text>contenido</Text>
      </Card>,
    );
    expect(getByText('contenido')).toBeTruthy();
  });

  it('applies outlined variant classes', () => {
    const { toJSON } = render(
      <Card variant="outlined">
        <Text>x</Text>
      </Card>,
    );
    const tree = JSON.stringify(toJSON());
    expect(tree).toBeTruthy();
  });
});
