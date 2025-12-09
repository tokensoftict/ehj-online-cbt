import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface ClassGroup {
    id: number
    name: string
    status: boolean
    created_at: string
    updated_at: string
}


export interface ClassName {
    id: number
    name: string
    status: boolean
    created_at: string
    updated_at: string
}


export interface Section {
    id: number
    name: string
    status: boolean
    created_at: string
    updated_at: string
}


export interface GeneralSubjects {
    id: number
    name: string
    status: boolean
    created_at: string
    updated_at: string
}


export interface StudentClasses {
    id: number
    class_name_id: number
    class_section_id: number
    class_group_id: number
    status: boolean
    created_at: string
    updated_at: string
    class_group: ClassGroup
    class_name: ClassName
    class_section: Section
}


export interface QuestionBank {
    id: number
    name: string
    student_class_id: number
    general_subject_id: number
    subject : string
    class : string
    questions : string
    status : string
    created_at: string
    updated_at: string
}


export interface Question {
    id: number
    question: string,
    question_info_id : number
    question_instruction_id : number | null,
    question_no : number
    a : string
    b : string
    c : string
    d : string
    correct_option : string
    date_added : string
    created_at : string
    updated_at: string,
    difficulty : "Easy" | "Medium" | "Hard",
    topic : ""
}
