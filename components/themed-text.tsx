// themed-text.tsx
// 
import { Text, type TextProps } from "react-native";

import { Typography } from "@/constants/theme";
import { usePreferences } from "@/hooks/use-preference";
import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "xlarge"
    | "large"
    | "title"
    | "subtitle"
    | "body"
    | "bodySemibold"
    | "small"
    | "xsmall"
    | "caption";
  variant?: "default" | "secondary" | "link" | "error" | "success" | "warning";
  propFontScale?: number;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "body",
  variant = "default",
  propFontScale = 1.0,
  ...rest
}: ThemedTextProps) {
  const { data: preferences } = usePreferences();
  const fontScale = preferences?.fontScale ?? 1.0;
  
  // Combine both font scales multiplicatively
  const combinedFontScale = fontScale * propFontScale;

  // Determine color based on variant
  let colorKey:
    | "text"
    | "textSecondary"
    | "link"
    | "error"
    | "success"
    | "warning" = "text";

  switch (variant) {
    case "secondary":
      colorKey = "textSecondary";
      break;
    case "link":
      colorKey = "link";
      break;
    case "error":
      colorKey = "error";
      break;
    case "success":
      colorKey = "success";
      break;
    case "warning":
      colorKey = "warning";
      break;
    default:
      colorKey = "text";
  }

  const color = useThemeColor({ light: lightColor, dark: darkColor }, colorKey);

  // Get typography styles and apply font scale
  const typographyStyle = Typography[type];
  
  // Safety check: if typography style doesn't exist, fall back to body
  if (!typographyStyle) {
    console.warn(`Typography type "${type}" not found, falling back to "body"`);
    const bodyStyle = Typography.body;
    const scaledTypography = {
      ...bodyStyle,
      fontSize: bodyStyle.fontSize * combinedFontScale,
      lineHeight: bodyStyle.lineHeight * combinedFontScale,
    };
    return <Text style={[{ color }, scaledTypography, style]} {...rest} />;
  }

  const scaledTypography = {
    ...typographyStyle,
    fontSize: typographyStyle.fontSize * combinedFontScale,
    lineHeight: typographyStyle.lineHeight * combinedFontScale,
  };

  return <Text style={[{ color }, scaledTypography, style]} {...rest} />;
}