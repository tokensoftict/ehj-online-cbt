import { Link } from '@inertiajs/react';
import { Button } from "@/components/template-ui/button";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    GraduationCap,
    X, NotebookIcon
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
    onClose?: () => void;
}

const navigation = [
    {
        name: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Subject Management",
        href: "/admin/general-subjects",
        icon: NotebookIcon,
    },
    {
        name: "Class Management",
        href: "/admin/class-groups",
        icon: GraduationCap,
    },
    {
        name: "Question Banks",
        href: "/admin/question-banks",
        icon: BookOpen,
    },
    {
        name: "Student Management",
        href: "/admin/students",
        icon: Users,
    },
];

export const AdminSidebar = ({ onClose }: AdminSidebarProps) => {
    return (
        <div className="bg-card border-r border-border h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img
                            src="https://www.qualitexpharma.com/qualitex_logo.png"
                            alt="EHJ"
                            className="h-8 w-auto"
                        />
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
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {navigation.map((item) => (
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
                </ul>
            </nav>
        </div>
    );
};
