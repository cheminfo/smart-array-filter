import type { JSONObject } from './types.js';

export type ObjectOperator<T> = (
  arg1: T,
) => (arg: JSONObject | null) => boolean;

export type CustomStringOperator<ParseOutput> = (
  input: ParseOutput,
) => (value: string) => boolean;
export type CustomNumberOperator<ParseInput> = (
  input: ParseInput,
) => (value: number) => boolean;

interface CustomOperatorBase<T> {
  name: string;
  parse: (input: string) => T | null;
  applyString?: CustomStringOperator<T>;
  applyNumber?: CustomNumberOperator<T>;
  applyObject?: ObjectOperator<T>;
}

export interface CustomOperator<T = any> extends CustomOperatorBase<T> {
  applyObject?: ObjectOperator<T>;
}

export interface CustomObjectOperator<T = any> extends CustomOperatorBase<T> {
  applyObject: ObjectOperator<T>;
}
