import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/template-ui/card';
import { Button } from '@/components/template-ui/button';
import { CheckCircle, Clock, Target, TrendingUp, History, PlayCircle, BarChart3 } from 'lucide-react';

interface ResultProps {
    practice: any;
    latestAttempt: any;
    allAttempts: any[];
}

export default function Results({ practice, latestAttempt, allAttempts }: ResultProps) {
    const isImproved = allAttempts.length > 1 && latestAttempt.score > allAttempts[1].score;
    const bestScore = Math.max(...allAttempts.map(a => a.score));

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-college-maroon-light via-background to-secondary pb-12">
            <Head title={`Results - ${practice.title}`} />

            <header className="bg-white shadow-card border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <h1 className="text-lg font-bold text-college-maroon-dark">Test Completed</h1>
                        </div>
                        <Button variant="ghost" className="text-muted-foreground hover:text-college-maroon" asChild>
                            <Link href="/student/dashboard">Back to Dashboard</Link>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">

                {/* Header Summary */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-college-maroon-dark mb-2">{practice.title}</h2>
                    <p className="text-muted-foreground">You have completed this practice test. Here is how you did.</p>
                </div>

                {/* Score Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="shadow-lg border-t-4 border-t-college-maroon bg-white text-center transform hover:-translate-y-1 transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold uppercase text-muted-foreground tracking-wider flex items-center justify-center">
                                <Target className="w-4 h-4 mr-2 text-college-maroon" /> Final Score
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-5xl font-extrabold text-college-maroon-dark mb-2">
                                {latestAttempt.score}
                            </div>
                            <p className="text-sm text-green-600 font-medium">
                                {latestAttempt.correct_answers} / {latestAttempt.total_questions} Correct
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-t-4 border-t-primary bg-white text-center transform hover:-translate-y-1 transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold uppercase text-muted-foreground tracking-wider flex items-center justify-center">
                                <Clock className="w-4 h-4 mr-2 text-primary" /> Time Taken
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-gray-800 mb-2 mt-1">
                                {formatTime(latestAttempt.time_taken)}
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">
                                out of {practice.duration}m
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-t-4 border-t-green-500 bg-white text-center transform hover:-translate-y-1 transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold uppercase text-muted-foreground tracking-wider flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 mr-2 text-green-500" /> Improvement
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mt-2 flex items-center justify-center">
                                {allAttempts.length === 1 ? (
                                    <span className="text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full text-sm">First Attempt</span>
                                ) : isImproved ? (
                                    <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-sm flex items-center">
                                        <TrendingUp className="w-4 h-4 mr-1" /> Improved from previous!
                                    </span>
                                ) : (
                                    <span className="text-amber-600 font-bold bg-amber-50 px-3 py-1 rounded-full text-sm">
                                        Keep practicing!
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-4 font-medium">Best Score: {bestScore}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Subject Breakdown (if multi-subject) */}
                {latestAttempt.subject_scores && Object.keys(latestAttempt.subject_scores).length > 0 && (
                    <Card className="shadow-card border-0">
                        <CardHeader className="bg-gray-50 border-b">
                            <CardTitle className="text-lg text-college-maroon flex items-center">
                                <BarChart3 className="w-5 h-5 mr-2" />
                                Subject Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Object.entries(latestAttempt.subject_scores).map(([subject, stats]: [string, any]) => {
                                    const percent = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                                    return (
                                        <div key={subject} className="bg-white border rounded-lg p-4 shadow-sm flex items-center justify-between">
                                            <div>
                                                <h4 className="font-semibold text-gray-800">{subject}</h4>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {stats.correct} / {stats.total} correct
                                                </p>
                                            </div>
                                            <div className={`text-lg font-bold ${percent >= 70 ? 'text-green-600' : percent >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                                                {percent}%
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Historic Attempts */}
                {allAttempts.length > 1 && (
                    <Card className="shadow-card border-0">
                        <CardHeader className="bg-gray-50 border-b">
                            <CardTitle className="text-lg text-college-maroon flex items-center">
                                <History className="w-5 h-5 mr-2" /> Let's look at your history
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {allAttempts.map((attempt, index) => (
                                    <div key={attempt.id} className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${attempt.id === latestAttempt.id ? 'bg-college-maroon/5' : ''}`}>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flexitems-center justify-center font-bold text-gray-500 flex items-center">
                                                #{allAttempts.length - index}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-800">Score: {attempt.score}</div>
                                                <div className="text-xs text-muted-foreground">{new Date(attempt.created_at).toLocaleString()}</div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-semibold text-gray-600">
                                            {formatTime(attempt.time_taken)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                    <Button asChild variant="outline" className="px-8 py-6 text-lg">
                        <Link href="/student/dashboard">Return to Dashboard</Link>
                    </Button>
                    <Button asChild className="px-8 py-6 text-lg  text-white shadow-lg shadow-college-maroon/30">
                        <Link href={`/student/practice/${practice.id}/take-test`}>
                            <PlayCircle className="w-5 h-5 mr-2" />
                            Retake Practice Test
                        </Link>
                    </Button>
                </div>
            </main>
        </div>
    );
}
