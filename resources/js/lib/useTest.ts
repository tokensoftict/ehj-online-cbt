// useTest.ts
import { useState, useCallback, useEffect } from 'react';

export interface Question {
    id: string;
    subject: string;
    question: string;
    passage?: string;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
    };
    correctAnswer: 'A' | 'B' | 'C' | 'D';
    explanation?: string;
}

export interface TestSession {
    subject: string;
    questions: Question[];
    currentQuestionIndex: number;
    answers: Record<string, 'A' | 'B' | 'C' | 'D'>;
    startTime: Date;
    endTime?: Date;
    score?: number;
    isCompleted: boolean;
}

// ✅ Mock questions
const mockQuestions: Record<string, Question[]> = {
    Mathematics: [
        {
            id: 'math-1',
            subject: 'Mathematics',
            question: 'Solve x² + 5x + 6 = 0',
            options: {
                A: 'x = -2 or -3',
                B: 'x = 2 or 3',
                C: 'x = -1 or -6',
                D: 'x = 1 or 6'
            },
            correctAnswer: 'A',
            explanation: 'Factor the quadratic: (x + 2)(x + 3) = 0, so x = -2 or -3.'
        },
        {
            id: 'math-2',
            subject: 'Mathematics',
            question: 'What is the derivative of f(x) = 3x² + 2x - 1?',
            options: {
                A: '6x + 2',
                B: '3x + 2',
                C: '6x - 1',
                D: '3x² + 2'
            },
            correctAnswer: 'A',
            explanation: 'Using the power rule: f′(x) = 6x + 2.'
        }
    ],
    Physics: [
        {
            id: 'phy-1',
            subject: 'Physics',
            question: 'What is the formula for kinetic energy?',
            options: {
                A: 'KE = mgh',
                B: 'KE = ½mv²',
                C: 'KE = mc²',
                D: 'KE = Fd'
            },
            correctAnswer: 'B',
            explanation: 'Kinetic energy is given by KE = ½mv².'
        }
    ]
};

// ✅ Main hook
export const useTest = () => {

    const [currentTest, setCurrentTest] = useState<TestSession | null>(null);


    // Default subject = "Mathematics"
    const startTest = useCallback((subject?: string) => {
        const selectedSubject = subject && mockQuestions[subject] ? subject : 'Mathematics';
        const questions = mockQuestions[selectedSubject] || [];
        const newTest: TestSession = {
            subject: selectedSubject,
            questions,
            currentQuestionIndex: 0,
            answers: {},
            startTime: new Date(),
            isCompleted: false
        };
        setCurrentTest(newTest);
    }, []);

    // Auto-start default test if none is active
    useEffect(() => {
        if (!currentTest) {
            startTest("Mathematics");
        }
    }, [currentTest, startTest]);


    const answerQuestion = useCallback((questionId: string, answer: 'A' | 'B' | 'C' | 'D') => {
        setCurrentTest(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                answers: {
                    ...prev.answers,
                    [questionId]: answer
                }
            };
        });
    }, []);

    const goToQuestion = useCallback((index: number) => {
        setCurrentTest(prev => {
            if (!prev || index < 0 || index >= prev.questions.length) return prev;
            return { ...prev, currentQuestionIndex: index };
        });
    }, []);

    const submitTest = useCallback(() => {
        setCurrentTest(prev => {
            if (!prev) return prev;
            const score = prev.questions.reduce((acc, q) => {
                const userAnswer = prev.answers[q.id];
                return acc + (userAnswer === q.correctAnswer ? 1 : 0);
            }, 0);
            return {
                ...prev,
                endTime: new Date(),
                score,
                isCompleted: true
            };
        });
    }, []);

    const resetTest = useCallback(() => {
        setCurrentTest(null);
    }, []);

    return {
        currentTest,
        startTest,
        answerQuestion,
        goToQuestion,
        submitTest,
        resetTest
    };
};
