import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useCardProfileQuery } from '../hooks/useCardProfileQuery';
import { useCardIssuanceMachine } from '../machines/useCardIssuanceMachine';
import type { SpendingInsight } from '../../../services/cardProfile';
import { cardControlsModule, withCardLock } from '../../../native/cardControls';
import { simulateMutation } from '../../../services/mockApi';
import type { IssuanceStateValue } from '../machines/cardIssuanceMachine';

export function CardOnboardingScreen() {
  const { data: profile } = useCardProfileQuery();
  const [state, send] = useCardIssuanceMachine({ profile });
  const [lockState, setLockState] = useState<'idle' | 'locking' | 'locked'>('idle');

  const issuanceState = state.value as IssuanceStateValue;
  const issuanceCopy = issuanceCopyByState[issuanceState];

  useEffect(() => {
    if (!state.matches('verifying')) {
      return;
    }

    let cancelled = false;

    void simulateMutation(() => {
      if (cancelled) return 'cancelled';

      const riskScore = Math.round(200 + Math.random() * 650);
      const approved = riskScore < 720;

      send({ type: 'RESOLVE_CHECKS', approved, riskScore });

      return approved ? 'approved' : 'blocked';
    }, 720);

    return () => {
      cancelled = true;
    };
  }, [send, state]);

  const actionButton = useMemo(() => {
    switch (issuanceState) {
      case 'idle':
        return {
          label: 'Spin up virtual card',
          onPress: () => send({ type: 'REQUEST_CARD' }),
        } as const;
      case 'verifying':
        return {
          label: 'Completing checks…',
          disabled: true,
        } as const;
      case 'approved':
        return {
          label: 'Share card details securely',
          onPress: () => send({ type: 'RESET' }),
        } as const;
      case 'blocked':
        return {
          label: 'Review insights and retry',
          onPress: () => send({ type: 'RESET' }),
        } as const;
      default:
        return { label: 'Try again', onPress: () => send({ type: 'RESET' }) } as const;
    }
  }, [issuanceState, send]);

  const disabled = 'disabled' in actionButton && Boolean(actionButton.disabled);

  const handleLockCard = useCallback(async () => {
    setLockState('locking');
    const result = await withCardLock(profile.cardId, async () => {
      await simulateMutation(() => 'locked');
      return 'locked' as const;
    });

    if (result === 'locked') {
      setLockState('locked');
      Alert.alert('Card locked', `Remote lock engaged via ${cardControlsModule.secureChannelId}`);
    } else {
      setLockState('idle');
    }
  }, [profile.cardId]);

  return (
    <ScrollView className="flex-1 bg-slate-950" contentContainerStyle={{ padding: 20, gap: 16 }}>
      <View className="gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
        <Text className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
          {profile.cardLevel} • {profile.currency}
        </Text>
        <Text className="text-3xl font-semibold text-white">{profile.userName}</Text>
        <View className="flex-row justify-between">
          <View>
            <Text className="text-xs uppercase text-slate-400">Credit limit</Text>
            <Text className="text-xl font-semibold text-slate-100">£{profile.creditLimit.toLocaleString()}</Text>
          </View>
          <View className="items-end">
            <Text className="text-xs uppercase text-slate-400">Current balance</Text>
            <Text className="text-xl font-semibold text-slate-100">£{profile.currentBalance.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      <View className="gap-3 rounded-3xl bg-slate-900/60 p-5">
        <Text className="text-lg font-semibold text-slate-100">Realtime insights</Text>
        {profile.insights.map((insight) => (
          <InsightRow key={insight.id} insight={insight} />
        ))}
      </View>

      <View className="gap-3 rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
        <Text className="text-xs uppercase text-indigo-400">
          {issuanceCopy.eyebrow}
        </Text>
        <Text className="text-xl font-semibold text-white">{issuanceCopy.title}</Text>
        <Text className="text-sm leading-relaxed text-slate-300">{issuanceCopy.body}</Text>
        <Pressable
          disabled={disabled}
          className={`mt-2 rounded-2xl px-5 py-3 ${
            issuanceState === 'verifying' ? 'bg-slate-700' : 'bg-emerald-500'
          } ${disabled ? 'opacity-60' : ''}`}
          onPress={actionButton.onPress}
        >
          <Text className="text-center text-base font-semibold text-emerald-50">
            {actionButton.label}
          </Text>
        </Pressable>
      </View>

      <View className="gap-3 rounded-3xl bg-slate-900/40 p-5">
        <Text className="text-lg font-semibold text-slate-100">Next best actions</Text>
        {profile.nextBestActions.map((action) => (
          <View
            key={action.id}
            className="flex-row items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/70 px-4 py-3"
          >
            <Text className="flex-1 text-sm font-medium text-slate-100">{action.label}</Text>
            <Text className="text-xs font-semibold uppercase text-emerald-300">{action.impact}</Text>
          </View>
        ))}
        <Pressable
          className={`rounded-2xl border border-emerald-400/60 px-5 py-3 ${
            lockState === 'locking' ? 'opacity-60' : ''
          }`}
          disabled={lockState === 'locking'}
          onPress={handleLockCard}
        >
          <Text className="text-center text-sm font-semibold text-emerald-200">
            {lockState === 'locking' ? 'Locking card…' : 'Lock card via Kotlin/Swift bridge'}
          </Text>
        </Pressable>
        {lockState === 'locked' ? (
          <View className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3">
            <Text className="text-xs uppercase text-emerald-300">Secure channel engaged</Text>
            <Text className="text-sm text-emerald-100">
              Card is currently locked via {cardControlsModule.secureChannelId}
            </Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const issuanceCopyByState: Record<IssuanceStateValue, { eyebrow: string; title: string; body: string }> = {
  idle: {
    eyebrow: 'Activation',
    title: 'Issue a travel-safe virtual card in seconds',
    body: 'We pre-fill limits based on journey context and let you tweak controls before provisioning.',
  },
  verifying: {
    eyebrow: 'Intelligence',
    title: 'Running velocity and travel-risk checks',
    body: 'We model FX exposure, real-time balances, and journey signals across user devices before issuing.',
  },
  approved: {
    eyebrow: 'Success',
    title: 'Your virtual card is live',
    body: 'Share to wallet apps, enable biometric lock, and push instant spending guardrails.',
  },
  blocked: {
    eyebrow: 'Action needed',
    title: 'We spotted something that needs review',
    body: 'One tap to drill into insights and remediate issues before retrying issuance.',
  },
};

const trendCopy: Record<SpendingInsight['trend'], { label: string; colour: string }> = {
  up: { label: '↑ trending up', colour: 'text-amber-300' },
  down: { label: '↓ trending down', colour: 'text-emerald-300' },
  flat: { label: '— stable', colour: 'text-slate-400' },
};

const InsightRow = memo(function InsightRow({ insight }: { insight: SpendingInsight }) {
  const trend = trendCopy[insight.trend];
  return (
    <View className="flex-row items-center justify-between rounded-2xl bg-slate-950/70 px-4 py-3">
      <View className="flex-1">
        <Text className="text-sm font-semibold text-slate-100">{insight.title}</Text>
        <Text className={`text-xs uppercase ${trend.colour}`}>{trend.label}</Text>
      </View>
      <Text className="text-base font-semibold text-slate-100">£{insight.amount}</Text>
    </View>
  );
});
