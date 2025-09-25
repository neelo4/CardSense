import { TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native';

type CardLockStatus = 'locked' | 'unlocked';

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export interface CardControlsSpec extends TurboModule {
  readonly secureChannelId: string;
  lockCard(cardId: string): Promise<CardLockStatus>;
  unlockCard(cardId: string): Promise<CardLockStatus>;
  setSpendingLimit(cardId: string, amount: number): Promise<void>;
}

function createFallback(): CardControlsSpec {
  const output: CardControlsSpec = {
    get secureChannelId() {
      return 'mock-secure-channel';
    },
    lockCard: async () => 'locked',
    unlockCard: async () => 'unlocked',
    setSpendingLimit: async () => undefined,
    getConstants: () => ({}),
  };

  return output;
}

export const cardControlsModule: CardControlsSpec = (() => {
  const getEnforcing = TurboModuleRegistry?.getEnforcing?.bind(TurboModuleRegistry);

  if (!getEnforcing) {
    if (__DEV__) {
      console.debug('CardControls native module not registered; using JS mock.');
    }
    return createFallback();
  }

  try {
    return getEnforcing<CardControlsSpec>('CardControls');
  } catch (error) {
    if (__DEV__) {
      console.debug('CardControls module unavailable, using JS mock.', error);
    }
    return createFallback();
  }
})();

export async function withCardLock<T>(cardId: string, action: () => Promise<T>) {
  await cardControlsModule.lockCard(cardId);
  try {
    return await action();
  } finally {
    await cardControlsModule.unlockCard(cardId);
  }
}

export type CardLockResult = UnwrapPromise<ReturnType<CardControlsSpec['lockCard']>>;
