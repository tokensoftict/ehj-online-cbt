import { Card, CardContent, CardHeader, CardTitle } from "@/components/template-ui/card";
import { Badge } from "@/components/template-ui/badge";
import {
    Users,
    BookOpen,
    GraduationCap,
    TrendingUp,
    Clock,
    FileText,
    CheckCircle,
    AlertCircle
} from "lucide-react";
import AdminLayout from '@/components/admin/AdminLayout';

interface DashboardProps {
    stats: {
        totalStudents: number;
        totalSubjects: number;
        testContainers: number;
        totalQuestions: number;
    };
    systemOverview: {
        activeTests: number;
        pendingReviews: number;
        classes: number;
        totalResults: number;
        averageScore: number;
    };
    recentActivities: Array<{
        id: number;
        action: string;
        details: string;
        time: string;
        type: string;
    }>;
}

const Dashboard = ({ stats: serverStats, systemOverview, recentActivities }: DashboardProps) => {
    const stats = [
        {
            title: "Total Students",
            value: serverStats.totalStudents.toLocaleString(),
            icon: Users,
            change: "System User",
            changeType: "increase" as const,
        },
        {
            title: "Total Subjects",
            value: serverStats.totalSubjects.toLocaleString(),
            icon: BookOpen,
            change: "Curriculum Data",
            changeType: "increase" as const,
        },
        {
            title: "Test Containers",
            value: serverStats.testContainers.toLocaleString(),
            icon: FileText,
            change: "Completed Banks",
            changeType: "increase" as const,
        },
        {
            title: "Total Questions",
            value: serverStats.totalQuestions.toLocaleString(),
            icon: GraduationCap,
            change: "Question Database",
            changeType: "increase" as const,
        },
    ];

    // Recent activities are now passed down from the controller

    const getActivityIcon = (type: string) => {
        switch (type) {
            case "test":
                return <FileText className="h-4 w-4 text-primary" />;
            case "student":
                return <Users className="h-4 w-4 text-success" />;
            case "question":
                return <BookOpen className="h-4 w-4 text-warning" />;
            case "class":
                return <GraduationCap className="h-4 w-4 text-accent-foreground" />;
            case "completion":
                return <CheckCircle className="h-4 w-4 text-success" />;
            default:
                return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome! Here's what's happening at EHJ Model College.
                    </p>
                </div>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <Card key={stat.title} className="shadow-card">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <span className="text-success">{stat.change}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="shadow-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivities.length > 0 ? (
                                    recentActivities.map((activity) => (
                                        <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                                            {getActivityIcon(activity.type)}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium">{activity.action}</p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {activity.details}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {activity.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">No recent activities found.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="shadow-card">
                        <CardHeader>
                            <CardTitle>System Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Active Tests</span>
                                <Badge variant="secondary">{systemOverview.activeTests}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Pending Reviews</span>
                                <Badge variant="outline">{systemOverview.pendingReviews}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Classes</span>
                                <Badge variant="secondary">{systemOverview.classes}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Total Results Found</span>
                                <Badge className="bg-success text-success-foreground">{systemOverview.totalResults}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Average Global Score</span>
                                <Badge className="bg-primary">{systemOverview.averageScore}%</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
