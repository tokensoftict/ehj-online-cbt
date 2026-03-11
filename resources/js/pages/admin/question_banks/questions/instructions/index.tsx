import { useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/template-ui/button';
import { ArrowLeft, Edit, FileText, Plus } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { QuestionInfo } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/template-ui/card';
import { createRoot } from 'react-dom/client';
import TableActions from '@/pages/admin/class_management/pages/components/tableactions';
import QuestionController from '@/actions/App/Http/Controllers/Administrator/QuestionController';
import QuestionInstructionController from '@/actions/App/Http/Controllers/Administrator/QuestionInstructionController';


export default function QuestionInstructionDetails({url, questionInfo} : {url:string, questionInfo : QuestionInfo}) {
    console.log(url)
    const tableRef = useRef<any>(null);
    const { toast } = useToast();


    DataTable.use(DT);

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold">{questionInfo.name}</h1>
                        <p className="text-muted-foreground">
                            Manage questions instruction in this test container
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={`/admin/${questionInfo.id}/instruction/create`}>
                            <Button type="button">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Instruction
                            </Button>
                        </Link>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Instruction List(s)
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
                            columns: [
                                { title: 'S/N', data: 'DT_RowIndex' },
                                { title: 'Title', data: 'title' },
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
                                                deleteUrl={QuestionInstructionController.destroy.url({ instruction: row.id, question_info_id : questionInfo.id },)}
                                                onDeleteSuccess={() => {
                                                    toast({
                                                        title: 'Instruction Deleted',
                                                        description:
                                                            'Instruction has been deleted successfully.',
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
                                                        label: "Edit Instruction",
                                                        icon: Edit,
                                                        href: QuestionInstructionController.edit.url(  { instruction: row.id, question_info_id : questionInfo.id })
                                                    },
                                                ]}
                                            />,
                                        );
                                        return div;
                                    },
                                },
                            ]
                        }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
