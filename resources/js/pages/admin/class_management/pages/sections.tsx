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
import { Section } from '@/types';
import ClassSectionController from '@/actions/App/Http/Controllers/Administrator/ClassSectionController';


export default function Sections({sections} : { sections: Section[] }) {
    const { toast } = useToast();
    const [Section, setSection] = useState<Section | undefined>();
    const [classForm, setClassForm] = useState(ClassSectionController.store.form());

    const handleEdit  = function(Section: Section) {
        setSection(Section);
    }

    const [open, setOpen] = useState(false);


    useEffect(() => {
        if(Section?.id !== undefined) {
            setClassForm(ClassSectionController.update.form({ class_section: Section.id }));
            setOpen(true);
        } else {
            setClassForm(ClassSectionController.store.form());
        }
    }, [Section]);

    return (
        <ClassManagementLayout>
            <>
                <TabNav active="/admin/class-sections" />
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Class Sections</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Section types (A, B, Science, Arts, Commercial)
                            </p>
                        </div>

                        <Button onClick={() => {
                            setSection(undefined);
                            setOpen(!open);
                        }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Class Section
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
                                {sections.map((name : Section) => (
                                    <TableRow key={name.id}>
                                        <TableCell className="font-medium">{name.name}</TableCell>
                                        <TableCell className="text-right">
                                            <TableActions
                                                onEdit={() => {
                                                    handleEdit(name);
                                                }}
                                                deleteUrl={ClassSectionController.destroy.url({ class_section: name.id })}
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
                    title={Section?.id ? "Update Class Section": "Create New Class Section"}
                    open={open}
                    setOpen={setOpen}
                >
                    <Form
                        {...classForm}
                        className="space-y-6"
                        onSuccess={() => {
                            toast({
                                title: "Class Management",
                                description: `Class Section has been `+(Section?.id ? "updated" : "created")+` successfully.`,
                            });

                            setOpen(false);
                        }}
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="groupName">Group Name</Label>
                                        <Input  key={Section?.id ?? "new"} id="groupName" defaultValue={Section?.name ?? ""}  name="name" placeholder="e.g., Junior Secondary School" />
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
