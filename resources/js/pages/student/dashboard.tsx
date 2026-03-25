import { Button } from '@/components/template-ui/button';

import {
    Atom,
    BookOpen,
    Calculator,
    LogOut,
    Microscope,
    Zap,
    History,
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/template-ui/card';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import student from '@/routes/student';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface DashboardProps {
    practiceQuestions: any[];
}

export default function Dashboard({ practiceQuestions }: DashboardProps) {
    const { auth, flash } = usePage<SharedData>().props;
    const { toast } = useToast();
    const randomIcons = [Atom, BookOpen, Calculator, Microscope, Zap];

    useEffect(() => {
        if (flash.success) {
            toast({
                title: 'Success',
                description: flash.success,
            });
        }
        if (flash.error) {
            toast({
                title: 'Error',
                description: flash.error,
                variant: 'destructive',
            });
        }
    }, [flash]);
    const randomColors = [
        'from-blue-500 to-blue-600',
        'from-purple-500 to-purple-600',
        'from-green-500 to-green-600',
        'from-emerald-500 to-emerald-600',
        'from-orange-500 to-orange-600',
        'from-rose-500 to-rose-600',
        'from-cyan-500 to-cyan-600'
    ];
    return (
        <div className="min-h-screen bg-gradient-to-br from-college-maroon-light via-background to-secondary">
            <header className="bg-white shadow-card border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white rounded-lg p-1.5 shadow-card">
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-college-maroon-dark">EHJ Model College</h1>
                                <p className="text-xs text-muted-foreground">CBT System</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button
                                variant="default"
                                className="text-white hover:text-college-maroon-dark"
                                asChild
                            >
                                <Link href="/student/history" className="flex">
                                    <History className="w-fit h-5 mr-2" />
                                    Past Results
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                className=""
                                asChild
                            >
                                <Link href={student.logout()} className="flex">
                                    <LogOut className="w-fit h-5 mr-2" />
                                    Logout
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-college-maroon-dark mb-2">
                        WELCOME, {auth.user?.surname.toUpperCase()} {auth.user?.firstname.toUpperCase()} {auth.user?.lastname.toUpperCase()}!
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Ready to take your next test? Choose a subject below to get started.
                    </p>
                </div>

                {practiceQuestions && practiceQuestions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {practiceQuestions.map((pq, index) => {
                            const IconComponent = randomIcons[index % randomIcons.length];
                            const colorClass = randomColors[index % randomColors.length];
                            const combinedSubjects = pq.question_infos?.map((qi: any) => qi.general_subject?.name).join(', ') || 'General';

                            return (
                                <Card key={pq.id} className="group hover:shadow-elevation transition-all duration-300 border-0 shadow-card">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${colorClass} flex items-center justify-center shadow-lg`}>
                                                <IconComponent className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-semibold text-college-maroon bg-college-maroon/10 px-2 py-1 rounded-full">
                                                    {pq.duration} min
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-college-maroon-dark mb-1 line-clamp-2">
                                                {pq.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
                                                Subjects: {combinedSubjects}
                                            </p>
                                        </div>
                                        <Button
                                            className="w-full h-11  hover:bg-college-maroon-dark text-white transition-all duration-300"
                                            asChild
                                        >
                                            <Link href={`/student/practice/${pq.id}/take-test`} className="flex w-full items-center justify-center">
                                                {pq.has_active_session ? 'Resume Test' : 'Start Test'}
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card className="bg-gradient-to-r from-primary/5 to-college-maroon/5 border-primary/20 shadow-card">
                        <CardContent className="p-6 text-center">
                            <h3 className="text-lg font-semibold text-college-maroon-dark mb-2">No Active Tests</h3>
                            <p className="text-muted-foreground">
                                You don't have any practice tests scheduled for this time. Check back later!
                            </p>
                        </CardContent>
                    </Card>
                )}



            </main>
            {/* Footer */}
            <footer className="border-t bg-card/30 py-8 px-4">
                <div className="container mx-auto max-w-6xl text-center">
                    <p className="text-muted-foreground">
                        © 2026 EHJ Model College Ilorin. All rights reserved. | Computer Based Testing Platform
                    </p>
                </div>
            </footer>
        </div>
    )
}
