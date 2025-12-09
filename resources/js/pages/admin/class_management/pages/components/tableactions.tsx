import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Button } from '@/components/template-ui/button';
import ConfirmDeleteDialog from '@/components/template-ui/delete-dialog-component';
import { Edit, Trash2, ChevronDown } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface ExtraActionBase {
    label: string;
    icon?: any;
}

interface ExtraLinkAction extends ExtraActionBase {
    type: "link";
    href: string;
}

interface ExtraButtonAction extends ExtraActionBase {
    type: "button";
    onClick: () => void;
}

type ExtraAction = ExtraLinkAction | ExtraButtonAction;

interface TableActionsProps {
    onEdit?: () => void;
    deleteUrl?: string;
    onDeleteSuccess?: () => void;
    extraActions?: ExtraAction[];
}

const TableActions = ({ onEdit, deleteUrl, onDeleteSuccess, extraActions = [] }: TableActionsProps) => (
    <Menu as="div" className="relative inline-block text-left">
        <Menu.Button as={Button} variant="outline" className="flex items-center gap-2">
            Action <ChevronDown className="h-4 w-4" />
        </Menu.Button>

        <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-card shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
                <div className="py-1 flex flex-col">

                    {/* EDIT */}
                    {onEdit && (
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={onEdit}
                                    className={`${active ? 'bg-muted/50' : ''} flex w-full items-center gap-2 px-4 py-2 text-sm`}
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </button>
                            )}
                        </Menu.Item>
                    )}

                    {/* DELETE */}
                    {deleteUrl && (
                        <div className="w-full">
                            <ConfirmDeleteDialog
                                deleteUrl={deleteUrl}
                                onSuccess={onDeleteSuccess}
                                trigger={
                                    <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted/50">
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                    </button>
                                }
                            />
                        </div>
                    )}

                    {/* DYNAMIC EXTRA ACTIONS */}
                    {extraActions.map((item, index) => {
                        const Icon = item.icon;

                        if (item.type === "link") {
                            return (
                                <Menu.Item key={index}>
                                    {({ active }) => (
                                        <Link
                                            href={item.href}
                                            className={`${active ? 'bg-muted/50' : ''} flex w-full items-center gap-2 px-4 py-2 text-sm`}
                                        >
                                            {Icon && <Icon className="h-4 w-4" />}
                                            {item.label}
                                        </Link>
                                    )}
                                </Menu.Item>
                            );
                        }

                        if (item.type === "button") {
                            return (
                                <Menu.Item key={index}>
                                    {({ active }) => (
                                        <button
                                            onClick={item.onClick}
                                            className={`${active ? 'bg-muted/50' : ''} flex w-full items-center gap-2 px-4 py-2 text-sm`}
                                        >
                                            {Icon && <Icon className="h-4 w-4" />}
                                            {item.label}
                                        </button>
                                    )}
                                </Menu.Item>
                            );
                        }

                        return null;
                    })}

                </div>
            </Menu.Items>
        </Transition>
    </Menu>
);

export default TableActions;
