import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 2) {
      window.history.back();
    } else {
      navigate("/temples");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleBack}
      className="fixed top-20 left-4 z-40 h-10 w-10 rounded-full border-primary/30 bg-background/95 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:border-primary hover:shadow-lg hover:shadow-primary/20 md:h-11 md:w-11"
      aria-label="Go back"
    >
      <ChevronLeft className="h-5 w-5 text-primary" />
    </Button>
  );
};

export default BackButton;
