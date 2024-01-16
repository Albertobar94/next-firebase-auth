export interface LoadingValue<T, E> {
  error?: E;
  loading: boolean;
  reset: () => void;
  setError: (error: E) => void;
  setValue: (value?: T) => void;
  value?: T;
}

export interface ReducerState<T, E> {
  error?: E;
  loading: boolean;
  value?: T;
}

export interface ErrorAction<E> {
  type: "error";
  error: E;
}
export interface ResetAction<T> {
  type: "reset";
  defaultValue?: T;
}
export interface ValueAction<T> {
  type: "value";
  value?: T;
}
export type ReducerAction<T, E> =
  | ErrorAction<E>
  | ResetAction<T>
  | ValueAction<T>;
