import { Button } from "@/components/ui/button";
import { Upload, Brain, BarChart3 } from "lucide-react";
import heroImage from "@/assets/hero-medical.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-subtle overflow-hidden">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Lung cancer detection AI visualization" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/90" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/50 text-accent-foreground text-sm font-medium mb-6 animate-pulse-medical">
              <Brain className="w-4 h-4 mr-2" />
              AI-Powered Detection
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Advanced Lung Cancer
              <span className="block bg-gradient-medical bg-clip-text text-transparent">
                Detection System
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Leverage cutting-edge CNN deep learning technology to analyze medical imaging 
              and detect lung cancer with unprecedented accuracy and speed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="medical" size="lg" className="group">
                <Upload className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Upload Dataset
              </Button>
              <Button variant="outline" size="lg">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Results
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border/50">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">95.8%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">2.3s</div>
                <div className="text-sm text-muted-foreground">Processing Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Images Analyzed</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Elements */}
          <div className="relative">
            <div className="relative bg-gradient-card rounded-2xl p-8 shadow-float animate-float">
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Model Performance</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Sensitivity</span>
                    <span className="font-semibold text-success">94.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Specificity</span>
                    <span className="font-semibold text-success">97.1%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">F1 Score</span>
                    <span className="font-semibold text-success">95.6%</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full animate-pulse-medical" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent/20 rounded-full animate-pulse-medical" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </div>
    </section>
  );
};