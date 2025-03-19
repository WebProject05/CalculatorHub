import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { formatCurrency, formatNumber } from "@/utils/calculators";
import CalculatorTemplate from "@/utils/CalculatorTemplate";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp } from "lucide-react";

interface InvestmentData {
  year: number;
  totalValue: number;
  principal: number;
  interestEarned: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const InvestmentCalculator = () => {
  // State for inputs
  const [initialInvestment, setInitialInvestment] = useState<number>(10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [annualInterestRate, setAnnualInterestRate] = useState<number>(8);
  const [investmentLength, setInvestmentLength] = useState<number>(20);
  const [compoundingFrequency, setCompoundingFrequency] = useState<"annually" | "semiannually" | "quarterly" | "monthly" | "daily">("monthly");
  
  // Results
  const [futureValue, setFutureValue] = useState<number | null>(null);
  const [totalPrincipal, setTotalPrincipal] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [investmentData, setInvestmentData] = useState<InvestmentData[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Calculate investment growth
  const calculateInvestment = () => {
    try {
      // Validate inputs
      if (initialInvestment < 0 || monthlyContribution < 0) {
        toast.error("Investment amounts cannot be negative");
        return;
      }
      
      if (annualInterestRate <= 0) {
        toast.error("Interest rate must be greater than zero");
        return;
      }
      
      if (investmentLength <= 0) {
        toast.error("Investment length must be greater than zero");
        return;
      }
      
      // Convert annual interest rate to the appropriate periodic rate
      let periodsPerYear: number;
      switch (compoundingFrequency) {
        case "annually":
          periodsPerYear = 1;
          break;
        case "semiannually":
          periodsPerYear = 2;
          break;
        case "quarterly":
          periodsPerYear = 4;
          break;
        case "monthly":
          periodsPerYear = 12;
          break;
        case "daily":
          periodsPerYear = 365;
          break;
        default:
          periodsPerYear = 12;
      }
      
      const periodicRate = annualInterestRate / 100 / periodsPerYear;
      const totalPeriods = periodsPerYear * investmentLength;
      
      // Calculate investment growth
      const data = calculateInvestmentGrowth(
        initialInvestment,
        monthlyContribution,
        periodicRate,
        periodsPerYear,
        totalPeriods
      );
      
      // Set results
      const lastDataPoint = data[data.length - 1];
      setFutureValue(lastDataPoint.totalValue);
      setTotalPrincipal(lastDataPoint.principal);
      setTotalInterest(lastDataPoint.interestEarned);
      setInvestmentData(data);
      
      setShowResults(true);
      toast.success("Investment growth calculated successfully");
    } catch (error) {
      console.error("Error calculating investment growth:", error);
      toast.error("Error in calculation. Please check your inputs.");
    }
  };

  // Calculate investment growth over time
  const calculateInvestmentGrowth = (
    initial: number,
    monthlyContrib: number,
    periodicRate: number,
    periodsPerYear: number,
    totalPeriods: number
  ): InvestmentData[] => {
    const data: InvestmentData[] = [];
    let currentValue = initial;
    let totalContributions = initial;
    const contributionPerPeriod = monthlyContrib * (12 / periodsPerYear);
    
    // Initial state
    data.push({
      year: 0,
      totalValue: currentValue,
      principal: totalContributions,
      interestEarned: 0
    });
    
    // Calculate period by period
    for (let period = 1; period <= totalPeriods; period++) {
      // Add contribution
      currentValue += contributionPerPeriod;
      totalContributions += contributionPerPeriod;
      
      // Add interest
      const interestForPeriod = currentValue * periodicRate;
      currentValue += interestForPeriod;
      
      // Only add yearly data points to keep the chart clean
      if (period % periodsPerYear === 0 || period === totalPeriods) {
        const year = period / periodsPerYear;
        data.push({
          year,
          totalValue: currentValue,
          principal: totalContributions,
          interestEarned: currentValue - totalContributions
        });
      }
    }
    
    return data;
  };

  // Reset calculator
  const handleReset = () => {
    setInitialInvestment(10000);
    setMonthlyContribution(500);
    setAnnualInterestRate(8);
    setInvestmentLength(20);
    setCompoundingFrequency("monthly");
    setFutureValue(null);
    setTotalPrincipal(null);
    setTotalInterest(null);
    setInvestmentData([]);
    setShowResults(false);
    toast.info("Calculator has been reset");
  };

  // Render input form
  const renderInputs = () => {
    return (
      <div className="space-y-6">
        {/* Initial Investment */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="initialInvestment">Initial Investment</Label>
            <span className="text-sm text-muted-foreground">{formatCurrency(initialInvestment)}</span>
          </div>
          <Slider
            value={[initialInvestment]}
            onValueChange={(values) => setInitialInvestment(values[0])}
            min={0}
            max={100000}
            step={1000}
            className="py-2"
          />
          <Input
            id="initialInvestment"
            type="number"
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(parseFloat(e.target.value) || 0)}
            min={0}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span>$100,000</span>
          </div>
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
            max={2000}
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
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span>$2,000</span>
          </div>
        </div>
        
        {/* Annual Interest Rate */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="annualInterestRate">Annual Interest Rate (%)</Label>
            <span className="text-sm text-muted-foreground">{annualInterestRate}%</span>
          </div>
          <Slider
            value={[annualInterestRate]}
            onValueChange={(values) => setAnnualInterestRate(values[0])}
            min={1}
            max={15}
            step={0.1}
            className="py-2"
          />
          <Input
            id="annualInterestRate"
            type="number"
            value={annualInterestRate}
            onChange={(e) => setAnnualInterestRate(parseFloat(e.target.value) || 0)}
            min={0.1}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1%</span>
            <span>15%</span>
          </div>
        </div>
        
        {/* Investment Length */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="investmentLength">Investment Length (years)</Label>
            <span className="text-sm text-muted-foreground">{investmentLength} years</span>
          </div>
          <Slider
            value={[investmentLength]}
            onValueChange={(values) => setInvestmentLength(values[0])}
            min={1}
            max={40}
            step={1}
            className="py-2"
          />
          <Input
            id="investmentLength"
            type="number"
            value={investmentLength}
            onChange={(e) => setInvestmentLength(parseInt(e.target.value) || 0)}
            min={1}
            max={40}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 year</span>
            <span>40 years</span>
          </div>
        </div>
        
        {/* Compounding Frequency */}
        <div className="space-y-2">
          <Label htmlFor="compoundingFrequency">Compounding Frequency</Label>
          <Tabs 
            value={compoundingFrequency} 
            onValueChange={(value) => setCompoundingFrequency(value as any)}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="annually">Annually</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <TabsTrigger value="semiannually">Semi-annually</TabsTrigger>
              <TabsTrigger value="daily">Daily</TabsTrigger>
            </div>
          </Tabs>
        </div>
      </div>
    );
  };

  // Render results
  const renderResults = () => {
    // Prepare data for pie chart
    const pieData = totalPrincipal && totalInterest ? [
      { name: 'Principal', value: totalPrincipal },
      { name: 'Interest', value: totalInterest }
    ] : [];
    
    // Calculate effective annual yield based on compounding frequency
    const calculateEffectiveYield = (): number => {
      let periodsPerYear: number;
      switch (compoundingFrequency) {
        case "annually": periodsPerYear = 1; break;
        case "semiannually": periodsPerYear = 2; break;
        case "quarterly": periodsPerYear = 4; break;
        case "monthly": periodsPerYear = 12; break;
        case "daily": periodsPerYear = 365; break;
        default: periodsPerYear = 12;
      }
      
      const periodicRate = annualInterestRate / 100 / periodsPerYear;
      return (Math.pow(1 + periodicRate, periodsPerYear) - 1) * 100;
    };
    
    const effectiveYield = calculateEffectiveYield();
    
    return (
      <div className="space-y-6">
        {/* Main Results */}
        <div className="p-6 bg-secondary rounded-lg">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-10 w-10 text-primary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Future Value</p>
              <p className="text-3xl font-bold">{futureValue !== null ? formatCurrency(futureValue) : "N/A"}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Interest Earned</p>
              <p className="text-3xl font-bold">{totalInterest !== null ? formatCurrency(totalInterest) : "N/A"}</p>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              After {investmentLength} years with {compoundingFrequency} compounding
              ({formatNumber(effectiveYield, 2)}% effective annual yield)
            </p>
          </div>
        </div>
        
        {/* Growth Chart */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-3">Investment Growth Over Time</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={investmentData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="year" 
                  label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} 
                />
                <YAxis 
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value as number), ""]}
                  labelFormatter={(value) => `Year ${value}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="totalValue" 
                  name="Total Value" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="principal" 
                  name="Principal" 
                  stroke="#82ca9d" 
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            The gap between the lines represents your investment growth from interest.
          </p>
        </div>
        
        {/* Principal vs Interest Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-3">Principal vs Interest</h3>
            <div className="h-60 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatCurrency(value as number), ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 text-center mt-2">
              <div>
                <p className="text-xs text-muted-foreground">Principal</p>
                <p className="font-medium">{totalPrincipal !== null ? formatCurrency(totalPrincipal) : "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Interest</p>
                <p className="font-medium">{totalInterest !== null ? formatCurrency(totalInterest) : "N/A"}</p>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-3">Investment Breakdown</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm">Initial Investment</p>
                <p className="text-xl font-medium">{formatCurrency(initialInvestment)}</p>
              </div>
              <div>
                <p className="text-sm">Monthly Contributions</p>
                <p className="text-xl font-medium">{formatCurrency(monthlyContribution)}</p>
              </div>
              <div>
                <p className="text-sm">Total Contributions</p>
                <p className="text-xl font-medium">
                  {formatCurrency(initialInvestment + (monthlyContribution * 12 * investmentLength))}
                </p>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm">Return on Investment (ROI)</p>
                <p className="text-xl font-medium">
                  {totalPrincipal && futureValue ? 
                    `${formatNumber((futureValue / totalPrincipal - 1) * 100, 2)}%` : 
                    "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Investment Tips */}
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium mb-2">Investment Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <ul className="space-y-1 list-disc list-inside">
              <li>Start investing early to maximize compound interest.</li>
              <li>Regular contributions often have more impact than the initial investment.</li>
              <li>Diversify your investments to manage risk.</li>
              <li>Consider tax-advantaged accounts like 401(k)s and IRAs.</li>
            </ul>
            <ul className="space-y-1 list-disc list-inside">
              <li>Reinvest dividends to accelerate growth.</li>
              <li>Higher returns typically come with higher risk.</li>
              <li>Historically, the stock market has returned about 7-10% annually over the long term.</li>
              <li>Review and adjust your investment strategy periodically.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <CalculatorTemplate
      title="Investment Calculator"
      description="Calculate the future value of your investments with compound interest."
      category="financial"
      renderInputs={renderInputs}
      renderResults={renderResults}
      handleCalculate={calculateInvestment}
      handleReset={handleReset}
      showResults={showResults}
    />
  );
};

export default InvestmentCalculator;
