import type { PropsWithChildren } from 'react';
import { QueryClientProvider, focusManager } from '@tanstack/react-query';
import { AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { queryClient } from './queryClient';

// Keep React Query in sync with app foreground/background state.
focusManager.setEventListener((handleFocus) => {
  const subscription = AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      handleFocus();
    }
  });

  return () => subscription.remove();
});

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </GestureHandlerRootView>
  );
}
