import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
 
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePreferences } from "@/hooks/use-preference";
import { ActivityIndicator, Platform, View } from "react-native";

const queryClient = new QueryClient();

export const unstable_settings = {
  anchor: "(tabs)",
};

const LoadingGuard = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

function RootLayoutContent() {
  // 1. Fetch User Preferences (This remains the critical, blocking dependency)
  const { data: prefs, isPending: isPrefsPending } = usePreferences();
  
 
  const resolvedColorScheme = useColorScheme();

  // Loading Guard: ONLY Wait for user preferences to be ready.
  // The app will now render the tabs immediately after prefs are available,
  // even if exchange rates are still loading in the background.
  if (isPrefsPending || !prefs) {
    return <LoadingGuard />;
  }

  const theme = resolvedColorScheme === "dark" ? DarkTheme : DefaultTheme;
  const statusBarStyle = resolvedColorScheme === "dark" ? "light" : "dark";

  return (
    <ThemeProvider value={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>

      <StatusBar style={statusBarStyle} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutContent />
      
      {Platform.OS === 'web' && process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}