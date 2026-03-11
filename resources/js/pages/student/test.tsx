import { useState, useEffect, useRef, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { Progress } from '@/components/template-ui/progress';
import { BookOpen, ChevronLeft, ChevronRight, Clock, Send, AlertTriangle, Flag, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/template-ui/card';
import { Button } from '@/components/template-ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/template-ui/dialog';
import MathPreview from '@/components/MathPreview';

interface TestProps {
    practice: any;
    session: any;
    subjects: string[];
    questionsBySubject: Record<string, any[]>;
}

export default function Test({ practice, session, subjects, questionsBySubject }: TestProps) {
    const [currentSubject, setCurrentSubject] = useState<string>(session.current_subject || subjects[0] || '');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // Test State
    const [answers, setAnswers] = useState<Record<number, string>>(session.answers || {});
    const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
    const [timeRemaining, setTimeRemaining] = useState<number>(session.time_remaining || practice.duration * 60);

    // UI State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    // Compute derived state
    const currentQuestions = questionsBySubject[currentSubject] || [];
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const totalTime = practice.duration * 60;
    const isLowTime = timeRemaining <= totalTime * 0.1;

    // Persist refs to prevent stale closures in intervals
    const stateRef = useRef({ answers, timeRemaining, currentSubject });
    useEffect(() => {
        stateRef.current = { answers, timeRemaining, currentSubject };
    }, [answers, timeRemaining, currentSubject]);

    // Timer Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // MathJax Initialization
    useEffect(() => {
        if (!window.MathJax) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
            script.async = true;
            document.head.appendChild(script);

            window.MathJax = {
                tex: {
                    inlineMath: [['$', '$'], ['\\(', '\\)']],
                    displayMath: [['$$', '$$'], ['\\[', '\\]']]
                },
                options: {
                    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
                }
            };
        }
    }, []);

    // Reprocess MathJax when question changes
    useEffect(() => {
        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise();
        }
    }, [currentQuestionIndex, currentSubject]);

    // Format time
    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Auto-Save Logic (Throttled/Debounced syncing to server)
    const saveProgress = useCallback(async (isFinal = false) => {
        setIsSyncing(true);
        try {
            await axios.post(`/student/practice/${practice.id}/save-progress`, {
                answers: stateRef.current.answers,
                time_remaining: stateRef.current.timeRemaining,
                current_subject: stateRef.current.currentSubject,
            });
        } catch (error) {
            console.error('Failed to sync progress', error);
        } finally {
            setIsSyncing(false);
        }
    }, [practice.id]);

    // Trigger save when answers change or subject changes
    useEffect(() => {
        const timeout = setTimeout(() => saveProgress(), 2000);
        return () => clearTimeout(timeout);
    }, [answers, currentSubject, saveProgress]);

    // Prevent accidental exit
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            saveProgress();
            e.preventDefault();
            e.returnValue = ''; // Required for some browsers
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [saveProgress]);

    // Event Handlers
    const handleAnswerSelect = (optionKey: string) => {
        if (!currentQuestion) return;
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: optionKey
        }));
    };

    const handleToggleReview = () => {
        if (!currentQuestion) return;
        setMarkedForReview(prev => ({
            ...prev,
            [currentQuestion.id]: !prev[currentQuestion.id]
        }));
    };

    const handleSubjectChange = (subject: string) => {
        setCurrentSubject(subject);
        setCurrentQuestionIndex(0);
    };

    const handleAutoSubmit = () => {
        // Stop any pending triggers
        setIsSubmitting(true);
        router.post(`/student/practice/${practice.id}/submit`, {
            answers: stateRef.current.answers
        });
    };

    const handleManualSubmit = () => {
        setIsSubmitting(true);
        router.post(`/student/practice/${practice.id}/submit`, {
            answers: answers
        });
    };

    // Derived counts for modal
    const totalQuestionsOverall = Object.values(questionsBySubject).reduce((acc, qs) => acc + qs.length, 0);
    const totalAnsweredOverall = Object.keys(answers || {}).filter(k => typeof answers[k as any] === 'string').length;
    const totalUnansweredOverall = totalQuestionsOverall - totalAnsweredOverall;
    const progressPercent = currentQuestions.length > 0
        ? ((currentQuestionIndex + 1) / currentQuestions.length) * 100
        : 0;

    if (!subjects.length || !currentQuestion) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">No questions available for this test.</p>
                        <Button className="mt-4" onClick={() => router.get('/student/dashboard')}>Go Back</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Head title={`Test - ${practice.title}`} />

            {/* Header / Navbar */}
            <header className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:block">
                                <h1 className="text-lg font-bold text-college-maroon-dark line-clamp-1">{practice.title}</h1>
                                <p className="text-xs text-muted-foreground">
                                    {isSyncing ? 'Saving...' : 'Saved to cloud'}
                                </p>
                            </div>
                        </div>

                        {/* Subject Tabs */}
                        <div className="flex-1 flex justify-center space-x-2 overflow-x-auto hide-scrollbar px-4">
                            {subjects.map(subject => (
                                <Button
                                    key={subject}
                                    onClick={() => handleSubjectChange(subject)}
                                    variant={currentSubject === subject ? 'default' : 'outline'}

                                >
                                    {subject}
                                </Button>
                            ))}
                        </div>

                        {/* Timer */}
                        <div className={`flex items-center px-4 py-2 rounded-lg font-mono font-bold text-lg border ${isLowTime
                            ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}>
                            <Clock className="w-5 h-5 mr-2" />
                            {formatTime(timeRemaining)}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main CBT Body */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">

                {/* Left side: Question Panel */}
                <div className="flex-1 flex flex-col space-y-4">

                    <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                            {currentSubject} - Question {currentQuestionIndex + 1} of {currentQuestions.length}
                        </span>
                        <Progress value={progressPercent} className="w-1/3 h-2" />
                    </div>

                    {/* Instruction / Passage Display */}
                    {currentQuestion.passage && (
                        <Card className="border-l-4 border-l-college-maroon shadow-sm bg-white">
                            <CardHeader className="py-3 bg-gray-50/50 border-b">
                                <CardTitle className="text-sm flex items-center text-gray-700">
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    Instructions for this question
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 prose prose-sm max-w-none text-gray-600">
                                <MathPreview
                                    content={currentQuestion.passage || ``}
                                    className="flex-1"
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Main Question Display */}
                    <Card className="shadow-md bg-white border-0">
                        <CardHeader className="border-b bg-gray-50/30">
                            <CardTitle className="text-lg leading-relaxed text-gray-800 font-medium min-h-[4rem]">
                                <MathPreview
                                    content={currentQuestion.question || ``}
                                    className="flex-1"
                                />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {['A', 'B', 'C', 'D'].map((key) => {
                                const optionText = currentQuestion.options[key];
                                if (!optionText) return null; // Skip if null

                                const isSelected = answers[currentQuestion.id] === key;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => handleAnswerSelect(key)}
                                        className={`w-full group text-left flex items-start p-4 rounded-xl border-2 transition-all duration-200 ${isSelected
                                            ? 'border-college-maroon bg-college-maroon/5 ring-1 ring-college-maroon shadow-sm'
                                            : 'border-gray-200 hover:border-college-maroon/40 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm mr-4 transition-colors ${isSelected
                                            ? 'bg-college-maroon border-college-maroon'
                                            : 'border-gray-300 text-gray-500 group-hover:border-college-maroon/50 group-hover:text-college-maroon'
                                            }`}>
                                            {key}
                                        </div>
                                        <MathPreview
                                            content={optionText || ``}
                                            className="flex-1 pt-1 text-gray-700"
                                        />

                                    </button>
                                );
                            })}
                        </CardContent>
                    </Card>

                    {/* Action Bar */}
                    <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                            disabled={currentQuestionIndex === 0}
                            className="w-32"
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" /> Prev
                        </Button>

                        <Button
                            variant="ghost"
                            className={`font-semibold ${markedForReview[currentQuestion.id] ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={handleToggleReview}
                        >
                            <Flag className={`w-4 h-4 mr-2 ${markedForReview[currentQuestion.id] ? 'fill-amber-500' : ''}`} />
                            {markedForReview[currentQuestion.id] ? 'Marked for Review' : 'Mark for Review'}
                        </Button>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowSubmitConfirm(true)}
                                className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium rounded-md px-4 py-2 transition-colors"
                            >
                                <Send className="w-4 h-4 mr-2" /> Submit Test
                            </button>

                            <Button
                                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                disabled={currentQuestionIndex === currentQuestions.length - 1}
                            >
                                Next <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right side: Navigation Grid */}
                <div className="w-full lg:w-80 flex flex-col gap-4">
                    <Card className="shadow-sm border-0 bg-white sticky top-20">
                        <CardHeader className="py-4 border-b">
                            <CardTitle className="text-base font-semibold text-gray-800 flex justify-between items-center">
                                Grid Navigation
                                <span className="text-xs font-normal text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                                    {totalAnsweredOverall} / {totalQuestionsOverall} answered
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="grid grid-cols-5 gap-2">
                                {currentQuestions.map((q, idx) => {
                                    const isCurrent = idx === currentQuestionIndex;
                                    const isAnswered = !!answers[q.id];
                                    const isReviewed = markedForReview[q.id];

                                    return (
                                        <Button
                                            key={idx}
                                            onClick={() => setCurrentQuestionIndex(idx)}
                                            className={`
                                                relative w-10 h-10 rounded-md flex items-center justify-center text-sm font-semibold transition-all duration-200
                                                ${isCurrent ? 'ring-2 ring-college-maroon ring-offset-2 scale-110 z-10' : 'hover:bg-gray-100'}
                                                ${isAnswered ? 'text-white border border-college-maroon' : 'bg-white text-gray-600 border border-gray-200'}
                                                ${isReviewed && !isAnswered ? 'bg-amber-100 border-amber-300 text-amber-800' : ''}
                                                ${isReviewed && isAnswered ? 'ring-2 ring-amber-400' : ''}
                                            `}
                                        >
                                            {idx + 1}
                                            {isReviewed && (
                                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white"></span>
                                            )}
                                        </Button>
                                    );
                                })}
                            </div>

                            <div className="mt-6 pt-4 border-t space-y-2 text-xs">
                                <div className="flex items-center text-gray-600"><span className="w-3 h-3 rounded-full bg-white border border-gray-300 mr-2"></span> Not Answered</div>
                                <div className="flex items-center text-gray-600"><span className="w-3 h-3 rounded-full bg-college-maroon mr-2"></span> Answered</div>
                                <div className="flex items-center text-gray-600"><span className="w-3 h-3 rounded-full bg-amber-100 border border-amber-300 mr-2"></span> Marked for Review</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Button
                        onClick={() => setShowSubmitConfirm(true)}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-6"
                    >
                        Submit Overall Exam
                    </Button>
                </div>
            </main>

            {/* Submission Confirmation Modal */}
            <Dialog open={showSubmitConfirm} onOpenChange={setShowSubmitConfirm}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-college-maroon-dark flex items-center">
                            <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
                            Confirm Submission
                        </DialogTitle>
                        <DialogDescription className="pt-2 text-base">
                            Are you absolutely sure you want to submit your test now?
                            You will not be able to change your answers after submission.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="bg-gray-50 p-4 rounded-lg my-4 grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-white rounded shadow-sm border">
                            <div className="text-2xl font-bold text-college-maroon">{totalAnsweredOverall}</div>
                            <div className="text-xs text-muted-foreground uppercase font-semibold mt-1">Answered</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded shadow-sm border">
                            <div className={`text-2xl font-bold ${totalUnansweredOverall > 0 ? 'text-amber-500' : 'text-green-500'}`}>
                                {totalUnansweredOverall}
                            </div>
                            <div className="text-xs text-muted-foreground uppercase font-semibold mt-1">Unanswered</div>
                        </div>
                    </div>

                    <DialogFooter className="flex space-x-2 justify-end">
                        <Button variant="outline" onClick={() => setShowSubmitConfirm(false)} disabled={isSubmitting}>
                            Resume Test
                        </Button>
                        <Button
                            onClick={handleManualSubmit}
                            disabled={isSubmitting}
                            className="hover:bg-college-maroon-dark text-white"
                        >
                            {isSubmitting ? 'Submitting...' : 'Yes, Submit Test'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
