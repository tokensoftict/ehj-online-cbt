
import { Card, CardContent, CardHeader, CardTitle } from '@/components/template-ui/card';
import { Button } from '@/components/template-ui/button';
import { LoaderCircle, Plus } from 'lucide-react';
import { Label } from '@/components/template-ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/template-ui/table';
import CreateDialog from '@/pages/admin/class_management/pages/components/createdialog';
import TableActions from '@/pages/admin/class_management/pages/components/tableactions';
import { useToast } from '@/hooks/use-toast';
import ClassManagementLayout from '@/pages/admin/class_management/layout';
import TabNav from '@/pages/admin/class_management/pages/components/tabnav';
import { ClassGroup, ClassName, Section, StudentClasses } from '@/types';
import { useEffect, useState } from 'react';
import ClassManagementController from '@/actions/App/Http/Controllers/Administrator/ClassManagementController';
import { Form } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { DialogFooter } from '@/components/template-ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/template-ui/select';



export default function StudentClass({classGroups, classNames, sections, student_classes} : {classNames: ClassName[], classGroups: ClassGroup[], sections: Section[], student_classes : StudentClasses[] }) {
    const { toast } = useToast();
    const [student_class, setStudent_class] = useState<StudentClasses | undefined>();
    const [open, setOpen] = useState(false);
    const [studentClassForm, setStudentClassForm] = useState(ClassManagementController.store.form());

    const handleEdit  = function(studentClass: StudentClasses) {
        setStudent_class(studentClass);
    }

    useEffect(() => {
        if(student_class?.id !== undefined) {
            setStudentClassForm(ClassManagementController.update.form({ student_class: student_class?.id }));
            setOpen(true);
        } else {
            setStudentClassForm(ClassManagementController.store.form());
        }
    }, [student_class]);

    return (
        <ClassManagementLayout>
            <>
                <TabNav active="/admin/student-classes" />
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Student Classes</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Numeric levels within groups (J SS 1 A, J SS 1B, S SS 1 Science)
                            </p>
                        </div>

                        <Button onClick={() => {
                            setStudent_class(undefined);
                            setOpen(!open);
                        }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Student Class
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Section</TableHead>
                                    <TableHead>Group</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {student_classes.map((student_class) => (
                                    <TableRow key={student_class.id}>
                                        <TableCell className="font-medium">{student_class.class_name.name}</TableCell>
                                        <TableCell className="font-medium">{student_class.class_section.name}</TableCell>
                                        <TableCell className="font-medium">{student_class.class_group.name}</TableCell>
                                        <TableCell className="text-right">
                                            <TableActions
                                                onEdit={() => {
                                                    handleEdit(student_class);
                                                }}
                                                deleteUrl={ClassManagementController.destroy.url({ student_class : student_class.id })}
                                                onDeleteSuccess={() =>
                                                    toast({
                                                        title: "Item Deleted",
                                                        description: "Item has been deleted successfully.",
                                                    })
                                                }
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <CreateDialog
                    title={student_class?.id ? "Update Student Class": "Create New Student Class"}
                    open={open}
                    setOpen={setOpen}
                >
                    <Form
                        {...studentClassForm}
                        className="space-y-6"
                        onSuccess={() => {
                            toast({
                                title: "Class Management",
                                description: `Student Class has been `+(student_class?.id ? "updated" : "created")+` successfully.`,
                            });

                            setOpen(false);
                        }}
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="class_name_id">Class Name</Label>
                                        <Select name="class_name_id" defaultValue={student_class?.class_name_id ? (student_class?.class_name_id+"") : ""}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Class Name" defaultValue="" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {classNames.map((className) => (
                                                    <SelectItem key={className.id + "_class_name"} value={className.id.toString()}>
                                                        {className.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.class_name_id} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="class_group_id">Group Name</Label>
                                        <Select name="class_group_id" defaultValue={student_class?.class_group_id ? (student_class?.class_group_id+"") : ""}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Class Group" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {classGroups.map((classGroup) => (
                                                    <SelectItem key={classGroup.id + "_group_name"} value={classGroup.id.toString()}>
                                                        {classGroup.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.class_group_id} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="class_section_id">Class Section</Label>
                                        <Select name="class_section_id" defaultValue={ student_class?.class_section_id ? (student_class?.class_section_id+"") : ""}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Class Section" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {sections.map((section) => (
                                                    <SelectItem key={section.id + "_section_name"} value={section.id.toString()}>
                                                        {section.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.class_section_id} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button disabled={processing} type="submit">
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}  Save
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </Form>
                </CreateDialog>

            </>
        </ClassManagementLayout>
    );

}

