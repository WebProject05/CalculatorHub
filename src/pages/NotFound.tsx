
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calculator, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold">404</h1>
          <h2 className="text-3xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="p-6 border border-border rounded-lg bg-muted/50">
          <p className="mb-2 font-medium">Looking for a calculator?</p>
          <p className="text-sm text-muted-foreground mb-4">
            Try one of these popular calculators or search for what you need.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link to="/calculators/financial/mortgage">
              <Button variant="outline" size="sm">Mortgage Calculator</Button>
            </Link>
            <Link to="/calculators/health/bmi">
              <Button variant="outline" size="sm">BMI Calculator</Button>
            </Link>
            <Link to="/calculators/math/scientific">
              <Button variant="outline" size="sm">Scientific Calculator</Button>
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/" className="w-full">
            <Button className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </Link>
          <Link to="/" className="w-full">
            <Button variant="outline" className="w-full">
              <Calculator className="mr-2 h-4 w-4" />
              Browse All Calculators
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
