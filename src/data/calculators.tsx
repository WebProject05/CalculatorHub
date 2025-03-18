
import {
  DollarSign,
  Home,
  Car,
  Percent,
  CreditCard,
  PiggyBank,
  BarChart,
  TrendingUp,
  Calculator,
  Scale,
  Activity,
  Heart,
  Baby,
  Droplet,
  Apple,
  Watch,
  BarChart3,
  Timer,
  PlusSquare,
  Pi,
  Divide,
  Shuffle,
  Triangle,
  BarChartHorizontal,
  XCircle,
  Sigma,
  FileSpreadsheet,
  FilePlus2,
  Circle,
  Trigonometry,
  LineChart,
  CalendarDays,
  Clock,
  Clock3,
  GraduationCap,
  Puzzle,
  Network,
  KeyRound,
  Layers,
  Globe,
  Car as CarIcon,
  Footprints,
  Leaf,
  Zodiac,
  Truck,
  Heart as HeartIcon,
  Dice5,
  Dog,
  Flame,
  Wine,
  MonitorPlay,
  Share2,
  Hash
} from "lucide-react";

export interface Calculator {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  category: string;
  path: string;
  featured?: boolean;
}

export const calculators: Calculator[] = [
  // Financial Calculators
  {
    id: "mortgage",
    title: "Mortgage Calculator",
    description: "Calculate your monthly mortgage payments based on various factors.",
    icon: <Home className="h-6 w-6" />,
    category: "financial",
    path: "/calculators/financial/mortgage",
    featured: true
  },
  {
    id: "loan",
    title: "Loan Calculator",
    description: "Calculate loan payments, interest, and amortization schedules.",
    icon: <DollarSign className="h-6 w-6" />,
    category: "financial",
    path: "/calculators/financial/loan"
  },
  {
    id: "auto-loan",
    title: "Auto Loan Calculator",
    description: "Calculate car loan payments and total interest over the loan term.",
    icon: <Car className="h-6 w-6" />,
    category: "financial",
    path: "/calculators/financial/auto-loan"
  },
  {
    id: "interest",
    title: "Interest Calculator",
    description: "Calculate simple and compound interest on your investments.",
    icon: <Percent className="h-6 w-6" />,
    category: "financial",
    path: "/calculators/financial/interest"
  },
  {
    id: "credit-card-payoff",
    title: "Credit Card Payoff Calculator",
    description: "Calculate how long it will take to pay off your credit card debt.",
    icon: <CreditCard className="h-6 w-6" />,
    category: "financial",
    path: "/calculators/financial/credit-card-payoff"
  },
  {
    id: "retirement",
    title: "Retirement Calculator",
    description: "Plan your retirement savings and forecast your future finances.",
    icon: <PiggyBank className="h-6 w-6" />,
    category: "financial",
    path: "/calculators/financial/retirement",
    featured: true
  },
  {
    id: "investment",
    title: "Investment Calculator",
    description: "Analyze returns on investments with customizable variables.",
    icon: <TrendingUp className="h-6 w-6" />,
    category: "financial",
    path: "/calculators/financial/investment"
  },
  {
    id: "compound-interest",
    title: "Compound Interest Calculator",
    description: "See the power of compound interest on your savings over time.",
    icon: <BarChart className="h-6 w-6" />,
    category: "financial",
    path: "/calculators/financial/compound-interest"
  },
  
  // Health & Fitness Calculators
  {
    id: "bmi",
    title: "BMI Calculator",
    description: "Calculate your Body Mass Index to assess your weight relative to height.",
    icon: <Scale className="h-6 w-6" />,
    category: "health",
    path: "/calculators/health/bmi",
    featured: true
  },
  {
    id: "calorie",
    title: "Calorie Calculator",
    description: "Calculate your daily calorie needs based on activity level and goals.",
    icon: <Activity className="h-6 w-6" />,
    category: "health",
    path: "/calculators/health/calorie"
  },
  {
    id: "body-fat",
    title: "Body Fat Calculator",
    description: "Estimate your body fat percentage using various measurement methods.",
    icon: <Heart className="h-6 w-6" />,
    category: "health",
    path: "/calculators/health/body-fat"
  },
  {
    id: "pregnancy",
    title: "Pregnancy Calculator",
    description: "Calculate important pregnancy dates and milestones.",
    icon: <Baby className="h-6 w-6" />,
    category: "health",
    path: "/calculators/health/pregnancy"
  },
  {
    id: "water-intake",
    title: "Water Intake Calculator",
    description: "Determine your recommended daily water intake based on various factors.",
    icon: <Droplet className="h-6 w-6" />,
    category: "health",
    path: "/calculators/health/water-intake"
  },
  {
    id: "macro-nutrient",
    title: "Macro Nutrient Calculator",
    description: "Calculate your ideal macronutrient ratios for your fitness goals.",
    icon: <Apple className="h-6 w-6" />,
    category: "health",
    path: "/calculators/health/macro-nutrient"
  },
  {
    id: "heart-rate-zone",
    title: "Heart Rate Zone Calculator",
    description: "Calculate your target heart rate zones for effective workouts.",
    icon: <Activity className="h-6 w-6" />,
    category: "health",
    path: "/calculators/health/heart-rate-zone"
  },
  {
    id: "one-rep-max",
    title: "One Rep Max Calculator",
    description: "Estimate your one-repetition maximum for various strength exercises.",
    icon: <BarChart3 className="h-6 w-6" />,
    category: "health",
    path: "/calculators/health/one-rep-max"
  },
  
  // Math & Statistics Calculators
  {
    id: "scientific",
    title: "Scientific Calculator",
    description: "Perform advanced scientific calculations with this versatile tool.",
    icon: <Calculator className="h-6 w-6" />,
    category: "math",
    path: "/calculators/math/scientific",
    featured: true
  },
  {
    id: "fraction",
    title: "Fraction Calculator",
    description: "Add, subtract, multiply, and divide fractions with ease.",
    icon: <Divide className="h-6 w-6" />,
    category: "math",
    path: "/calculators/math/fraction"
  },
  {
    id: "percentage",
    title: "Percentage Calculator",
    description: "Calculate percentages, increases, decreases, and differences.",
    icon: <Percent className="h-6 w-6" />,
    category: "math",
    path: "/calculators/math/percentage"
  },
  {
    id: "random-number",
    title: "Random Number Generator",
    description: "Generate random numbers with customizable parameters.",
    icon: <Shuffle className="h-6 w-6" />,
    category: "math",
    path: "/calculators/math/random-number"
  },
  {
    id: "triangle",
    title: "Triangle Calculator",
    description: "Calculate properties of triangles including area and perimeter.",
    icon: <Triangle className="h-6 w-6" />,
    category: "math",
    path: "/calculators/math/triangle"
  },
  {
    id: "standard-deviation",
    title: "Standard Deviation Calculator",
    description: "Calculate statistical measures including standard deviation.",
    icon: <BarChartHorizontal className="h-6 w-6" />,
    category: "math",
    path: "/calculators/math/standard-deviation"
  },
  {
    id: "quadratic-equation",
    title: "Quadratic Equation Solver",
    description: "Solve quadratic equations and visualize the solutions.",
    icon: <XCircle className="h-6 w-6" />,
    category: "math",
    path: "/calculators/math/quadratic-equation"
  },
  {
    id: "permutation-combination",
    title: "Permutation & Combination Calculator",
    description: "Calculate permutations and combinations for given sets.",
    icon: <Sigma className="h-6 w-6" />,
    category: "math",
    path: "/calculators/math/permutation-combination"
  },
  
  // General Calculators
  {
    id: "age",
    title: "Age Calculator",
    description: "Calculate exact age between two dates in years, months, and days.",
    icon: <CalendarDays className="h-6 w-6" />,
    category: "general",
    path: "/calculators/general/age",
    featured: true
  },
  {
    id: "date",
    title: "Date Calculator",
    description: "Calculate the difference between dates or add/subtract days.",
    icon: <CalendarDays className="h-6 w-6" />,
    category: "general",
    path: "/calculators/general/date"
  },
  {
    id: "time",
    title: "Time Calculator",
    description: "Add or subtract hours, minutes, and seconds with precision.",
    icon: <Clock className="h-6 w-6" />,
    category: "general",
    path: "/calculators/general/time"
  },
  {
    id: "hours",
    title: "Hours Calculator",
    description: "Calculate work hours and pay for timesheet management.",
    icon: <Clock3 className="h-6 w-6" />,
    category: "general",
    path: "/calculators/general/hours"
  },
  {
    id: "gpa",
    title: "GPA Calculator",
    description: "Calculate your Grade Point Average based on course grades and credits.",
    icon: <GraduationCap className="h-6 w-6" />,
    category: "general",
    path: "/calculators/general/gpa"
  },
  {
    id: "password-generator",
    title: "Password Generator",
    description: "Generate secure, random passwords with customizable parameters.",
    icon: <KeyRound className="h-6 w-6" />,
    category: "general",
    path: "/calculators/general/password-generator"
  },
  {
    id: "unit-converter",
    title: "Unit Converter",
    description: "Convert between different units of measurement.",
    icon: <Layers className="h-6 w-6" />,
    category: "general",
    path: "/calculators/general/unit-converter"
  },
  {
    id: "currency-converter",
    title: "Currency Converter",
    description: "Convert between different currencies with up-to-date exchange rates.",
    icon: <Globe className="h-6 w-6" />,
    category: "general",
    path: "/calculators/general/currency-converter"
  },
  
  // Fun & Viral Calculators
  {
    id: "love",
    title: "Love Calculator",
    description: "Test compatibility and find your love score with this fun calculator.",
    icon: <HeartIcon className="h-6 w-6" />,
    category: "fun",
    path: "/calculators/fun/love"
  },
  {
    id: "lucky-number",
    title: "Lucky Number Calculator",
    description: "Discover your lucky numbers based on your name and birth date.",
    icon: <Dice5 className="h-6 w-6" />,
    category: "fun",
    path: "/calculators/fun/lucky-number"
  },
  {
    id: "pet-age",
    title: "Pet Age Calculator",
    description: "Convert your pet's age to human years for dogs and cats.",
    icon: <Dog className="h-6 w-6" />,
    category: "fun",
    path: "/calculators/fun/pet-age"
  },
  {
    id: "calorie-burn",
    title: "Daily Calorie Burn Estimate",
    description: "Estimate calories burned during different activities.",
    icon: <Flame className="h-6 w-6" />,
    category: "fun",
    path: "/calculators/fun/calorie-burn"
  },
  {
    id: "alcohol-consumption",
    title: "Alcohol Consumption Calculator",
    description: "Estimate blood alcohol content based on drinks consumed.",
    icon: <Wine className="h-6 w-6" />,
    category: "fun",
    path: "/calculators/fun/alcohol-consumption"
  },
  {
    id: "binge-watch",
    title: "Binge-Watch Time Calculator",
    description: "Calculate how long it will take to watch an entire series.",
    icon: <MonitorPlay className="h-6 w-6" />,
    category: "fun",
    path: "/calculators/fun/binge-watch"
  },
  {
    id: "social-media-engagement",
    title: "Social Media Engagement Calculator",
    description: "Calculate engagement rates for your social media content.",
    icon: <Share2 className="h-6 w-6" />,
    category: "fun",
    path: "/calculators/fun/social-media-engagement"
  },
  {
    id: "name-numerology",
    title: "Name Numerology Calculator",
    description: "Discover the numerological significance of your name.",
    icon: <Hash className="h-6 w-6" />,
    category: "fun",
    path: "/calculators/fun/name-numerology",
    featured: true
  }
];
