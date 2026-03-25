import { Button } from '@/components/template-ui/button';
import { History, LogOut, ArrowLeft, CheckCircle2, SearchX, BookOpen } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/template-ui/card';
import student from '@/routes/student';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Badge } from '@/components/template-ui/badge';

interface HistoryResult {
    id: number;
    student_id: number;
    practice_question_id: number;
    total_questions: number;
    answered_questions: number;
    correct_answers: number;
    score: number;
    time_taken: number;
    created_at: string;
    practice_question: {
        id: number;
        title: string;
        general_subject: {
            name: string;
        };
        duration: number;
        show_result: boolean;
    };
}

interface PaginatedHistory {
    data: HistoryResult[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    current_page: number;
    last_page: number;
    total: number;
}

interface HistoryProps {
    results: PaginatedHistory;
}

export default function StudentHistory({ results }: HistoryProps) {
    const { auth } = usePage<SharedData>().props;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        }).format(date);
    };

    const formatTimeTaken = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        const parts = [];
        if (h > 0) parts.push(`${h}h`);
        if (m > 0) parts.push(`${m}m`);
        if (s > 0 || parts.length === 0) parts.push(`${s}s`);

        return parts.join(' ');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-college-maroon-light via-background to-secondary">
            {/* Header */}
            <header className="bg-white shadow-card border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="icon" asChild className="text-muted-foreground mr-2">
                                <Link href="/student/dashboard">
                                    <ArrowLeft className="h-5 w-5" />
                                </Link>
                            </Button>
                            <div className="w-10 h-10 bg-white rounded-lg p-1.5 shadow-card">

                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-lg font-semibold text-college-maroon-dark">EHJ Model College</h1>
                                <p className="text-xs text-muted-foreground">Past Results</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button variant="outline" asChild>
                                <Link href={student.logout()} className="flex">
                                    <LogOut className="w-fit h-5 mr-2" />
                                    Logout
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-college-maroon-dark tracking-tight">Your History</h2>
                        <p className="text-muted-foreground mt-1">Review your past practice tests and scores.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {results.data && results.data.length > 0 ? (
                        results.data.map((result) => (
                            <Card key={result.id} className="group overflow-hidden border border-border/50 hover:border-border transition-colors shadow-sm hover:shadow-md">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-college-maroon to-college-maroon-light" />
                                <div className="flex flex-col sm:flex-row p-6 items-start sm:items-center justify-between gap-6 pl-8">
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-lg text-foreground line-clamp-1 group-hover:text-college-maroon transition-colors">
                                            {result.practice_question?.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-0.5 rounded-md">
                                                <BookOpen className="w-4 h-4 text-muted-foreground/70" />
                                                {result.practice_question?.general_subject?.name || 'General Subject'}
                                            </span>
                                            <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-0.5 rounded-md">
                                                <History className="w-4 h-4 text-muted-foreground/70" />
                                                {formatDate(result.created_at)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-border/50">
                                        <div className="flex flex-row justify-start gap-8 w-full sm:w-auto">
                                            {result.practice_question?.show_result ? (
                                                <>
                                                    <div className="flex flex-col items-start sm:items-end">
                                                        <span className="text-xs text-muted-foreground uppercase font-medium tracking-wider mb-1">Score</span>
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-2xl font-bold text-college-maroon">{result.score}</span>
                                                            <span className="text-sm font-medium text-muted-foreground">/ {result.total_questions * (result.practice_question?.duration || 1)}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-start sm:items-end">
                                                        <span className="text-xs text-muted-foreground uppercase font-medium tracking-wider mb-1">Time</span>
                                                        <span className="text-sm font-medium text-foreground py-1">
                                                            {formatTimeTaken(result.time_taken)}
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-start sm:items-end">
                                                    <span className="text-xs text-muted-foreground uppercase font-medium tracking-wider mb-1">Status</span>
                                                    <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200 py-1">
                                                        Awaiting Review
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>

                                        {result.practice_question?.show_result && (
                                            <>
                                                <div className="hidden sm:block h-12 w-px bg-border/50"></div>
                                                <Button asChild variant="default" className="w-full sm:w-auto  hover:bg-college-maroon-dark text-white rounded-lg shadow-sm">
                                                    <Link href={`/student/practice/${result.practice_question_id}/results/${result.id}`}>
                                                        View Review
                                                    </Link>
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white/50 rounded-2xl border border-dashed border-border/60">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                <SearchX className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">No Past Results</h3>
                            <p className="text-muted-foreground max-w-sm mb-6">
                                You haven't fully completed any practice tests yet. Once you submit a test, your results will appear here.
                            </p>
                            <Button asChild>
                                <Link href="/student/dashboard" className="flex items-center">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Go to Dashboard
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {results.links && results.links.length > 3 && (
                    <div className="mt-8 flex justify-center flex-wrap gap-2">
                        {results.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? "default" : "outline"}
                                size="sm"
                                disabled={!link.url}
                                asChild={!!link.url}
                                className={link.active ? "bg-college-maroon hover:bg-college-maroon-dark text-white" : ""}
                            >
                                {link.url ? (
                                    <Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                                ) : (
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                )}
                            </Button>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
