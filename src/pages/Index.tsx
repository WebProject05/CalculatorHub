
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Home, Calculator, Activity, PieChart, Coffee, Search,
  DollarSign, Heart, Percent, Clock, Sparkles
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CalculatorCard from "@/components/CalculatorCard";
import { calculators } from "@/data/calculators";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleCalculators, setVisibleCalculators] = useState(calculators);

  // Filter calculators based on search term and active category
  useEffect(() => {
    const filteredCalculators = calculators.filter((calculator) => {
      const matchesSearch = 
        calculator.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        calculator.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        activeCategory === "all" || calculator.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    setVisibleCalculators(filteredCalculators);
  }, [searchTerm, activeCategory]);

  // Category options
  const categories = [
    { id: "all", name: "All Calculators", icon: Calculator },
    { id: "financial", name: "Financial", icon: DollarSign },
    { id: "health", name: "Health & Fitness", icon: Heart },
    { id: "math", name: "Math & Statistics", icon: Percent },
    { id: "general", name: "General", icon: Clock },
    { id: "fun", name: "Fun & Games", icon: Sparkles },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Section */}
      <section className="py-16 px-4 text-center glass-panel animate-fade-in">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
          All-in-One Calculator Hub
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Your one-stop destination for all calculation needs - from finances to fitness, mathematics to daily utilities.
        </p>
        
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for a calculator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-6 text-base rounded-xl"
          />
        </div>
      </section>

      {/* Categories Navigation */}
      <section className="py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Categories</h2>
        </div>
        
        <div className="flex overflow-x-auto pb-4 gap-2 md:gap-4 px-1 scrollbar-none">
          {categories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                className={`flex items-center gap-2 rounded-full px-4 py-2 shadow-sm whitespace-nowrap transition-all duration-300
                  ${activeCategory === category.id ? 
                    "bg-primary text-primary-foreground" : 
                    "hover:bg-secondary"}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <CategoryIcon className="h-4 w-4" />
                <span>{category.name}</span>
              </Button>
            );
          })}
        </div>
      </section>

      {/* Calculators Grid */}
      <section className="py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            {activeCategory === "all" 
              ? "All Calculators" 
              : `${categories.find(c => c.id === activeCategory)?.name} Calculators`}
          </h2>
          
          <Badge variant="outline" className="px-3 py-1">
            {visibleCalculators.length} {visibleCalculators.length === 1 ? "calculator" : "calculators"} found
          </Badge>
        </div>
        
        {visibleCalculators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleCalculators.map((calculator, index) => (
              <CalculatorCard 
                key={calculator.id}
                calculator={calculator}
                delay={index * 0.05}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No calculators found for "{searchTerm}"</p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("all");
              }}
            >
              Clear search
            </Button>
          </div>
        )}
      </section>

      {/* Featured Calculators */}
      {activeCategory === "all" && searchTerm === "" && (
        <section className="py-6">
          <h2 className="text-2xl font-semibold mb-6">Featured Calculators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {calculators
              .filter(calc => calc.featured)
              .slice(0, 4)
              .map((calculator, index) => (
                <CalculatorCard 
                  key={calculator.id}
                  calculator={calculator}
                  delay={index * 0.05}
                />
              ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
