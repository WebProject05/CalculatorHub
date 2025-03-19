
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { 
  Fraction, 
  addFractions, 
  subtractFractions, 
  multiplyFractions, 
  divideFractions,
  simplifyFraction,
  formatFraction
} from "@/utils/calculators";
import CalculatorTemplate from "@/utils/CalculatorTemplate";
import { Plus, Minus, X, Divide } from "lucide-react";

const FractionCalculator = () => {
  // State for input fractions
  const [numerator1, setNumerator1] = useState<number>(1);
  const [denominator1, setDenominator1] = useState<number>(2);
  const [numerator2, setNumerator2] = useState<number>(1);
  const [denominator2, setDenominator2] = useState<number>(4);
  const [operation, setOperation] = useState<"add" | "subtract" | "multiply" | "divide">("add");
  
  // State for result
  const [result, setResult] = useState<Fraction | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Calculate result
  const calculateResult = () => {
    // Validate inputs
    if (denominator1 === 0 || denominator2 === 0) {
      toast.error("Denominator cannot be zero");
      return;
    }

    // Create fraction objects
    const fraction1: Fraction = {
      numerator: numerator1,
      denominator: denominator1
    };

    const fraction2: Fraction = {
      numerator: numerator2,
      denominator: denominator2
    };

    // Perform operation
    let calculatedResult: Fraction;

    switch (operation) {
      case "add":
        calculatedResult = addFractions(fraction1, fraction2);
        break;
      case "subtract":
        calculatedResult = subtractFractions(fraction1, fraction2);
        break;
      case "multiply":
        calculatedResult = multiplyFractions(fraction1, fraction2);
        break;
      case "divide":
        if (fraction2.numerator === 0) {
          toast.error("Cannot divide by zero");
          return;
        }
        calculatedResult = divideFractions(fraction1, fraction2);
        break;
      default:
        calculatedResult = addFractions(fraction1, fraction2);
    }

    setResult(calculatedResult);
    setShowResults(true);
    toast.success("Calculation completed");
  };

  // Reset calculator
  const handleReset = () => {
    setNumerator1(1);
    setDenominator1(2);
    setNumerator2(1);
    setDenominator2(4);
    setOperation("add");
    setResult(null);
    setShowResults(false);
    toast.info("Calculator has been reset");
  };

  // Render input form
  const renderInputs = () => {
    return (
      <div className="space-y-6">
        {/* First Fraction */}
        <div>
          <Label className="mb-2 block">First Fraction</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={numerator1}
              onChange={(e) => setNumerator1(parseInt(e.target.value) || 0)}
              className="w-20"
            />
            <div className="h-[2px] w-8 bg-primary"></div>
            <Input
              type="number"
              value={denominator1}
              onChange={(e) => setDenominator1(parseInt(e.target.value) || 1)}
              className="w-20"
            />
          </div>
        </div>

        {/* Operation Selection */}
        <div>
          <Label className="mb-2 block">Operation</Label>
          <RadioGroup
            value={operation}
            onValueChange={(value) => setOperation(value as "add" | "subtract" | "multiply" | "divide")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="add" id="add" />
              <Label htmlFor="add" className="flex items-center space-x-1 cursor-pointer">
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="subtract" id="subtract" />
              <Label htmlFor="subtract" className="flex items-center space-x-1 cursor-pointer">
                <Minus className="h-4 w-4" />
                <span>Subtract</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="multiply" id="multiply" />
              <Label htmlFor="multiply" className="flex items-center space-x-1 cursor-pointer">
                <X className="h-4 w-4" />
                <span>Multiply</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="divide" id="divide" />
              <Label htmlFor="divide" className="flex items-center space-x-1 cursor-pointer">
                <Divide className="h-4 w-4" />
                <span>Divide</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Second Fraction */}
        <div>
          <Label className="mb-2 block">Second Fraction</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={numerator2}
              onChange={(e) => setNumerator2(parseInt(e.target.value) || 0)}
              className="w-20"
            />
            <div className="h-[2px] w-8 bg-primary"></div>
            <Input
              type="number"
              value={denominator2}
              onChange={(e) => setDenominator2(parseInt(e.target.value) || 1)}
              className="w-20"
            />
          </div>
        </div>
      </div>
    );
  };

  // Render results
  const renderResults = () => {
    if (!result) return null;

    const operationSymbol = {
      add: "+",
      subtract: "-",
      multiply: "×",
      divide: "÷"
    }[operation];

    return (
      <div className="space-y-6">
        {/* Result Display */}
        <div className="p-6 bg-secondary rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-1">Result</p>
          <div className="flex items-center justify-center gap-x-4 mb-6">
            <div className="flex flex-col items-center">
              <div className="text-2xl">{numerator1}</div>
              <div className="h-[2px] w-12 my-1 bg-foreground"></div>
              <div className="text-2xl">{denominator1}</div>
            </div>
            <div className="text-2xl">{operationSymbol}</div>
            <div className="flex flex-col items-center">
              <div className="text-2xl">{numerator2}</div>
              <div className="h-[2px] w-12 my-1 bg-foreground"></div>
              <div className="text-2xl">{denominator2}</div>
            </div>
            <div className="text-2xl">=</div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold">{result.numerator}</div>
              {result.denominator !== 1 && (
                <>
                  <div className="h-[2px] w-16 my-1 bg-primary"></div>
                  <div className="text-3xl font-bold">{result.denominator}</div>
                </>
              )}
            </div>
          </div>
          <p className="text-lg">
            {formatFraction({numerator: numerator1, denominator: denominator1})} {operationSymbol} {formatFraction({numerator: numerator2, denominator: denominator2})} = {formatFraction(result)}
          </p>
        </div>

        {/* Explanation */}
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium mb-2">Explanation</h3>
          <div className="space-y-2 text-sm">
            {operation === "add" && (
              <p>
                To add fractions, we need a common denominator. The common denominator is {result.denominator}.
                After converting to equivalent fractions with the same denominator, we add the numerators.
              </p>
            )}
            {operation === "subtract" && (
              <p>
                To subtract fractions, we need a common denominator. The common denominator is {result.denominator}.
                After converting to equivalent fractions with the same denominator, we subtract the numerators.
              </p>
            )}
            {operation === "multiply" && (
              <p>
                To multiply fractions, we multiply the numerators together and the denominators together.
                {numerator1} × {numerator2} = {numerator1 * numerator2} for the numerator,
                and {denominator1} × {denominator2} = {denominator1 * denominator2} for the denominator.
              </p>
            )}
            {operation === "divide" && (
              <p>
                To divide fractions, we multiply the first fraction by the reciprocal of the second.
                {numerator1}/{denominator1} ÷ {numerator2}/{denominator2} = {numerator1}/{denominator1} × {denominator2}/{numerator2}
              </p>
            )}
            {result.numerator !== 0 && result.denominator !== 1 && (
              <p className="mt-2">
                The result can {result.numerator % result.denominator === 0 ? "be" : "also be"} expressed as a decimal: {(result.numerator / result.denominator).toFixed(4)}
              </p>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Fraction Facts</h3>
          <ul className="text-sm space-y-2 list-disc list-inside">
            <li>A proper fraction has a numerator less than its denominator (e.g. 3/4).</li>
            <li>An improper fraction has a numerator greater than or equal to its denominator (e.g. 5/4).</li>
            <li>A mixed number combines a whole number and a proper fraction (e.g. 1 1/4).</li>
            <li>Two fractions are equivalent if they represent the same value (e.g. 1/2 = 2/4 = 3/6).</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <CalculatorTemplate
      title="Fraction Calculator"
      description="Add, subtract, multiply, and divide fractions with step-by-step solutions."
      category="math"
      renderInputs={renderInputs}
      renderResults={renderResults}
      handleCalculate={calculateResult}
      handleReset={handleReset}
      showResults={showResults}
    />
  );
};

export default FractionCalculator;
