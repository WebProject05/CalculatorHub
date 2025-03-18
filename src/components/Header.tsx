
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Moon, Sun, Search, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === "/" 
                    ? "text-foreground" 
                    : "text-muted-foreground"
                }`}
              >
                Home
              </Link>
              <Link 
                to="/calculators/financial/mortgage" 
                className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
              >
                Financial
              </Link>
              <Link 
                to="/calculators/health/bmi" 
                className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
              >
                Health
              </Link>
              <Link 
                to="/calculators/math/scientific" 
                className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
              >
                Math
              </Link>
              <Link 
                to="/calculators/general/age" 
                className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
              >
                General
              </Link>
            </nav>
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
