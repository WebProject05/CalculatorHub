
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Calculator } from "@/data/calculators";

interface CalculatorCardProps {
  calculator: Calculator;
  delay?: number;
}

const CalculatorCard = ({ calculator, delay = 0 }: CalculatorCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 100); // Reduce delay multiplier to make animations faster
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  // Get badge color based on category
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "financial":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
      case "health":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
      case "math":
        return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800";
      case "general":
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700";
      case "fun":
        return "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };
  
  return (
    <div
      className={`bg-card text-card-foreground shadow-sm hover:shadow-md rounded-lg overflow-hidden border border-border transition-all duration-300 h-full ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <Link to={calculator.path} className="block h-full">
        <div className="p-6 flex flex-col h-full">
          <div className="mb-4 flex items-center justify-between">
            <Badge variant="outline" className={`category-badge ${getCategoryBadgeClass(calculator.category)}`}>
              {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1)}
            </Badge>
            
            {calculator.featured && (
              <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800">
                Featured
              </Badge>
            )}
          </div>
          
          <div className="mb-4 flex items-center justify-center text-3xl text-primary">
            {calculator.icon}
          </div>
          
          <h3 className="text-xl font-semibold mb-2">{calculator.title}</h3>
          
          <p className="text-sm text-muted-foreground mb-4 flex-grow">{calculator.description}</p>
          
          <div className="mt-auto pt-4 border-t border-border">
            <span className="text-sm text-primary font-medium">
              Use Calculator →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CalculatorCard;
