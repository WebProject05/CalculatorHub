
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import CalculatorTemplate from "@/utils/CalculatorTemplate";

// Unit types and conversions
const unitTypes = [
  { id: "length", name: "Length" },
  { id: "weight", name: "Weight" },
  { id: "volume", name: "Volume" },
  { id: "temperature", name: "Temperature" },
  { id: "area", name: "Area" },
  { id: "speed", name: "Speed" },
  { id: "time", name: "Time" },
  { id: "digital", name: "Digital Storage" },
];

// Unit definitions by type
const unitDefinitions = {
  length: [
    { id: "meter", name: "Meter (m)", conversionFactor: 1 },
    { id: "kilometer", name: "Kilometer (km)", conversionFactor: 1000 },
    { id: "centimeter", name: "Centimeter (cm)", conversionFactor: 0.01 },
    { id: "millimeter", name: "Millimeter (mm)", conversionFactor: 0.001 },
    { id: "inch", name: "Inch (in)", conversionFactor: 0.0254 },
    { id: "foot", name: "Foot (ft)", conversionFactor: 0.3048 },
    { id: "yard", name: "Yard (yd)", conversionFactor: 0.9144 },
    { id: "mile", name: "Mile (mi)", conversionFactor: 1609.34 },
  ],
  weight: [
    { id: "kilogram", name: "Kilogram (kg)", conversionFactor: 1 },
    { id: "gram", name: "Gram (g)", conversionFactor: 0.001 },
    { id: "milligram", name: "Milligram (mg)", conversionFactor: 0.000001 },
    { id: "pound", name: "Pound (lb)", conversionFactor: 0.453592 },
    { id: "ounce", name: "Ounce (oz)", conversionFactor: 0.0283495 },
    { id: "ton", name: "Metric Ton (t)", conversionFactor: 1000 },
    { id: "stone", name: "Stone (st)", conversionFactor: 6.35029 },
  ],
  volume: [
    { id: "liter", name: "Liter (L)", conversionFactor: 1 },
    { id: "milliliter", name: "Milliliter (mL)", conversionFactor: 0.001 },
    { id: "cubicMeter", name: "Cubic Meter (m³)", conversionFactor: 1000 },
    { id: "gallon", name: "Gallon (US gal)", conversionFactor: 3.78541 },
    { id: "quart", name: "Quart (US qt)", conversionFactor: 0.946353 },
    { id: "pint", name: "Pint (US pt)", conversionFactor: 0.473176 },
    { id: "cup", name: "Cup (US cup)", conversionFactor: 0.24 },
    { id: "fluidOunce", name: "Fluid Ounce (US fl oz)", conversionFactor: 0.0295735 },
    { id: "tablespoon", name: "Tablespoon (tbsp)", conversionFactor: 0.0147868 },
    { id: "teaspoon", name: "Teaspoon (tsp)", conversionFactor: 0.00492892 },
  ],
  temperature: [
    { id: "celsius", name: "Celsius (°C)", conversionFactor: 1 },
    { id: "fahrenheit", name: "Fahrenheit (°F)", conversionFactor: 1 },
    { id: "kelvin", name: "Kelvin (K)", conversionFactor: 1 },
  ],
  area: [
    { id: "squareMeter", name: "Square Meter (m²)", conversionFactor: 1 },
    { id: "squareKilometer", name: "Square Kilometer (km²)", conversionFactor: 1000000 },
    { id: "squareCentimeter", name: "Square Centimeter (cm²)", conversionFactor: 0.0001 },
    { id: "squareMillimeter", name: "Square Millimeter (mm²)", conversionFactor: 0.000001 },
    { id: "squareInch", name: "Square Inch (in²)", conversionFactor: 0.00064516 },
    { id: "squareFoot", name: "Square Foot (ft²)", conversionFactor: 0.092903 },
    { id: "squareYard", name: "Square Yard (yd²)", conversionFactor: 0.836127 },
    { id: "acre", name: "Acre", conversionFactor: 4046.86 },
    { id: "hectare", name: "Hectare (ha)", conversionFactor: 10000 },
  ],
  speed: [
    { id: "metersPerSecond", name: "Meters per Second (m/s)", conversionFactor: 1 },
    { id: "kilometersPerHour", name: "Kilometers per Hour (km/h)", conversionFactor: 0.277778 },
    { id: "milesPerHour", name: "Miles per Hour (mph)", conversionFactor: 0.44704 },
    { id: "knot", name: "Knot (kn)", conversionFactor: 0.514444 },
    { id: "feetPerSecond", name: "Feet per Second (ft/s)", conversionFactor: 0.3048 },
  ],
  time: [
    { id: "second", name: "Second (s)", conversionFactor: 1 },
    { id: "minute", name: "Minute (min)", conversionFactor: 60 },
    { id: "hour", name: "Hour (h)", conversionFactor: 3600 },
    { id: "day", name: "Day (d)", conversionFactor: 86400 },
    { id: "week", name: "Week (wk)", conversionFactor: 604800 },
    { id: "month", name: "Month (avg)", conversionFactor: 2628000 },
    { id: "year", name: "Year (yr)", conversionFactor: 31536000 },
  ],
  digital: [
    { id: "byte", name: "Byte (B)", conversionFactor: 1 },
    { id: "kilobyte", name: "Kilobyte (KB)", conversionFactor: 1024 },
    { id: "megabyte", name: "Megabyte (MB)", conversionFactor: 1048576 },
    { id: "gigabyte", name: "Gigabyte (GB)", conversionFactor: 1073741824 },
    { id: "terabyte", name: "Terabyte (TB)", conversionFactor: 1099511627776 },
    { id: "petabyte", name: "Petabyte (PB)", conversionFactor: 1125899906842624 },
    { id: "bit", name: "Bit (b)", conversionFactor: 0.125 },
    { id: "kibibyte", name: "Kibibyte (KiB)", conversionFactor: 1024 },
    { id: "mebibyte", name: "Mebibyte (MiB)", conversionFactor: 1048576 },
    { id: "gibibyte", name: "Gibibyte (GiB)", conversionFactor: 1073741824 },
  ],
};

const UnitConverter = () => {
  const [unitType, setUnitType] = useState("length");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [inputValue, setInputValue] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);
  const [formula, setFormula] = useState<string>("");
  const [showResults, setShowResults] = useState(false);

  // Set default units when unit type changes
  const handleUnitTypeChange = (value: string) => {
    setUnitType(value);
    const units = unitDefinitions[value as keyof typeof unitDefinitions];
    setFromUnit(units[0].id);
    setToUnit(units[1].id);
    setResult(null);
    setShowResults(false);
  };

  // Convert temperature (special case)
  const convertTemperature = (value: number, from: string, to: string): number => {
    // Convert to Celsius first as intermediate step
    let celsius;
    
    if (from === "celsius") {
      celsius = value;
    } else if (from === "fahrenheit") {
      celsius = (value - 32) * (5/9);
    } else if (from === "kelvin") {
      celsius = value - 273.15;
    } else {
      return 0;
    }
    
    // Convert from Celsius to target unit
    if (to === "celsius") {
      return celsius;
    } else if (to === "fahrenheit") {
      return (celsius * (9/5)) + 32;
    } else if (to === "kelvin") {
      return celsius + 273.15;
    } else {
      return 0;
    }
  };

  // Generate formula for conversion
  const generateFormula = (value: number, from: string, to: string): string => {
    const fromUnit = unitDefinitions[unitType as keyof typeof unitDefinitions].find(u => u.id === from);
    const toUnit = unitDefinitions[unitType as keyof typeof unitDefinitions].find(u => u.id === to);
    
    if (!fromUnit || !toUnit) return "";
    
    if (unitType === "temperature") {
      if (from === "celsius" && to === "fahrenheit") {
        return `${value}°C × (9/5) + 32 = ${result?.toFixed(6)}°F`;
      } else if (from === "fahrenheit" && to === "celsius") {
        return `(${value}°F - 32) × (5/9) = ${result?.toFixed(6)}°C`;
      } else if (from === "celsius" && to === "kelvin") {
        return `${value}°C + 273.15 = ${result?.toFixed(6)}K`;
      } else if (from === "kelvin" && to === "celsius") {
        return `${value}K - 273.15 = ${result?.toFixed(6)}°C`;
      } else if (from === "fahrenheit" && to === "kelvin") {
        return `(${value}°F - 32) × (5/9) + 273.15 = ${result?.toFixed(6)}K`;
      } else if (from === "kelvin" && to === "fahrenheit") {
        return `(${value}K - 273.15) × (9/5) + 32 = ${result?.toFixed(6)}°F`;
      } else {
        return `${value} ${fromUnit.name} = ${result?.toFixed(6)} ${toUnit.name}`;
      }
    } else {
      return `${value} ${fromUnit.name} × ${(toUnit.conversionFactor / fromUnit.conversionFactor).toFixed(6)} = ${result?.toFixed(6)} ${toUnit.name}`;
    }
  };

  // Handle calculation
  const handleCalculate = () => {
    if (!inputValue) {
      toast.error("Please enter a value to convert");
      return;
    }

    if (!fromUnit || !toUnit) {
      toast.error("Please select both units for conversion");
      return;
    }

    try {
      const value = parseFloat(inputValue);
      
      if (isNaN(value)) {
        toast.error("Please enter a valid number");
        return;
      }
      
      let convertedValue: number;
      
      // Special handling for temperature
      if (unitType === "temperature") {
        convertedValue = convertTemperature(value, fromUnit, toUnit);
      } else {
        // Get conversion factors
        const fromUnitDef = unitDefinitions[unitType as keyof typeof unitDefinitions].find(u => u.id === fromUnit);
        const toUnitDef = unitDefinitions[unitType as keyof typeof unitDefinitions].find(u => u.id === toUnit);
        
        if (!fromUnitDef || !toUnitDef) {
          toast.error("Invalid unit selection");
          return;
        }
        
        // Convert by ratio of conversion factors (to standard unit and then to target unit)
        convertedValue = value * (fromUnitDef.conversionFactor / toUnitDef.conversionFactor);
      }
      
      setResult(convertedValue);
      setFormula(generateFormula(value, fromUnit, toUnit));
      setShowResults(true);
      toast.success("Conversion calculated successfully");
      
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Error performing conversion");
    }
  };

  // Reset the calculator
  const handleReset = () => {
    setInputValue("");
    setResult(null);
    setFormula("");
    setShowResults(false);
    toast.info("Calculator has been reset");
  };

  // Render input form
  const renderInputs = () => {
    const units = unitDefinitions[unitType as keyof typeof unitDefinitions] || [];
    
    return (
      <>
        {/* Unit Type */}
        <div className="space-y-2">
          <Label htmlFor="unitType">Unit Type</Label>
          <Select 
            value={unitType} 
            onValueChange={handleUnitTypeChange}
          >
            <SelectTrigger id="unitType">
              <SelectValue placeholder="Select unit type" />
            </SelectTrigger>
            <SelectContent>
              {unitTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* From Unit */}
        <div className="space-y-2">
          <Label htmlFor="fromUnit">From Unit</Label>
          <Select 
            value={fromUnit} 
            onValueChange={setFromUnit}
          >
            <SelectTrigger id="fromUnit">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Input Value */}
        <div className="space-y-2">
          <Label htmlFor="inputValue">Value</Label>
          <Input
            id="inputValue"
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value to convert"
          />
        </div>

        {/* To Unit */}
        <div className="space-y-2">
          <Label htmlFor="toUnit">To Unit</Label>
          <Select 
            value={toUnit} 
            onValueChange={setToUnit}
          >
            <SelectTrigger id="toUnit">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </>
    );
  };

  // Render results
  const renderResults = () => {
    const fromUnitName = unitDefinitions[unitType as keyof typeof unitDefinitions]?.find(u => u.id === fromUnit)?.name || "";
    const toUnitName = unitDefinitions[unitType as keyof typeof unitDefinitions]?.find(u => u.id === toUnit)?.name || "";
    
    return (
      <>
        {/* Main Result */}
        <div className="p-6 bg-secondary rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-1">Result</p>
          <div className="flex justify-center items-center gap-4">
            <div className="text-center">
              <p className="text-xl font-semibold mb-1">{inputValue || "0"}</p>
              <p className="text-xs text-muted-foreground">{fromUnitName}</p>
            </div>
            <div className="text-2xl font-bold">=</div>
            <div className="text-center">
              <p className="text-3xl font-bold mb-1">
                {result !== null ? result.toFixed(6).replace(/\.?0+$/, "") : "0"}
              </p>
              <p className="text-xs text-muted-foreground">{toUnitName}</p>
            </div>
          </div>
        </div>

        {/* Conversion Details */}
        {showResults && (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Conversion Formula</h3>
              <p className="text-sm">{formula}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Common {unitTypes.find(t => t.id === unitType)?.name} Conversions</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {unitType === "length" && (
                    <>
                      <li>1 meter = 39.37 inches</li>
                      <li>1 kilometer = 0.621 miles</li>
                      <li>1 foot = 30.48 centimeters</li>
                    </>
                  )}
                  {unitType === "weight" && (
                    <>
                      <li>1 kilogram = 2.205 pounds</li>
                      <li>1 pound = 16 ounces</li>
                      <li>1 stone = 14 pounds</li>
                    </>
                  )}
                  {unitType === "temperature" && (
                    <>
                      <li>0°C = 32°F = 273.15K</li>
                      <li>100°C = 212°F = 373.15K</li>
                      <li>-40°C = -40°F = 233.15K</li>
                    </>
                  )}
                  {unitType === "volume" && (
                    <>
                      <li>1 liter = 0.264 gallons (US)</li>
                      <li>1 gallon = 3.785 liters</li>
                      <li>1 cup = 16 tablespoons</li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Conversion Accuracy</h3>
                <p className="text-sm text-muted-foreground">
                  Results are rounded to 6 decimal places for display purposes. For scientific applications requiring greater precision, additional decimal places may be necessary.
                </p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <CalculatorTemplate
      title="Unit Converter"
      description="Convert between different units of measurement across multiple categories."
      category="general"
      renderInputs={renderInputs}
      renderResults={renderResults}
      handleCalculate={handleCalculate}
      handleReset={handleReset}
      showResults={showResults}
    />
  );
};

export default UnitConverter;
