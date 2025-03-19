
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { formatCurrency, formatNumber } from "@/utils/calculators";
import CalculatorTemplate from "@/utils/CalculatorTemplate";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CreditCard, Calendar, DollarSign } from "lucide-react";

interface PaymentSchedule {
  month: number;
  payment: number;
  interestPaid: number;
  principalPaid: number;
  remainingBalance: number;
}

const CreditCardPayoffCalculator = () => {
  // State for inputs
  const [balance, setBalance] = useState<number>(5000);
  const [interestRate, setInterestRate] = useState<number>(18.9);
  const [paymentType, setPaymentType] = useState<"fixed" | "time">("fixed");
  const [monthlyPayment, setMonthlyPayment] = useState<number>(200);
  const [monthsToPayoff, setMonthsToPayoff] = useState<number>(36);
  
  // Results
  const [calculatedMonthlyPayment, setCalculatedMonthlyPayment] = useState<number | null>(null);
  const [calculatedMonthsToPayoff, setCalculatedMonthsToPayoff] = useState<number | null>(null);
  const [totalInterestPaid, setTotalInterestPaid] = useState<number | null>(null);
  const [totalAmountPaid, setTotalAmountPaid] = useState<number | null>(null);
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentSchedule[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  
  // Set minimum monthly payment based on balance
  useEffect(() => {
    const minPayment = Math.max(25, balance * 0.02);
    if (monthlyPayment < minPayment) {
      setMonthlyPayment(Math.ceil(minPayment));
    }
  }, [balance]);

  // Calculate payoff
  const calculatePayoff = () => {
    try {
      // Validate inputs
      if (balance <= 0) {
        toast.error("Balance must be greater than zero");
        return;
      }
      
      if (interestRate <= 0) {
        toast.error("Interest rate must be greater than zero");
        return;
      }
      
      // Monthly interest rate
      const monthlyRate = interestRate / 100 / 12;
      
      if (paymentType === "fixed") {
        // Calculate months to pay off with fixed payment
        if (monthlyPayment <= balance * monthlyRate) {
          toast.error("Monthly payment is too low to pay off the balance");
          return;
        }
        
        // Calculate months to payoff
        const months = calculateMonthsToPayoff(balance, monthlyRate, monthlyPayment);
        setCalculatedMonthsToPayoff(months);
        setCalculatedMonthlyPayment(monthlyPayment);
        
        // Generate payment schedule
        const schedule = generatePaymentSchedule(balance, monthlyRate, monthlyPayment, months);
        setPaymentSchedule(schedule);
        
        // Calculate total interest and amount paid
        const totalInterest = schedule.reduce((sum, month) => sum + month.interestPaid, 0);
        const totalAmount = schedule.reduce((sum, month) => sum + month.payment, 0);
        setTotalInterestPaid(totalInterest);
        setTotalAmountPaid(totalAmount);
      } else {
        // Calculate monthly payment with fixed time to pay off
        if (monthsToPayoff <= 0) {
          toast.error("Months to pay off must be greater than zero");
          return;
        }
        
        // Calculate monthly payment
        const payment = calculateMonthlyPayment(balance, monthlyRate, monthsToPayoff);
        setCalculatedMonthlyPayment(payment);
        setCalculatedMonthsToPayoff(monthsToPayoff);
        
        // Generate payment schedule
        const schedule = generatePaymentSchedule(balance, monthlyRate, payment, monthsToPayoff);
        setPaymentSchedule(schedule);
        
        // Calculate total interest and amount paid
        const totalInterest = schedule.reduce((sum, month) => sum + month.interestPaid, 0);
        const totalAmount = schedule.reduce((sum, month) => sum + month.payment, 0);
        setTotalInterestPaid(totalInterest);
        setTotalAmountPaid(totalAmount);
      }
      
      setShowResults(true);
      toast.success("Payoff schedule calculated successfully");
    } catch (error) {
      console.error("Error calculating payoff:", error);
      toast.error("Error in calculation. Please check your inputs.");
    }
  };

  // Calculate months to pay off with fixed payment
  const calculateMonthsToPayoff = (
    principal: number,
    monthlyRate: number,
    payment: number
  ): number => {
    // Formula: log(1 - (principal * rate / payment)) / log(1 + rate)
    const numerator = Math.log(1 + (principal * monthlyRate) / payment);
    const denominator = Math.log(1 + monthlyRate);
    const months = Math.ceil(-numerator / denominator);
    
    return months;
  };

  // Calculate monthly payment with fixed time to pay off
  const calculateMonthlyPayment = (
    principal: number,
    monthlyRate: number,
    months: number
  ): number => {
    // Formula: principal * rate * (1 + rate)^months / ((1 + rate)^months - 1)
    const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, months);
    const denominator = Math.pow(1 + monthlyRate, months) - 1;
    const payment = numerator / denominator;
    
    return Math.ceil(payment * 100) / 100; // Round up to nearest cent
  };

  // Generate payment schedule
  const generatePaymentSchedule = (
    principal: number,
    monthlyRate: number,
    payment: number,
    months: number
  ): PaymentSchedule[] => {
    const schedule: PaymentSchedule[] = [];
    let remainingBalance = principal;
    
    for (let month = 1; month <= months && remainingBalance > 0; month++) {
      const interestForMonth = remainingBalance * monthlyRate;
      let principalForMonth = payment - interestForMonth;
      let actualPayment = payment;
      
      // Handle final payment (might be less than regular payment)
      if (principalForMonth > remainingBalance) {
        principalForMonth = remainingBalance;
        actualPayment = principalForMonth + interestForMonth;
      }
      
      remainingBalance -= principalForMonth;
      
      schedule.push({
        month,
        payment: actualPayment,
        interestPaid: interestForMonth,
        principalPaid: principalForMonth,
        remainingBalance
      });
      
      // Break if balance is effectively zero (floating point issues)
      if (remainingBalance < 0.01) {
        break;
      }
    }
    
    return schedule;
  };

  // Reset calculator
  const handleReset = () => {
    setBalance(5000);
    setInterestRate(18.9);
    setPaymentType("fixed");
    setMonthlyPayment(200);
    setMonthsToPayoff(36);
    setCalculatedMonthlyPayment(null);
    setCalculatedMonthsToPayoff(null);
    setTotalInterestPaid(null);
    setTotalAmountPaid(null);
    setPaymentSchedule([]);
    setShowResults(false);
    toast.info("Calculator has been reset");
  };

  // Render input form
  const renderInputs = () => {
    // Calculate minimum payment (greater of $25 or 2% of balance)
    const minPayment = Math.max(25, balance * 0.02);
    
    return (
      <div className="space-y-6">
        {/* Balance */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="balance">Credit Card Balance</Label>
            <span className="text-sm text-muted-foreground">{formatCurrency(balance)}</span>
          </div>
          <Input
            id="balance"
            type="number"
            value={balance}
            onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
            min={0}
            className="w-full"
          />
          <Slider
            value={[balance]}
            onValueChange={(values) => setBalance(values[0])}
            min={1000}
            max={30000}
            step={100}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$1,000</span>
            <span>$30,000</span>
          </div>
        </div>
        
        {/* Interest Rate */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
            <span className="text-sm text-muted-foreground">{interestRate}%</span>
          </div>
          <Input
            id="interestRate"
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
            min={0.1}
            step={0.1}
            className="w-full"
          />
          <Slider
            value={[interestRate]}
            onValueChange={(values) => setInterestRate(values[0])}
            min={5}
            max={30}
            step={0.1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5%</span>
            <span>30%</span>
          </div>
        </div>
        
        {/* Payment Type Selector */}
        <div className="space-y-2">
          <Label>Payoff Method</Label>
          <Tabs 
            value={paymentType} 
            onValueChange={(value) => setPaymentType(value as "fixed" | "time")}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="fixed" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Fixed Payment
              </TabsTrigger>
              <TabsTrigger value="time" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fixed Time
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="fixed" className="space-y-4 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="monthlyPayment">Monthly Payment</Label>
                  <span className="text-sm text-muted-foreground">{formatCurrency(monthlyPayment)}</span>
                </div>
                <Input
                  id="monthlyPayment"
                  type="number"
                  value={monthlyPayment}
                  onChange={(e) => setMonthlyPayment(parseFloat(e.target.value) || 0)}
                  min={minPayment}
                  className="w-full"
                />
                <Slider
                  value={[monthlyPayment]}
                  onValueChange={(values) => setMonthlyPayment(values[0])}
                  min={minPayment}
                  max={Math.max(minPayment * 5, 500)}
                  step={10}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(minPayment)}</span>
                  <span>{formatCurrency(Math.max(minPayment * 5, 500))}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum payment: {formatCurrency(minPayment)} (2% of balance or $25, whichever is greater)
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="time" className="space-y-4 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="monthsToPayoff">Months to Pay Off</Label>
                  <span className="text-sm text-muted-foreground">{monthsToPayoff} months</span>
                </div>
                <Input
                  id="monthsToPayoff"
                  type="number"
                  value={monthsToPayoff}
                  onChange={(e) => setMonthsToPayoff(parseInt(e.target.value) || 0)}
                  min={1}
                  className="w-full"
                />
                <Slider
                  value={[monthsToPayoff]}
                  onValueChange={(values) => setMonthsToPayoff(values[0])}
                  min={6}
                  max={120}
                  step={1}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>6 months</span>
                  <span>120 months</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  };

  // Render results
  const renderResults = () => {
    const chartData = paymentSchedule.filter((_, index) => index % Math.max(1, Math.floor(paymentSchedule.length / 20)) === 0);
    
    return (
      <div className="space-y-6">
        {/* Summary Results */}
        <div className="p-6 bg-secondary rounded-lg">
          <div className="flex items-center justify-center mb-4">
            <CreditCard className="w-10 h-10 text-primary" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Monthly Payment</p>
              <p className="text-3xl font-bold">{calculatedMonthlyPayment !== null ? formatCurrency(calculatedMonthlyPayment) : "N/A"}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Time to Pay Off</p>
              <p className="text-3xl font-bold">
                {calculatedMonthsToPayoff !== null ? (
                  calculatedMonthsToPayoff < 12 
                    ? `${calculatedMonthsToPayoff} months` 
                    : `${Math.floor(calculatedMonthsToPayoff / 12)} years ${calculatedMonthsToPayoff % 12} months`
                ) : "N/A"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Interest</p>
              <p className="text-3xl font-bold">{totalInterestPaid !== null ? formatCurrency(totalInterestPaid) : "N/A"}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Amount Paid</p>
              <p className="text-3xl font-bold">{totalAmountPaid !== null ? formatCurrency(totalAmountPaid) : "N/A"}</p>
            </div>
          </div>
        </div>
        
        {/* Payoff Chart */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-4">Balance Payoff Timeline</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  label={{ value: 'Months', position: 'insideBottomRight', offset: -5 }} 
                />
                <YAxis 
                  tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value as number), "Balance"]}
                  labelFormatter={(value) => `Month ${value}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="remainingBalance" 
                  name="Remaining Balance" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Amortization Schedule */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Payment Schedule</h3>
          <div className="max-h-60 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-background">
                <tr className="border-b">
                  <th className="text-left p-2">Month</th>
                  <th className="text-right p-2">Payment</th>
                  <th className="text-right p-2">Interest</th>
                  <th className="text-right p-2">Principal</th>
                  <th className="text-right p-2">Remaining</th>
                </tr>
              </thead>
              <tbody>
                {paymentSchedule.map((month, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{month.month}</td>
                    <td className="text-right p-2">{formatCurrency(month.payment)}</td>
                    <td className="text-right p-2">{formatCurrency(month.interestPaid)}</td>
                    <td className="text-right p-2">{formatCurrency(month.principalPaid)}</td>
                    <td className="text-right p-2">{formatCurrency(month.remainingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Tips */}
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium mb-2">Tips to Pay Off Credit Card Debt Faster</h3>
          <ul className="text-sm space-y-2 list-disc list-inside">
            <li>Pay more than the minimum payment whenever possible.</li>
            <li>Consider transferring high-interest balances to a card with a lower rate or 0% intro APR.</li>
            <li>Use the "debt avalanche" method: pay off highest interest rate cards first.</li>
            <li>Make bi-weekly payments instead of monthly to reduce interest and pay off debt faster.</li>
            <li>Apply any windfalls (tax refunds, bonuses, etc.) to your credit card balance.</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <CalculatorTemplate
      title="Credit Card Payoff Calculator"
      description="Calculate how long it will take to pay off your credit card and how much interest you'll pay."
      category="financial"
      renderInputs={renderInputs}
      renderResults={renderResults}
      handleCalculate={calculatePayoff}
      handleReset={handleReset}
      showResults={showResults}
    />
  );
};

export default CreditCardPayoffCalculator;
