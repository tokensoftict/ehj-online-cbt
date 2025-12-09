import { GeneralSubjects } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useRef, useState } from 'react';
import GeneralSubjectController from '@/actions/App/Http/Controllers/Administrator/GeneralSubjectController';
import GeneralSubjectManagement from '@/pages/admin/general_subject_management/general_subject_layout';
import GeneralSubjectManagementTabNav from '@/pages/admin/general_subject_management/components/general_subject_management_tabnav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/template-ui/card';
import { Button } from '@/components/template-ui/button';
import { LoaderCircle, Plus } from 'lucide-react';
import { Form } from '@inertiajs/react';
import { Label } from '@/components/template-ui/label';
import { Input } from '@/components/template-ui/input';
import InputError from '@/components/input-error';
import { DialogFooter } from '@/components/template-ui/dialog';
import CreateDialog from '@/pages/admin/class_management/pages/components/createdialog';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import { createRoot } from 'react-dom/client';
import TableActions from '@/pages/admin/class_management/pages/components/tableactions';

export default function GeneralSubject({ url }: { url: string }) {
    const { toast } = useToast();
    DataTable.use(DT);
    const tableRef = useRef<any>(null);
    const [open, setOpen] = useState(false);
    const [generalSubject, setGeneralSubject] = useState<GeneralSubjects | undefined>();
    const [generalSubjectForm, setGeneralSubjectForm] = useState(GeneralSubjectController.store.form());

    const handleEdit  = function(subject: GeneralSubjects) {
        setGeneralSubject(subject);
    }

    useEffect(() => {
        if (generalSubject?.id !== undefined) {
            setGeneralSubjectForm(GeneralSubjectController.update.form({ general_subject: generalSubject.id }));
            setOpen(true);
        } else {
            setGeneralSubjectForm(GeneralSubjectController.store.form());
        }
    }, [generalSubject]);


    return (
        <GeneralSubjectManagement>
            <>
                <GeneralSubjectManagementTabNav active="/admin/general_subjects" />

                <Card className="shadow-sm border border-gray-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <div>
                            <CardTitle className="text-xl font-semibold">General Subjects</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                All subjects offered by the school (Math, English, etc.)
                            </p>
                        </div>

                        <Button
                            className="flex items-center gap-2"
                            onClick={() => {
                                setGeneralSubject(undefined);
                                setOpen(true);
                            }}
                        >
                            <Plus className="h-4 w-4" />
                            Add Subject
                        </Button>
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
                                { title: "S/N", data: "DT_RowIndex" },
                                { title: "Name", data: "name" },
                                {
                                    title: "Actions",
                                    data: null,
                                    orderable: false,
                                    searchable: false,
                                    render: function (data, type, row, meta) {
                                        const div = document.createElement('div');
                                        createRoot(div).render(
                                            <TableActions
                                                onEdit={() => handleEdit(row)}
                                                deleteUrl={GeneralSubjectController.destroy.url({ general_subject: row.id })}
                                                onDeleteSuccess={() => {
                                                    toast({
                                                        title: "Item Deleted",
                                                        description: "Item has been deleted successfully.",
                                                    });
                                                    tableRef.current?.dt().ajax.reload(null, false);
                                                }}
                                            />
                                        );
                                        return div;
                                    },
                                },
                            ]}
                        />

                    </CardContent>
                </Card>

                {/* Create / Update Dialog */}
                <CreateDialog
                    title={generalSubject?.id ? 'Update Subject' : 'Create New Subject'}
                    open={open}
                    setOpen={setOpen}
                >
                    <Form
                        {...generalSubjectForm}
                        className="space-y-6"
                        onSuccess={() => {
                            toast({
                                title: 'General Subjects',
                                description:
                                    `Subject has been ` +
                                    (generalSubject?.id ? 'updated' : 'created') +
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
                                        <Label htmlFor="groupName">Subject Name</Label>
                                        <Input
                                            key={generalSubject?.id ?? 'new'}
                                            id="groupName"
                                            defaultValue={generalSubject?.name ?? ''}
                                            name="name"
                                            placeholder="e.g., English, Math"
                                            className="focus:ring-2 focus:ring-primary/30"
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button disabled={processing} type="submit" className="flex items-center gap-2">
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        Save
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </Form>
                </CreateDialog>
            </>
        </GeneralSubjectManagement>
    );
}
