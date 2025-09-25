import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import { SuspenseBoundary } from './providers/SuspenseBoundary';
import { CardOnboardingScreen } from '../features/onboarding/components/CardOnboardingScreen';
import { OnboardingSkeleton } from '../features/onboarding/components/OnboardingSkeleton';

export function CardSenseApp() {
  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar style="light" />
      <SuspenseBoundary fallback={<OnboardingSkeleton />}>
        <CardOnboardingScreen />
      </SuspenseBoundary>
    </SafeAreaView>
  );
}
