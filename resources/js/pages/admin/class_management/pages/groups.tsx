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
import ClassGroupController from '@/actions/App/Http/Controllers/Administrator/ClassGroupController';
import { Form, router } from '@inertiajs/react';
import { DialogFooter } from '@/components/template-ui/dialog';
import InputError from '@/components/input-error';
import { useEffect, useState } from 'react';
import { ClassGroup } from '@/types';


export default function Groups({classGroups} : { classGroups: ClassGroup[] }) {
    const { toast } = useToast();
    const [classGroup, setClassGroup] = useState<ClassGroup | undefined>();
    const [groupForm, setGroupForm] = useState(ClassGroupController.store.form());

    const handleEdit  = function(classGroup: ClassGroup) {
        setClassGroup(classGroup);
    }

    const [open, setOpen] = useState(false);


    useEffect(() => {
        if(classGroup?.id !== undefined) {
            setGroupForm(ClassGroupController.update.form({ class_group: classGroup.id }));
            setOpen(true);
        } else {
            setGroupForm(ClassGroupController.store.form());
        }
    }, [classGroup]);

    return (
        <ClassManagementLayout>
            <>
                <TabNav active="/admin/class-groups" />
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Class Groups</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Major class groupings (Junior Secondary School, Senior Secondary School)
                            </p>
                        </div>

                        <Button onClick={() => {
                            setClassGroup(undefined);
                            setOpen(!open);
                        }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Group
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
                                {classGroups.map((group : ClassGroup) => (
                                    <TableRow key={group.id}>
                                        <TableCell className="font-medium">{group.name}</TableCell>
                                        <TableCell className="text-right">
                                            <TableActions
                                                onEdit={() => {
                                                   handleEdit(group);
                                                }}
                                                deleteUrl={ClassGroupController.destroy.url({ class_group: group.id })}
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
                    title={classGroup?.id ? "Update Class Group": "Create New Class Group"}
                    open={open}
                    setOpen={setOpen}
                >
                    <Form
                        {...groupForm}
                        className="space-y-6"
                        onSuccess={() => {
                            toast({
                                title: "Class Management",
                                description: `Class Group has been `+(classGroup?.id ? "updated" : "created")+` successfully.`,
                            });

                           setOpen(false);
                        }}
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="groupName">Group Name</Label>
                                        <Input  key={classGroup?.id ?? "new"} id="groupName" defaultValue={classGroup?.name ?? ""}  name="name" placeholder="e.g., Junior Secondary School" />
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
