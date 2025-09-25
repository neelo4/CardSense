import type { PropsWithChildren, ReactNode } from 'react';
import { Suspense } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { Pressable, Text, View } from 'react-native';

export type SuspenseBoundaryProps = PropsWithChildren<{
  fallback: ReactNode;
  errorFallback?: (props: FallbackProps) => ReactNode;
  onReset?: () => void;
}>;

const defaultErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
  <ErrorPanel message={error.message} onRetry={resetErrorBoundary} />
);

export function SuspenseBoundary({
  children,
  fallback,
  errorFallback = defaultErrorFallback,
  onReset,
}: SuspenseBoundaryProps) {
  return (
    <ErrorBoundary onReset={onReset} fallbackRender={errorFallback}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}

function ErrorPanel({ message, onRetry }: { message?: string; onRetry: () => void }) {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-rose-950/40 p-6">
      <Text className="text-center text-base font-semibold text-rose-100">
        {message ?? 'Something went wrong.'}
      </Text>
      <Pressable className="rounded-full bg-rose-500 px-4 py-2" onPress={onRetry}>
        <Text className="text-sm font-semibold text-rose-50">Try again</Text>
      </Pressable>
    </View>
  );
}
