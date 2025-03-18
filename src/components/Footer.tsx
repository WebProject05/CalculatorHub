
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-lg font-medium">All-in-One Calculator</h3>
            <p className="text-sm text-muted-foreground">
              Your comprehensive calculator hub for all types of calculations.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/calculators/financial/mortgage" className="text-muted-foreground hover:text-foreground transition-colors">
                  Financial
                </Link>
              </li>
              <li>
                <Link to="/calculators/health/bmi" className="text-muted-foreground hover:text-foreground transition-colors">
                  Health & Fitness
                </Link>
              </li>
              <li>
                <Link to="/calculators/math/scientific" className="text-muted-foreground hover:text-foreground transition-colors">
                  Math & Statistics
                </Link>
              </li>
              <li>
                <Link to="/calculators/general/age" className="text-muted-foreground hover:text-foreground transition-colors">
                  General
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Popular Calculators</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/calculators/financial/mortgage" className="text-muted-foreground hover:text-foreground transition-colors">
                  Mortgage Calculator
                </Link>
              </li>
              <li>
                <Link to="/calculators/health/bmi" className="text-muted-foreground hover:text-foreground transition-colors">
                  BMI Calculator
                </Link>
              </li>
              <li>
                <Link to="/calculators/math/scientific" className="text-muted-foreground hover:text-foreground transition-colors">
                  Scientific Calculator
                </Link>
              </li>
              <li>
                <Link to="/calculators/general/age" className="text-muted-foreground hover:text-foreground transition-colors">
                  Age Calculator
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">About</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} All-in-One Calculator Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
