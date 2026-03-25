import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/template-ui/card';
import { Button } from '@/components/template-ui/button';
import { Link, Head, usePage } from '@inertiajs/react';
import { Clock, BookOpen, AlertCircle, FileText } from 'lucide-react';
import { SharedData } from '@/types';

interface PracticeInstructionProps extends SharedData {
    practice: any;
    totalQuestions: number;
    hasActiveSession: boolean;
    attemptsCount: number;
}

export default function Instructions({ practice, totalQuestions, hasActiveSession, attemptsCount }: PracticeInstructionProps) {
    const { auth } = usePage<SharedData>().props;
    if (!practice) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">Practice Test not found or unavailable.</p>
                        <Button className="mt-4" asChild>
                            <Link href="/student/dashboard">Back to Dashboard</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const {
        title,
        duration,
        instruction,
        general_subject,
        question_infos,
        practice_limit
    } = practice;

    const subjectNames = question_infos?.map((qi: any) => qi.general_subject?.name || qi.name).filter(Boolean);
    const combinedSubjects = subjectNames?.length ? subjectNames.join(', ') : (general_subject?.name || 'General');

    return (
        <div className="min-h-screen bg-gradient-to-br from-college-maroon-light via-background to-secondary pb-12">
            <Head title={`${title} - Instructions`} />

            <header className="bg-white shadow-card border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white rounded-lg p-1 shadow-card flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-college-maroon" />
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-college-maroon-dark">EHJ CBT System</h1>
                            </div>
                        </div>
                        <Button variant="destructive" className="text-white hover:text-college-maroon" asChild>
                            <Link href="/student/dashboard">Cancel</Link>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-college-maroon-dark mb-3">{title}</h2>
                    <p className="text-lg text-muted-foreground">Please read the instructions carefully before starting.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card className="shadow-card border-l-4 border-l-primary">
                        <CardContent className="p-6 flex items-start space-x-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                <Clock className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-college-maroon-dark">Duration</h3>
                                <p className="text-3xl font-bold text-primary mt-1">{duration} <span className="text-lg font-normal text-muted-foreground">minutes</span></p>
                                <p className="text-sm text-muted-foreground mt-1">Timer starts automatically</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-card border-l-4 border-l-college-maroon">
                        <CardContent className="p-6 flex items-start space-x-4">
                            <div className="w-12 h-12 rounded-full bg-college-maroon/10 flex items-center justify-center flex-shrink-0 mt-1">
                                <FileText className="w-6 h-6 text-college-maroon" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-college-maroon-dark">Questions</h3>
                                <p className="text-3xl font-bold text-college-maroon mt-1">{totalQuestions} <span className="text-lg font-normal text-muted-foreground">total</span></p>
                                <p className="text-sm text-muted-foreground mt-1">Multiple Choice Format</p>
                            </div>
                        </CardContent>
                    </Card>

                    {practice_limit > 0 && (
                        <Card className="shadow-card border-l-4 border-l-blue-500 md:col-span-2">
                            <CardContent className="p-6 flex items-start space-x-4">
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                                    <AlertCircle className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-college-maroon-dark">Practice Limit</h3>
                                    <p className="text-3xl font-bold text-blue-500 mt-1">{attemptsCount} / {practice_limit} <span className="text-lg font-normal text-muted-foreground">attempts used</span></p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {practice_limit - attemptsCount} attempt(s) remaining.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <Card className="shadow-elevation border-0 mb-8">
                    <CardHeader className="bg-gradient-to-r from-college-maroon/5 to-transparent border-b">
                        <CardTitle className="flex items-center text-xl text-college-maroon-dark">
                            <AlertCircle className="w-5 h-5 mr-2 text-college-maroon" />
                            Test Information & Rules
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8 space-y-6 text-base text-muted-foreground">

                        <div>
                            <h4 className="flex items-center font-semibold text-college-maroon-dark mb-2">
                                <span className="w-6 h-6 rounded bg-college-maroon-light text-college-maroon flex items-center justify-center mr-2 text-xs">1</span>
                                Subjects Covered
                            </h4>
                            <p className="ml-8">{combinedSubjects}</p>
                        </div>

                        {instruction && (
                            <div>
                                <h4 className="flex items-center font-semibold text-college-maroon-dark mb-2">
                                    <span className="w-6 h-6 rounded bg-college-maroon-light text-college-maroon flex items-center justify-center mr-2 text-xs">2</span>
                                    Specific Instructions
                                </h4>
                                <div className="ml-8 prose prose-slate max-w-none text-muted-foreground text-sm" dangerouslySetInnerHTML={{ __html: instruction }} />
                            </div>
                        )}

                        <div>
                            <h4 className="flex items-center font-semibold text-college-maroon-dark mb-2">
                                <span className="w-6 h-6 rounded bg-college-maroon-light text-college-maroon flex items-center justify-center mr-2 text-xs">3</span>
                                General Guidelines
                            </h4>
                            <ul className="ml-8 mt-2 space-y-3 list-disc list-inside">
                                <li>The timer will begin as soon as you click "Start Test".</li>
                                <li>You can navigate back and forth between questions using the "Previous" and "Next" buttons or by clicking on the question numbers.</li>
                                <li>Your choices are saved automatically. Do not close your browser or navigate away.</li>
                                <li>Do not refresh the page forcefully; if you lose connection, your progress will be saved where you left off.</li>
                                <li>If the time expires, your test will be submitted automatically.</li>
                            </ul>
                        </div>
                    </CardContent>

                    <CardFooter className="bg-gray-50 border-t p-6 flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">Ready to begin?</p>
                        <Link href={`/student/practice/${practice.id}/start`}>
                            <Button
                                className=" hover:bg-college-maroon-dark text-white px-8 py-6 text-lg rounded shadow-lg shadow-college-maroon/30 transition-all hover:-translate-y-1"
                            >
                                {hasActiveSession ? 'Resume Test Now' : 'Start Test Now'}
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>

            </main>
        </div>
    );
}
