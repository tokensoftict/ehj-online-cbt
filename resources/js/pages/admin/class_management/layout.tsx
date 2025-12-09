import { cn } from "@/lib/utils";

import AdminLayout from '@/components/admin/AdminLayout';

const tabs = [
    { label: "Groups", href: "/groups" },
    { label: "Levels", href: "/levels" },
    { label: "Sections", href: "/sections" },
    { label: "Class Combinations", href: "/combinations" },
];
const ClassManagementLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Class Management</h1>
                        <p className="text-muted-foreground">
                            Manage class groups, names, sections, and subjects
                        </p>
                    </div>
                </div>

                {children}
            </div>
        </AdminLayout>
    );
};

export default ClassManagementLayout;
