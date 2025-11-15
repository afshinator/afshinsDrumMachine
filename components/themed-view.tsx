import { View, type ViewProps } from 'react-native';

import { getShadow, Shadows } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'default' | 'secondary';
  shadow?: keyof typeof Shadows;
};

export function ThemedView({ 
  style, 
  lightColor, 
  darkColor, 
  variant = 'default',
  shadow,
  ...otherProps 
}: ThemedViewProps) {
  const colorKey = variant === 'secondary' ? 'backgroundSecondary' : 'background';
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, colorKey);

  const shadowStyle = shadow ? getShadow(shadow) : undefined;

  return <View style={[{ backgroundColor }, shadowStyle, style]} {...otherProps} />;
}