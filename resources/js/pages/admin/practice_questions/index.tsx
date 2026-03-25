import AdminLayout from '@/components/admin/AdminLayout';
import InputError from '@/components/input-error';
import { Badge } from '@/components/template-ui/badge';
import { Button } from '@/components/template-ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/template-ui/card';
import { DialogFooter } from '@/components/template-ui/dialog';
import { Input } from '@/components/template-ui/input';
import { Label } from '@/components/template-ui/label';
import { Checkbox } from '@/components/template-ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { router, useForm } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/template-ui/select';
import DT from 'datatables.net-dt';
import DataTable from 'datatables.net-react';
import { BookOpen, CalendarIcon, LoaderCircle, Plus, CheckCircle, XCircle, BarChart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import CreateDialog from '../class_management/pages/components/createdialog';
import CK4Editor from '@/components/CK4Editor';
import { GeneralSubjects } from '@/types';
import { cn } from "@/lib/utils";
import TableActions from '../class_management/pages/components/tableactions';

interface StudentClass {
    id: number;
    class_name: { name: string };
    class_section: { name: string };
}

interface QuestionBank {
    id: number;
    name: string;
    student_class_id: number;
    general_subject_id: number;
    student_class: {
        class_name: { name: string };
        class_section: { name: string };
    };
}

interface PracticeQuestion {
    id: number;
    title: string;
    student_class_id: number;
    general_subject_id: number;
    start_schedule_date: string;
    end_schedule_date: string;
    duration: number;
    total_score_per_question: number;
    instruction: string;
    practice_limit: number;
    show_result: boolean;
    is_approved: boolean;
    question_infos: QuestionBank[];
}

export default function PracticeQuestions({ url, questionBanks, classes }: { url: string, questionBanks: QuestionBank[], classes: StudentClass[] }) {
    const tableRef = useRef<any>(null);
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    DataTable.use(DT);
    const [practiceQuestion, setPracticeQuestion] = useState<PracticeQuestion | undefined>();

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        title: '',
        student_class_id: '',
        general_subject_id: '',
        question_info_ids: [] as number[],
        start_schedule_date: '',
        end_schedule_date: '',
        duration: '',
        total_score_per_question: '1',
        practice_limit: '0',
        show_result: true,
        instruction: '',
    });

    const formatDateTimeLocal = (dateString?: string) => {
        if (!dateString) return '';
        // Convert "2026-03-10T14:30:00.000000Z" or "2026-03-10 14:30:00" to "YYYY-MM-DDThh:mm"
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return '';
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    useEffect(() => {
        if (practiceQuestion?.id) {
            setData({
                title: practiceQuestion.title || '',
                student_class_id: practiceQuestion.student_class_id?.toString() || '',
                general_subject_id: practiceQuestion.general_subject_id?.toString() || '',
                question_info_ids: practiceQuestion.question_infos ? practiceQuestion.question_infos.map(q => q.id) : [],
                start_schedule_date: formatDateTimeLocal(practiceQuestion.start_schedule_date),
                end_schedule_date: formatDateTimeLocal(practiceQuestion.end_schedule_date),
                duration: practiceQuestion.duration?.toString() || '',
                total_score_per_question: practiceQuestion.total_score_per_question?.toString() || '1',
                practice_limit: practiceQuestion.practice_limit?.toString() || '0',
                show_result: practiceQuestion.show_result ?? true,
                instruction: practiceQuestion.instruction || '',
            });
        } else {
            reset();
            clearErrors();
        }
    }, [practiceQuestion]);

    const handleEdit = (row: PracticeQuestion) => {
        setPracticeQuestion(row);
        setOpen(true);
    };

    const handleToggleApprove = (row: PracticeQuestion) => {
        const action = row.is_approved ? "unapprove" : "approve";
        if (!window.confirm(`Are you sure you want to ${action} "${row.title}"?`)) {
            return;
        }

        router.post(`/admin/practice-questions/${row.id}/toggle-approve`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                tableRef.current?.dt().ajax.reload(null, false);
                toast({
                    title: 'Status Updated',
                    description: 'The approval status has been updated successfully.',
                });
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const onSuccess = () => {
            toast({
                title: 'Practice Question',
                description: `Practice Question has been ${practiceQuestion?.id ? 'updated' : 'created'} successfully.`,
            });
            setOpen(false);
            if (tableRef.current) {
                tableRef.current.dt().ajax.reload(null, false);
            }
        };

        if (practiceQuestion?.id) {
            put(`/admin/practice-questions/${practiceQuestion.id}`, { onSuccess });
        } else {
            post('/admin/practice-questions', { onSuccess });
        }
    };

    const toggleBankSelection = (id: number) => {
        const current = data.question_info_ids;
        if (current.includes(id)) {
            setData('question_info_ids', current.filter(b => b !== id));
        } else {
            setData('question_info_ids', [...current, id]);
        }
    };

    // Filter question banks based on selected subject
    // V3: Removed filtering by subject, show all banks.
    const filteredBanks = questionBanks;

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Practice Questions</h1>
                        <p className="text-muted-foreground">Manage practice tests for students</p>
                    </div>
                    <Button onClick={() => { setPracticeQuestion(undefined); setOpen(true); }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Practice Question
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Practice Questions
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
                                { title: 'Name', data: 'title' },
                                { title: 'Class', data: 'class' },
                                { title: 'Schedule', data: 'schedule' },
                                { title: 'Duration (Mins)', data: 'duration' },
                                {
                                    title: 'Status',
                                    data: 'status',
                                    render: (data, type, row) => {
                                        const badge = document.createElement('div');
                                        const variant = row.is_approved ? 'default' : 'destructive';
                                        createRoot(badge).render(<Badge variant={variant as "default" | "destructive"}>{data}</Badge>);
                                        return badge;
                                    }
                                },
                                {
                                    title: 'Actions',
                                    data: null,
                                    orderable: false,
                                    searchable: false,
                                    render: function (data, type, row) {
                                        const div = document.createElement('div');
                                        createRoot(div).render(
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleToggleApprove(row)}
                                                    title={row.is_approved ? "Unapprove" : "Approve"}
                                                >
                                                    {row.is_approved ? (
                                                        <XCircle className="h-4 w-4 text-destructive" />
                                                    ) : (
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                    )}
                                                </Button>
                                                <TableActions
                                                    onEdit={() => handleEdit(row)}
                                                    deleteUrl={`/admin/practice-questions/${row.id}`}
                                                    onDeleteSuccess={() => {
                                                        toast({
                                                            title: 'Item Deleted',
                                                            description: 'Practice Question has been deleted successfully.',
                                                        });
                                                        tableRef.current?.dt().ajax.reload(null, false);
                                                    }}
                                                    extraActions={[
                                                        {
                                                            type: 'link',
                                                            label: 'View Results',
                                                            icon: BarChart,
                                                            href: `/admin/practice-questions/${row.id}/results`
                                                        }
                                                    ]}
                                                />
                                            </div>
                                        );
                                        return div;
                                    },
                                },
                            ]}
                        />
                    </CardContent>
                </Card>

                <CreateDialog className="sm:max-w-[700px]" title={practiceQuestion?.id ? "Update Practice Question" : "Create Practice Question"} open={open} setOpen={setOpen}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="max-h-[70vh] overflow-y-auto px-1 py-1">
                            <div className="grid grid-cols-2 gap-4">

                                {/* Full Width Title */}
                                <div className="col-span-2 grid gap-2">
                                    <Label htmlFor="title">Name</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g., Mock Exam Term 1"
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="grid gap-2">
                                    <Label>Class</Label>
                                    <Select value={data.student_class_id} onValueChange={(v) => setData('student_class_id', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes?.map((c) => (
                                                <SelectItem key={c.id} value={c.id.toString()}>
                                                    {c.class_name.name} {c.class_section.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.student_class_id} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="total_score_per_question">Score For Each Question</Label>
                                    <Input
                                        id="total_score_per_question"
                                        type="number"
                                        value={data.total_score_per_question}
                                        onChange={(e) => setData('total_score_per_question', e.target.value)}
                                        placeholder="e.g. 1"
                                    />
                                    <InputError message={errors.total_score_per_question} />
                                </div>


                                <div className="grid gap-2">
                                    <Label htmlFor="start_schedule_date">Start Schedule Date</Label>
                                    <Input
                                        id="start_schedule_date"
                                        type="datetime-local"
                                        value={data.start_schedule_date}
                                        onChange={(e) => setData('start_schedule_date', e.target.value)}
                                    />
                                    <InputError message={errors.start_schedule_date} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="end_schedule_date">End Schedule Date</Label>
                                    <Input
                                        id="end_schedule_date"
                                        type="datetime-local"
                                        value={data.end_schedule_date}
                                        onChange={(e) => setData('end_schedule_date', e.target.value)}
                                    />
                                    <InputError message={errors.end_schedule_date} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="total_score_per_question">Practice Duration(Minutes)</Label>
                                    <Input
                                        id="duration"
                                        type="number"
                                        value={data.duration}
                                        onChange={(e) => setData('duration', e.target.value)}
                                        placeholder="e.g. 60"
                                    />
                                    <InputError message={errors.duration} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="practice_limit">Practice Limit (0 for unlimited)</Label>
                                    <Input
                                        id="practice_limit"
                                        type="number"
                                        value={data.practice_limit}
                                        onChange={(e) => setData('practice_limit', e.target.value)}
                                        placeholder="e.g. 0"
                                    />
                                    <InputError message={errors.practice_limit} />
                                </div>

                                <div className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow-sm h-full">
                                    <Checkbox
                                        id="show_result"
                                        checked={data.show_result}
                                        onCheckedChange={(checked) => setData('show_result', !!checked)}
                                    />
                                    <div className="space-y-1 leading-none">
                                        <Label htmlFor="show_result" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Show Result to Student
                                        </Label>
                                        <p className="text-[0.8rem] text-muted-foreground">
                                            Students will see their performance after submission.
                                        </p>
                                    </div>
                                    <InputError message={errors.show_result} />
                                </div>


                                <div className="col-span-2 grid gap-2">
                                    <Label htmlFor="instruction">Practice Instruction</Label>

                                    <div className="border rounded-md shadow-sm overflow-hidden bg-background">
                                        <CK4Editor
                                            initData={data.instruction}
                                            onChange={(e: any) => setData('instruction', e.editor.getData())}
                                            id={`instruction-editor-${practiceQuestion?.id || 'new'}`}
                                        />
                                    </div>
                                    <InputError message={errors.instruction} />
                                </div>

                                <div className="col-span-2 grid gap-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <Label>Select Question Banks</Label>

                                    </div>
                                    <div className="max-h-[150px] overflow-y-auto space-y-2 border p-3 rounded-md bg-muted/40">
                                        {filteredBanks.length === 0 ? (
                                            <p className="text-sm text-center text-muted-foreground py-4">
                                                {data.general_subject_id ? "No question banks found for the selected Subject." : "Please select a Subject to view available Question Banks."}
                                            </p>
                                        ) : (
                                            filteredBanks.map((bank) => (
                                                <div key={bank.id} className="flex flex-row items-center space-x-3 space-y-0 relative items-start">
                                                    <Checkbox
                                                        id={`bank-${bank.id}`}
                                                        checked={data.question_info_ids.includes(bank.id)}
                                                        onCheckedChange={() => toggleBankSelection(bank.id)}
                                                    />
                                                    <label htmlFor={`bank-${bank.id}`} className="font-normal text-sm cursor-pointer leading-snug">
                                                        {bank.name} <span className="text-muted-foreground text-xs">({bank.student_class?.class_name?.name} {bank.student_class?.class_section?.name})</span>
                                                    </label>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <InputError message={errors.question_info_ids} />
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button disabled={processing} type="submit" className="flex items-center gap-2">
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </CreateDialog>
            </div>
        </AdminLayout>
    );
}
