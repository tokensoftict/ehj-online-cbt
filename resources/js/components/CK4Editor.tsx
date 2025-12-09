import React, { useEffect, useRef, useState } from 'react';
import {CKEditor} from 'ckeditor4-react';

interface CK4EditorProps {
    data: string;
    name: string;
    onChange?: (data: string) => void;
    placeholder?: string;
}

export default function MathEditor({ data, onChange, name ,placeholder }: CK4EditorProps) {

    return (
        <div className="ckeditor-wrapper">
            <div className="mt-3 items-center ">
                <CKEditor
                    initialValues={data}
                    name={name}
                    onChange={onChange}
                    config={{
                        toolbar: [
                            { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'Undo', 'Redo'] },
                            { name: 'editing', items: ['Find', 'Replace', 'SelectAll'] },
                            { name: 'links', items: ['Link', 'Unlink'] },
                            { name: 'insert', items: ['Image', 'Table', 'Mathjax'] },
                            { name: 'styles', items: ['Format', 'Font', 'FontSize'] },
                            { name: 'colors', items: ['TextColor', 'BGColor'] },
                            { name: 'basicstyles', items: ['Bold', 'Italic', 'Strike', 'RemoveFormat'] },
                            { name: 'paragraph', items: ['NumberedList', 'BulletedList', 'Blockquote', 'Outdent', 'Indent', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
                            { name: 'tools', items: ['Maximize'] },
                            { name: 'about', items: ['About'] }
                        ],
                        format_tags : 'p;h1;h2;h3;pre',
                        removeDialogTabs :  'image:advanced;link:advanced',
                        versionCheck : false,
                        extraPlugins: 'mathjax',
                        mathJaxLib: 'https://cdn.jsdelivr.net/npm/mathjax@2/MathJax.js?config=TeX-AMS_HTML',
                        height: 150,
                        removeButtons: 'PasteFromWord,Underline,Subscript,Superscript',
                    }}
                />
            </div>

        </div>
    );
}
