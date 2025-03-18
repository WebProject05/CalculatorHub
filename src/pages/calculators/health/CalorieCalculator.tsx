
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Info, RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CalorieCalculator = () => {
  // State for form inputs
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState(30);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [goal, setGoal] = useState("maintain");
  const [units, setUnits] = useState("metric");
  
  // State for results
  const [bmr, setBmr] = useState(0);
  const [tdee, setTdee] = useState(0);
  const [dailyCalories, setDailyCalories] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  // Calculate calorie needs
  const calculateCalories = () => {
    // Convert imperial to metric if needed
    let weightKg = weight;
    let heightCm = height;
    
    if (units === "imperial") {
      weightKg = weight * 0.453592; // lbs to kg
      heightCm = height * 2.54; // inches to cm
    }
    
    // Calculate BMR using Mifflin-St Jeor Equation
    let calculatedBmr = 0;
    
    if (gender === "male") {
      calculatedBmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      calculatedBmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }
    
    // Calculate TDEE based on activity level
    let activityMultiplier = 1.2; // Sedentary
    
    switch (activityLevel) {
      case "sedentary":
        activityMultiplier = 1.2;
        break;
      case "light":
        activityMultiplier = 1.375;
        break;
      case "moderate":
        activityMultiplier = 1.55;
        break;
      case "active":
        activityMultiplier = 1.725;
        break;
      case "veryActive":
        activityMultiplier = 1.9;
        break;
    }
    
    const calculatedTdee = Math.round(calculatedBmr * activityMultiplier);
    
    // Adjust calories based on goal
    let goalCalories = calculatedTdee;
    
    switch (goal) {
      case "lose":
        goalCalories = calculatedTdee - 500; // 500 calorie deficit for weight loss
        break;
      case "gain":
        goalCalories = calculatedTdee + 500; // 500 calorie surplus for weight gain
        break;
    }
    
    // Update state with results
    setBmr(Math.round(calculatedBmr));
    setTdee(calculatedTdee);
    setDailyCalories(goalCalories);
    setShowResults(true);
    
    toast.success("Calorie needs calculated successfully");
  };
  
  // Handle calculation
  const handleCalculate = () => {
    if (age <= 0 || weight <= 0 || height <= 0) {
      toast.error("Please enter valid values for all fields");
      return;
    }
    
    calculateCalories();
  };
  
  // Reset the calculator
  const handleReset = () => {
    setGender("male");
    setAge(30);
    setWeight(70);
    setHeight(170);
    setActivityLevel("moderate");
    setGoal("maintain");
    setUnits("metric");
    setShowResults(false);
    toast.info("Calculator has been reset");
  };
  
  // Download as PDF
  const handleDownloadPDF = () => {
    toast.success("PDF download started");
    // In a real app, this would generate and download a PDF
  };
  
  // Get macronutrient recommendations
  const getMacros = () => {
    // Protein: 30%, Carbs: 40%, Fat: 30% (adjusting based on goal)
    let proteinPercentage = 0.3;
    let carbPercentage = 0.4;
    let fatPercentage = 0.3;
    
    // Adjust macros based on goal
    if (goal === "lose") {
      proteinPercentage = 0.4; // Higher protein for preserving muscle
      carbPercentage = 0.3;
      fatPercentage = 0.3;
    } else if (goal === "gain") {
      proteinPercentage = 0.25;
      carbPercentage = 0.5; // Higher carbs for energy
      fatPercentage = 0.25;
    }
    
    // Calculate grams (protein: 4 cal/g, carbs: 4 cal/g, fat: 9 cal/g)
    const proteinCals = dailyCalories * proteinPercentage;
    const carbCals = dailyCalories * carbPercentage;
    const fatCals = dailyCalories * fatPercentage;
    
    const proteinGrams = Math.round(proteinCals / 4);
    const carbGrams = Math.round(carbCals / 4);
    const fatGrams = Math.round(fatCals / 9);
    
    return {
      protein: proteinGrams,
      carbs: carbGrams,
      fat: fatGrams
    };
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Calorie Calculator</h1>
        <p className="text-muted-foreground">
          Calculate your daily calorie needs based on your body metrics and activity level.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <Card className="lg:col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle>Enter Your Details</CardTitle>
            <CardDescription>
              Adjust the values to calculate your daily calorie needs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Units Selection */}
            <div className="space-y-2">
              <Label htmlFor="units">Units</Label>
              <Tabs value={units} onValueChange={setUnits} className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="metric">Metric</TabsTrigger>
                  <TabsTrigger value="imperial">Imperial</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <RadioGroup defaultValue={gender} onValueChange={setGender} className="flex gap-4">
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
            
            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age">Age (years)</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                min={1}
                max={120}
                className="w-full"
              />
            </div>
            
            {/* Weight */}
            <div className="space-y-2">
              <Label htmlFor="weight">Weight ({units === "metric" ? "kg" : "lbs"})</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
                min={1}
                className="w-full"
              />
            </div>
            
            {/* Height */}
            <div className="space-y-2">
              <Label htmlFor="height">Height ({units === "metric" ? "cm" : "in"})</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                min={1}
                className="w-full"
              />
            </div>
            
            {/* Activity Level */}
            <div className="space-y-2">
              <Label htmlFor="activityLevel">Activity Level</Label>
              <Select 
                value={activityLevel} 
                onValueChange={setActivityLevel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                  <SelectItem value="light">Light (exercise 1-3 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderate (exercise 3-5 days/week)</SelectItem>
                  <SelectItem value="active">Active (exercise 6-7 days/week)</SelectItem>
                  <SelectItem value="veryActive">Very Active (intense exercise daily)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Goal */}
            <div className="space-y-2">
              <Label htmlFor="goal">Goal</Label>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose">Lose Weight</SelectItem>
                  <SelectItem value="maintain">Maintain Weight</SelectItem>
                  <SelectItem value="gain">Gain Weight</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
        <Card className={`lg:col-span-2 shadow-sm transition-opacity duration-500 ${showResults ? 'opacity-100' : 'opacity-50'}`}>
          <CardHeader>
            <CardTitle>Calorie Results</CardTitle>
            <CardDescription>
              Your daily calorie needs based on your details
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {showResults ? (
              <>
                {/* Daily Calorie Needs */}
                <div className="p-6 bg-secondary rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    Your Daily Calorie Needs
                  </p>
                  <p className="text-5xl font-bold mb-2">{dailyCalories}</p>
                  <p className="text-sm text-muted-foreground">
                    calories per day to {goal === "lose" ? "lose" : goal === "gain" ? "gain" : "maintain"} weight
                  </p>
                </div>
                
                {/* BMR and TDEE */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Basal Metabolic Rate (BMR)</p>
                    <p className="text-2xl font-semibold">{bmr}</p>
                    <p className="text-xs text-muted-foreground">calories/day</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Total Daily Energy Expenditure</p>
                    <p className="text-2xl font-semibold">{tdee}</p>
                    <p className="text-xs text-muted-foreground">calories/day</p>
                  </div>
                </div>
                
                {/* Macronutrient Distribution */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Recommended Macronutrients</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-sm font-medium">Protein</p>
                      <p className="text-xl font-semibold">{getMacros().protein}g</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round(getMacros().protein * 4)} calories
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-sm font-medium">Carbs</p>
                      <p className="text-xl font-semibold">{getMacros().carbs}g</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round(getMacros().carbs * 4)} calories
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-sm font-medium">Fat</p>
                      <p className="text-xl font-semibold">{getMacros().fat}g</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round(getMacros().fat * 9)} calories
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Goals and Timeline */}
                {goal !== "maintain" && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">Weight Change Projection</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      With a {Math.abs(tdee - dailyCalories)} calorie {goal === "lose" ? "deficit" : "surplus"} per day:
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">1 Month</p>
                        <p className="font-medium">
                          {((Math.abs(tdee - dailyCalories) * 30) / 7700).toFixed(1)} kg
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">3 Months</p>
                        <p className="font-medium">
                          {((Math.abs(tdee - dailyCalories) * 90) / 7700).toFixed(1)} kg
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">6 Months</p>
                        <p className="font-medium">
                          {((Math.abs(tdee - dailyCalories) * 180) / 7700).toFixed(1)} kg
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-3">
                      *Estimates based on 7,700 calories per kg of body weight
                    </p>
                  </div>
                )}
                
                {/* Info Section */}
                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm">
                      These calculations provide estimates based on formulas. Individual results may vary based on metabolism, genetics, and other factors.
                    </p>
                    <p className="text-sm mt-2">
                      Always consult with a healthcare professional before starting any diet or exercise program.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Enter your details and click "Calculate" to see your daily calorie needs
                </p>
              </div>
            )}
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

export default CalorieCalculator;
