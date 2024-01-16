import { useCallback, useMemo, useReducer } from "react";
import type {
  LoadingValue,
  ReducerAction,
  ReducerState,
} from "./use-enhanced-state.types";

const defaultState = <T>(
  defaultValue?: T
): {
  loading: boolean;
  value: T | undefined;
} => {
  return {
    loading: defaultValue === undefined || defaultValue === null,
    value: defaultValue,
  };
};

const reducer =
  <T, E>() =>
  (
    state: ReducerState<T, E>,
    action: ReducerAction<T, E>
  ): ReducerState<T, E> => {
    switch (action.type) {
      case "error":
        return {
          ...state,
          error: action.error,
          loading: false,
          value: undefined,
        };
      case "reset":
        return defaultState<T>(action.defaultValue);
      case "value":
        return {
          ...state,
          error: undefined,
          loading: false,
          value: action.value,
        };
      default:
        return state;
    }
  };

export default <T, E>(getDefaultValue?: () => T): LoadingValue<T, E> => {
  const defaultValue = getDefaultValue ? getDefaultValue() : undefined;
  const [state, dispatch] = useReducer(
    reducer<T, E>(),
    defaultState(defaultValue)
  );

  const reset = useCallback(() => {
    const defaultValue = getDefaultValue ? getDefaultValue() : undefined;
    dispatch({ type: "reset", defaultValue });
  }, [getDefaultValue]);

  const setError = useCallback((error: E) => {
    dispatch({ type: "error", error });
  }, []);

  const setValue = useCallback((value?: T) => {
    dispatch({ type: "value", value });
  }, []);

  return useMemo(
    () => ({
      error: state.error,
      loading: state.loading,
      reset,
      setError,
      setValue,
      value: state.value,
    }),
    [state.error, state.loading, reset, setError, setValue, state.value]
  );
};
