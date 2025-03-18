
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { Calculator, calculators } from "@/data/calculators";
import { ArrowLeft, Construction, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { downloadAsPDF } from "@/utils/pdfUtils";

const PlaceholderCalculator = () => {
  const location = useLocation();
  const [calculator, setCalculator] = useState<Calculator | null>(null);

  useEffect(() => {
    // Find the calculator that matches the current path
    const currentCalculator = calculators.find(calc => calc.path === location.pathname);
    
    if (currentCalculator) {
      setCalculator(currentCalculator);
      document.title = `${currentCalculator.title} | Calculator Hub`;
    } else {
      document.title = "Calculator | Calculator Hub";
    }
    
    // Show a toast to indicate this is a placeholder
    toast.info("This calculator is coming soon!", { duration: 5000 });
  }, [location.pathname]);

  const handleDownloadPDF = () => {
    downloadAsPDF('calculator-placeholder', 'calculator-preview.pdf');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{calculator?.title || "Calculator"}</h1>
        <p className="text-muted-foreground">
          {calculator?.description || "This calculator will be available soon."}
        </p>
      </div>
      
      <Card id="calculator-placeholder" className="shadow-sm mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Construction className="h-5 w-5 mr-2" /> 
            Coming Soon
          </CardTitle>
          <CardDescription>
            This calculator is under development and will be available soon
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="p-8 bg-secondary rounded-lg text-center space-y-4">
            {calculator?.icon && (
              <div className="text-6xl mx-auto mb-6">
                {calculator.icon}
              </div>
            )}
            
            <h2 className="text-2xl font-bold">{calculator?.title || "Calculator"}</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              We're working hard to bring you this calculator. Check back soon for the full functionality!
            </p>

            <div className="p-6 mt-4 border border-dashed border-border rounded-lg bg-background">
              <h3 className="text-lg font-medium mb-3">Features Coming Soon</h3>
              <ul className="text-sm text-muted-foreground space-y-2 text-left list-disc list-inside">
                <li>Interactive calculation with instant results</li>
                <li>Detailed explanation of formulas used</li>
                <li>Visual charts and graphs to visualize data</li>
                <li>Ability to save and download results</li>
                <li>Mobile-friendly responsive design</li>
              </ul>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Link to="/" className="w-full">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Calculators
            </Button>
          </Link>
          <Button 
            className="w-full"
            onClick={handleDownloadPDF}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Preview
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PlaceholderCalculator;
