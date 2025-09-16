import type { NumberMatcher } from './getNumberMatchers.js';
import type { ObjectMatcher } from './getObjectMatchers.js';
import type { StringMatcher } from './getStringMatchers.js';

export type ObjectMatcherCreator<T> = (
  parsedSearchExpression: T,
) => ObjectMatcher;

export type StringMatcherCreator<T> = (
  parsedSearchExpression: T,
) => StringMatcher;

export type NumberMatcherCreator<T> = (
  parsedSearchExpression: T,
) => NumberMatcher;

interface CustomOperatorBase<ParsedSearchExpression> {
  name: string;
  /**
   * Parse the search expression of a criterion of the query string.
   * Return `null` if the input does not match the expected format, which will
   * effectively ignore the operator for the given criterion.
   * Search expressions are parsed by all custom operators and those which
   * return non-null values are kept to be executed during search.
   *
   * Example: We implement a custom `+-` operator for finding a value plus or minus some tolerance.
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CustomOperator<T = any> extends CustomOperatorBase<T> {
  createObjectMatcher?: ObjectMatcherCreator<T>;
}
