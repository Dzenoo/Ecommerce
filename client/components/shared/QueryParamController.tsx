'use client';

import React, { useEffect, useState } from 'react';

import { useQueryParams } from '@/hooks/core/useQueryParams';

type QueryParamControllerProps<T> = {
  paramKey: string;
  defaultValue?: T;
  transform?: {
    decode: (value: string | string[]) => T;
    encode: (value: T) => string | string[];
  };
  debounce?: number;
  children: (props: {
    value: T;
    onChange: (value: T) => void;
  }) => React.ReactNode;
};

const QueryParamController = <T,>({
  paramKey,
  defaultValue,
  transform,
  debounce = 300,
  children,
}: QueryParamControllerProps<T>) => {
  const { getQueryParam, getQueryParamAll, updateQueryParams } =
    useQueryParams();
  const [internalValue, setInternalValue] = useState<T>(defaultValue as T);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const paramValue = getQueryParamAll(paramKey);
    const valueFromUrl =
      paramValue.length > 1 ? paramValue : paramValue[0] || null;

    if (valueFromUrl !== null) {
      const decoded = transform?.decode(valueFromUrl) ?? valueFromUrl;
      setInternalValue(decoded as T);
    } else if (defaultValue !== undefined) {
      setInternalValue(defaultValue as T);
    }
    setIsInitialized(true);
  }, [paramKey, getQueryParam, getQueryParamAll, transform, defaultValue]);

  useEffect(() => {
    if (!isInitialized) return;

    const handler = setTimeout(() => {
      const encodedValue =
        transform?.encode(internalValue) ??
        (internalValue as string | string[] | null);
      updateQueryParams({ [paramKey]: encodedValue });
    }, debounce);

    return () => clearTimeout(handler);
  }, [
    internalValue,
    paramKey,
    updateQueryParams,
    transform,
    debounce,
    isInitialized,
  ]);

  return children({
    value: internalValue,
    onChange: setInternalValue,
  });
};

export default QueryParamController;
