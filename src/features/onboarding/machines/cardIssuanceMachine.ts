import { assign, createMachine } from 'xstate';
import type { CardProfile } from '../../../services/cardProfile';

export type IssuanceStateValue = 'idle' | 'verifying' | 'approved' | 'blocked';

type IssuanceEvent =
  | { type: 'REQUEST_CARD' }
  | { type: 'RESOLVE_CHECKS'; approved: boolean; riskScore: number }
  | { type: 'RESET' };

export type IssuanceContext = {
  profile: CardProfile;
  riskScore?: number;
};

export const cardIssuanceMachine = createMachine(
  {
    types: {} as {
      context: IssuanceContext;
      events: IssuanceEvent;
      value: IssuanceStateValue;
      input: IssuanceContext;
    },
    id: 'card-issuance',
    context: ({ input }) => input,
    initial: 'idle',
    states: {
      idle: {
        on: {
          REQUEST_CARD: 'verifying',
        },
      },
      verifying: {
        entry: 'notifyRiskCheck',
        on: {
          RESOLVE_CHECKS: [
            {
              guard: 'wasApproved',
              target: 'approved',
              actions: ['captureRiskScore'],
            },
            {
              target: 'blocked',
              actions: ['captureRiskScore'],
            },
          ],
        },
      },
      approved: {
        entry: 'notifyIssued',
        on: { RESET: 'idle' },
      },
      blocked: {
        entry: 'notifyBlocked',
        on: { RESET: 'idle' },
      },
    },
  },
  {
    guards: {
      wasApproved: ({ event }) => event.type === 'RESOLVE_CHECKS' && event.approved,
    },
    actions: {
      captureRiskScore: assign(({ event }) => ({
        riskScore: event.type === 'RESOLVE_CHECKS' ? event.riskScore : undefined,
      })),
      notifyRiskCheck: ({ context }) => {
        console.log('Running risk checks for', context.profile.cardId);
      },
      notifyIssued: ({ context }) => {
        console.log('Virtual card issued for', context.profile.userName);
      },
      notifyBlocked: ({ context }) => {
        console.warn('Issuance blocked for', context.profile.userName);
      },
    },
  }
);
