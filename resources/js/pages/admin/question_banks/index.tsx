import GeneralSubjectController from '@/actions/App/Http/Controllers/Administrator/GeneralSubjectController';
import QuestionBanksController from '@/actions/App/Http/Controllers/Administrator/QuestionBanksController';
import AdminLayout from '@/components/admin/AdminLayout';
import InputError from '@/components/input-error';
import { Badge } from '@/components/template-ui/badge';
import { Button } from '@/components/template-ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/template-ui/card';
import { DialogFooter } from '@/components/template-ui/dialog';
import { Input } from '@/components/template-ui/input';
import { Label } from '@/components/template-ui/label';
import { useToast } from '@/hooks/use-toast';
import TableActions from '@/pages/admin/class_management/pages/components/tableactions';
import { Form } from '@inertiajs/react';
import DT from 'datatables.net-dt';
import DataTable from 'datatables.net-react';
import { Eye, FileText, LoaderCircle, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import CreateDialog from '../class_management/pages/components/createdialog';
import { GeneralSubjects, QuestionBank, StudentClasses } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/template-ui/select';

export default function QuestionBanks({ url, subjects, student_classes }: { url: string, subjects : GeneralSubjects[], student_classes : StudentClasses[]}) {
    const tableRef = useRef<any>(null);
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    DataTable.use(DT);
    const [questionBank, setQuestionBank] = useState<QuestionBank>()

    const [questionBankForm, setQuestionBankForm] = useState(QuestionBanksController.store.form());


    useEffect(() => {
        if (questionBank?.id !== undefined) {
            setQuestionBankForm(QuestionBanksController.update.form({ question_bank: questionBank.id }));
            setOpen(true);
        } else {
            setQuestionBankForm(QuestionBanksController.store.form());
        }
    }, [questionBank]);


    const handleEdit = function (row : QuestionBank) {
        setQuestionBank(row);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Active':
                return (
                    <Badge className="bg-success text-success-foreground">
                        Active
                    </Badge>
                );
            case 'Draft':
                return <Badge variant="secondary">Draft</Badge>;
            case 'Archived':
                return <Badge variant="outline">Archived</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Question Bank</h1>
                        <p className="text-muted-foreground">
                            Manage test containers and questions
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            setQuestionBank(undefined);
                            setOpen(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Test Container
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Test Containers
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
                                { title: 'Name', data: 'name' },
                                { title: 'Subject', data: 'subject' },
                                { title: 'Class', data: 'class' },
                                {
                                    title: 'Question',
                                    data: 'questions',
                                    render: (data, type, row) => {
                                        const countBadge = document.createElement('div');
                                        createRoot(countBadge).render(<Badge>{row.questions}</Badge>)
                                        return countBadge;
                                    }
                                },
                                {
                                    title: 'Status',
                                    data: 'status',
                                    render: (data, type, row) => {
                                        const badge = document.createElement('div');
                                         createRoot(badge).render(getStatusBadge(row.status))
                                        return badge;
                                    }
                                },
                                { title: 'Created', data: 'created_at' },
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
                                                onEdit={() => handleEdit(row)}
                                                deleteUrl={QuestionBanksController.destroy.url(
                                                    { question_bank: row.id },
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
                                                        label: "View Questions",
                                                        icon: Eye,
                                                        href: QuestionBanksController.show.url(  { question_bank: row.id })
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
                    title="Create New Test Container"
                    open={open}
                    setOpen={setOpen}
                >
                    <Form
                        {...questionBankForm}
                        className="space-y-6"
                        onSuccess={() => {
                            toast({
                                title: 'Test Container',
                                description:
                                    `Test Container has been ` +
                                    (questionBank?.id
                                        ? 'updated'
                                        : 'created') +
                                    ` successfully.`,
                            });

                            setOpen(false);

                            if (tableRef.current) {
                                tableRef.current.dt().ajax.reload(null, false);
                            }
                        }}
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="groupName">
                                            Subject Name
                                        </Label>
                                        <Input
                                            key={questionBank?.id ?? 'new'}
                                            id="groupName"
                                            defaultValue={
                                                questionBank?.name ?? ''
                                            }
                                            name="name"
                                            placeholder="e.g., Practice English Question"
                                            className="focus:ring-2 focus:ring-primary/30"
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="student_class_id">Class Name</Label>
                                    <Select name="student_class_id" defaultValue={questionBank?.student_class_id ? (questionBank?.student_class_id+"") : ""}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Class Name" defaultValue="" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {student_classes.map((className) => (
                                                <SelectItem key={className.id + "_class_name"} value={className.id.toString()}>
                                                    {className.class_name.name} {className.class_section.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.class_name_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="general_subject_id">Subject</Label>
                                    <Select name="general_subject_id" defaultValue={questionBank?.general_subject_id ? (questionBank?.general_subject_id+"") : ""}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Subject" defaultValue="" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subjects.map((subject) => (
                                                <SelectItem key={subject.id + "_subject"} value={subject.id.toString()}>
                                                    {subject.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.general_subject_id} />
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
                                        Save
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
