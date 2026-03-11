import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/template-ui/button';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { Instruction, QuestionInfo } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import QuestionInstructionController from '@/actions/App/Http/Controllers/Administrator/QuestionInstructionController';
import { Label } from '@/components/template-ui/label';
import { Input } from '@/components/template-ui/input';
import MathEditor from '@/components/CK4Editor';
import InputError from '@/components/input-error';


export default function InstructionForm({questionInfo, instruction} : {questionInfo : QuestionInfo, instruction : Instruction}) {
    const { toast } = useToast();
    const [instructionForm, setInstructionForm] = useState(QuestionInstructionController.store.form({question_info_id : questionInfo.id}));
    const [formInstruction, setFormInstruction] = useState<string>(instruction?.instruction);
    useEffect(() => {
        if (instruction?.id !== undefined) {
            setInstructionForm(QuestionInstructionController.update.form({question_info_id : questionInfo.id, instruction : instruction.id}));
        } else {
            setInstructionForm(QuestionInstructionController.store.form({question_info_id : questionInfo.id}));
        }
    }, [instruction]);

    return (
      <AdminLayout>
          <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                  <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.history.back()}
                  >
                      <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                      <h1 className="text-3xl font-bold"> {instruction?.id ? "Update" : "Add new" } Instruction</h1>
                      <p className="text-muted-foreground">
                          {instruction?.id ? "Update instruction" : "Create a new instruction" } for your test container
                      </p>
                  </div>
              </div>
              <Card>
                  <CardContent className="pt-6">
                      <Form
                          {...instructionForm}
                          className="space-y-6"
                          transform={(data) => ({
                              ...data,
                              instruction : formInstruction,
                          })}
                          onSuccess={() => {
                              toast({
                                  title: 'Instruction',
                                  description:
                                      `Instruction has been ` +
                                      (instruction?.id
                                          ? 'updated'
                                          : 'created') +
                                      ` successfully.`,
                              });
                             if(!instruction.id){
                                 setTimeout(() => {
                                     window.location.reload();
                                 }, 1300)
                             } else {
                                 setTimeout(() => {
                                     window.history.back();
                                 }, 1300)
                             }
                          }}
                      >

                          {({ processing, errors }) => (
                              <>
                              <div className="grid gap-4">
                                  <div className="grid gap-2">
                                      <Label htmlFor="title">
                                          Title
                                      </Label>
                                      <Input
                                          key={instruction?.id ?? 'new'}
                                          id="title"
                                          defaultValue={
                                              instruction?.title ?? ''
                                          }
                                          name="title"
                                          placeholder={"Title."}
                                          className="focus:ring-2 focus:ring-primary/30"
                                      />
                                      <InputError message={errors.title} />
                                  </div>

                                  <div className="grid gap-2">
                                      <Label htmlFor="title">
                                          Instruction
                                      </Label>
                                      <MathEditor data={instruction?.instruction ?? ""} name="instruction" onChange={(value) => setFormInstruction(value.editor.getData())}/>
                                      <InputError message={errors.instruction} />
                                  </div>
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
                              </div>


                              </>
                          )}
                      </Form>
                  </CardContent>
              </Card>
          </div>
      </AdminLayout>
    );
}
