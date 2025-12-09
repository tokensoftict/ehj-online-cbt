import { Button } from '@/components/template-ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/template-ui/card';
import { CardHeader } from '@/components/ui/card';
import { Award, BookOpen, Clock, Users } from 'lucide-react';
import { Link } from '@inertiajs/react';
import student from '@/routes/student';







function Intro() {
    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
                {/* Header */}
                <header className="border-b bg-card/50 backdrop-blur-sm">
                    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-primary rounded-full"></div>
                            <span className="text-xl font-bold text-primary">EHJ Model College</span>
                        </div>
                        <Button  variant="default">
                            <Link href={student.login()}>
                                Student Login
                            </Link>

                        </Button>
                    </div>
                </header>

                <main>
                    {/* Hero Section */}
                    <section className="py-20 px-4">
                        <div className="container mx-auto max-w-6xl text-center">
                            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                                Computer Based Testing
                                <span className="block text-primary mt-2">Excellence Platform</span>
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                                Welcome to Eucharistic Heart of Jesus Model College Ilorin's state-of-the-art CBT system, where academic excellence meets innovative technology. Experience seamless online assessments designed for student success.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" onClick={() => {}} className="text-lg px-8 py-4">
                                    <Link href={student.login()}>
                                        Start Your Test
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                                    Learn More
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* About School Section */}
                    <section className="py-16 px-4 bg-secondary/30">
                        <div className="container mx-auto max-w-6xl">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-4">About EHJ Model College Ilorin</h2>
                                <p className="text-muted-foreground text-lg max-w-4xl mx-auto leading-relaxed">
                                    Welcome to Eucharistic Heart of Jesus Model College, where academic excellence meets holistic development! It is with great pleasure that we extend a warm welcome to each of you. EHJMC is not just a school; it is a vibrant community dedicated to nurturing young minds and fostering a love for learning. Our commitment to providing a supportive and innovative learning environment is at the core of everything we do.
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-muted-foreground text-lg max-w-4xl mx-auto leading-relaxed">
                                    As the principal, I am honored to lead a team of dedicated educators who are passionate about guiding our students toward success. Our focus extends beyond academic achievements to encompass character building, personal growth, and comprehensive development of every student.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* CBT Features */}
                    <section className="py-16 px-4">
                        <div className="container mx-auto max-w-6xl">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-4">CBT Platform Features</h2>
                                <p className="text-muted-foreground text-lg">Modern testing technology for enhanced learning experience</p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <Card className="text-center hover:shadow-lg transition-all duration-300">
                                    <CardHeader>
                                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mt-4">
                                            <BookOpen className="w-6 h-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-xl">Multiple Subjects</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription>
                                            Comprehensive testing across all academic subjects with diverse question types and difficulty levels.
                                        </CardDescription>
                                    </CardContent>
                                </Card>

                                <Card className="text-center hover:shadow-lg transition-all duration-300">
                                    <CardHeader>
                                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mt-4">
                                            <Clock className="w-6 h-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-xl">Real-time Results</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription>
                                            Instant feedback and detailed performance analytics to track student progress and improvement areas.
                                        </CardDescription>
                                    </CardContent>
                                </Card>

                                <Card className="text-center hover:shadow-lg transition-all duration-300">
                                    <CardHeader>
                                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mt-4">
                                            <Users className="w-6 h-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-xl">Secure Platform</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription>
                                            Advanced security measures ensuring fair testing environment with user authentication and monitoring.
                                        </CardDescription>
                                    </CardContent>
                                </Card>

                                <Card className="text-center hover:shadow-lg transition-all duration-300">
                                    <CardHeader>
                                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mt-4">
                                            <Award className="w-6 h-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-xl">Performance Analytics</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription>
                                            Comprehensive reports and insights to help students and educators track academic progress effectively.
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </section>

                    {/* Call to Action */}
                    <section className="py-16 px-4 bg-primary/5">
                        <div className="container mx-auto max-w-4xl text-center">
                            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Begin Your Assessment?</h2>
                            <p className="text-muted-foreground text-lg mb-8">
                                Access your personalized dashboard and start your computer-based test with confidence.
                            </p>
                            <Button size="lg" onClick={() => {}} className="text-lg px-8 py-4">
                                <Link href={student.login()}>
                                    Access Student Portal
                                </Link>
                            </Button>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t bg-card/30 py-8 px-4">
                    <div className="container mx-auto max-w-6xl text-center">
                        <p className="text-muted-foreground">
                            © 2025 Eucharistic Heart of Jesus Model College Ilorin. All rights reserved. | Computer Based Testing Platform
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}

export default function Welcome() {
    return Intro();
}
