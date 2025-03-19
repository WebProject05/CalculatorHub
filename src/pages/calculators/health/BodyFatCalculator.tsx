
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { formatNumber } from "@/utils/calculators";
import CalculatorTemplate from "@/utils/CalculatorTemplate";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const BodyFatCalculator = () => {
  // State
  const [method, setMethod] = useState<string>("navy");
  const [gender, setGender] = useState<string>("male");
  const [height, setHeight] = useState<number>(175);
  const [weight, setWeight] = useState<number>(75);
  const [age, setAge] = useState<number>(30);
  
  // Navy method measurements
  const [waist, setWaist] = useState<number>(85);
  const [neck, setNeck] = useState<number>(38);
  const [hip, setHip] = useState<number>(100);
  
  // Skinfold measurements
  const [chest, setChest] = useState<number>(15);
  const [abdomen, setAbdomen] = useState<number>(20);
  const [thigh, setThigh] = useState<number>(15);
  const [tricep, setTricep] = useState<number>(15);
  const [subscapular, setSubscapular] = useState<number>(15);
  const [suprailiac, setSuprailiac] = useState<number>(15);
  
  // Results
  const [bodyFatPercentage, setBodyFatPercentage] = useState<number | null>(null);
  const [fatMass, setFatMass] = useState<number | null>(null);
  const [leanMass, setLeanMass] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);
  
  // Calculate body fat percentage
  const calculateBodyFat = () => {
    try {
      let calculatedBodyFat = 0;
      
      // Navy method (circumference-based)
      if (method === "navy") {
        if (gender === "male") {
          // Navy formula for men: 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
          calculatedBodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
        } else {
          // Navy formula for women: 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
          calculatedBodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
        }
      }
      // Skinfold method
      else if (method === "skinfold") {
        if (gender === "male") {
          // Jackson-Pollock 3-site formula for men (chest, abdomen, thigh)
          const sum = chest + abdomen + thigh;
          const bodyDensity = 1.10938 - (0.0008267 * sum) + (0.0000016 * sum * sum) - (0.0002574 * age);
          calculatedBodyFat = (4.95 / bodyDensity - 4.5) * 100;
        } else {
          // Jackson-Pollock 3-site formula for women (tricep, suprailiac, thigh)
          const sum = tricep + suprailiac + thigh;
          const bodyDensity = 1.099421 - (0.0009929 * sum) + (0.0000023 * sum * sum) - (0.0001392 * age);
          calculatedBodyFat = (4.95 / bodyDensity - 4.5) * 100;
        }
      }
      // BMI method (least accurate)
      else if (method === "bmi") {
        // Calculate BMI
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        
        // Derive body fat from BMI (very rough estimate)
        if (gender === "male") {
          calculatedBodyFat = (1.20 * bmi) + (0.23 * age) - 16.2;
        } else {
          calculatedBodyFat = (1.20 * bmi) + (0.23 * age) - 5.4;
        }
      }
      
      // Ensure body fat is within reasonable limits
      calculatedBodyFat = Math.max(2, Math.min(60, calculatedBodyFat));
      
      // Calculate fat mass and lean mass
      const calculatedFatMass = (calculatedBodyFat / 100) * weight;
      const calculatedLeanMass = weight - calculatedFatMass;
      
      // Determine category
      let calculatedCategory = "";
      if (gender === "male") {
        if (calculatedBodyFat < 6) calculatedCategory = "Essential Fat";
        else if (calculatedBodyFat < 14) calculatedCategory = "Athletic";
        else if (calculatedBodyFat < 18) calculatedCategory = "Fitness";
        else if (calculatedBodyFat < 25) calculatedCategory = "Average";
        else calculatedCategory = "Obese";
      } else {
        if (calculatedBodyFat < 14) calculatedCategory = "Essential Fat";
        else if (calculatedBodyFat < 21) calculatedCategory = "Athletic";
        else if (calculatedBodyFat < 25) calculatedCategory = "Fitness";
        else if (calculatedBodyFat < 32) calculatedCategory = "Average";
        else calculatedCategory = "Obese";
      }
      
      // Update state
      setBodyFatPercentage(calculatedBodyFat);
      setFatMass(calculatedFatMass);
      setLeanMass(calculatedLeanMass);
      setCategory(calculatedCategory);
      setShowResults(true);
      
      toast.success("Body fat calculation complete!");
    } catch (error) {
      console.error("Calculation error:", error);
      toast.error("Could not calculate body fat. Please check your measurements.");
    }
  };
  
  // Reset calculator
  const handleReset = () => {
    setMethod("navy");
    setGender("male");
    setHeight(175);
    setWeight(75);
    setAge(30);
    setWaist(85);
    setNeck(38);
    setHip(100);
    setChest(15);
    setAbdomen(20);
    setThigh(15);
    setTricep(15);
    setSubscapular(15);
    setSuprailiac(15);
    setBodyFatPercentage(null);
    setFatMass(null);
    setLeanMass(null);
    setCategory("");
    setShowResults(false);
    toast.info("Calculator has been reset");
  };
  
  // Get color based on body fat category
  const getCategoryColor = () => {
    switch (category) {
      case "Essential Fat": return "#3b82f6"; // blue
      case "Athletic": return "#10b981"; // green
      case "Fitness": return "#22c55e"; // lighter green
      case "Average": return "#f59e0b"; // yellow
      case "Obese": return "#ef4444"; // red
      default: return "#6b7280"; // gray
    }
  };
  
  // Render inputs
  const renderInputs = () => {
    return (
      <>
        {/* Method Selection */}
        <div className="space-y-3">
          <Label>Calculation Method</Label>
          <Tabs value={method} onValueChange={setMethod} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="navy">Navy Method</TabsTrigger>
              <TabsTrigger value="skinfold">Skinfold</TabsTrigger>
              <TabsTrigger value="bmi">BMI Method</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Gender Selection */}
        <div className="space-y-3">
          <Label>Gender</Label>
          <RadioGroup
            value={gender}
            onValueChange={setGender}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Common Measurements */}
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="height">Height (cm)</Label>
              <span className="text-sm text-muted-foreground">{height} cm</span>
            </div>
            <Input
              id="height"
              type="number"
              min="100"
              max="250"
              value={height}
              onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="weight">Weight (kg)</Label>
              <span className="text-sm text-muted-foreground">{weight} kg</span>
            </div>
            <Input
              id="weight"
              type="number"
              min="30"
              max="300"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="age">Age (years)</Label>
              <span className="text-sm text-muted-foreground">{age} years</span>
            </div>
            <Input
              id="age"
              type="number"
              min="18"
              max="100"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value) || 0)}
              className="w-full"
            />
          </div>
        </div>
        
        {/* Navy Method Inputs */}
        {method === "navy" && (
          <div className="space-y-3 border-t pt-3">
            <h3 className="font-medium text-sm">Navy Method Measurements</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="waist">Waist Circumference (cm)</Label>
                <span className="text-sm text-muted-foreground">{waist} cm</span>
              </div>
              <Input
                id="waist"
                type="number"
                min="40"
                max="200"
                value={waist}
                onChange={(e) => setWaist(parseFloat(e.target.value) || 0)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="neck">Neck Circumference (cm)</Label>
                <span className="text-sm text-muted-foreground">{neck} cm</span>
              </div>
              <Input
                id="neck"
                type="number"
                min="20"
                max="80"
                value={neck}
                onChange={(e) => setNeck(parseFloat(e.target.value) || 0)}
                className="w-full"
              />
            </div>
            
            {gender === "female" && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="hip">Hip Circumference (cm)</Label>
                  <span className="text-sm text-muted-foreground">{hip} cm</span>
                </div>
                <Input
                  id="hip"
                  type="number"
                  min="50"
                  max="200"
                  value={hip}
                  onChange={(e) => setHip(parseFloat(e.target.value) || 0)}
                  className="w-full"
                />
              </div>
            )}
          </div>
        )}
        
        {/* Skinfold Method Inputs */}
        {method === "skinfold" && (
          <div className="space-y-3 border-t pt-3">
            <h3 className="font-medium text-sm">Skinfold Measurements (mm)</h3>
            
            {gender === "male" ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="chest">Chest Skinfold (mm)</Label>
                    <span className="text-sm text-muted-foreground">{chest} mm</span>
                  </div>
                  <Slider
                    id="chest-slider"
                    value={[chest]}
                    onValueChange={(values) => setChest(values[0])}
                    min={2}
                    max={50}
                    step={0.5}
                    className="py-2"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="abdomen">Abdominal Skinfold (mm)</Label>
                    <span className="text-sm text-muted-foreground">{abdomen} mm</span>
                  </div>
                  <Slider
                    id="abdomen-slider"
                    value={[abdomen]}
                    onValueChange={(values) => setAbdomen(values[0])}
                    min={2}
                    max={60}
                    step={0.5}
                    className="py-2"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="tricep">Tricep Skinfold (mm)</Label>
                    <span className="text-sm text-muted-foreground">{tricep} mm</span>
                  </div>
                  <Slider
                    id="tricep-slider"
                    value={[tricep]}
                    onValueChange={(values) => setTricep(values[0])}
                    min={2}
                    max={50}
                    step={0.5}
                    className="py-2"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="suprailiac">Suprailiac Skinfold (mm)</Label>
                    <span className="text-sm text-muted-foreground">{suprailiac} mm</span>
                  </div>
                  <Slider
                    id="suprailiac-slider"
                    value={[suprailiac]}
                    onValueChange={(values) => setSuprailiac(values[0])}
                    min={2}
                    max={60}
                    step={0.5}
                    className="py-2"
                  />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="thigh">Thigh Skinfold (mm)</Label>
                <span className="text-sm text-muted-foreground">{thigh} mm</span>
              </div>
              <Slider
                id="thigh-slider"
                value={[thigh]}
                onValueChange={(values) => setThigh(values[0])}
                min={2}
                max={60}
                step={0.5}
                className="py-2"
              />
            </div>
          </div>
        )}
      </>
    );
  };
  
  // Render results
  const renderResults = () => {
    // Chart data
    const bodyCompositionData = [
      { name: "Fat Mass", value: fatMass || 0 },
      { name: "Lean Mass", value: leanMass || 0 }
    ];
    
    // Chart colors
    const COLORS = ["#ef4444", "#3b82f6"];
    
    return (
      <>
        {/* Main Result */}
        <div 
          className="p-6 rounded-lg text-center"
          style={{ backgroundColor: `${getCategoryColor()}20` }}
        >
          <p className="text-sm text-muted-foreground mb-1">Your Body Fat Percentage</p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-4xl font-bold">
              {bodyFatPercentage !== null ? formatNumber(bodyFatPercentage, 1) : "0"}%
            </p>
            <div
              className="text-white text-xs py-1 px-2 rounded font-medium"
              style={{ backgroundColor: getCategoryColor() }}
            >
              {category}
            </div>
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Based on {method === "navy" ? "Navy Method" : method === "skinfold" ? "Skinfold Method" : "BMI Method"}
          </div>
        </div>
        
        {/* Composition Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="font-medium">Body Composition</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Lean Mass</p>
                <p className="font-bold text-lg">{leanMass !== null ? formatNumber(leanMass, 1) : "0"} kg</p>
                <p className="text-xs text-muted-foreground">
                  {leanMass !== null && weight ? formatNumber((leanMass / weight) * 100, 1) : "0"}%
                </p>
              </div>
              
              <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Fat Mass</p>
                <p className="font-bold text-lg">{fatMass !== null ? formatNumber(fatMass, 1) : "0"} kg</p>
                <p className="text-xs text-muted-foreground">
                  {bodyFatPercentage !== null ? formatNumber(bodyFatPercentage, 1) : "0"}%
                </p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm border-t pt-2">
              <p>Total Weight: {weight} kg</p>
              <p>Height: {height} cm</p>
              <p>
                BMI: {formatNumber(weight / ((height / 100) ** 2), 1)} kg/m²
              </p>
            </div>
          </div>
          
          <div className="h-44 md:h-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bodyCompositionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                >
                  {bodyCompositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${formatNumber(value as number, 1)} kg`, ""]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Body Fat Categories */}
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium mb-2">Body Fat Percentage Categories</h3>
          
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-5 gap-2 text-xs font-medium">
              <div className="col-span-2">Category</div>
              <div className="col-span-3 grid grid-cols-2">
                <div>Men</div>
                <div>Women</div>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-2 text-xs py-1 border-t">
              <div className="col-span-2 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                Essential Fat
              </div>
              <div className="col-span-3 grid grid-cols-2">
                <div>2-5%</div>
                <div>10-13%</div>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-2 text-xs py-1 border-t">
              <div className="col-span-2 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Athletic
              </div>
              <div className="col-span-3 grid grid-cols-2">
                <div>6-13%</div>
                <div>14-20%</div>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-2 text-xs py-1 border-t">
              <div className="col-span-2 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                Fitness
              </div>
              <div className="col-span-3 grid grid-cols-2">
                <div>14-17%</div>
                <div>21-24%</div>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-2 text-xs py-1 border-t">
              <div className="col-span-2 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                Average
              </div>
              <div className="col-span-3 grid grid-cols-2">
                <div>18-24%</div>
                <div>25-31%</div>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-2 text-xs py-1 border-t">
              <div className="col-span-2 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                Obese
              </div>
              <div className="col-span-3 grid grid-cols-2">
                <div>25%+</div>
                <div>32%+</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Method Information */}
        <div className="border p-4 rounded-lg text-sm">
          <h3 className="font-medium mb-2">About {method === "navy" ? "Navy Method" : method === "skinfold" ? "Skinfold Method" : "BMI Method"}</h3>
          
          {method === "navy" && (
            <p>
              The Navy Method uses body circumference measurements to estimate body fat percentage.
              It's more accurate than BMI and easier to perform than skinfold measurements.
              For best results, measure at the same time of day with the same measuring tape.
            </p>
          )}
          
          {method === "skinfold" && (
            <p>
              The Skinfold Method uses measurements of skinfold thickness at specific body sites.
              It's considered quite accurate when performed correctly with proper calipers.
              The 3-site Jackson-Pollock formula is used for these calculations.
            </p>
          )}
          
          {method === "bmi" && (
            <p>
              The BMI Method provides a rough estimate based on your BMI and age.
              It's the least accurate method as it doesn't directly measure body fat.
              For more accurate results, use the Navy or Skinfold methods.
            </p>
          )}
        </div>
      </>
    );
  };
  
  return (
    <CalculatorTemplate
      title="Body Fat Calculator"
      description="Estimate your body fat percentage using various measurement methods."
      category="health"
      renderInputs={renderInputs}
      renderResults={renderResults}
      handleCalculate={calculateBodyFat}
      handleReset={handleReset}
      showResults={showResults}
    />
  );
};

export default BodyFatCalculator;
