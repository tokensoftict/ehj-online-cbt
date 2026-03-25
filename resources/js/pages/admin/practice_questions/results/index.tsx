import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/template-ui/badge';
import { Button } from '@/components/template-ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/template-ui/card';
import { useToast } from '@/hooks/use-toast';
import DT from 'datatables.net-dt';
import DataTable from 'datatables.net-react';
import { DownloadCloud, ArrowLeft, FileText, LoaderCircle, Trash2, RotateCcw } from 'lucide-react';
import { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Link, router } from '@inertiajs/react';

interface PracticeQuestionTitle {
    id: number;
    title: string;
    total_score_per_question: number;
}

export default function PracticeResults({ url, practice }: { url: string, practice: PracticeQuestionTitle }) {
    const tableRef = useRef<any>(null);
    const { toast } = useToast();
    DataTable.use(DT);
    const [exporting, setExporting] = useState(false);

    const handleExportExcel = () => {
        setExporting(true);
        window.location.href = `/admin/practice-questions/${practice.id}/results/export`;
        setTimeout(() => setExporting(false), 2000); // Reset state after a brief moment
    };

    const handleReset = (resultId: number) => {
        if (!window.confirm("Are you sure you want to reset this attempt? This will delete the result and allow the student to retake it.")) {
            return;
        }

        router.delete(`/admin/practice-questions/${practice.id}/results/${resultId}`, {
            preserveScroll: true,
            onSuccess: () => {
                tableRef.current?.dt().ajax.reload(null, false);
                toast({
                    title: 'Attempt Reset',
                    description: 'The practice attempt has been deleted successfully.',
                });
            }
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-2">
                            <Link href="/admin/practice-questions" className="text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <h1 className="text-3xl font-bold">Practice Results</h1>
                        </div>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Viewing results for: <span className="font-semibold text-foreground">{practice.title}</span>
                        </p>
                    </div>
                    <Button onClick={handleExportExcel} disabled={exporting} className="bg-green-600 hover:bg-green-700 text-white">
                        {exporting ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <DownloadCloud className="mr-2 h-4 w-4" />}
                        Export to Excel
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Student Attempts
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
                                pageLength: 25,
                            }}
                            columns={[
                                { title: 'S/N', data: 'DT_RowIndex' },
                                { title: 'Name', data: 'student_name' },
                                { title: 'Reg No', data: 'reg_no' },
                                {
                                    title: 'Score',
                                    data: 'score_formatted',
                                    render: (data) => {
                                        const badge = document.createElement('div');
                                        createRoot(badge).render(<Badge variant="outline" className="font-mono text-sm">{data}</Badge>);
                                        return badge;
                                    }
                                },
                                { title: 'Answered', data: 'answered_questions' },
                                { title: 'Time Taken', data: 'time_formatted' },
                                { title: 'Date Attempted', data: 'date' },
                                {
                                    title: 'Actions',
                                    data: null,
                                    orderable: false,
                                    searchable: false,
                                    render: function (data, type, row: any) {
                                        const div = document.createElement('div');
                                        createRoot(div).render(
                                            <div className="flex items-center space-x-2">
                                                <a
                                                    href={`/admin/practice-questions/${practice.id}/results/${row.id}/pdf`}
                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700"
                                                    title="Download PDF"
                                                >
                                                    <DownloadCloud className="h-4 w-4 mr-1" /> PDF
                                                </a>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleReset(row.id)}
                                                    className="h-8 bg-amber-600 hover:bg-amber-700 border-amber-600"
                                                    title="Reset Attempt"
                                                >
                                                    <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
                                                </Button>
                                            </div>
                                        );
                                        return div;
                                    },
                                },
                            ]}
                        />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
