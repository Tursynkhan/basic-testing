import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },
  { a: 5, b: 3, action: Action.Subtract, expected: 2 },
  { a: 10, b: 2, action: Action.Subtract, expected: 8 },
  { a: 4, b: 2, action: Action.Multiply, expected: 8 },
  { a: 6, b: 2, action: Action.Divide, expected: 3 },
  { a: 9, b: 3, action: Action.Divide, expected: 3 },
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 4, b: 2, action: Action.Exponentiate, expected: 16 },
  { a: 'invalid', b: 2, action: Action.Add, expected: null }, // invalid input
  { a: 4, b: 2, action: 'invalid' as Action, expected: null }, // invalid action
];

describe('simpleCalculator table-driven tests', () => {
  test.each(testCases)(
    'should return $expected for $a $action $b',
    ({ a, b, action, expected }) => {
      expect(simpleCalculator({ a, b, action })).toBe(expected);
    },
  );
});
