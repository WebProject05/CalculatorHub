
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Calculator } from "@/data/calculators";

// Adding framer-motion dependency
import { FramerMotion } from "framer-motion";

interface CalculatorCardProps {
  calculator: Calculator;
  delay?: number;
}

const CalculatorCard = ({ calculator, delay = 0 }: CalculatorCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  // Get badge color based on category
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "financial":
        return "category-badge-financial";
      case "health":
        return "category-badge-health";
      case "math":
        return "category-badge-math";
      case "general":
        return "category-badge-general";
      case "fun":
        return "category-badge-fun";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };
  
  return (
    <div
      className={`calculator-card transform transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <Link to={calculator.path} className="block h-full">
        <div className="p-6 flex flex-col h-full">
          <div className="mb-4 flex items-center justify-between">
            <span className={`category-badge ${getCategoryBadgeClass(calculator.category)}`}>
              {calculator.category.charAt(0).toUpperCase() + calculator.category.slice(1)}
            </span>
            
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
