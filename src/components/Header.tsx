
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Moon, Sun, Search, Menu, X, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { calculators } from "@/data/calculators";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Group calculators by category
  const calculatorsByCategory = {
    financial: calculators.filter((calc) => calc.category === "financial"),
    health: calculators.filter((calc) => calc.category === "health"),
    math: calculators.filter((calc) => calc.category === "math"),
    general: calculators.filter((calc) => calc.category === "general"),
    fun: calculators.filter((calc) => calc.category === "fun"),
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" 
          : "bg-background"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link 
              to="/" 
              className="text-xl font-semibold tracking-tight transition-colors"
            >
              <span className="font-light">All-in-One</span> <span className="font-bold">Calculator</span>
            </Link>
          </div>

          {/* Desktop Navigation with Dropdowns */}
          {!isMobile && (
            <NavigationMenu className="hidden md:flex mx-6">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className={`text-sm font-medium mr-4 transition-colors hover:text-primary ${
                    location.pathname === "/" ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    Home
                  </Link>
                </NavigationMenuItem>

                {/* Financial Calculators */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 text-sm font-medium bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
                    <span className="text-muted-foreground hover:text-primary">Financial</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {calculatorsByCategory.financial.map((calculator) => (
                        <NavigationMenuLink asChild key={calculator.id}>
                          <Link
                            to={calculator.path}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">{calculator.icon}</span>
                              <div className="text-sm font-medium leading-none">{calculator.title}</div>
                            </div>
                            <p className="line-clamp-2 text-xs text-muted-foreground">
                              {calculator.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Health Calculators */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 text-sm font-medium bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
                    <span className="text-muted-foreground hover:text-primary">Health</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {calculatorsByCategory.health.map((calculator) => (
                        <NavigationMenuLink asChild key={calculator.id}>
                          <Link
                            to={calculator.path}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">{calculator.icon}</span>
                              <div className="text-sm font-medium leading-none">{calculator.title}</div>
                            </div>
                            <p className="line-clamp-2 text-xs text-muted-foreground">
                              {calculator.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Math Calculators */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 text-sm font-medium bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
                    <span className="text-muted-foreground hover:text-primary">Math</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {calculatorsByCategory.math.map((calculator) => (
                        <NavigationMenuLink asChild key={calculator.id}>
                          <Link
                            to={calculator.path}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">{calculator.icon}</span>
                              <div className="text-sm font-medium leading-none">{calculator.title}</div>
                            </div>
                            <p className="line-clamp-2 text-xs text-muted-foreground">
                              {calculator.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* General Calculators */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 text-sm font-medium bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
                    <span className="text-muted-foreground hover:text-primary">General</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {calculatorsByCategory.general.map((calculator) => (
                        <NavigationMenuLink asChild key={calculator.id}>
                          <Link
                            to={calculator.path}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">{calculator.icon}</span>
                              <div className="text-sm font-medium leading-none">{calculator.title}</div>
                            </div>
                            <p className="line-clamp-2 text-xs text-muted-foreground">
                              {calculator.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Fun Calculators */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 text-sm font-medium bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
                    <span className="text-muted-foreground hover:text-primary">Fun</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {calculatorsByCategory.fun.map((calculator) => (
                        <NavigationMenuLink asChild key={calculator.id}>
                          <Link
                            to={calculator.path}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">{calculator.icon}</span>
                              <div className="text-sm font-medium leading-none">{calculator.title}</div>
                            </div>
                            <p className="line-clamp-2 text-xs text-muted-foreground">
                              {calculator.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}

          <div className="flex items-center gap-4">
            {/* Search Component */}
            <div className="hidden md:flex relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search calculators..."
                className="w-64 rounded-full bg-background pl-8 pr-4 focus-visible:ring-primary/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 transition-all" />
              ) : (
                <Moon className="h-5 w-5 transition-all" />
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background animate-fade-in">
          <nav className="container mx-auto p-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="p-2 text-lg font-medium rounded-md hover:bg-accent"
            >
              Home
            </Link>
            <Link 
              to="/calculators/financial/mortgage" 
              className="p-2 text-lg font-medium rounded-md hover:bg-accent"
            >
              Financial
            </Link>
            <Link 
              to="/calculators/health/bmi" 
              className="p-2 text-lg font-medium rounded-md hover:bg-accent"
            >
              Health
            </Link>
            <Link 
              to="/calculators/math/scientific" 
              className="p-2 text-lg font-medium rounded-md hover:bg-accent"
            >
              Math
            </Link>
            <Link 
              to="/calculators/general/age" 
              className="p-2 text-lg font-medium rounded-md hover:bg-accent"
            >
              General
            </Link>
            
            {/* Mobile Search */}
            <div className="relative mt-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search calculators..."
                className="w-full pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
