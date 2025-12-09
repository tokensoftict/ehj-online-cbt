import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/template-ui/button';
import { ArrowLeft, FileText, Plus } from 'lucide-react';
import { QuestionBank } from '@/types';
import DataTable from 'datatables.net-react';
import { createRoot } from 'react-dom/client';
import TableActions from '@/pages/admin/class_management/pages/components/tableactions';
import { useRef } from 'react';
import DT from 'datatables.net-dt';
import { Link } from '@inertiajs/react';


export default function QuestionInfoDetails({questionInfo, url} : {questionInfo: QuestionBank, url : string}) {
    const tableRef = useRef<any>(null);
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
                            Manage questions in this test container
                        </p>
                    </div>

                    <div className="flex items-center gap-2">


                        <Link href={`#`}>
                            <Button
                                variant="outline"
                                type="button"
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                Instructions
                            </Button>
                        </Link>

                        <Link href={`/admin/${questionInfo.id}/question/create`}>
                            <Button type="button">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Question
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="grid gap-6">

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
                            { title: 'Question No', data: 'question_no' },
                            { title: 'Question', data: 'question' },
                            { title: 'Options A', data: 'a' },
                            { title: 'Options B', data: 'b' },
                            { title: 'Options C', data: 'c' },
                            { title: 'Options D', data: 'e' },
                            { title: 'Correct Ans', data: 'correct_option' },
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

                                        />,
                                    );
                                    return div;
                                },
                            },
                        ]}
                    />

                </div>
            </div>
        </AdminLayout>
    );

}
