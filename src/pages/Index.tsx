import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { FileUpload } from "@/components/FileUpload";
import { ResultsDashboard } from "@/components/ResultsDashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <section id="hero">
          <HeroSection />
        </section>
        
        <section id="upload">
          <FileUpload />
        </section>
        
        <section id="dashboard">
          <ResultsDashboard />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground">
              © 2024 LungScan. Advanced medical imaging analysis powered by deep learning.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
