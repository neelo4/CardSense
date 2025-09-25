import { View } from 'react-native';

export function OnboardingSkeleton() {
  return (
    <View className="flex-1 gap-4 bg-slate-950 p-5">
      <View className="h-40 animate-pulse rounded-3xl bg-slate-800" />
      <View className="h-36 animate-pulse rounded-3xl bg-slate-800/80" />
      <View className="h-44 animate-pulse rounded-3xl bg-slate-800/80" />
      <View className="h-40 animate-pulse rounded-3xl bg-slate-800/80" />
    </View>
  );
}
