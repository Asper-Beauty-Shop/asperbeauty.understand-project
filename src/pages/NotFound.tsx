import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FlaskConical, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        {/* Decorative maroon line icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/5 border border-primary/10">
          <FlaskConical className="h-10 w-10 text-primary/60" />
        </div>

        <h1 className="font-heading text-5xl font-bold text-foreground mb-3">404</h1>
        <p className="font-heading text-xl text-foreground mb-2">
          Formula Not Found
        </p>
        <p className="text-muted-foreground font-body mb-8 leading-relaxed">
          We couldn't find that product. It may have been discontinued for a better formula.
          Let our pharmacists guide you to something extraordinary.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Return Home
            </Button>
          </Link>
          <Link to="/products">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 btn-ripple gap-2">
              Browse Best Sellers
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
