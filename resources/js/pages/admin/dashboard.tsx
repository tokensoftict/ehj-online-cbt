import { Card, CardContent, CardHeader, CardTitle } from "@/components/template-ui/card";
import { Badge } from "@/components/template-ui/badge";
import {
    Users,
    BookOpen,
    GraduationCap,
    FileText,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle
} from "lucide-react";
import AdminLayout from '@/components/admin/AdminLayout';

const Dashboard = () => {
    // Mock data - replace with actual API calls
    const stats = [
        {
            title: "Total Students",
            value: "2,847",
            icon: Users,
            change: "+12%",
            changeType: "increase" as const,
        },
        {
            title: "Total Subjects",
            value: "15",
            icon: BookOpen,
            change: "+2",
            changeType: "increase" as const,
        },
        {
            title: "Test Containers",
            value: "124",
            icon: FileText,
            change: "+8",
            changeType: "increase" as const,
        },
        {
            title: "Total Questions",
            value: "3,462",
            icon: GraduationCap,
            change: "+145",
            changeType: "increase" as const,
        },
    ];

    const recentActivities = [
        {
            id: 1,
            action: "New Test Created",
            details: "English JSS 2 - Reading Comprehension",
            time: "2 hours ago",
            type: "test",
        },
        {
            id: 2,
            action: "Student Added",
            details: "25 new students added to SSS 1",
            time: "4 hours ago",
            type: "student",
        },
        {
            id: 3,
            action: "Questions Updated",
            details: "Mathematics JSS 3 - 12 questions modified",
            time: "6 hours ago",
            type: "question",
        },
        {
            id: 4,
            action: "Class Created",
            details: "New class: SSS 2 Science",
            time: "1 day ago",
            type: "class",
        },
        {
            id: 5,
            action: "Test Completed",
            details: "Physics SSS 3 - 89% completion rate",
            time: "1 day ago",
            type: "completion",
        },
    ];

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
                    Welcome back! Here's what's happening at EHJ Model College.
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
                                <TrendingUp className="h-3 w-3 text-success" />
                                <span className="text-success">{stat.change}</span>
                                <span>from last month</span>
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
                            {recentActivities.map((activity) => (
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
                            ))}
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
                            <Badge variant="secondary">23</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Pending Reviews</span>
                            <Badge variant="outline">5</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Classes</span>
                            <Badge variant="secondary">18</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Test Completion Rate</span>
                            <Badge className="bg-success text-success-foreground">94%</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Average Score</span>
                            <Badge className="bg-primary">78.5%</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
        </AdminLayout>
    );
};

export default Dashboard;
