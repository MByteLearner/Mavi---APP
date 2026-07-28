import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@/components/ui/Button';

describe('<Button />', () => {
  it('renders the label', () => {
    const { getByText } = render(<Button label="Hola" onPress={() => undefined} />);
    expect(getByText('Hola')).toBeTruthy();
  });

  it('fires onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button label="Aceptar" onPress={onPress} />);
    fireEvent.press(getByText('Aceptar'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button label="X" onPress={onPress} disabled />);
    fireEvent.press(getByText('X'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows activity indicator when loading', () => {
    const { queryByText, UNSAFE_queryByType } = render(
      <Button label="Cargando" onPress={() => undefined} loading />,
    );
    expect(queryByText('Cargando')).toBeNull();
    const ActivityIndicator =
      require('react-native').ActivityIndicator;
    expect(UNSAFE_queryByType(ActivityIndicator)).toBeTruthy();
  });
});
