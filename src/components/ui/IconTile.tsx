import { View } from 'react-native';
import type { ReactNode } from 'react';

export type IconTileSize = 'sm' | 'md' | 'lg';
export type IconTileTone = 'brand' | 'neutral' | 'plain';

export interface IconTileProps {
  children: ReactNode;
  size?: IconTileSize;
  tone?: IconTileTone;
  className?: string;
}

const sizeClasses: Record<IconTileSize, string> = {
  sm: 'h-8 w-8 rounded-lg',
  md: 'h-10 w-10 rounded-lg',
  lg: 'h-12 w-12 rounded-xl',
};

const toneClasses: Record<IconTileTone, string> = {
  brand: 'bg-ink',
  neutral: 'bg-paper-muted',
  plain: 'bg-transparent',
};

export function IconTile({
  children,
  size = 'md',
  tone = 'plain',
  className,
}: IconTileProps) {
  return (
    <View
      className={`items-center justify-center ${sizeClasses[size]} ${toneClasses[tone]} ${
        className ?? ''
      }`}
    >
      {children}
    </View>
  );
}
