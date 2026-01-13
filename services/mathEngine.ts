// Fix: LEVEL_CONFIGS is exported from constants, not types
import { Difficulty } from '../types';
import { LEVEL_CONFIGS } from '../constants';

export interface Question {
  text: string;
  answer: number;
}

export const generateQuestion = (difficulty: Difficulty): Question => {
  const config = LEVEL_CONFIGS[difficulty];
  const op = config.operations[Math.floor(Math.random() * config.operations.length)];
  let num1 = Math.floor(Math.random() * config.maxNumber) + 1;
  let num2 = Math.floor(Math.random() * config.maxNumber) + 1;

  let text = '';
  let answer = 0;

  switch (op) {
    case '+':
      text = `${num1} + ${num2}`;
      answer = num1 + num2;
      break;
    case '-':
      // Ensure positive result for younger learners
      if (num1 < num2) [num1, num2] = [num2, num1];
      text = `${num1} - ${num2}`;
      answer = num1 - num2;
      break;
    case '*':
      text = `${num1} × ${num2}`;
      answer = num1 * num2;
      break;
    case '/':
      // Ensure whole number result
      answer = Math.floor(Math.random() * 5) + 1;
      num2 = Math.floor(Math.random() * 5) + 1;
      num1 = answer * num2;
      text = `${num1} ÷ ${num2}`;
      break;
  }

  return { text, answer };
};