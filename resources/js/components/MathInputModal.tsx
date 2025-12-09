import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calculator, Eye } from 'lucide-react';
import MathPreview from './MathPreview';

interface MathInputModalProps {
  onInsert: (latex: string, display?: boolean) => void;
  trigger?: React.ReactNode;
}

const MathInputModal = ({ onInsert, trigger }: MathInputModalProps) => {
  const [latex, setLatex] = useState('');
  const [isDisplay, setIsDisplay] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleInsert = () => {
    if (latex.trim()) {
      onInsert(latex.trim(), isDisplay);
      setLatex('');
      setIsOpen(false);
    }
  };

  const examples = [
    { label: 'Fraction', latex: '\\frac{a}{b}' },
    { label: 'Square Root', latex: '\\sqrt{x}' },
    { label: 'Power', latex: 'x^{2}' },
    { label: 'Subscript', latex: 'x_{1}' },
    { label: 'Sum', latex: '\\sum_{i=1}^{n} x_i' },
    { label: 'Integral', latex: '\\int_{a}^{b} f(x) dx' },
    { label: 'Matrix', latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
    { label: 'Greek Letters', latex: '\\alpha, \\beta, \\gamma, \\delta' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Calculator className="h-4 w-4 mr-2" />
            Insert Equation
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Insert Mathematical Equation
          </DialogTitle>
          <DialogDescription>
            Enter LaTeX formula to insert mathematical expressions into your content.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="latex">LaTeX Formula</Label>
                <Textarea
                  id="latex"
                  placeholder="Enter LaTeX formula here..."
                  value={latex}
                  onChange={(e) => setLatex(e.target.value)}
                  className="font-mono"
                  rows={4}
                />
              </div>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={!isDisplay}
                    onChange={() => setIsDisplay(false)}
                  />
                  <span className="text-sm">Inline (within text)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={isDisplay}
                    onChange={() => setIsDisplay(true)}
                  />
                  <span className="text-sm">Display (centered block)</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </Label>
              <div className="min-h-[100px] p-4 border rounded-lg bg-muted/20">
                {latex ? (
                  <MathPreview 
                    content={isDisplay ? `$$${latex}$$` : `$${latex}$`}
                    className="text-center"
                  />
                ) : (
                  <p className="text-muted-foreground text-sm">Enter LaTeX to see preview</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Common Examples (click to use)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {examples.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-2 px-3 flex flex-col items-center gap-1"
                  onClick={() => setLatex(example.latex)}
                >
                  <span className="font-medium">{example.label}</span>
                  <MathPreview 
                    content={`$${example.latex}$`}
                    className="text-xs"
                  />
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInsert} disabled={!latex.trim()}>
              Insert Equation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MathInputModal;