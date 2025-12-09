import { cn } from "@/lib/utils";
import { Link } from '@inertiajs/react';

const tabs = [
    { label: "General Subjects", href: "/admin/general_subjects" },
];

export default function GeneralSubjectManagementTabNav({ active } : {active: string}) {
    return (
        <div className="space-y-4">
            <div className="grid w-full grid-cols-5 rounded-md border p-1 bg-muted">
                {tabs.map((tab) => (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={cn(
                            "px-3 py-2 text-center text-sm font-medium rounded-sm transition",
                            active === tab.href
                                ? "bg-background shadow-sm text-primary"
                                : "text-muted-foreground hover:text-primary"
                        )}
                    >
                        {tab.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
