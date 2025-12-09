import { useEffect, useRef, useState } from 'react';
import { Calculator } from 'lucide-react';
import MathInputModal from './MathInputModal';

// MathJax configuration
declare global {
  interface Window {
    MathJax: any;
  }
}

interface CKEditorProps {
  data: string;
  onChange: (data: string) => void;
  placeholder?: string;
}

const CKEditor = ({ data, onChange, placeholder }: CKEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);
  const [showMathModal, setShowMathModal] = useState(false);

  useEffect(() => {
    let editorInstance: any = null;

    const initMathJax = () => {
      if (!window.MathJax) {
        window.MathJax = {
          tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            displayMath: [['$$', '$$'], ['\\[', '\\]']],
            processEscapes: true,
            processEnvironments: true
          },
          options: {
            ignoreHtmlClass: 'tex2jax_ignore',
            processHtmlClass: 'tex2jax_process'
          },
          startup: {
            typeset: false,
            ready: () => {
              window.MathJax.startup.defaultReady();
              console.log('MathJax is ready!');
            }
          }
        };

        const script = document.createElement('script');
        script.src = 'https://polyfill.io/v3/polyfill.min.js?features=es6';
        document.head.appendChild(script);

        const mathJaxScript = document.createElement('script');
        mathJaxScript.id = 'MathJax-script';
        mathJaxScript.async = true;
        mathJaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
        document.head.appendChild(mathJaxScript);
      }
    };

    const initEditor = async () => {
      try {
        // Initialize MathJax first
        initMathJax();

        const { default: ClassicEditor } = await import('@ckeditor/ckeditor5-build-classic');
        
        if (editorRef.current) {
          editorInstance = await ClassicEditor.create(editorRef.current, {
            placeholder: placeholder || 'Enter content here...',
            toolbar: [
              'heading',
              '|',
              'bold',
              'italic',
              '|',
              'bulletedList',
              'numberedList',
              '|',
              'indent',
              'outdent',
              '|',
              'link',
              'insertTable',
              '|',
              'undo',
              'redo'
            ],
            heading: {
              options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
              ]
            }
          });

          editorInstance.setData(data);
          
          editorInstance.model.document.on('change:data', () => {
            const content = editorInstance.getData();
            onChange(content);
            
            // Debounced MathJax rendering
            clearTimeout((window as any).mathJaxTimeout);
            (window as any).mathJaxTimeout = setTimeout(() => {
              renderMathInEditor();
            }, 300);
          });

          // Initial MathJax rendering
          setTimeout(() => {
            renderMathInEditor();
          }, 500);

          setEditor(editorInstance);
        }
      } catch (error) {
        console.error('Error initializing CKEditor:', error);
      }
    };

    initEditor();

    return () => {
      if (editorInstance) {
        editorInstance.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (editor && editor.getData() !== data) {
      editor.setData(data);
      
      // Re-render MathJax when data changes
      setTimeout(() => {
        renderMathInEditor();
      }, 200);
    }
  }, [data, editor]);

  const renderMathInEditor = () => {
    if (window.MathJax && window.MathJax.typesetPromise && editorRef.current) {
      const editorContent = editorRef.current.querySelector('.ck-editor__editable');
      if (editorContent) {
        // Clear previous MathJax elements to avoid conflicts
        const oldMathElements = editorContent.querySelectorAll('.MathJax, mjx-container');
        oldMathElements.forEach(el => {
          const parent = el.parentNode;
          if (parent && el.previousSibling && el.previousSibling.nodeType === Node.TEXT_NODE) {
            // Keep the original LaTeX text
            const originalText = el.previousSibling.textContent;
            if (originalText && (originalText.includes('$') || originalText.includes('\\('))) {
              el.remove();
              return;
            }
          }
          el.remove();
        });

        window.MathJax.typesetPromise([editorContent]).then(() => {
          addMathClickHandlers(editorContent);
        }).catch((err: any) => {
          console.warn('MathJax typeset error:', err);
        });
      }
    }
  };

  const addMathClickHandlers = (container: Element) => {
    const mathElements = container.querySelectorAll('mjx-container');
    mathElements.forEach((mathEl) => {
      const htmlEl = mathEl as HTMLElement;
      
      htmlEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Try to find the original LaTeX
        const mathContent = htmlEl.getAttribute('jax') || '';
        if (mathContent) {
          const isDisplay = htmlEl.getAttribute('display') === 'true';
          
          // Store for modal to use
          (window as any).editingMath = { 
            latex: mathContent, 
            isDisplay, 
            element: htmlEl 
          };
          
          setShowMathModal(true);
        }
      });
      
      // Add visual hover effect
      htmlEl.style.cursor = 'pointer';
      htmlEl.addEventListener('mouseenter', () => {
        htmlEl.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
        htmlEl.style.borderRadius = '3px';
      });
      htmlEl.addEventListener('mouseleave', () => {
        htmlEl.style.backgroundColor = '';
        htmlEl.style.borderRadius = '';
      });
    });
  };

  const handleMathInsert = (latex: string, isDisplay = false) => {
    if (editor) {
      const mathFormula = isDisplay ? `$$${latex}$$` : `$${latex}$`;
      
      // Insert the math formula at the current cursor position
      editor.model.change((writer: any) => {
        const insertPosition = editor.model.document.selection.getFirstPosition();
        writer.insertText(mathFormula, insertPosition);
      });
      
      // Force MathJax rendering after inserting
      setTimeout(() => {
        renderMathInEditor();
      }, 100);
    }
  };

  return (
    <div className="ckeditor-wrapper">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          💡 <strong>Math formulas:</strong> Use the <Calculator className="inline h-4 w-4 mx-1" /> button in the toolbar to insert equations
        </div>
        <MathInputModal 
          onInsert={handleMathInsert}
          trigger={
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md hover:bg-accent transition-colors"
              onClick={() => setShowMathModal(true)}
            >
              <Calculator className="h-4 w-4" />
              Insert Math
            </button>
          }
        />
      </div>
      <div ref={editorRef} />
      <style>{`
        .ck-editor__editable {
          min-height: 200px;
        }
        .ckeditor-wrapper .ck.ck-toolbar {
          border-top: 1px solid hsl(var(--border));
          border-left: 1px solid hsl(var(--border));
          border-right: 1px solid hsl(var(--border));
          border-radius: 6px 6px 0 0;
          background: hsl(var(--background));
        }
        .ckeditor-wrapper .ck.ck-editor__main > .ck-editor__editable {
          border-left: 1px solid hsl(var(--border));
          border-right: 1px solid hsl(var(--border));
          border-bottom: 1px solid hsl(var(--border));
          border-radius: 0 0 6px 6px;
          background: hsl(var(--background));
          color: hsl(var(--foreground));
        }
        .ckeditor-wrapper .ck.ck-editor__editable:focus {
          border-color: hsl(var(--ring));
          box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
        }
        .ckeditor-wrapper .ck.ck-button {
          color: hsl(var(--foreground));
        }
        .ckeditor-wrapper .ck.ck-button:hover {
          background: hsl(var(--accent));
        }
        .ckeditor-wrapper .ck-editor__editable mjx-container {
          cursor: pointer;
          transition: background-color 0.2s;
          border-radius: 3px;
          padding: 1px 2px;
        }
        .ckeditor-wrapper .ck-editor__editable mjx-container:hover {
          background-color: hsl(var(--accent) / 0.3) !important;
        }
        .ckeditor-wrapper .ck-editor__editable .MathJax {
          cursor: pointer;
          transition: background-color 0.2s;
        }
      `}</style>
    </div>
  );
};

export default CKEditor;