import { simulateNetwork } from './mockApi';

export type SpendingInsight = {
  id: string;
  title: string;
  amount: number;
  trend: 'up' | 'down' | 'flat';
};

export type CardProfile = {
  cardId: string;
  userName: string;
  cardLevel: 'Essential' | 'Revolv' | 'Voyager';
  currency: 'USD' | 'GBP' | 'EUR';
  creditLimit: number;
  currentBalance: number;
  insights: SpendingInsight[];
  nextBestActions: Array<{ id: string; label: string; impact: 'high' | 'medium' | 'low' }>;
};

const demoProfile: CardProfile = {
  cardId: 'cs-44492',
  userName: 'Priya Sen',
  cardLevel: 'Voyager',
  currency: 'GBP',
  creditLimit: 3200,
  currentBalance: 1180,
  insights: [
    { id: 'fx', title: 'FX spend this week', amount: 480, trend: 'up' },
    { id: 'subs', title: 'Subscriptions coming due', amount: 5, trend: 'flat' },
    { id: 'travel', title: 'Travel wallet top-up suggested', amount: 300, trend: 'down' },
  ],
  nextBestActions: [
    { id: 'freeze', label: 'Enable travel-safe card freeze', impact: 'high' },
    { id: 'alerts', label: 'Tune cross-border alerts', impact: 'medium' },
    { id: 'budget', label: 'Lock FX budget for this trip', impact: 'medium' },
  ],
};

export async function fetchCardProfile() {
  return simulateNetwork(demoProfile, { latency: 650, jitter: 520 });
}
