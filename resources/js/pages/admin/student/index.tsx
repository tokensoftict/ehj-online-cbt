
import AdminLayout from '@/components/admin/AdminLayout';
import { Form, Link } from '@inertiajs/react';
import { Button } from '@/components/template-ui/button';
import { FileText, LoaderCircle, Plus } from 'lucide-react';
import { CardHeader, CardTitle, Card, CardContent } from '@/components/template-ui/card';
import DataTable from 'datatables.net-react';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import DT from 'datatables.net-dt';
import CreateDialog from '@/pages/admin/class_management/pages/components/createdialog';
import { Sex, Student, StudentClasses } from '@/types';
import { Label } from '@/components/template-ui/label';
import { Input } from '@/components/template-ui/input';
import InputError from '@/components/input-error';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/template-ui/select';
import { DialogFooter } from '@/components/template-ui/dialog';
import { createRoot } from 'react-dom/client';
import TableActions from '@/pages/admin/class_management/pages/components/tableactions';
import FileUploadController from '@/actions/App/Http/Controllers/Administrator/FileUploadController';
import StudentController from '@/actions/App/Http/Controllers/Administrator/StudentController';

export default function StudentManager({ url, classes, sex }: { url: string, classes: StudentClasses[], sex: Sex[] }) {

    const tableRef = useRef<any>(null);
    const { toast } = useToast();
    const [open, setOpen] = useState(false);

    const [uploadOpen, setUploadOpen] = useState(false);

    const [student, setStudent] = useState<Student>()
    DataTable.use(DT);
    const [studentForm, setStudentForm] = useState(StudentController.store.form());

    useEffect(() => {
        if (student?.id !== undefined) {
            setStudentForm(StudentController.update.form({ student: student.id }));
            setOpen(true);
        } else {
            setStudentForm(StudentController.store.form());
        }
    }, [student]);

    const handleEdit = function (row: Student) {
        setStudent(row);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Student Management</h1>
                        <p className="text-muted-foreground">
                            Manage student e.g create, upload, edit and delete student data
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => {
                                setStudent(undefined);
                                setUploadOpen(true);
                            }}
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            Upload Student
                        </Button>

                        <Button type="button"
                            onClick={() => {
                                setStudent(undefined);
                                setOpen(true);
                            }}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Student
                        </Button>
                    </div>

                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Student List
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
                                { title: 'Registration No', data: 'reg_no' },
                                { title: 'Surname', data: 'surname' },
                                { title: 'First Name', data: 'firstname' },
                                { title: 'Last name', data: 'lastname' },
                                { title: 'Class', data: 'class' },
                                { title: 'Gender', data: 'sex' },
                                { title: 'Age', data: 'age' },
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
                                                deleteUrl={StudentController.destroy.url(
                                                    { student: row.id },
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

                    title="New Student"
                    open={open}
                    setOpen={setOpen}
                >
                    <div className="max-h-[70vh] overflow-y-auto px-1 py-1">
                        <Form
                            {...studentForm}
                            className="space-y-6"
                            onSuccess={() => {
                                toast({
                                    title: 'Student Management',
                                    description:
                                        `Student has been ` +
                                        (student?.id
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
                                            <Label htmlFor="reg_no">
                                                Registration No
                                            </Label>
                                            <Input
                                                key={student?.id ?? 'new'}
                                                id="reg_no"
                                                defaultValue={
                                                    student?.reg_no ?? ''
                                                }
                                                name="reg_no"
                                                placeholder={"Registration No."}
                                                className="focus:ring-2 focus:ring-primary/30"
                                            />
                                            <InputError message={errors.reg_no} />
                                        </div>
                                    </div>

                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="surname">
                                                Surname
                                            </Label>
                                            <Input
                                                key={student?.id ?? 'new'}
                                                id="surname"
                                                defaultValue={
                                                    student?.surname ?? ''
                                                }
                                                name="surname"
                                                placeholder={"Surname"}
                                                className="focus:ring-2 focus:ring-primary/30"
                                            />
                                            <InputError message={errors.surname} />
                                        </div>
                                    </div>

                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="firstname">
                                                Firstname
                                            </Label>
                                            <Input
                                                key={student?.id ?? 'new'}
                                                id="firstname"
                                                defaultValue={
                                                    student?.firstname ?? ''
                                                }
                                                name="firstname"
                                                placeholder={"Firstname"}
                                                className="focus:ring-2 focus:ring-primary/30"
                                            />
                                            <InputError message={errors.firstname} />
                                        </div>
                                    </div>

                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="lastname">
                                                Lastname
                                            </Label>
                                            <Input
                                                key={student?.id ?? 'new'}
                                                id="lastname"
                                                defaultValue={
                                                    student?.lastname ?? ''
                                                }
                                                name="lastname"
                                                placeholder={"Lastname"}
                                                className="focus:ring-2 focus:ring-primary/30"
                                            />
                                            <InputError message={errors.lastname} />
                                        </div>
                                    </div>

                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="age">
                                                Age
                                            </Label>
                                            <Input
                                                key={student?.id ?? 'new'}
                                                id="age"
                                                defaultValue={
                                                    student?.age ?? ''
                                                }
                                                name="age"
                                                placeholder={"Age"}
                                                className="focus:ring-2 focus:ring-primary/30"
                                            />
                                            <InputError message={errors.age} />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="sex">Gender</Label>
                                        <Select name="sex" defaultValue={student?.sex ? (student?.sex + "") : ""}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Gender" defaultValue="" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {sex.map((s: Sex) => (
                                                    <SelectItem key={s.value + "_sex"} value={s.value.toString()}>
                                                        {s.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.sex} />
                                    </div>


                                    <div className="grid gap-2">
                                        <Label htmlFor="student_class_id">Student Class</Label>
                                        <Select name="student_class_id" defaultValue={student?.student_class_id ? (student?.student_class_id + "") : ""}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Class" defaultValue="" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {classes.map((classs: StudentClasses) => (
                                                    <SelectItem key={classs.id + "_sex"} value={classs.id.toString()}>
                                                        {classs.class_name.name} {classs.class_section.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.student_class_id} />
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
                    </div>



                </CreateDialog>




                <CreateDialog
                    title="Upload Student"
                    open={uploadOpen}
                    setOpen={setUploadOpen}
                >
                    <Form
                        {...StudentController.upload.form()}
                        className="space-y-6"
                        onSuccess={() => {
                            toast({
                                title: 'Student Management',
                                description:
                                    `Student file has been uploaded successfully.`,
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
                                            Name
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
                                    <Label htmlFor="student_class_id">Student Class</Label>
                                    <Select name="student_class_id" defaultValue={student?.student_class_id ? (student?.student_class_id + "") : ""}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Student Class" defaultValue="" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes.map((classs: StudentClasses) => (
                                                <SelectItem key={classs.id + "_sex"} value={classs.id.toString()}>
                                                    {classs.class_name.name} {classs.class_section.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.student_class_id} />
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
                                            window.open(FileUploadController.student_template.url())
                                        }}
                                        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors    text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                        href="#"
                                    >Download Student Template</Link>
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
