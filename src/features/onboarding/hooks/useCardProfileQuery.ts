import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchCardProfile, type CardProfile } from '../../../services/cardProfile';

const queryKey = ['card-profile'] as const;

export function useCardProfileQuery() {
  return useSuspenseQuery<CardProfile>({
    queryKey,
    queryFn: fetchCardProfile,
  });
}
