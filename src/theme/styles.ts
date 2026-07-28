import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import { palette, radius, shadow, spacing } from './tokens';

export type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle };

export const themeStyles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    padding: spacing.lg,
    ...shadow.sm,
  },
  cardMuted: {
    backgroundColor: palette.background,
    borderRadius: radius.card,
    padding: spacing.lg,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  col: {
    flexDirection: 'column',
  },
  screen: {
    flex: 1,
    backgroundColor: palette.background,
  },
  screenContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
});

export { palette, radius, shadow, spacing };
export const createStyles = <T extends NamedStyles<T>>(styles: T) => StyleSheet.create(styles);
