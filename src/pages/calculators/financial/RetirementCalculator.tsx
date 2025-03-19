
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/calculators";
import CalculatorTemplate from "@/utils/CalculatorTemplate";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface RetirementData {
  age: number;
  savings: number;
  contributions: number;
  interest: number;
  yearlyWithdrawal?: number;
}

const RetirementCalculator = () => {
  // Current state
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [currentSavings, setCurrentSavings] = useState<number>(50000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  
  // Retirement goals
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [yearsInRetirement, setYearsInRetirement] = useState<number>(30);
  const [annualExpenses, setAnnualExpenses] = useState<number>(60000);
  const [inflationRate, setInflationRate] = useState<number>(2.5);
  
  // Investment assumptions
  const [annualReturn, setAnnualReturn] = useState<number>(7);
  const [returnDuringRetirement, setReturnDuringRetirement] = useState<number>(5);
  
  // Results
  const [retirementSavingsGoal, setRetirementSavingsGoal] = useState<number | null>(null);
  const [projectedSavings, setProjectedSavings] = useState<number | null>(null);
  const [additionalSavingsNeeded, setAdditionalSavingsNeeded] = useState<number | null>(null);
  const [savingsData, setSavingsData] = useState<RetirementData[]>([]);
  const [withdrawalData, setWithdrawalData] = useState<RetirementData[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Calculate retirement plan
  const calculateRetirement = () => {
    try {
      // Validate inputs
      if (currentAge >= retirementAge) {
        toast.error("Retirement age must be greater than current age");
        return;
      }
      
      if (monthlyContribution < 0 || currentSavings < 0) {
        toast.error("Savings and contributions cannot be negative");
        return;
      }
      
      // Calculate retirement savings goal
      const goal = calculateRetirementSavingsGoal();
      setRetirementSavingsGoal(goal);
      
      // Calculate projected savings at retirement
      const { projected, savingsData } = calculateProjectedSavings();
      setProjectedSavings(projected);
      setSavingsData(savingsData);
      
      // Calculate withdrawal schedule
      const withdrawals = calculateWithdrawalSchedule(projected);
      setWithdrawalData(withdrawals);
      
      // Additional savings needed (if any)
      const additional = goal > projected ? goal - projected : 0;
      setAdditionalSavingsNeeded(additional);
      
      setShowResults(true);
      toast.success("Retirement plan calculated successfully");
    } catch (error) {
      console.error("Error calculating retirement plan:", error);
      toast.error("Error in calculation. Please check your inputs.");
    }
  };

  // Calculate how much money needed for retirement
  const calculateRetirementSavingsGoal = (): number => {
    // Present value of an annuity formula to calculate the lump sum needed
    // to generate the desired annual income during retirement
    
    // Adjust annual expenses for inflation until retirement
    const yearsTillRetirement = retirementAge - currentAge;
    const inflationFactor = Math.pow(1 + inflationRate / 100, yearsTillRetirement);
    const inflationAdjustedExpenses = annualExpenses * inflationFactor;
    
    // Calculate the lump sum needed at retirement to fund retirement years
    // Using the present value of an annuity formula
    const monthlyRate = returnDuringRetirement / 100 / 12;
    const numberOfPayments = yearsInRetirement * 12;
    
    // Monthly withdrawal needed
    const monthlyExpenses = inflationAdjustedExpenses / 12;
    
    // Present value calculation
    // PV = PMT × [1 - (1 + r)^-n] / r
    const presentValue = monthlyExpenses * (1 - Math.pow(1 + monthlyRate, -numberOfPayments)) / monthlyRate;
    
    return presentValue;
  };

  // Calculate projected savings at retirement age
  const calculateProjectedSavings = (): { projected: number, savingsData: RetirementData[] } => {
    const yearsTillRetirement = retirementAge - currentAge;
    const data: RetirementData[] = [];
    
    // Monthly rate of return
    const monthlyRate = annualReturn / 100 / 12;
    
    // Initial values
    let currentBalance = currentSavings;
    let totalContributions = 0;
    let totalInterest = 0;
    
    // Add initial state
    data.push({
      age: currentAge,
      savings: currentBalance,
      contributions: totalContributions,
      interest: totalInterest
    });
    
    // Calculate year by year
    for (let year = 1; year <= yearsTillRetirement; year++) {
      let yearlyContributions = 0;
      let yearlyInterest = 0;
      
      // Calculate month by month for more accuracy
      for (let month = 1; month <= 12; month++) {
        // Add monthly contribution
        currentBalance += monthlyContribution;
        yearlyContributions += monthlyContribution;
        
        // Add monthly interest
        const monthlyInterest = currentBalance * monthlyRate;
        currentBalance += monthlyInterest;
        yearlyInterest += monthlyInterest;
      }
      
      totalContributions += yearlyContributions;
      totalInterest += yearlyInterest;
      
      // Add to data
      data.push({
        age: currentAge + year,
        savings: currentBalance,
        contributions: totalContributions,
        interest: totalInterest
      });
    }
    
    return {
      projected: currentBalance,
      savingsData: data
    };
  };

  // Calculate withdrawal schedule during retirement
  const calculateWithdrawalSchedule = (startingBalance: number): RetirementData[] => {
    const data: RetirementData[] = [];
    
    // Monthly rate during retirement
    const monthlyRate = returnDuringRetirement / 100 / 12;
    
    // Adjust annual expenses for inflation until retirement
    const yearsTillRetirement = retirementAge - currentAge;
    const inflationFactor = Math.pow(1 + inflationRate / 100, yearsTillRetirement);
    let currentExpenses = annualExpenses * inflationFactor;
    
    // Initial balance
    let currentBalance = startingBalance;
    
    // Add initial retirement state
    data.push({
      age: retirementAge,
      savings: currentBalance,
      contributions: 0,
      interest: 0,
      yearlyWithdrawal: 0
    });
    
    // Calculate year by year during retirement
    for (let year = 1; year <= yearsInRetirement; year++) {
      // Adjust expenses for inflation during retirement
      currentExpenses *= (1 + inflationRate / 100);
      
      let yearlyInterest = 0;
      const yearlyWithdrawal = currentExpenses;
      
      // Calculate month by month
      for (let month = 1; month <= 12; month++) {
        // Monthly withdrawal
        const monthlyWithdrawal = currentExpenses / 12;
        
        // Withdraw money
        currentBalance -= monthlyWithdrawal;
        
        // If balance is depleted
        if (currentBalance <= 0) {
          currentBalance = 0;
          break;
        }
        
        // Add monthly interest
        const monthlyInterest = currentBalance * monthlyRate;
        currentBalance += monthlyInterest;
        yearlyInterest += monthlyInterest;
      }
      
      // Add to data
      data.push({
        age: retirementAge + year,
        savings: Math.max(0, currentBalance),
        contributions: 0,
        interest: yearlyInterest,
        yearlyWithdrawal
      });
      
      // If completely out of money
      if (currentBalance <= 0) {
        break;
      }
    }
    
    return data;
  };

  // Reset calculator
  const handleReset = () => {
    setCurrentAge(30);
    setCurrentSavings(50000);
    setMonthlyContribution(500);
    setRetirementAge(65);
    setYearsInRetirement(30);
    setAnnualExpenses(60000);
    setInflationRate(2.5);
    setAnnualReturn(7);
    setReturnDuringRetirement(5);
    setRetirementSavingsGoal(null);
    setProjectedSavings(null);
    setAdditionalSavingsNeeded(null);
    setSavingsData([]);
    setWithdrawalData([]);
    setShowResults(false);
    toast.info("Calculator has been reset");
  };

  // Render input form
  const renderInputs = () => {
    return (
      <div className="space-y-6">
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="current">Current Status</TabsTrigger>
            <TabsTrigger value="retirement">Retirement</TabsTrigger>
            <TabsTrigger value="investment">Investment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="space-y-4 mt-4">
            {/* Current Age */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="currentAge">Current Age</Label>
                <span className="text-sm text-muted-foreground">{currentAge} years</span>
              </div>
              <Slider
                value={[currentAge]}
                onValueChange={(values) => setCurrentAge(values[0])}
                min={18}
                max={80}
                step={1}
                className="py-2"
              />
              <Input
                id="currentAge"
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(parseInt(e.target.value) || 0)}
                min={18}
                max={80}
                className="w-full"
              />
            </div>
            
            {/* Current Savings */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="currentSavings">Current Retirement Savings</Label>
                <span className="text-sm text-muted-foreground">{formatCurrency(currentSavings)}</span>
              </div>
              <Slider
                value={[currentSavings]}
                onValueChange={(values) => setCurrentSavings(values[0])}
                min={0}
                max={500000}
                step={1000}
                className="py-2"
              />
              <Input
                id="currentSavings"
                type="number"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(parseFloat(e.target.value) || 0)}
                min={0}
                className="w-full"
              />
            </div>
            
            {/* Monthly Contribution */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
                <span className="text-sm text-muted-foreground">{formatCurrency(monthlyContribution)}</span>
              </div>
              <Slider
                value={[monthlyContribution]}
                onValueChange={(values) => setMonthlyContribution(values[0])}
                min={0}
                max={3000}
                step={50}
                className="py-2"
              />
              <Input
                id="monthlyContribution"
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 0)}
                min={0}
                className="w-full"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="retirement" className="space-y-4 mt-4">
            {/* Retirement Age */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="retirementAge">Retirement Age</Label>
                <span className="text-sm text-muted-foreground">{retirementAge} years</span>
              </div>
              <Slider
                value={[retirementAge]}
                onValueChange={(values) => setRetirementAge(values[0])}
                min={Math.max(currentAge + 1, 50)}
                max={80}
                step={1}
                className="py-2"
              />
              <Input
                id="retirementAge"
                type="number"
                value={retirementAge}
                onChange={(e) => setRetirementAge(parseInt(e.target.value) || 0)}
                min={Math.max(currentAge + 1, 50)}
                max={80}
                className="w-full"
              />
            </div>
            
            {/* Years in Retirement */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="yearsInRetirement">Years in Retirement</Label>
                <span className="text-sm text-muted-foreground">{yearsInRetirement} years</span>
              </div>
              <Slider
                value={[yearsInRetirement]}
                onValueChange={(values) => setYearsInRetirement(values[0])}
                min={10}
                max={40}
                step={1}
                className="py-2"
              />
              <Input
                id="yearsInRetirement"
                type="number"
                value={yearsInRetirement}
                onChange={(e) => setYearsInRetirement(parseInt(e.target.value) || 0)}
                min={10}
                max={40}
                className="w-full"
              />
            </div>
            
            {/* Annual Expenses */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="annualExpenses">Annual Expenses in Retirement</Label>
                <span className="text-sm text-muted-foreground">{formatCurrency(annualExpenses)}</span>
              </div>
              <Slider
                value={[annualExpenses]}
                onValueChange={(values) => setAnnualExpenses(values[0])}
                min={20000}
                max={200000}
                step={1000}
                className="py-2"
              />
              <Input
                id="annualExpenses"
                type="number"
                value={annualExpenses}
                onChange={(e) => setAnnualExpenses(parseFloat(e.target.value) || 0)}
                min={0}
                className="w-full"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="investment" className="space-y-4 mt-4">
            {/* Annual Return (Pre-retirement) */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="annualReturn">Expected Annual Return (Pre-retirement)</Label>
                <span className="text-sm text-muted-foreground">{annualReturn}%</span>
              </div>
              <Slider
                value={[annualReturn]}
                onValueChange={(values) => setAnnualReturn(values[0])}
                min={1}
                max={12}
                step={0.1}
                className="py-2"
              />
              <Input
                id="annualReturn"
                type="number"
                value={annualReturn}
                onChange={(e) => setAnnualReturn(parseFloat(e.target.value) || 0)}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>
            
            {/* Annual Return (During Retirement) */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="returnDuringRetirement">Expected Annual Return (During Retirement)</Label>
                <span className="text-sm text-muted-foreground">{returnDuringRetirement}%</span>
              </div>
              <Slider
                value={[returnDuringRetirement]}
                onValueChange={(values) => setReturnDuringRetirement(values[0])}
                min={1}
                max={8}
                step={0.1}
                className="py-2"
              />
              <Input
                id="returnDuringRetirement"
                type="number"
                value={returnDuringRetirement}
                onChange={(e) => setReturnDuringRetirement(parseFloat(e.target.value) || 0)}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>
            
            {/* Inflation Rate */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="inflationRate">Expected Inflation Rate</Label>
                <span className="text-sm text-muted-foreground">{inflationRate}%</span>
              </div>
              <Slider
                value={[inflationRate]}
                onValueChange={(values) => setInflationRate(values[0])}
                min={1}
                max={5}
                step={0.1}
                className="py-2"
              />
              <Input
                id="inflationRate"
                type="number"
                value={inflationRate}
                onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  // Render results
  const renderResults = () => {
    // Filter data for chart to avoid too many points
    const filteredSavingsData = savingsData.filter((_, index) => 
      index === 0 || index === savingsData.length - 1 || index % Math.max(1, Math.floor(savingsData.length / 10)) === 0
    );
    
    const filteredWithdrawalData = withdrawalData.filter((_, index) => 
      index === 0 || index === withdrawalData.length - 1 || index % Math.max(1, Math.floor(withdrawalData.length / 10)) === 0
    );
    
    // Combine data for full timeline chart
    const fullTimelineData = [...filteredSavingsData, ...filteredWithdrawalData.slice(1)];
    
    // Check if retirement savings will last
    const willFundLastForRetirement = withdrawalData.length >= yearsInRetirement;
    const lastFundedAge = retirementAge + withdrawalData.length - 1;
    
    return (
      <div className="space-y-6">
        {/* Main Results */}
        <div className="p-6 bg-secondary rounded-lg text-center">
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Projected Savings at Retirement</p>
              <p className="text-3xl font-bold">{projectedSavings !== null ? formatCurrency(projectedSavings) : "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Retirement Savings Goal</p>
              <p className="text-3xl font-bold">{retirementSavingsGoal !== null ? formatCurrency(retirementSavingsGoal) : "N/A"}</p>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${additionalSavingsNeeded && additionalSavingsNeeded > 0 ? "bg-red-100 dark:bg-red-950" : "bg-green-100 dark:bg-green-950"}`}>
            {additionalSavingsNeeded !== null && additionalSavingsNeeded > 0 ? (
              <>
                <p className="font-medium text-lg">Shortfall: {formatCurrency(additionalSavingsNeeded)}</p>
                <p className="text-sm mt-1">
                  To meet your retirement goal, you'll need to save an additional {formatCurrency(additionalSavingsNeeded / ((retirementAge - currentAge) * 12))} monthly.
                </p>
              </>
            ) : (
              <p className="font-medium text-lg">You're on track to meet your retirement goal! 🎉</p>
            )}
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            Based on retiring at age {retirementAge} with {yearsInRetirement} years in retirement.
          </div>
        </div>
        
        {/* Retirement Timeline Chart */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-3">Retirement Timeline</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fullTimelineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="age" 
                  label={{ value: 'Age', position: 'insideBottomRight', offset: -5 }} 
                />
                <YAxis 
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value as number), "Savings"]}
                  labelFormatter={(value) => `Age ${value}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="#8884d8" 
                  fillOpacity={1} 
                  fill="url(#colorSavings)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
              <span>Savings grow while working (age {currentAge} to {retirementAge})</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-3 h-3 rounded-full bg-indigo-300"></div>
              <span>Savings gradually depleted during retirement (age {retirementAge}+)</span>
            </div>
          </div>
        </div>
        
        {/* Savings Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-3">Savings Accumulation</h3>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredSavingsData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="age" />
                  <YAxis 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value as number), ""]}
                    labelFormatter={(value) => `Age ${value}`}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="contributions" 
                    name="Contributions" 
                    stackId="1" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="interest" 
                    name="Investment Growth" 
                    stackId="1" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-3 text-sm">
              <p>
                <strong>At retirement (age {retirementAge}):</strong>
              </p>
              <p>
                Total Contributions: {formatCurrency(savingsData[savingsData.length - 1]?.contributions || 0)}
              </p>
              <p>
                Investment Growth: {formatCurrency(savingsData[savingsData.length - 1]?.interest || 0)}
              </p>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-3">Retirement Withdrawals</h3>
            {withdrawalData.length > 1 ? (
              <>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredWithdrawalData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="age" />
                      <YAxis 
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value as number), ""]}
                        labelFormatter={(value) => `Age ${value}`}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="savings" 
                        name="Remaining Savings" 
                        stroke="#8884d8" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="yearlyWithdrawal" 
                        name="Annual Withdrawal" 
                        stroke="#ff7300" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-3 text-sm">
                  {willFundLastForRetirement ? (
                    <p className="text-green-600 dark:text-green-400 font-medium">
                      Your savings will last through your planned retirement period.
                    </p>
                  ) : (
                    <p className="text-red-600 dark:text-red-400 font-medium">
                      Your savings will be depleted by age {lastFundedAge}, 
                      {yearsInRetirement - withdrawalData.length + 1} years short of your goal.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="h-60 flex items-center justify-center">
                <p className="text-muted-foreground">
                  No withdrawal data available - your retirement savings will be depleted immediately.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Retirement Planning Tips */}
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium mb-2">Retirement Planning Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <ul className="space-y-1 list-disc list-inside">
              <li>Increase your monthly contributions to boost your retirement savings.</li>
              <li>Take advantage of employer matching in your 401(k) if available.</li>
              <li>Consider delaying retirement to increase your savings and reduce the withdrawal period.</li>
              <li>Reduce planned retirement expenses to make your savings last longer.</li>
            </ul>
            <ul className="space-y-1 list-disc list-inside">
              <li>Diversify your investments to manage risk while seeking growth.</li>
              <li>Look into catch-up contributions if you're over 50 years old.</li>
              <li>Remember that Social Security benefits (not included in this calculation) will supplement your retirement income.</li>
              <li>Review and adjust your retirement plan annually as your circumstances change.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <CalculatorTemplate
      title="Retirement Calculator"
      description="Plan your retirement savings and see if you're on track to meet your retirement goals."
      category="financial"
      renderInputs={renderInputs}
      renderResults={renderResults}
      handleCalculate={calculateRetirement}
      handleReset={handleReset}
      showResults={showResults}
    />
  );
};

export default RetirementCalculator;
