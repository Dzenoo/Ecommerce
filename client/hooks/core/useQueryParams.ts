'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

const useQueryParams = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams],
  );

  const updateQueryParams = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const newParams = new URLSearchParams(params);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          newParams.delete(key);
        } else if (Array.isArray(value)) {
          newParams.delete(key);
          value.forEach((v) => newParams.append(key, v));
        } else {
          newParams.set(key, value);
        }

        window.history.replaceState(
          null,
          '',
          `${pathname}?${newParams.toString()}`,
        );
      });
    },
    [params, pathname],
  );

  const getQueryParam = useCallback(
    (key: string) => {
      return params.get(key);
    },
    [params],
  );

  const getQueryParamAll = useCallback(
    (key: string) => {
      return params.getAll(key);
    },
    [params],
  );

  const deleteQueryParam = useCallback(
    (key: string) => {
      updateQueryParams({ [key]: null });
    },
    [updateQueryParams],
  );

  return {
    params,
    updateQueryParams,
    getQueryParam,
    getQueryParamAll,
    deleteQueryParam,
  };
};

export { useQueryParams };
