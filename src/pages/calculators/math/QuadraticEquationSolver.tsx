
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { solveQuadraticEquation, formatNumber } from "@/utils/calculators";
import CalculatorTemplate from "@/utils/CalculatorTemplate";

const QuadraticEquationSolver = () => {
  // State for coefficients
  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(3);
  const [c, setC] = useState<number>(-4);
  
  // Results
  const [discriminant, setDiscriminant] = useState<number | null>(null);
  const [x1, setX1] = useState<number | null>(null);
  const [x2, setX2] = useState<number | null>(null);
  const [hasRealRoots, setHasRealRoots] = useState<boolean>(false);
  const [hasComplexRoots, setHasComplexRoots] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Calculate roots
  const calculateRoots = () => {
    try {
      // Check if a is zero (not a quadratic equation)
      if (a === 0) {
        toast.error("Coefficient 'a' cannot be zero (not a quadratic equation)");
        return;
      }
      
      // Solve the equation
      const result = solveQuadraticEquation(a, b, c);
      
      setDiscriminant(result.discriminant);
      setX1(result.x1);
      setX2(result.x2);
      setHasRealRoots(result.hasRealRoots);
      setHasComplexRoots(result.hasComplexRoots);
      
      setShowResults(true);
      toast.success("Equation solved successfully");
    } catch (error) {
      console.error("Error solving quadratic equation:", error);
      toast.error("Error in calculation. Please check your inputs.");
    }
  };

  // Reset calculator
  const handleReset = () => {
    setA(1);
    setB(3);
    setC(-4);
    setDiscriminant(null);
    setX1(null);
    setX2(null);
    setHasRealRoots(false);
    setHasComplexRoots(false);
    setShowResults(false);
    toast.info("Calculator has been reset");
  };

  // Format equation for display
  const formatEquation = (): string => {
    let equation = "";
    
    // First term (ax²)
    if (a === 1) equation += "x²";
    else if (a === -1) equation += "-x²";
    else equation += `${a}x²`;
    
    // Second term (bx)
    if (b !== 0) {
      const sign = b > 0 ? "+" : "";
      if (b === 1) equation += ` ${sign} x`;
      else if (b === -1) equation += " - x";
      else equation += ` ${sign} ${b}x`;
    }
    
    // Third term (c)
    if (c !== 0) {
      const sign = c > 0 ? "+" : "";
      equation += ` ${sign} ${c}`;
    }
    
    // Set equal to zero
    equation += " = 0";
    
    return equation;
  };

  // Render input form
  const renderInputs = () => {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-secondary rounded-lg text-center">
          <p className="text-lg font-medium mb-2">Quadratic Equation</p>
          <p className="text-2xl font-mono mb-4">{formatEquation()}</p>
          <p className="text-sm text-muted-foreground">
            Standard form: ax² + bx + c = 0
          </p>
        </div>
        
        {/* Coefficient a */}
        <div className="space-y-2">
          <Label htmlFor="a">Coefficient a</Label>
          <Input
            id="a"
            type="number"
            value={a}
            onChange={(e) => setA(parseFloat(e.target.value) || 0)}
            step="0.1"
          />
        </div>
        
        {/* Coefficient b */}
        <div className="space-y-2">
          <Label htmlFor="b">Coefficient b</Label>
          <Input
            id="b"
            type="number"
            value={b}
            onChange={(e) => setB(parseFloat(e.target.value) || 0)}
            step="0.1"
          />
        </div>
        
        {/* Coefficient c */}
        <div className="space-y-2">
          <Label htmlFor="c">Coefficient c</Label>
          <Input
            id="c"
            type="number"
            value={c}
            onChange={(e) => setC(parseFloat(e.target.value) || 0)}
            step="0.1"
          />
        </div>
      </div>
    );
  };

  // Render results
  const renderResults = () => {
    // Format complex roots if needed
    const formatComplexRoot = (index: number): string => {
      if (!hasComplexRoots || discriminant === null) return "N/A";
      
      const realPart = -b / (2 * a);
      const imaginaryPart = Math.sqrt(Math.abs(discriminant)) / (2 * a);
      
      const sign = index === 1 ? "+" : "-";
      return `${formatNumber(realPart, 4)} ${sign} ${formatNumber(imaginaryPart, 4)}i`;
    };

    return (
      <div className="space-y-6">
        {/* Results Display */}
        <div className="p-6 bg-secondary rounded-lg">
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground mb-1">Equation</p>
            <p className="text-xl font-mono">{formatEquation()}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Discriminant (Δ = b² - 4ac)</p>
              <p className="text-xl font-medium">{discriminant !== null ? formatNumber(discriminant, 4) : "N/A"}</p>
            </div>
            
            {hasRealRoots && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">First Root (x₁)</p>
                  <p className="text-xl font-medium">{x1 !== null ? formatNumber(x1, 4) : "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Second Root (x₂)</p>
                  <p className="text-xl font-medium">{x2 !== null ? formatNumber(x2, 4) : "N/A"}</p>
                </div>
              </div>
            )}
            
            {hasComplexRoots && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">First Root (x₁)</p>
                  <p className="text-xl font-medium">{formatComplexRoot(1)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Second Root (x₂)</p>
                  <p className="text-xl font-medium">{formatComplexRoot(2)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Explanation */}
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium mb-2">How It's Solved</h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Step 1:</strong> Calculate the discriminant (Δ) using the formula:
            </p>
            <p className="my-2 font-mono">
              Δ = b² - 4ac = {b}² - 4 × {a} × {c} = {discriminant}
            </p>
            
            <p>
              <strong>Step 2:</strong> Determine the type of roots based on the discriminant:
            </p>
            <ul className="list-disc list-inside my-2">
              <li>If Δ > 0: Two distinct real roots</li>
              <li>If Δ = 0: One real root (repeated)</li>
              <li>If Δ < 0: Two complex conjugate roots</li>
            </ul>
            
            <p>
              <strong>Step 3:</strong> Calculate the roots using the quadratic formula:
            </p>
            <p className="my-2 font-mono">
              x = (-b ± √Δ) / (2a)
            </p>
            
            {hasRealRoots && (
              <div className="mt-4">
                <p>For this equation with Δ = {discriminant}:</p>
                <p className="my-1">
                  x₁ = (-{b} + √{discriminant}) / (2 × {a}) = {x1 !== null ? formatNumber(x1, 4) : "N/A"}
                </p>
                <p className="my-1">
                  x₂ = (-{b} - √{discriminant}) / (2 × {a}) = {x2 !== null ? formatNumber(x2, 4) : "N/A"}
                </p>
              </div>
            )}
            
            {hasComplexRoots && (
              <div className="mt-4">
                <p>For this equation with Δ = {discriminant} (negative discriminant):</p>
                <p className="my-1">
                  x₁ = -{b}/(2×{a}) + i×√(|{discriminant}|)/(2×{a}) = {formatComplexRoot(1)}
                </p>
                <p className="my-1">
                  x₂ = -{b}/(2×{a}) - i×√(|{discriminant}|)/(2×{a}) = {formatComplexRoot(2)}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Additional Information */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Quadratic Equation Facts</h3>
          <ul className="text-sm space-y-2 list-disc list-inside">
            <li>The general form of a quadratic equation is ax² + bx + c = 0, where a ≠ 0.</li>
            <li>The solutions to a quadratic equation are called roots or zeros.</li>
            <li>The sum of the roots equals -b/a.</li>
            <li>The product of the roots equals c/a.</li>
            <li>The graph of a quadratic equation is a parabola. The roots are the x-intercepts of this parabola.</li>
            <li>The axis of symmetry of the parabola is at x = -b/(2a).</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <CalculatorTemplate
      title="Quadratic Equation Solver"
      description="Solve quadratic equations and find the roots with step-by-step explanation."
      category="math"
      renderInputs={renderInputs}
      renderResults={renderResults}
      handleCalculate={calculateRoots}
      handleReset={handleReset}
      showResults={showResults}
    />
  );
};

export default QuadraticEquationSolver;
