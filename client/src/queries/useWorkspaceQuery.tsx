import { useQuery } from '@tanstack/react-query';
import { getWorkspaceInfo } from 'src/apis/workspace';

export function useWorkspaceQuery(id?: string) {
  return useQuery({
    queryKey: ['workspace', id],
    queryFn: () => getWorkspaceInfo({ id }),
  });
}
