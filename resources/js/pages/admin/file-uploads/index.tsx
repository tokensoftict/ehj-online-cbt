import AdminLayout from "@/components/admin/AdminLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/template-ui/card';
import { Download, FileText, RefreshCcw } from 'lucide-react';
import DataTable from 'datatables.net-react';
import { useRef } from 'react';
import DT from 'datatables.net-dt';
import { createRoot } from 'react-dom/client';
import TableActions from '@/pages/admin/class_management/pages/components/tableactions';
import { useToast } from '@/hooks/use-toast';
import FileUploadController from '@/actions/App/Http/Controllers/Administrator/FileUploadController';



export default function FileUploads({url} : {url: string}) {
    const tableRef = useRef<any>(null);
    DataTable.use(DT);
    const { toast } = useToast();

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">File Uploads</h1>
                        <p className="text-muted-foreground">
                            Manage all file uploads
                        </p>
                    </div>

                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            File Uploads
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            ajax={url}
                            ref={tableRef}
                            className="w-full"
                            options={{
                                dom: "<'dt-length-search'<'dt-length'l><'dt-search'f>>rtip",
                                processing: true,
                                serverSide: false,
                                pageLength: 10,
                            }}
                            columns={[
                                { title: 'S/N', data: 'DT_RowIndex' },
                                { title: 'Filename', data: 'filename' },
                                { title: 'Status', data: 'status' },
                                { title: 'Type', data: 'type' },
                                {
                                    title: 'Actions',
                                    data: null,
                                    orderable: false,
                                    searchable: false,
                                    render: function (data, type, row) {
                                        const div =
                                            document.createElement('div');
                                        createRoot(div).render(
                                            <TableActions
                                                deleteUrl={FileUploadController.destroy.url(
                                                    { file_upload: row.id }
                                                )}
                                                onDeleteSuccess={() => {
                                                    toast({
                                                        title: 'Item Deleted',
                                                        description:
                                                            'Item has been deleted successfully.',
                                                    });
                                                    tableRef.current
                                                        ?.dt()
                                                        .ajax.reload(
                                                        null,
                                                        false,
                                                    );
                                                }}
                                                extraActions={[
                                                    {
                                                        type: "link",
                                                        label: "Re-Run File",
                                                        icon: RefreshCcw,
                                                        href: FileUploadController.re_run.url( { id: row.id })
                                                    },
                                                    {
                                                        type: "link",
                                                        label: "Download File",
                                                        icon: Download,
                                                        href: FileUploadController.download_file.url( { id: row.id })
                                                    },
                                                ]}
                                            />
                                        );
                                        return div;
                                    }
                                }
                            ]}
                        />
                    </CardContent>
                </Card>

            </div>
        </AdminLayout>
    );

}
