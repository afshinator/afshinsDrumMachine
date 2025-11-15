/**
 * TanStack Query hooks for user preferences
 */

import { PREFERENCES_QUERY_KEY, UserPreferences } from "@/constants/misc";
import { preferencesStorage } from "@/utils/preferenceStorage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Hook to get user preferences
 * Automatically hydrates from AsyncStorage on mount and persists defaults if needed
 */
export function usePreferences() {
  return useQuery({
    queryKey: PREFERENCES_QUERY_KEY,
    queryFn: preferencesStorage.get,
    staleTime: Infinity,
  });
}

/**
 * Hook to update user preferences
 * Invalidates query to ensure fresh data from AsyncStorage
 */
export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: Partial<UserPreferences>) =>
      preferencesStorage.update(updates),
    onSuccess: () => {
      // Invalidate to trigger refetch and ensure cache matches AsyncStorage
      queryClient.invalidateQueries({ queryKey: PREFERENCES_QUERY_KEY });
    },
  });
}

/**
 * Hook to reset preferences to defaults
 */
export function useResetPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: preferencesStorage.reset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PREFERENCES_QUERY_KEY });
    },
  });
}
