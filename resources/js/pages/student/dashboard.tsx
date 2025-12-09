import { Button } from '@/components/template-ui/button';

import {
    Atom,
    BookOpen,
    Calculator,
    LogOut,
    Microscope,
    Zap,
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/template-ui/card';
import student from '@/routes/student';


export default function Dashboard() {
    const subjects = [
        {
            name: 'Mathematics',
            icon: Calculator,
            color: 'from-blue-500 to-blue-600',
            description: 'Algebra, Calculus & Geometry'
        },
        {
            name: 'Physics',
            icon: Zap,
            color: 'from-purple-500 to-purple-600',
            description: 'Mechanics, Waves & Electricity'
        },
        {
            name: 'Chemistry',
            icon: Atom,
            color: 'from-green-500 to-green-600',
            description: 'Organic, Inorganic & Physical'
        },
        {
            name: 'Biology',
            icon: Microscope,
            color: 'from-emerald-500 to-emerald-600',
            description: 'Genetics, Ecology & Physiology'
        },
        {
            name: 'English',
            icon: BookOpen,
            color: 'from-orange-500 to-orange-600',
            description: 'Grammar, Literature & Comprehension'
        }
    ];
    return (
        <div className="min-h-screen bg-gradient-to-br from-college-maroon-light via-background to-secondary">
            <header className="bg-white shadow-card border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white rounded-lg p-1.5 shadow-card">
                                <img src="https://www.qualitexpharma.com/qualitex_logo.png" alt="EHJ Model College Logo" className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-college-maroon-dark">EHJ Model College</h1>
                                <p className="text-xs text-muted-foreground">CBT System</p>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className=""
                        >
                            <Link href={student.logout()} className="flex">
                                <LogOut className="w-fit h-5 mr-2" />
                                Logout
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-college-maroon-dark mb-2">
                        Welcome back, Demo user!
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Ready to take your next test? Choose a subject below to get started.
                    </p>
                </div>

                {/* Subjects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map((subject) => {
                        const IconComponent = subject.icon;
                        return (
                            <Card key={subject.name} className="group hover:shadow-elevation transition-all duration-300 cursor-pointer border-0 shadow-card">
                                <CardContent className="p-6">
                                    <div className="text-center space-y-4">
                                        <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${subject.color} flex items-center justify-center shadow-lg`}>
                                            <IconComponent className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-college-maroon-dark mb-1">
                                                {subject.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                {subject.description}
                                            </p>
                                        </div>
                                        <Button
                                            className="w-full h-11  from-primary to-college-maroon hover:from-primary-hover hover:to-college-maroon-dark transition-all duration-300"
                                        >
                                            <Link href={`/student/${subject.name}/take-test`} className="flex w-full items-center justify-center">
                                                Take Test
                                            </Link>

                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Multi-Subject Practice Card */}
                <Card className="mt-8 bg-gradient-to-r from-primary/5 to-college-maroon/5 border-primary/20 shadow-card">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-college-maroon-dark mb-2">Multi-Subject Practice</h3>
                                <p className="text-muted-foreground mb-3">
                                    Practice questions from multiple subjects simultaneously with tabbed interface and auto-advance
                                </p>
                            </div>
                            <Button
                                onClick={() => {}}
                                className=" from-primary to-college-maroon hover:from-primary-hover hover:to-college-maroon-dark"
                            >
                                Start Practice
                            </Button>
                        </div>
                    </CardContent>
                </Card>


                {/* Instructions */}
                <Card className="mt-6 border-l-4 border-l-college-maroon shadow-card">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-college-maroon-dark mb-3">Test Instructions</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-college-maroon rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                Each test contains multiple-choice questions with 4 options (A, B, C, D)
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-college-maroon rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                Navigate between questions using the Previous/Next buttons
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-college-maroon rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                Review your answers before final submission
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-college-maroon rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                Mathematical formulas are rendered for better readability
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 bg-college-maroon rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                Some questions may include passages or instructions - read carefully
                            </li>
                        </ul>
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
    )
}
