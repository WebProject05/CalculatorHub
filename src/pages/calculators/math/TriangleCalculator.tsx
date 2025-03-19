
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  calculateTriangleArea, 
  calculateTrianglePerimeter,
  calculateTriangleAreaWithSides,
  formatNumber
} from "@/utils/calculators";
import CalculatorTemplate from "@/utils/CalculatorTemplate";

const TriangleCalculator = () => {
  // State for calculation mode
  const [mode, setMode] = useState<"base-height" | "sides">("base-height");
  
  // Base-height inputs
  const [base, setBase] = useState<number>(5);
  const [height, setHeight] = useState<number>(4);
  
  // Three sides inputs
  const [sideA, setSideA] = useState<number>(3);
  const [sideB, setSideB] = useState<number>(4);
  const [sideC, setSideC] = useState<number>(5);
  
  // Results
  const [area, setArea] = useState<number | null>(null);
  const [perimeter, setPerimeter] = useState<number | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Calculate triangle properties
  const calculateTriangle = () => {
    try {
      if (mode === "base-height") {
        // Validate inputs
        if (base <= 0 || height <= 0) {
          toast.error("Base and height must be positive values");
          return;
        }
        
        // Calculate area using base and height
        const calculatedArea = calculateTriangleArea(base, height);
        setArea(calculatedArea);
        
        // We can't calculate perimeter with just base and height
        setPerimeter(null);
      } else {
        // Validate inputs
        if (sideA <= 0 || sideB <= 0 || sideC <= 0) {
          toast.error("All sides must be positive values");
          return;
        }
        
        // Check triangle inequality theorem
        if (sideA + sideB <= sideC || sideA + sideC <= sideB || sideB + sideC <= sideA) {
          toast.error("Invalid triangle: The sum of any two sides must be greater than the third side");
          return;
        }
        
        // Calculate area using Heron's formula
        const calculatedArea = calculateTriangleAreaWithSides(sideA, sideB, sideC);
        setArea(calculatedArea);
        
        // Calculate perimeter
        const calculatedPerimeter = calculateTrianglePerimeter(sideA, sideB, sideC);
        setPerimeter(calculatedPerimeter);
      }
      
      setShowResults(true);
      toast.success("Triangle properties calculated successfully");
    } catch (error) {
      console.error("Error calculating triangle properties:", error);
      toast.error("Error in calculation. Please check your inputs.");
    }
  };

  // Reset calculator
  const handleReset = () => {
    if (mode === "base-height") {
      setBase(5);
      setHeight(4);
    } else {
      setSideA(3);
      setSideB(4);
      setSideC(5);
    }
    
    setArea(null);
    setPerimeter(null);
    setShowResults(false);
    toast.info("Calculator has been reset");
  };

  // Render input form
  const renderInputs = () => {
    return (
      <div className="space-y-6">
        {/* Calculation Mode Selector */}
        <div>
          <Label className="mb-2 block">Calculation Method</Label>
          <Tabs 
            value={mode} 
            onValueChange={(value) => setMode(value as "base-height" | "sides")}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="base-height">Base & Height</TabsTrigger>
              <TabsTrigger value="sides">Three Sides</TabsTrigger>
            </TabsList>
            
            <TabsContent value="base-height" className="mt-4 space-y-4">
              {/* Base Input */}
              <div className="space-y-2">
                <Label htmlFor="base">Base Length</Label>
                <Input
                  id="base"
                  type="number"
                  value={base}
                  onChange={(e) => setBase(parseFloat(e.target.value) || 0)}
                  min={0.1}
                  step={0.1}
                />
              </div>
              
              {/* Height Input */}
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                  min={0.1}
                  step={0.1}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="sides" className="mt-4 space-y-4">
              {/* Side A Input */}
              <div className="space-y-2">
                <Label htmlFor="sideA">Side A</Label>
                <Input
                  id="sideA"
                  type="number"
                  value={sideA}
                  onChange={(e) => setSideA(parseFloat(e.target.value) || 0)}
                  min={0.1}
                  step={0.1}
                />
              </div>
              
              {/* Side B Input */}
              <div className="space-y-2">
                <Label htmlFor="sideB">Side B</Label>
                <Input
                  id="sideB"
                  type="number"
                  value={sideB}
                  onChange={(e) => setSideB(parseFloat(e.target.value) || 0)}
                  min={0.1}
                  step={0.1}
                />
              </div>
              
              {/* Side C Input */}
              <div className="space-y-2">
                <Label htmlFor="sideC">Side C</Label>
                <Input
                  id="sideC"
                  type="number"
                  value={sideC}
                  onChange={(e) => setSideC(parseFloat(e.target.value) || 0)}
                  min={0.1}
                  step={0.1}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  };

  // Render results
  const renderResults = () => {
    return (
      <div className="space-y-6">
        {/* Results Display */}
        <div className="p-6 bg-secondary rounded-lg text-center">
          {/* Triangle Illustration */}
          <div className="flex justify-center mb-6">
            <svg width="180" height="120" viewBox="0 0 180 120" className="border border-border p-2 bg-card">
              {mode === "base-height" ? (
                <>
                  {/* Base-height triangle */}
                  <polygon 
                    points="20,100 160,100 90,20" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                  />
                  {/* Height line */}
                  <line 
                    x1="90" y1="20" 
                    x2="90" y2="100" 
                    stroke="currentColor" 
                    strokeWidth="1" 
                    strokeDasharray="4,2" 
                  />
                  {/* Base label */}
                  <text x="85" y="115" fontSize="12" textAnchor="middle">Base: {base}</text>
                  {/* Height label */}
                  <text x="70" y="60" fontSize="12" textAnchor="end">Height: {height}</text>
                </>
              ) : (
                <>
                  {/* Three sides triangle */}
                  <polygon 
                    points="20,100 160,100 90,20" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                  />
                  {/* Side labels */}
                  <text x="85" y="115" fontSize="12" textAnchor="middle">Side C: {sideC}</text>
                  <text x="45" y="60" fontSize="12" textAnchor="middle">Side A: {sideA}</text>
                  <text x="135" y="60" fontSize="12" textAnchor="middle">Side B: {sideB}</text>
                </>
              )}
            </svg>
          </div>
          
          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Area</p>
              <p className="text-3xl font-bold">{area !== null ? formatNumber(area, 2) : "N/A"} square units</p>
            </div>
            
            {mode === "sides" && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Perimeter</p>
                <p className="text-3xl font-bold">{perimeter !== null ? formatNumber(perimeter, 2) : "N/A"} units</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Explanation */}
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium mb-2">How It's Calculated</h3>
          <div className="space-y-2 text-sm">
            {mode === "base-height" ? (
              <>
                <p>
                  <strong>Area Calculation:</strong> The area of a triangle is calculated using the formula:
                </p>
                <p className="my-2 text-center font-mono">
                  Area = (Base × Height) ÷ 2
                </p>
                <p>
                  With your inputs: Area = ({base} × {height}) ÷ 2 = {formatNumber(area || 0, 2)} square units
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>Area Calculation:</strong> When we have three sides (a={sideA}, b={sideB}, c={sideC}), we use Heron's formula:
                </p>
                <p className="my-2 text-center font-mono">
                  s = (a + b + c) ÷ 2<br/>
                  Area = √(s × (s-a) × (s-b) × (s-c))
                </p>
                <p>
                  Where s is the semi-perimeter, which equals ({sideA} + {sideB} + {sideC}) ÷ 2 = {(sideA + sideB + sideC) / 2}
                </p>
                <p className="mt-2">
                  <strong>Perimeter Calculation:</strong> The perimeter is simply the sum of all sides:
                </p>
                <p className="my-2 text-center font-mono">
                  Perimeter = a + b + c
                </p>
                <p>
                  With your inputs: Perimeter = {sideA} + {sideB} + {sideC} = {sideA + sideB + sideC} units
                </p>
              </>
            )}
          </div>
        </div>
        
        {/* Triangle Facts */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Triangle Facts</h3>
          <ul className="text-sm space-y-2 list-disc list-inside">
            <li>The sum of the interior angles of a triangle is always 180 degrees.</li>
            <li>A triangle with all sides equal is called an equilateral triangle.</li>
            <li>A triangle with two sides equal is called an isosceles triangle.</li>
            <li>A triangle with a right angle is called a right triangle.</li>
            <li>The Pythagorean theorem (a² + b² = c²) applies only to right triangles.</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <CalculatorTemplate
      title="Triangle Calculator"
      description="Calculate the area and perimeter of a triangle using different methods."
      category="math"
      renderInputs={renderInputs}
      renderResults={renderResults}
      handleCalculate={calculateTriangle}
      handleReset={handleReset}
      showResults={showResults}
    />
  );
};

export default TriangleCalculator;
