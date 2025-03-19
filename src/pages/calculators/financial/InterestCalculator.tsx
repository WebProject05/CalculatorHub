
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { formatCurrency, formatNumber } from "@/utils/calculators";
import CalculatorTemplate from "@/utils/CalculatorTemplate";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const InterestCalculator = () => {
  // State for form inputs
  const [calculationType, setCalculationType] = useState<"simple" | "compound">("compound");
  const [principal, setPrincipal] = useState<number>(10000);
  const [interestRate, setInterestRate] = useState<number>(5);
  const [timeYears, setTimeYears] = useState<number>(5);
  const [compoundingFrequency, setCompoundingFrequency] = useState<string>("yearly");
  const [additionalContribution, setAdditionalContribution] = useState<number>(0);
  const [contributionFrequency, setContributionFrequency] = useState<string>("monthly");
  
  // State for results
  const [finalAmount, setFinalAmount] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [totalContributions, setTotalContributions] = useState<number | null>(null);
  const [yearlyData, setYearlyData] = useState<any[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  
  // Get compounding frequency factor
  const getCompoundingFactor = (frequency: string): number => {
    switch (frequency) {
      case "daily": return 365;
      case "weekly": return 52;
      case "monthly": return 12;
      case "quarterly": return 4;
      case "semiannually": return 2;
      case "yearly": return 1;
      default: return 1;
    }
  };
  
  // Get contribution frequency factor
  const getContributionFactor = (frequency: string): number => {
    switch (frequency) {
      case "monthly": return 12;
      case "quarterly": return 4;
      case "semiannually": return 2;
      case "yearly": return 1;
      default: return 12;
    }
  };
  
  // Calculate interest
  const calculateInterest = () => {
    if (principal <= 0 || interestRate <= 0 || timeYears <= 0) {
      toast.error("All values must be greater than zero");
      return;
    }
    
    let result = 0;
    let interestEarned = 0;
    let totalDeposited = principal;
    let graphData = [];
    
    const compoundFactor = getCompoundingFactor(compoundingFrequency);
    const contribFactor = getContributionFactor(contributionFrequency);
    const contributionPerPeriod = additionalContribution / contribFactor;
    
    // Simple interest calculation
    if (calculationType === "simple") {
      // A = P(1 + rt)
      result = principal * (1 + (interestRate / 100) * timeYears);
      
      if (additionalContribution > 0) {
        // For simple interest with contributions, we need to calculate each contribution separately
        const contributionTotal = additionalContribution * timeYears;
        
        // Average time for contributions (assuming regular intervals)
        const avgTime = timeYears / 2;
        const contributionInterest = contributionTotal * (interestRate / 100) * avgTime;
        
        result += contributionTotal + contributionInterest;
        totalDeposited += contributionTotal;
      }
      
      interestEarned = result - totalDeposited;
      
      // Generate yearly data for graph
      for (let year = 0; year <= timeYears; year++) {
        let yearlyAmount = 0;
        
        if (year === 0) {
          yearlyAmount = principal;
        } else {
          // Principal plus simple interest to this point
          const principalInterest = principal * (1 + (interestRate / 100) * year);
          
          // Contribution amount to this point
          const contributionAmount = additionalContribution * year;
          
          // Contribution interest (using average time for simplicity)
          const avgTime = year / 2;
          const contribInterest = contributionAmount * (interestRate / 100) * avgTime;
          
          yearlyAmount = principalInterest + contributionAmount + contribInterest;
        }
        
        graphData.push({
          year,
          amount: yearlyAmount,
          principal: year === 0 ? principal : principal + (additionalContribution * year),
          interest: year === 0 ? 0 : yearlyAmount - (principal + (additionalContribution * year))
        });
      }
    } else {
      // Compound interest calculation
      
      // First calculate just the principal with compound interest
      // A = P(1 + r/n)^(nt)
      const rate = interestRate / 100;
      const compoundedPrincipal = principal * Math.pow(1 + (rate / compoundFactor), compoundFactor * timeYears);
      
      if (additionalContribution > 0) {
        // For compound interest with regular contributions, we use the future value of annuity formula
        // FV = PMT × (((1 + r/n)^(nt) - 1) / (r/n))
        
        // Calculate future value of contributions
        const periodicRate = rate / compoundFactor;
        const periods = compoundFactor * timeYears;
        
        const annuityFactor = (Math.pow(1 + periodicRate, periods) - 1) / periodicRate;
        const contributionFuture = contributionPerPeriod * annuityFactor;
        
        result = compoundedPrincipal + contributionFuture;
        totalDeposited = principal + (additionalContribution * timeYears);
      } else {
        result = compoundedPrincipal;
      }
      
      interestEarned = result - totalDeposited;
      
      // Generate yearly data for graph
      let cumulativeContributions = principal;
      let currentAmount = principal;
      
      for (let year = 0; year <= timeYears; year++) {
        if (year === 0) {
          graphData.push({
            year,
            amount: principal,
            principal: principal,
            interest: 0
          });
        } else {
          // Calculate compound interest for this year
          const prevAmount = currentAmount;
          
          // Compound the amount from the previous year
          currentAmount = prevAmount * Math.pow(1 + (rate / compoundFactor), compoundFactor);
          
          // Add contributions for this year
          if (additionalContribution > 0) {
            // For simplicity, we're adding the contributions at the end of each year
            currentAmount += additionalContribution;
            cumulativeContributions += additionalContribution;
          }
          
          graphData.push({
            year,
            amount: currentAmount,
            principal: cumulativeContributions,
            interest: currentAmount - cumulativeContributions
          });
        }
      }
    }
    
    // Update state
    setFinalAmount(result);
    setTotalInterest(interestEarned);
    setTotalContributions(totalDeposited);
    setYearlyData(graphData);
    setShowResults(true);
    
    toast.success(`${calculationType === "simple" ? "Simple" : "Compound"} interest calculated successfully`);
  };
  
  // Reset calculator
  const handleReset = () => {
    setCalculationType("compound");
    setPrincipal(10000);
    setInterestRate(5);
    setTimeYears(5);
    setCompoundingFrequency("yearly");
    setAdditionalContribution(0);
    setContributionFrequency("monthly");
    setFinalAmount(null);
    setTotalInterest(null);
    setTotalContributions(null);
    setYearlyData([]);
    setShowResults(false);
    toast.info("Calculator has been reset");
  };
  
  // Render inputs
  const renderInputs = () => {
    return (
      <>
        {/* Interest Type */}
        <div className="space-y-3">
          <Label>Interest Type</Label>
          <RadioGroup
            value={calculationType}
            onValueChange={(value) => setCalculationType(value as "simple" | "compound")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="simple" id="simple" />
              <Label htmlFor="simple">Simple Interest</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="compound" id="compound" />
              <Label htmlFor="compound">Compound Interest</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Principal Amount */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="principal">Principal Amount</Label>
            <span className="text-sm text-muted-foreground">{formatCurrency(principal)}</span>
          </div>
          <Input
            id="principal"
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
            className="w-full"
          />
          <Slider
            id="principal-slider"
            value={[principal]}
            onValueChange={(values) => setPrincipal(values[0])}
            min={100}
            max={100000}
            step={100}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$100</span>
            <span>$100,000</span>
          </div>
        </div>
        
        {/* Interest Rate */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <span className="text-sm text-muted-foreground">{interestRate}%</span>
          </div>
          <Input
            id="interestRate"
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
            className="w-full"
            step="0.1"
          />
          <Slider
            id="interestRate-slider"
            value={[interestRate]}
            onValueChange={(values) => setInterestRate(values[0])}
            min={0.1}
            max={20}
            step={0.1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0.1%</span>
            <span>20%</span>
          </div>
        </div>
        
        {/* Time Period */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="timeYears">Time Period (years)</Label>
            <span className="text-sm text-muted-foreground">{timeYears} years</span>
          </div>
          <Input
            id="timeYears"
            type="number"
            value={timeYears}
            onChange={(e) => setTimeYears(parseFloat(e.target.value) || 0)}
            className="w-full"
            step="1"
          />
          <Slider
            id="timeYears-slider"
            value={[timeYears]}
            onValueChange={(values) => setTimeYears(values[0])}
            min={1}
            max={50}
            step={1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 year</span>
            <span>50 years</span>
          </div>
        </div>
        
        {/* Compounding Frequency (for compound interest) */}
        {calculationType === "compound" && (
          <div className="space-y-2">
            <Label htmlFor="compoundingFrequency">Compounding Frequency</Label>
            <select
              id="compoundingFrequency"
              value={compoundingFrequency}
              onChange={(e) => setCompoundingFrequency(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="semiannually">Semi-Annually</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        )}
        
        {/* Additional Contributions */}
        <div className="space-y-3 border-t pt-3">
          <h3 className="font-medium text-sm">Additional Contributions</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="additionalContribution">Contribution Amount (per year)</Label>
              <span className="text-sm text-muted-foreground">{formatCurrency(additionalContribution)}/year</span>
            </div>
            <Input
              id="additionalContribution"
              type="number"
              value={additionalContribution}
              onChange={(e) => setAdditionalContribution(parseFloat(e.target.value) || 0)}
              className="w-full"
            />
            <Slider
              id="additionalContribution-slider"
              value={[additionalContribution]}
              onValueChange={(values) => setAdditionalContribution(values[0])}
              min={0}
              max={20000}
              step={100}
              className="py-2"
            />
          </div>
          
          {additionalContribution > 0 && (
            <div className="space-y-2">
              <Label htmlFor="contributionFrequency">Contribution Frequency</Label>
              <select
                id="contributionFrequency"
                value={contributionFrequency}
                onChange={(e) => setContributionFrequency(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="semiannually">Semi-Annually</option>
                <option value="yearly">Yearly</option>
              </select>
              
              <div className="text-sm text-muted-foreground">
                {formatCurrency(additionalContribution / getContributionFactor(contributionFrequency))} 
                {contributionFrequency === "monthly" ? " per month" :
                 contributionFrequency === "quarterly" ? " per quarter" :
                 contributionFrequency === "semiannually" ? " per half-year" : " per year"}
              </div>
            </div>
          )}
        </div>
      </>
    );
  };
  
  // Render results
  const renderResults = () => {
    return (
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="chart">Growth Chart</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-6 pt-3">
          {/* Main Results */}
          <div className="p-6 bg-secondary rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Final Amount</p>
            <p className="text-4xl font-bold">{finalAmount !== null ? formatCurrency(finalAmount) : "$0"}</p>
            <div className="text-sm text-muted-foreground mt-2">
              After {timeYears} years at {interestRate}% interest
              {calculationType === "compound" && (
                <span> (compounded {compoundingFrequency})</span>
              )}
            </div>
          </div>
          
          {/* Breakdown */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-1">Principal</p>
              <p className="text-lg font-semibold">{formatCurrency(principal)}</p>
            </div>
            
            {additionalContribution > 0 && (
              <div className="bg-muted p-4 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Contributions</p>
                <p className="text-lg font-semibold">{formatCurrency(additionalContribution * timeYears)}</p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(additionalContribution)} / year
                </p>
              </div>
            )}
            
            <div className="bg-muted p-4 rounded-lg text-center col-span-additionalContribution > 0 ? 1 : 2">
              <p className="text-xs text-muted-foreground mb-1">Interest Earned</p>
              <p className="text-lg font-semibold">{totalInterest !== null ? formatCurrency(totalInterest) : "$0"}</p>
              <p className="text-xs text-muted-foreground">
                {totalInterest !== null && totalContributions !== null
                  ? `${formatNumber((totalInterest / totalContributions) * 100, 1)}% return`
                  : "0% return"}
              </p>
            </div>
          </div>
          
          {/* Interest Details */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Interest Details</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Interest Type:</span>
                <span className="font-medium">{calculationType === "simple" ? "Simple Interest" : "Compound Interest"}</span>
              </div>
              
              {calculationType === "compound" && (
                <div className="flex justify-between">
                  <span>Compounding Frequency:</span>
                  <span className="font-medium capitalize">{compoundingFrequency}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Annual Rate:</span>
                <span className="font-medium">{interestRate}%</span>
              </div>
              
              <div className="flex justify-between">
                <span>Time Period:</span>
                <span className="font-medium">{timeYears} years</span>
              </div>
              
              {additionalContribution > 0 && (
                <>
                  <div className="flex justify-between">
                    <span>Additional Contributions:</span>
                    <span className="font-medium">{formatCurrency(additionalContribution)} per year</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contribution Frequency:</span>
                    <span className="font-medium capitalize">{contributionFrequency}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Yearly Breakdown Table (first 5 years and last year) */}
          {yearlyData.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted px-4 py-2 text-sm font-medium">
                Year-by-Year Breakdown
              </div>
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Year</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Balance</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Interest</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {yearlyData.slice(0, Math.min(6, yearlyData.length)).map((data, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm">{data.year}</td>
                      <td className="px-4 py-2 text-sm text-right">{formatCurrency(data.amount)}</td>
                      <td className="px-4 py-2 text-sm text-right">{formatCurrency(data.interest)}</td>
                    </tr>
                  ))}
                  
                  {yearlyData.length > 7 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-center text-xs text-muted-foreground">...</td>
                    </tr>
                  )}
                  
                  {yearlyData.length > 6 && (
                    <tr>
                      <td className="px-4 py-2 text-sm">{yearlyData[yearlyData.length - 1].year}</td>
                      <td className="px-4 py-2 text-sm text-right">{formatCurrency(yearlyData[yearlyData.length - 1].amount)}</td>
                      <td className="px-4 py-2 text-sm text-right">{formatCurrency(yearlyData[yearlyData.length - 1].interest)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="chart" className="space-y-6 pt-3">
          {/* Growth Chart */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-4 text-center">Growth Over Time</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={yearlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="year"
                    label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip formatter={(value) => [formatCurrency(value as number), ""]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    name="Total Balance"
                    stroke="#8884d8"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="principal"
                    name="Principal + Contributions"
                    stroke="#82ca9d"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="interest"
                    name="Interest"
                    stroke="#ffc658"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Explanation */}
          <div className="border p-4 rounded-lg">
            <h3 className="font-medium mb-2">Understanding the Chart</h3>
            <ul className="text-sm space-y-2 list-disc list-inside">
              <li>
                <span className="font-medium">Total Balance (purple):</span> The total amount including
                principal, contributions, and interest.
              </li>
              <li>
                <span className="font-medium">Principal + Contributions (green):</span> Your initial investment
                plus all additional contributions made over time.
              </li>
              <li>
                <span className="font-medium">Interest (yellow):</span> The amount earned from interest
                over time.
              </li>
            </ul>
            
            <div className="mt-4 text-sm text-muted-foreground">
              {calculationType === "simple" 
                ? "With simple interest, interest is only earned on the principal amount."
                : "With compound interest, you earn interest on your interest, leading to exponential growth over time."
              }
            </div>
          </div>
        </TabsContent>
      </Tabs>
    );
  };
  
  return (
    <CalculatorTemplate
      title="Interest Calculator"
      description="Calculate simple and compound interest on your investments."
      category="financial"
      renderInputs={renderInputs}
      renderResults={renderResults}
      handleCalculate={calculateInterest}
      handleReset={handleReset}
      showResults={showResults}
    />
  );
};

export default InterestCalculator;
