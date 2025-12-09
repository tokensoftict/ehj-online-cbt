import AdminLayout from '@/components/admin/AdminLayout';

const GeneralSubjectManagement = ({ children }: { children: React.ReactNode }) => {

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Subject Management</h1>
                        <p className="text-muted-foreground">
                            Manage all subject schools is offering
                        </p>
                    </div>
                </div>

                {children}
            </div>
        </AdminLayout>
    );
};

export default GeneralSubjectManagement;
