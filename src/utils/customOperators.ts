import type { JSONObject } from './types.js';

export type ObjectMatcherCreator<T> = (
  parsedSearchExpression: T,
) => (arg: JSONObject | null) => boolean;

export type StringMatcherCreator<T> = (parsedSearchExpression: T) => (
  /**
   * The leaf string value to match against the search expression.
   * @return `true` if the value matches, `false` otherwise.
   */
  value: string,
  path: string[],
) => boolean;
export type NumberMatcherCreator<T> = (
  parsedSearchExpression: T,
) => (value: number) => boolean;

interface CustomOperatorBase<ParsedSearchExpression> {
  name: string;
  /**
   * Parse the search expression of a criterion of the query string.
   * Return `null` if the input does not match the expected format.
   * Search expressions are parsed by all custom operators until one returns
   * a non-null value. If none matches, the default search operators are used.
   *
   * Example: We want a custom `+-` operator which allow to find a value plus or minus some tolerance.
   * The query string passed to smart-array-filter is `molecularMass:30+-5`.
   * The parse function will receive `10+-5` as input, which could be parsed to `{value: 10, tolerance: 5}`, or return `null` if the `+-` pattern is not found.
   */
  parse: (searchExpression: string) => ParsedSearchExpression | null;

  /**
   * Create the function which matches numbers against the operator, based on the parsed expression.
   * During traversal of the searched items, if a number value is found,
   * this function will be called with the parsed value returned by `parse`.
   *
   * Example: For the `+-` operator, this function will receive `{value: 10, tolerance: 5}` as input.
   *
   */
  createNumberMatcher?: NumberMatcherCreator<ParsedSearchExpression>;

  /**
   * Create the function which matches strings against the operator, based on the parsed expression.
   * During traversal of the searched items, if a string value is found,
   * this function will be called with the parsed value returned by `parse`.
   */

  createStringMatcher?: StringMatcherCreator<ParsedSearchExpression>;
  /**
   * Create the function which matches objects against the operator, based on the parsed expression.
   * During traversal of the searched items, if an object or `null` value is found,
   * this function will be called with the parsed value returned by `parse`.
   */
  createObjectMatcher?: ObjectMatcherCreator<ParsedSearchExpression>;
}

export interface CustomOperator<T = any> extends CustomOperatorBase<T> {
  createObjectMatcher?: ObjectMatcherCreator<T>;
}

export interface CustomObjectOperator<T = any> extends CustomOperatorBase<T> {
  createObjectMatcher: ObjectMatcherCreator<T>;
}
