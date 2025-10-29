import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useUserStats(userId: string) {
  return useQuery({
    queryKey: ['userStats', userId], // La clé de la requête
    queryFn: () => api.get(`/users/${userId}/stats`), // La fonction qui fetch les données
    staleTime: 1000 * 60, // 1 minute (les autres options restent ici)
  });
}