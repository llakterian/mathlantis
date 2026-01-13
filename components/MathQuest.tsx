
import React, { useState, useEffect, useCallback } from 'react';
import { Difficulty } from '../types';
import { generateQuestion, Question } from '../services/mathEngine';

interface Props {
  difficulty: Difficulty;
  onSolve: (correct: boolean) => void;
}

const MathQuest: React.FC<Props> = ({ difficulty, onSolve }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const nextQuestion = useCallback(() => {
    setQuestion(generateQuestion(difficulty));
    setInput('');
    setFeedback(null);
  }, [difficulty]);

  useEffect(() => {
    nextQuestion();
  }, [nextQuestion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || input === '') return;

    if (parseInt(input) === question.answer) {
      setFeedback('correct');
      onSolve(true);
      setTimeout(nextQuestion, 600);
    } else {
      setFeedback('wrong');
      onSolve(false);
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl md:rounded-3xl p-3 md:p-5 shadow-2xl border-b-4 md:border-b-8 border-indigo-500 transform transition-all w-full max-w-[280px] md:max-w-sm mx-auto">
      <div className="flex justify-between items-center mb-3 md:mb-4 border-b border-indigo-50 pb-2">
        <div>
          <h2 className="text-lg md:text-2xl font-black text-indigo-950 leading-tight tracking-tighter uppercase">
            SOLVE
          </h2>
          <p className="text-[8px] md:text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none mt-1">Verification</p>
        </div>
        <div className="bg-indigo-700 text-white px-2 py-1 rounded-lg text-[8px] md:text-[10px] font-black shadow-lg uppercase tracking-wider">
          {difficulty}
        </div>
      </div>

      <div className="bg-indigo-950 rounded-xl md:rounded-2xl p-4 md:p-8 mb-3 md:mb-5 text-center shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)] relative overflow-hidden border-2 border-indigo-900">
        {feedback === 'correct' && (
          <div className="absolute inset-0 bg-green-600/95 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 z-20">
            <span className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter">SUCCESS</span>
          </div>
        )}
        {feedback === 'wrong' && (
          <div className="absolute inset-0 bg-red-600/95 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 z-20">
            <span className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter">ERROR</span>
          </div>
        )}
        <div className="text-4xl md:text-6xl font-black text-white tracking-tighter [text-shadow:0_4px_0_rgba(0,0,0,0.4)] relative z-10">
          {question?.text}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 md:gap-4">
        <div className="relative">
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="?"
            className={`w-full text-center text-2xl md:text-5xl p-2 md:p-4 rounded-xl md:rounded-2xl border-2 md:border-4 transition-all outline-none font-black text-indigo-950 placeholder-indigo-100 shadow-md ${
              feedback === 'wrong' ? 'border-red-500 bg-red-50' : 
              feedback === 'correct' ? 'border-green-500 bg-green-50' : 
              'border-indigo-100 focus:border-indigo-600 focus:bg-white'
            }`}
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="group w-full bg-indigo-950 hover:bg-black text-white font-black text-sm md:text-lg py-3 md:py-4 rounded-xl md:rounded-2xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-[0.1em]"
        >
          <span>SUBMIT</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </form>

      <div className="mt-4 pt-3 border-t-2 border-dotted border-indigo-50 flex flex-col items-center">
        <div className="flex gap-2">
          {['Σ', 'Δ', 'Ω'].map((label, i) => (
            <div key={i} className="bg-indigo-50 px-2 py-1 flex items-center justify-center rounded-lg shadow-sm border border-indigo-100 animate-bounce-subtle text-[8px] font-black text-indigo-400 uppercase tracking-widest" style={{ animationDelay: `${i * 0.4}s` }}>
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MathQuest;
