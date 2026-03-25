import { Link, usePage } from '@inertiajs/react';
import { Button } from "@/components/template-ui/button";
import { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    GraduationCap,
    X, NotebookIcon, Upload, ChevronDown, ChevronUp, UserCog, ShieldCheck
} from 'lucide-react';


interface AdminSidebarProps {
    onClose?: () => void;
}

const navigation = [
    {
        name: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        permission: "view_dashboard"
    },
    {
        name: "Subject Management",
        href: "/admin/general-subjects",
        icon: NotebookIcon,
        permission: "manage_subjects"
    },
    {
        name: "Class Management",
        href: "/admin/class-groups",
        icon: GraduationCap,
        permission: "manage_classes"
    },
    {
        name: "Question Banks",
        href: "/admin/question-banks",
        icon: BookOpen,
        permission: "manage_question_banks"
    },
    {
        name: "Student Management",
        href: "/admin/students",
        icon: Users,
        permission: "manage_students"
    },
    {
        name: "File Uploads",
        href: "/admin/file-uploads",
        icon: Upload,
        permission: "manage_file_uploads"
    },
    {
        name: "Admin Management",
        href: "/admin/admins",
        icon: Users,
        permission: "manage_admins"
    },
    {
        name: "Practice Questions",
        href: "/admin/practice-questions",
        icon: BookOpen,
        permission: "manage_practice_questions"
    },
    {
        name: "Roles & Permissions",
        href: "/admin/roles",
        icon: ShieldCheck,
        permission: "manage_roles_permissions"
    },
];

export const AdminSidebar = ({ onClose }: AdminSidebarProps) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { auth } = usePage<any>().props;

    const filteredNavigation = navigation.filter(item => {
        if (item.permission) {
            return auth.user.permissions.includes(item.permission);
        }
        return true;
    });

    return (
        <div className="bg-card border-r border-border h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">

                        <div>
                            <h2 className="font-bold text-primary">EHJ Model College</h2>
                            <p className="text-xs text-muted-foreground">Administrator Panel</p>
                        </div>
                    </div>
                    {onClose && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="lg:hidden"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Navigation

       {({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }

       */}
            <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-2">
                    {filteredNavigation.map((item) => (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors    text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                onClick={onClose}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            <div className="flex items-center gap-3">
                                <UserCog className="h-4 w-4" />
                                My Profile
                            </div>
                            {isProfileOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                        {isProfileOpen && (
                            <ul className="pl-9 mt-1 space-y-1">
                                <li>
                                    <Link
                                        href="/admin/profile"
                                        className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-accent-foreground hover:bg-accent transition-colors"
                                        onClick={onClose}
                                    >
                                        Update Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/admin/password"
                                        className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-accent-foreground hover:bg-accent transition-colors"
                                        onClick={onClose}
                                    >
                                        Change Password
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/admin/logout"
                                        method="post"
                                        as="button"
                                        className="w-full text-left block px-3 py-2 rounded-md text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                                        onClick={onClose}
                                    >
                                        Log Out
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </nav>
        </div>
    );
};
