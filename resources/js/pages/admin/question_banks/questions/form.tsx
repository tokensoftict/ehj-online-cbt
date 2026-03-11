import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';
import { Instruction, Question, QuestionInfo } from '@/types';
import { useState } from 'react';
import { Label } from '@/components/template-ui/label';

import {
    RadioGroup,
    RadioGroupItem,
} from '@/components/template-ui/radio-group';
import {
    Select,
    SelectItem,
    SelectTrigger,
} from '@/components/template-ui/select';
import { SelectContent, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/template-ui/input';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/template-ui/card';
import MathPreview from '@/components/MathPreview';
import { Button } from '@/components/template-ui/button';
import { ArrowLeft, LoaderCircle, Save } from 'lucide-react';
import MathEditor from '@/components/CK4Editor';
import { useForm } from '@inertiajs/react';
import { ScrollArea } from '@/components/template-ui/scroll-area';


export default function QuestionFormPage({ question_info, createLink, questionNumber, question, backLink, questionInstruction }: { question_info: QuestionInfo, createLink: string, questionNumber: number, question: Question, backLink: string, questionInstruction: Instruction[] }) {
    const { toast } = useToast();

    const [questionData, setQuestionData] = useState<Question>(question);
    const [currentStep, setCurrentStep] = useState(1);

    const { data, setData, post, put, processing } = useForm<Question>(question);
    const [errors, setErrors] = useState<Record<string, string[]>>({});


    const handleInputChange = <K extends keyof Question>(
        field: K,
        value: string
    ) => {
        setQuestionData(prev => ({
            ...prev,
            [field]: value as Question[K],
        }));
    };


    const handleSubmit = () => {
        console.log(data);
        if (question?.id) {
            put(createLink, {
                preserveScroll: true,
                onSuccess: (page) => {
                    toast({
                        title: "Question Updated",
                        description: "Question has been updated successfully",
                    });

                    setTimeout(() => {
                        window.location.href = backLink;
                    }, 1200)

                },
                onError: (errors) => {
                    setErrors(errors);
                    toast({
                        title: "Question Error",
                        variant: "destructive",
                        description: "There was an error updating the question.",
                    });
                },
            })
        } else {
            post(createLink, {
                preserveScroll: true,
                onSuccess: (page) => {
                    toast({
                        title: "Question Added",
                        description: "Question has been added successfully",
                    });

                    setTimeout(() => {
                        window.location.reload();
                    }, 1200)

                },
                onError: (errors) => {
                    setErrors(errors);
                    toast({
                        title: "Question Error",
                        variant: "destructive",
                        description: "There was an error creating the question.",
                    });
                },
            })
        }
    };

    const steps = [
        { id: 1, name: "Question Content", description: "Enter the question text" },
        { id: 2, name: "Answer Options", description: "Add multiple choice options" },
        { id: 3, name: "Settings", description: "Set difficulty and topic" },
        { id: 4, name: "Preview", description: "Review and submit" },
    ];

    const isStepComplete = (step: number) => {
        switch (step) {
            case 1:
                return (String(questionData?.question ?? "").trim() !== "");
            case 2:
                return Object.values(
                    {
                        a: questionData?.a ?? "",
                        b: questionData?.b ?? "",
                        c: questionData?.c ?? "",
                        d: questionData?.d ?? ""
                    }
                ).every(option => option.trim() !== "");
            case 3:
                return questionData?.correct_option !== "";
            default:
                return false;
        }
    };

    const canProceed = () => {
        return isStepComplete(currentStep);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">

                        <div className="space-y-2">
                            <Label htmlFor="question_no">Question No</Label>
                            <Input
                                key={questionData?.question_no ?? 'new'}
                                id="age"
                                onChange={function (e) {
                                    handleInputChange("question_no", e.target.value)
                                    setData("question_no", e.target.value)
                                }}
                                defaultValue={
                                    questionData?.question_no ?? questionNumber
                                }
                                name="question_no"
                                placeholder={"Question No"}
                                className="focus:ring-2 focus:ring-primary/30"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="question">Question *</Label>
                            <MathEditor data={questionData?.question ?? ""} name="question" onChange={function (value) {
                                handleInputChange("question", value.editor.getData());
                                setData("question", value.editor.getData())
                            }} />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <ScrollArea className="h-72 space-y-4">
                        <div className="space-y-4">
                            <div className="text-sm text-muted-foreground mb-4">
                                Enter all four answer options. You'll select the correct one in the next step.
                            </div>
                            {Object.entries({
                                a: questionData?.a ?? "",
                                b: questionData?.b ?? "",
                                c: questionData?.c ?? "",
                                d: questionData?.d ?? ""
                            }).map(([key, value]) => (
                                <div key={key} className="space-y-2">
                                    <Label htmlFor={`option_${key}`}>Option {key.toUpperCase()} *</Label>
                                    <MathEditor data={questionData?.[key] ?? ""} name={key} onChange={function (value) {
                                        handleInputChange(key, value.editor.getData());
                                        setData(key, value.editor.getData())
                                    }} />
                                    {questionData.correct_option === key && (
                                        <span className="ml-2 text-xs text-success">(Correct Answer)</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label>Correct Answer *</Label>
                            <RadioGroup
                                className="mt-2"
                                value={questionData?.correct_option ?? ""}
                                onValueChange={function (value) {
                                    handleInputChange("correct_option", value)
                                    setData("correct_option", value)
                                }}
                            >
                                {Object.entries({
                                    A: questionData?.a ?? "",
                                    B: questionData?.b ?? "",
                                    C: questionData?.c ?? "",
                                    D: questionData?.d ?? ""
                                }).map(([key, value]) => (
                                    <div
                                        key={key}
                                        className={`p-3 rounded-lg border ${questionData?.correct_option === key
                                            ? "border-success bg-success/5 text-success-foreground"
                                            : "border-border bg-muted/20"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{key.toUpperCase()}.</span>
                                            <RadioGroupItem value={key} id={`correct_${key}`} />
                                            <MathPreview
                                                key={key + "-preview"}
                                                content={value || `Option ${key}`}
                                                className="flex-1"
                                            />
                                            {questionData.correct_option === key && (
                                                <span className="ml-2 text-xs text-success">(Correct Answer)</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="difficulty">Difficulty Level *</Label>
                                <Select
                                    value={questionData?.difficulty ?? "Easy"}
                                    onValueChange={function (value) {
                                        handleInputChange("difficulty", value)
                                        setData("difficulty", value)
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select difficulty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Easy">Easy</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Hard">Hard</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="difficulty">Question Instruction</Label>
                                <Select
                                    value={String(questionData?.question_instruction_id)}
                                    onValueChange={function (value) {
                                        handleInputChange("question_instruction_id", value)
                                        setData("question_instruction_id", parseInt(value))
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Question Instruction" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {questionInstruction.map((instruction) => (
                                            <SelectItem key={instruction.id + "_class_name"} value={instruction.id.toString()}>
                                                {instruction.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>


                            <div className="space-y-2">
                                <Label htmlFor="topic">Topic</Label>
                                <Input
                                    id="topic"
                                    placeholder="e.g., Algebra, Geography..."
                                    value={questionData?.topic ?? ""}
                                    onChange={function (e) {
                                        handleInputChange("topic", e.target.value)
                                        setData("topic", e.target.value)
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-2">Question Preview</h3>
                            <p className="text-sm text-muted-foreground">
                                This is how students will see your question
                            </p>
                        </div>

                        <Card className="bg-accent/20">
                            <CardHeader>
                                <CardTitle className="text-lg">Question Preview</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <MathPreview
                                        content={questionData?.question ?? ""}
                                        className="font-medium mb-3 prose prose-sm max-w-none"
                                    />
                                    <br />
                                    <div className="grid gap-2">
                                        {Object.entries({
                                            A: questionData?.a ?? "",
                                            B: questionData?.b ?? "",
                                            C: questionData?.c ?? "",
                                            D: questionData?.d ?? ""
                                        }).map(([key, value]) => (
                                            <div
                                                key={key}
                                                className={`p-3 rounded-lg border ${questionData?.correct_option === key
                                                    ? "border-success bg-success/5 text-success-foreground"
                                                    : "border-border bg-muted/20"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{key}.</span>
                                                    <MathPreview
                                                        content={value || `Option ${key}`}
                                                        className="flex-1"
                                                    />
                                                    {questionData.correct_option === key && (
                                                        <span className="ml-2 text-xs text-success">(Correct Answer)</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4 text-sm text-muted-foreground">
                                    <span>Difficulty: <strong>{questionData?.difficulty ?? "Easy"}</strong></span>
                                    {questionData?.topic && (
                                        <span>Topic: <strong>{questionData?.topic}</strong></span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                );

            default:
                return null;
        }
    };




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
                        <h1 className="text-3xl font-bold"> {question?.id ? "Update" : "Add new"} Question</h1>
                        <p className="text-muted-foreground">
                            {question?.id ? "Update question" : "Create a new question"} for your test container
                        </p>
                    </div>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            {steps.map((step, index) => (
                                <div key={step.id} className="flex items-center">
                                    <div className="flex items-center">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === step.id
                                                ? "bg-primary text-primary-foreground"
                                                : isStepComplete(step.id)
                                                    ? "bg-success text-success-foreground"
                                                    : "bg-muted text-muted-foreground"
                                                }`}
                                        >
                                            {step.id}
                                        </div>
                                        <div className="ml-2 hidden sm:block">
                                            <p className="text-sm font-medium">{step.name}</p>
                                            <p className="text-xs text-muted-foreground">{step.description}</p>
                                        </div>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className="w-8 sm:w-20 h-px bg-border mx-4" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{steps[currentStep - 1].name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {renderStepContent()}
                    </CardContent>
                </Card>
                <div className="flex items-center gap-4">
                    {Object.values(errors).flat().map((err, index) => (
                        <p key={index} className={"text-sm text-red-600 dark:text-red-400"}> {err}</p>
                    ))}
                </div>
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                        disabled={currentStep === 1}
                    >
                        Previous
                    </Button>

                    <div className="flex items-center gap-2">
                        {currentStep === 4 ? (
                            <Button onClick={handleSubmit} disabled={processing}>
                                {processing && (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                )}
                                {!processing && (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Question
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
                            >
                                Next
                            </Button>
                        )}
                    </div>
                </div>

            </div>
        </AdminLayout>
    )
}
