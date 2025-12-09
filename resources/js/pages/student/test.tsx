import { Progress } from '@/components/template-ui/progress';
import { BookOpen, ChevronLeft, ChevronRight, Clock, Send } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/template-ui/card';
import { Button } from '@/components/template-ui/button';
import { useEffect, useState } from 'react';
import { useTest } from '@/lib/useTest';
import { Link } from '@inertiajs/react';

export default function Test() {
    const subject  = "mathematics";
    const { currentTest, answerQuestion, goToQuestion, submitTest } = useTest();
    const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
    const [timeElapsed, setTimeElapsed] = useState(0);

    // Initialize MathJax
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://polyfill.io/v3/polyfill.min.js?features=es6';
        document.head.appendChild(script);

        const mathJaxScript = document.createElement('script');
        mathJaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
        mathJaxScript.async = true;
        document.head.appendChild(mathJaxScript);

        mathJaxScript.onload = () => {
            window.MathJax = {
                tex: {
                    inlineMath: [['$', '$'], ['\\(', '\\)']],
                    displayMath: [['$$', '$$'], ['\\[', '\\]']]
                },
                options: {
                    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
                }
            };
        };

        return () => {
            document.head.removeChild(script);
            document.head.removeChild(mathJaxScript);
        };
    }, []);

    // Timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeElapsed(Date.now() - currentTest.startTime.getTime());
        }, 1000);

        return () => clearInterval(timer);
    }, [currentTest]);

    // Reprocess MathJax when question changes
    useEffect(() => {
        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise();
        }
    }, [currentTest?.currentQuestionIndex]);

    // Load current answer when question changes
    useEffect(() => {
        if (currentTest && currentTest.questions.length > 0) {
            const currentQuestion = currentTest.questions[currentTest.currentQuestionIndex];
            const currentAnswer = currentTest.answers[currentQuestion.id];
            setSelectedAnswer(currentAnswer || null);
        }
    }, [currentTest?.currentQuestionIndex, currentTest?.answers]);




    if (!currentTest || currentTest.questions.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">No questions available for {subject}</p>
                        <Button onClick={() => {}} className="mt-4">
                            <Link href={`/student/dashboard`} className="flex w-full items-center justify-center">
                                Back to Dashboard
                            </Link>

                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }


    const currentQuestion = currentTest.questions[currentTest.currentQuestionIndex];
    const progress = ((currentTest.currentQuestionIndex + 1) / currentTest.questions.length) * 100;
    const formatTime = (ms: number) => {
        const seconds = Math.floor(ms / 1000) % 60;
        const minutes = Math.floor(ms / (1000 * 60));
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleAnswerSelect = (answer: 'A' | 'B' | 'C' | 'D') => {
        setSelectedAnswer(answer);
        answerQuestion(currentQuestion.id, answer);
    };

    const handleNext = () => {
        if (currentTest.currentQuestionIndex < currentTest.questions.length - 1) {
            goToQuestion(currentTest.currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentTest.currentQuestionIndex > 0) {
            goToQuestion(currentTest.currentQuestionIndex - 1);
        }
    };

    const handleSubmit = () => {
        if (Object.keys(currentTest.answers).length === 0) {
            /*
            toast({
                title: "No answers submitted",
                description: "Please answer at least one question before submitting.",
                variant: "destructive"
            });
             */
            return;
        }

        submitTest();
       // navigate('/results');
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-college-maroon-light via-background to-secondary">
            {/* Header */}
            <header className="bg-white shadow-card border-b">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white rounded-lg p-1 shadow-card">
                                <img src="https://www.qualitexpharma.com/qualitex_logo.png" alt="EHJ Model College Logo" className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-college-maroon-dark">{currentTest.subject} Test</h1>
                                <p className="text-xs text-muted-foreground">EHJ CBT System</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {formatTime(timeElapsed)}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Progress */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-college-maroon-dark">
                      Question {currentTest.currentQuestionIndex + 1} of {currentTest.questions.length}
                    </span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(progress)}% Complete
                        </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>


                {/* Passage Card (if question has passage) */}
                {currentQuestion.passage && (
                    <Card className="shadow-card mb-6 border-l-4 border-l-college-maroon">
                        <CardHeader>
                            <CardTitle className="text-lg text-college-maroon-dark flex items-center">
                                <BookOpen className="w-5 h-5 mr-2" />
                                Reading Passage
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                                <div dangerouslySetInnerHTML={{ __html: currentQuestion.passage.replace(/\n/g, '<br>') }} />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Question Card */}
                <Card className="shadow-elevation mb-6">
                    <CardHeader>
                        <CardTitle className="text-xl text-college-maroon-dark">
                            <div dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.entries(currentQuestion.options).map(([key, option]) => (
                            <Button
                                key={key}
                                variant={selectedAnswer === key ? "default" : "outline"}
                                className={`w-full p-6 h-auto text-left justify-start text-wrap ${
                                    selectedAnswer === key
                                        ? 'from-primary to-college-maroon text-white border-primary'
                                        : 'hover:bg-college-maroon-light hover:border-college-maroon'
                                }`}
                                onClick={() => handleAnswerSelect(key as 'A' | 'B' | 'C' | 'D')}
                            >
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0 font-semibold ${
                                    selectedAnswer === key
                                        ? 'bg-white text-primary'
                                        : 'bg-college-maroon-light text-college-maroon-dark'
                                }`}>
                                  {key}
                                </span>
                                <span dangerouslySetInnerHTML={{ __html: option }} />
                            </Button>
                        ))}
                    </CardContent>
                </Card>


                {/* Navigation */}
                <div className="flex justify-between items-center">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentTest.currentQuestionIndex === 0}
                        className="border-college-maroon text-college-maroon hover:bg-college-maroon hover:text-white"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                    </Button>

                    <div className="text-sm text-muted-foreground">
                        Answered: {Object.keys(currentTest.answers).length} / {currentTest.questions.length}
                    </div>

                    {currentTest.currentQuestionIndex === currentTest.questions.length - 1 ? (
                        <Button
                            onClick={handleSubmit}
                            className="from-success to-green-600 hover:from-green-600 hover:to-green-700"
                        >
                            <Send className="w-4 h-4 mr-2" />
                            Submit Test
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            className="from-primary to-college-maroon hover:from-primary-hover hover:to-college-maroon-dark"
                        >
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </div>


                {/* Question Navigation */}
                <Card className="mt-6 shadow-card">
                    <CardHeader>
                        <CardTitle className="text-lg text-college-maroon-dark">Question Navigation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                            {currentTest.questions.map((_, index) => (
                                <Button
                                    key={index}
                                    variant={index === currentTest.currentQuestionIndex ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => goToQuestion(index)}
                                    className={`w-10 h-10 p-0 ${
                                        index === currentTest.currentQuestionIndex
                                            ? 'from-primary to-college-maroon'
                                            : currentTest.answers[currentTest.questions[index].id]
                                                ? 'bg-success text-black border-success hover:bg-success/90'
                                                : 'hover:bg-college-maroon-light hover:border-college-maroon'
                                    }`}
                                >
                                    {index + 1}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </main>

            {/* Footer */}
            <footer className="border-t bg-card/30 py-8 px-4">
                <div className="container mx-auto max-w-6xl text-center">
                    <p className="text-muted-foreground">
                        © 2024 EHJ Model College Ilorin. All rights reserved. | Computer Based Testing Platform
                    </p>
                </div>
            </footer>
        </div>
    );
}
