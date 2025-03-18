
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";
import { downloadAsPDF } from "@/utils/pdfUtils";

interface CalculatorTemplateProps {
  title: string;
  description: string;
  category: string;
  renderInputs: () => React.ReactNode;
  renderResults: () => React.ReactNode;
  handleCalculate: () => void;
  handleReset: () => void;
  showResults: boolean;
}

const CalculatorTemplate = ({
  title,
  description,
  category,
  renderInputs,
  renderResults,
  handleCalculate,
  handleReset,
  showResults
}: CalculatorTemplateProps) => {
  
  const handleDownloadPDF = () => {
    downloadAsPDF('calculator-results', `${title.toLowerCase().replace(/\s+/g, '-')}-results.pdf`);
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Input Form */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Enter Details</CardTitle>
            <CardDescription>
              Adjust values to calculate results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderInputs()}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleReset} className="w-full flex items-center gap-2 mr-2">
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
            <Button onClick={handleCalculate} className="w-full flex items-center gap-2 ml-2">
              <Send className="h-4 w-4" />
              Calculate
            </Button>
          </CardFooter>
        </Card>
        
        {/* Results */}
        <Card id="calculator-results" className={`lg:col-span-3 shadow-sm transition-opacity duration-500 ${showResults ? 'opacity-100' : 'opacity-50'}`}>
          <CardHeader>
            <CardTitle>{title} Results</CardTitle>
            <CardDescription>
              Calculated results based on your inputs
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {renderResults()}
          </CardContent>
          
          {showResults && (
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2"
                onClick={handleDownloadPDF}
              >
                <Download className="h-4 w-4" />
                Download PDF Report
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CalculatorTemplate;
