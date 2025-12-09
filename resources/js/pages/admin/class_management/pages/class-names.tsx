import { Card, CardContent, CardHeader, CardTitle } from '@/components/template-ui/card';
import { Button } from '@/components/template-ui/button';
import { LoaderCircle, Plus } from 'lucide-react';
import { Label } from '@/components/template-ui/label';
import { Input } from '@/components/template-ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/template-ui/table';
import CreateDialog from '@/pages/admin/class_management/pages/components/createdialog';
import { useToast } from '@/hooks/use-toast';
import TableActions from '@/pages/admin/class_management/pages/components/tableactions';
import ClassManagementLayout from '@/pages/admin/class_management/layout';
import TabNav from '@/pages/admin/class_management/pages/components/tabnav';
import { Form } from '@inertiajs/react';
import { DialogFooter } from '@/components/template-ui/dialog';
import InputError from '@/components/input-error';
import { useEffect, useState } from 'react';
import { ClassName } from '@/types';
import ClassNameController from '@/actions/App/Http/Controllers/Administrator/ClassNameController';

export default function ClassNames({classNames} : { classNames: ClassName[] }) {
    const { toast } = useToast();
    const [className, setClassName] = useState<ClassName | undefined>();
    const [classForm, setClassForm] = useState(ClassNameController.store.form());

    const handleEdit  = function(className: ClassName) {
        setClassName(className);
    }

    const [open, setOpen] = useState(false);


    useEffect(() => {
        if(className?.id !== undefined) {
            setClassForm(ClassNameController.update.form({ class_name: className.id }));
            setOpen(true);
        } else {
            setClassForm(ClassNameController.store.form());
        }
    }, [className]);

    return (
        <ClassManagementLayout>
            <>
                <TabNav active="/admin/class-names" />
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Class Names</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Major class names (JSS, SSS)
                            </p>
                        </div>

                        <Button onClick={() => {
                            setClassName(undefined);
                            setOpen(!open);
                        }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Class Name
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {classNames.map((name : ClassName) => (
                                    <TableRow key={name.id}>
                                        <TableCell className="font-medium">{name.name}</TableCell>
                                        <TableCell className="text-right">
                                            <TableActions
                                                onEdit={() => {
                                                   handleEdit(name);
                                                }}
                                                deleteUrl={ClassNameController.destroy.url({ class_name: name.id })}
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
                    title={className?.id ? "Update Class Name": "Create New Class Name"}
                    open={open}
                    setOpen={setOpen}
                >
                    <Form
                        {...classForm}
                        className="space-y-6"
                        onSuccess={() => {
                            toast({
                                title: "Class Management",
                                description: `Class Name has been `+(className?.id ? "updated" : "created")+` successfully.`,
                            });

                           setOpen(false);
                        }}
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="groupName">Group Name</Label>
                                        <Input  key={className?.id ?? "new"} id="groupName" defaultValue={className?.name ?? ""}  name="name" placeholder="e.g., Junior Secondary School" />
                                        <InputError message={errors.name} />
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
    )
}
