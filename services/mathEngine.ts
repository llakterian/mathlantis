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
  let num1 = 0;
  let num2 = 0;
  let text = '';
  let answer = 0;

  switch (op) {
    case '+':
      num1 = Math.floor(Math.random() * config.maxNumber) + 1;
      num2 = Math.floor(Math.random() * config.maxNumber) + 1;
      text = `${num1} + ${num2}`;
      answer = num1 + num2;
      break;
    case '-':
      num1 = Math.floor(Math.random() * config.maxNumber) + 1;
      num2 = Math.floor(Math.random() * num1) + 1;
      text = `${num1} - ${num2}`;
      answer = num1 - num2;
      break;
    case '*':
      num1 = Math.floor(Math.random() * config.maxNumber) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      text = `${num1} x ${num2}`;
      answer = num1 * num2;
      break;
    case '/':
      answer = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      num1 = answer * num2;
      text = `${num1} / ${num2}`;
      break;
  }

  return { text, answer };
};