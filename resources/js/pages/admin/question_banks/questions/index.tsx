import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/template-ui/button';
import { ArrowLeft, Edit, Eye, FileText, LoaderCircle, Plus } from 'lucide-react';
import { Question, QuestionBank, Student, StudentClasses } from '@/types';
import DataTable from 'datatables.net-react';
import { createRoot } from 'react-dom/client';
import TableActions from '@/pages/admin/class_management/pages/components/tableactions';
import { useRef, useState } from 'react';
import DT from 'datatables.net-dt';
import { Form, Link } from '@inertiajs/react';
import CreateDialog from '@/pages/admin/class_management/pages/components/createdialog';
import { Label } from '@/components/template-ui/label';
import InputError from '@/components/input-error';
import { Input } from '@/components/template-ui/input';
import { DialogFooter } from '@/components/template-ui/dialog';
import { useToast } from '@/hooks/use-toast';
import QuestionController from '@/actions/App/Http/Controllers/Administrator/QuestionController';
import MathPreview from '@/components/MathPreview';
import { CardHeader, CardTitle } from '@/components/template-ui/card';
import { Card, CardContent } from '@/components/ui/card';
import FileUploadController from '@/actions/App/Http/Controllers/Administrator/FileUploadController';


export default function QuestionInfoDetails({ questionInfo, url }: { questionInfo: QuestionBank, url: string }) {
    const tableRef = useRef<any>(null);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [question, setQuestion] = useState<Question>();
    const { toast } = useToast();

    const handleEdit = function (row: Question) {
        setQuestion(row);
    };

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

                        <Button
                            variant="success"
                            type="button"
                            onClick={() => {
                                setUploadOpen(true);
                            }}
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            Upload Question
                        </Button>


                        <Link href={`/admin/question/${questionInfo.id}/instruction`}>

                            <Button
                                variant="outline"
                                type="button"
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                Instructions
                            </Button>
                        </Link>

                        <Link href={`/admin/question/${questionInfo.id}/question/create`}>
                            <Button type="button">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Question
                            </Button>
                        </Link>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Question List(s)
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
                                { title: 'Question No', data: 'question_no' },
                                {
                                    title: 'Question',
                                    data: 'question',
                                    render: function (data, type, row) {
                                        const div =
                                            document.createElement('div');
                                        createRoot(div).render(
                                            <MathPreview content={data} />
                                        );
                                        return div;
                                    }
                                },
                                {
                                    title: 'Options A',
                                    data: 'a',
                                    render: function (data, type, row) {
                                        const div =
                                            document.createElement('div');
                                        createRoot(div).render(
                                            <MathPreview content={data} />
                                        );
                                        return div;
                                    }
                                },
                                {
                                    title: 'Options B',
                                    data: 'b',
                                    render: function (data, type, row) {
                                        const div =
                                            document.createElement('div');
                                        createRoot(div).render(
                                            <MathPreview content={data} />
                                        );
                                        return div;
                                    }
                                },
                                {
                                    title: 'Options C',
                                    data: 'c',
                                    render: function (data, type, row) {
                                        const div =
                                            document.createElement('div');
                                        createRoot(div).render(
                                            <MathPreview content={data} />
                                        );
                                        return div;
                                    }
                                },
                                {
                                    title: 'Options D',
                                    data: 'd',
                                    render: function (data, type, row) {
                                        const div =
                                            document.createElement('div');
                                        createRoot(div).render(
                                            <MathPreview content={data} />
                                        );
                                        return div;
                                    }
                                },
                                {
                                    title: 'Correct Ans',
                                    data: 'correct_option'
                                },
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
                                                deleteUrl={QuestionController.destroy.url({ question: row.id, question_info_id: questionInfo.id },)}
                                                onDeleteSuccess={() => {
                                                    toast({
                                                        title: 'Question Deleted',
                                                        description:
                                                            'Question has been deleted successfully.',
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
                                                        label: "Edit Questions",
                                                        icon: Edit,
                                                        href: QuestionController.edit.url({ question: row.id, question_info_id: questionInfo.id })
                                                    },
                                                ]}
                                            />,
                                        );
                                        return div;
                                    },
                                },
                            ]}
                        />
                    </CardContent>
                </Card>

                <CreateDialog
                    title="Upload Questions"
                    open={uploadOpen}
                    setOpen={setUploadOpen}
                >
                    <Form
                        {...QuestionController.upload.form({ question_info_id: questionInfo.id })}
                        className="space-y-6"
                        onSuccess={() => {
                            toast({
                                title: 'Question Management',
                                description:
                                    `Question file has been uploaded successfully.`,
                            });
                            setUploadOpen(false);

                            if (tableRef.current) {
                                tableRef.current.dt().ajax.reload(null, false);
                            }
                        }}
                    >
                        {({ processing, errors }) => (

                            <>
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="file_name_new">
                                            name
                                        </Label>
                                        <Input
                                            key={'file_name_new'}
                                            id="file_name_new"
                                            name="filename"
                                            placeholder={"File name"}
                                            className="focus:ring-2 focus:ring-primary/30"
                                        />
                                        <InputError message={errors.filename} />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="file">Upload File</Label>
                                    <Input
                                        key="file"
                                        id="file"
                                        name="file"
                                        type="file"
                                        placeholder={"File"}
                                        className="focus:ring-2 focus:ring-primary/30"
                                    />
                                    <Link
                                        onClick={() => {
                                            window.open(FileUploadController.question_template.url())
                                        }}
                                        href="#"
                                        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors    text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    >Download Question Template</Link>
                                    <InputError message={errors.file} />
                                </div>

                                <DialogFooter>
                                    <Button
                                        disabled={processing}
                                        type="submit"
                                        className="flex items-center gap-2"
                                    >
                                        {processing && (
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                        )}
                                        Upload
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </Form>



                </CreateDialog>
            </div>


        </AdminLayout>
    );

}
