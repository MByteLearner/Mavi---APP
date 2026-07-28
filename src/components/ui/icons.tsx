import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

type IoniconName = ComponentProps<typeof Ionicons>['name'];
type IoniconProps = Omit<ComponentProps<typeof Ionicons>, 'name' | 'color'> & {
  color?: ColorValue | string;
};

function makeIcon(name: IoniconName) {
  const Component = ({ size = 24, color, ...rest }: IoniconProps) => (
    <Ionicons name={name} size={size} color={color as string | undefined} {...rest} />
  );
  Component.displayName = `Icon(${name})`;
  return Component;
}

export const Flame = makeIcon('flame');
export const ScanLine = makeIcon('scan');
export const UtensilsCrossed = makeIcon('restaurant');
export const Check = makeIcon('checkmark');
export const Circle = makeIcon('ellipse-outline');
export const FileText = makeIcon('document-text');
export const Camera = makeIcon('camera');
export const CloseIcon = makeIcon('close');
export const House = makeIcon('home');
export const BookOpen = makeIcon('book');
export const TrendingUp = makeIcon('trending-up');
export const User = makeIcon('person');
export const CheckCircle = makeIcon('checkmark-circle');
export const ArrowLeft = makeIcon('arrow-back');
export const Bluetooth = makeIcon('bluetooth');

export const Home = makeIcon('home-outline');
export const Nutrition = makeIcon('restaurant-outline');
export const Sparkles = makeIcon('sparkles-outline');
export const History = makeIcon('time-outline');
export const Person = makeIcon('person-outline');

export const Heart = makeIcon('heart-outline');
export const Settings = makeIcon('settings-outline');
export const Water = makeIcon('water-outline');
export const Scale = makeIcon('scale-outline');
export const Target = makeIcon('locate-outline');
export const Notification = makeIcon('notifications-outline');
export const Edit = makeIcon('create-outline');
export const ChevronRight = makeIcon('chevron-forward');
export const ChevronLeft = makeIcon('chevron-back');
export const Plus = makeIcon('add');
export const MoreHorizontal = makeIcon('ellipsis-horizontal');
export const Mic = makeIcon('mic-outline');
export const Send = makeIcon('send-outline');
export const Search = makeIcon('search-outline');
export const Filter = makeIcon('filter-outline');
export const Image = makeIcon('image-outline');
export const Info = makeIcon('information-circle-outline');
export const Lock = makeIcon('lock-closed-outline');
export const Mail = makeIcon('mail-outline');
export const Eye = makeIcon('eye-outline');
export const EyeOff = makeIcon('eye-off-outline');
export const LogOut = makeIcon('log-out-outline');
export const ArrowRight = makeIcon('arrow-forward');

