import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, Users, Target, AlertTriangle } from "lucide-react";
import dashboardImage from "@/assets/dashboard-preview.jpg";

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

const metrics: MetricCard[] = [
  {
    title: "Total Scans",
    value: "2,847",
    change: "+12.5%",
    trend: 'up',
    icon: <Activity className="w-5 h-5" />
  },
  {
    title: "Accuracy Rate",
    value: "95.8%",
    change: "+2.1%",
    trend: 'up',
    icon: <Target className="w-5 h-5" />
  },
  {
    title: "Positive Cases",
    value: "127",
    change: "-5.2%",
    trend: 'down',
    icon: <AlertTriangle className="w-5 h-5" />
  },
  {
    title: "Active Users",
    value: "342",
    change: "+8.7%",
    trend: 'up',
    icon: <Users className="w-5 h-5" />
  }
];

const recentResults = [
  {
    id: 1,
    filename: "chest_xray_001.jpg",
    prediction: "No Cancer Detected",
    confidence: 94.2,
    risk: "low",
    timestamp: "2 minutes ago"
  },
  {
    id: 2,
    filename: "ct_scan_045.dcm",
    prediction: "Suspicious Nodule",
    confidence: 78.6,
    risk: "medium",
    timestamp: "5 minutes ago"
  },
  {
    id: 3,
    filename: "chest_xray_034.jpg",
    prediction: "Cancer Detected",
    confidence: 96.1,
    risk: "high",
    timestamp: "8 minutes ago"
  },
  {
    id: 4,
    filename: "ct_scan_112.dcm",
    prediction: "No Cancer Detected",
    confidence: 91.7,
    risk: "low",
    timestamp: "12 minutes ago"
  },
  {
    id: 5,
    filename: "chest_xray_089.jpg",
    prediction: "Suspicious Area",
    confidence: 82.4,
    risk: "medium",
    timestamp: "15 minutes ago"
  }
];

export const ResultsDashboard = () => {
  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      default: return 'outline';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          AI Analysis Dashboard
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Real-time insights and results from your lung cancer detection model
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-gradient-card shadow-card hover:shadow-float transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {metric.icon}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  </div>
                </div>
                <div className={`flex items-center space-x-1 ${
                  metric.trend === 'up' ? 'text-success' : 'text-destructive'
                }`}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">{metric.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Model Performance */}
        <Card className="lg:col-span-2 bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle>Model Performance Metrics</CardTitle>
            <CardDescription>
              Current model accuracy and performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
              <img 
                src={dashboardImage} 
                alt="Medical data visualization dashboard" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent rounded-lg" />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Sensitivity</span>
                  <span className="text-sm font-semibold text-success">94.2%</span>
                </div>
                <Progress value={94.2} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Specificity</span>
                  <span className="text-sm font-semibold text-success">97.1%</span>
                </div>
                <Progress value={97.1} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Precision</span>
                  <span className="text-sm font-semibold text-success">93.8%</span>
                </div>
                <Progress value={93.8} className="h-2" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">F1 Score</span>
                  <span className="text-sm font-semibold text-success">95.6%</span>
                </div>
                <Progress value={95.6} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Results */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle>Recent Analysis</CardTitle>
            <CardDescription>
              Latest scan results and predictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentResults.map((result) => (
                <div key={result.id} className="bg-card rounded-lg p-4 shadow-sm border">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">
                        {result.filename}
                      </p>
                      <p className="text-xs text-muted-foreground">{result.timestamp}</p>
                    </div>
                    <Badge variant={getRiskBadgeVariant(result.risk)} className="ml-2">
                      {result.risk.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Prediction:</span>
                      <span className={`text-sm font-medium ${getRiskColor(result.risk)}`}>
                        {result.prediction}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Confidence:</span>
                        <span className="text-xs font-medium">{result.confidence}%</span>
                      </div>
                      <Progress value={result.confidence} className="h-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};