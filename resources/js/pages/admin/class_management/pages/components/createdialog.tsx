import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/template-ui/dialog';



const CreateDialog = ({
                          title,
                          children,
                          open,
                          setOpen,
                      }: {
    title: string;
   // trigger: React.ReactNode;
    children: React.ReactNode;
    open: boolean;
    setOpen: (value: boolean) => void;
}) => (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>
                    Fill in the details below to create a new item.
                </DialogDescription>
            </DialogHeader>

            {children}
        </DialogContent>
    </Dialog>
);


export default CreateDialog;
