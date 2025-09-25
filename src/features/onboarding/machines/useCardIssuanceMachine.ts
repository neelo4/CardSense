import { useMachine } from '@xstate/react';
import { cardIssuanceMachine, type IssuanceContext } from './cardIssuanceMachine';

export function useCardIssuanceMachine(context: IssuanceContext) {
  return useMachine(cardIssuanceMachine, { input: context });
}
