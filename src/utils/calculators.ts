
// Mortgage calculator functions
export const calculateMortgage = (
  loanAmount: number,
  monthlyRate: number,
  numberOfPayments: number
): number => {
  if (monthlyRate === 0) return loanAmount / numberOfPayments;
  
  return (
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  );
};

// BMI calculator functions
export const calculateBMI = (weight: number, height: number): number => {
  if (height <= 0 || weight <= 0) return 0;
  return weight / (height * height);
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 16.5) return "Severely Underweight";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  if (bmi < 35) return "Obese (Class I)";
  if (bmi < 40) return "Obese (Class II)";
  return "Obese (Class III)";
};

export const getBMIColor = (bmi: number): string => {
  if (bmi < 16.5) return "bg-blue-700";
  if (bmi < 18.5) return "bg-blue-500";
  if (bmi < 25) return "bg-green-500";
  if (bmi < 30) return "bg-yellow-500";
  if (bmi < 35) return "bg-orange-500";
  if (bmi < 40) return "bg-red-500";
  return "bg-purple-500";
};

// Age calculator functions
export const calculateAge = (birthDate: Date, toDate: Date) => {
  const years = toDate.getFullYear() - birthDate.getFullYear();
  const months = toDate.getMonth() - birthDate.getMonth();
  const days = toDate.getDate() - birthDate.getDate();
  
  // Adjust years and months if necessary
  let adjustedYears = years;
  let adjustedMonths = months;
  
  if (months < 0 || (months === 0 && days < 0)) {
    adjustedYears--;
    adjustedMonths = months + 12;
  }
  
  // Adjust days if necessary
  let adjustedDays = days;
  if (days < 0) {
    const lastMonthDate = new Date(toDate.getFullYear(), toDate.getMonth(), 0);
    adjustedDays = days + lastMonthDate.getDate();
    adjustedMonths--;
  }
  
  return {
    years: adjustedYears,
    months: adjustedMonths,
    days: adjustedDays
  };
};

// Utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

export const formatNumber = (number: number, decimals = 2): string => {
  return number.toFixed(decimals);
};

// Convert string to title case
export const toTitleCase = (str: string): string => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
};
