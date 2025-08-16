import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Menu, X, Upload, BarChart3, Home } from "lucide-react";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-medical rounded-lg shadow-medical">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">LungScan</h1>
              <p className="text-xs text-muted-foreground">Cancer Detection System</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('hero')}
              className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button 
              onClick={() => scrollToSection('upload')}
              className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>
            <button 
              onClick={() => scrollToSection('dashboard')}
              className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <Button variant="medical" size="sm">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-4">
            <div className="space-y-4">
              <button 
                onClick={() => scrollToSection('hero')}
                className="flex items-center space-x-3 text-muted-foreground hover:text-primary transition-colors w-full text-left"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              <button 
                onClick={() => scrollToSection('upload')}
                className="flex items-center space-x-3 text-muted-foreground hover:text-primary transition-colors w-full text-left"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Dataset</span>
              </button>
              <button 
                onClick={() => scrollToSection('dashboard')}
                className="flex items-center space-x-3 text-muted-foreground hover:text-primary transition-colors w-full text-left"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <Button variant="medical" size="sm" className="w-full">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};