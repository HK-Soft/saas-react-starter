// bayaan-portal/src/hooks/useApiLoading
import { useIsFetching, useIsMutating } from '@tanstack/react-query';

export const useApiLoading = () => {
    const isFetching = useIsFetching();
    const isMutating = useIsMutating();

    return {
        isApiLoading: isFetching > 0 || isMutating > 0,
        fetchingCount: isFetching,
        mutatingCount: isMutating,
    };
};