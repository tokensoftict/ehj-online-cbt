import { useState } from 'react';
import { Button } from '@/components/template-ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/template-ui/dialog';
import { LoaderCircle } from 'lucide-react';
import { router } from '@inertiajs/react';

interface ConfirmDeleteDialogProps {
    deleteUrl: string;
    trigger: React.ReactNode;
    onSuccess?: () => void;
    title?: string;
    description?: string;
}

export default function ConfirmDeleteDialog({
                                                deleteUrl,
                                                trigger,
                                                onSuccess,
                                                title = "Confirm Delete?",
                                                description = "Are you sure you want to delete this item? This action cannot be undone.",
                                            }: ConfirmDeleteDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = () => {
        setLoading(true);
        router.delete(deleteUrl, {
            onSuccess: () => {
                setLoading(false);
                setOpen(false);
                onSuccess?.();
            },
            onError: () => {
                setLoading(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                        {loading && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

