
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

// Unit conversion functions
export interface ConversionUnit {
  id: string;
  name: string;
  conversionFactor: number;
}

export const convertValue = (
  value: number,
  fromUnit: ConversionUnit,
  toUnit: ConversionUnit
): number => {
  // Convert from source unit to standard unit, then to target unit
  return value * (fromUnit.conversionFactor / toUnit.conversionFactor);
};

// Temperature conversion functions (special case)
export const convertTemperature = (
  value: number,
  fromUnit: string,
  toUnit: string
): number => {
  // Convert to Celsius first as intermediate step
  let celsius;
  
  if (fromUnit === "celsius") {
    celsius = value;
  } else if (fromUnit === "fahrenheit") {
    celsius = (value - 32) * (5/9);
  } else if (fromUnit === "kelvin") {
    celsius = value - 273.15;
  } else {
    return 0;
  }
  
  // Convert from Celsius to target unit
  if (toUnit === "celsius") {
    return celsius;
  } else if (toUnit === "fahrenheit") {
    return (celsius * (9/5)) + 32;
  } else if (toUnit === "kelvin") {
    return celsius + 273.15;
  } else {
    return 0;
  }
};

// Triangle calculator functions
export const calculateTriangleArea = (base: number, height: number): number => {
  return (base * height) / 2;
};

export const calculateTrianglePerimeter = (a: number, b: number, c: number): number => {
  return a + b + c;
};

export const calculateTriangleAreaWithSides = (a: number, b: number, c: number): number => {
  // Heron's formula
  const s = (a + b + c) / 2;
  return Math.sqrt(s * (s - a) * (s - b) * (s - c));
};

// Fraction calculator functions
export interface Fraction {
  numerator: number;
  denominator: number;
}

export const addFractions = (a: Fraction, b: Fraction): Fraction => {
  const numerator = a.numerator * b.denominator + b.numerator * a.denominator;
  const denominator = a.denominator * b.denominator;
  return simplifyFraction({ numerator, denominator });
};

export const subtractFractions = (a: Fraction, b: Fraction): Fraction => {
  const numerator = a.numerator * b.denominator - b.numerator * a.denominator;
  const denominator = a.denominator * b.denominator;
  return simplifyFraction({ numerator, denominator });
};

export const multiplyFractions = (a: Fraction, b: Fraction): Fraction => {
  const numerator = a.numerator * b.numerator;
  const denominator = a.denominator * b.denominator;
  return simplifyFraction({ numerator, denominator });
};

export const divideFractions = (a: Fraction, b: Fraction): Fraction => {
  const numerator = a.numerator * b.denominator;
  const denominator = a.denominator * b.numerator;
  return simplifyFraction({ numerator, denominator });
};

export const simplifyFraction = (fraction: Fraction): Fraction => {
  const gcd = findGCD(Math.abs(fraction.numerator), fraction.denominator);
  return {
    numerator: fraction.numerator / gcd,
    denominator: fraction.denominator / gcd
  };
};

export const findGCD = (a: number, b: number): number => {
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
};

export const formatFraction = (fraction: Fraction): string => {
  if (fraction.denominator === 1) {
    return `${fraction.numerator}`;
  }
  if (Math.abs(fraction.numerator) > fraction.denominator) {
    const wholePart = Math.floor(Math.abs(fraction.numerator) / fraction.denominator);
    const remainder = Math.abs(fraction.numerator) % fraction.denominator;
    const sign = fraction.numerator < 0 ? "-" : "";
    return remainder === 0 
      ? `${sign}${wholePart}` 
      : `${sign}${wholePart} ${remainder}/${fraction.denominator}`;
  }
  return `${fraction.numerator}/${fraction.denominator}`;
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

// Quadratic equation solver
export const solveQuadraticEquation = (a: number, b: number, c: number): {
  discriminant: number;
  x1: number | null;
  x2: number | null;
  hasRealRoots: boolean;
  hasComplexRoots: boolean;
} => {
  // Calculate the discriminant
  const discriminant = b * b - 4 * a * c;
  
  let x1: number | null = null;
  let x2: number | null = null;
  let hasRealRoots = false;
  let hasComplexRoots = false;
  
  if (discriminant > 0) {
    // Two distinct real roots
    x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    hasRealRoots = true;
  } else if (discriminant === 0) {
    // One real root (repeated)
    x1 = -b / (2 * a);
    x2 = x1;
    hasRealRoots = true;
  } else {
    // Complex roots
    hasComplexRoots = true;
  }
  
  return {
    discriminant,
    x1,
    x2,
    hasRealRoots,
    hasComplexRoots
  };
};

// Statistical functions
export const calculateMean = (values: number[]): number => {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

export const calculateMedian = (values: number[]): number => {
  if (values.length === 0) return 0;
  
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  } else {
    return sorted[middle];
  }
};

export const calculateVariance = (values: number[]): number => {
  if (values.length <= 1) return 0;
  
  const mean = calculateMean(values);
  const sumOfSquares = values.reduce((sum, value) => {
    return sum + Math.pow(value - mean, 2);
  }, 0);
  
  return sumOfSquares / (values.length - 1); // Sample variance
};

export const calculateStandardDeviation = (values: number[]): number => {
  return Math.sqrt(calculateVariance(values));
};

// Permutation and combination
export const factorial = (n: number): number => {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

export const calculatePermutation = (n: number, r: number): number => {
  if (n < r) return 0;
  return factorial(n) / factorial(n - r);
};

export const calculateCombination = (n: number, r: number): number => {
  if (n < r) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
};
