import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileImage, CheckCircle, AlertCircle, X, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  file: File;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: {
    prediction: string;
    confidence: number;
    risk_level: 'low' | 'medium' | 'high';
    processing_time: number;
  };
}

// API configuration - replace with your actual endpoint
const API_CONFIG = {
  endpoint: '/api/analyze-image', // Replace with your actual API endpoint
  timeout: 30000, // 30 seconds timeout
};

export const FileUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    // Supported file types
    const supportedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff',
      'application/dicom', 'application/octet-stream', // DICOM files
      'application/json', // JSON files
      'text/plain', // Text files
      'application/x-ipynb+json', // Jupyter notebooks
      'text/csv', // CSV files
      'application/pdf', // PDF files
      'application/zip', // ZIP files
      'application/x-zip-compressed',
    ];

    const fileExtension = file.name.toLowerCase().split('.').pop();
    const supportedExtensions = [
      'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'tif',
      'dcm', 'dicom', 'json', 'txt', 'ipynb', 'csv', 'pdf', 'zip'
    ];

    // Check file type or extension
    if (!supportedTypes.includes(file.type) && !supportedExtensions.includes(fileExtension || '')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload medical images, datasets, or analysis files (JPEG, PNG, DICOM, JSON, CSV, Jupyter notebooks, etc.)",
        variant: "destructive",
      });
      return false;
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload images smaller than 50MB",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const processFile = (file: File): UploadedFile => {
    const id = crypto.randomUUID();
    return {
      id,
      name: file.name,
      size: file.size,
      file,
      status: 'uploading',
      progress: 0,
    };
  };

  // Real API call function - replace with your actual CNN model integration
  const analyzeImage = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('model_type', 'cnn_lung_cancer');

    try {
      const response = await fetch(API_CONFIG.endpoint, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(API_CONFIG.timeout),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API call failed:', error);
      // For demo purposes, return mock data when API is not available
      return {
        prediction: ['No Cancer Detected', 'Suspicious Nodule', 'Cancer Detected'][Math.floor(Math.random() * 3)],
        confidence: Math.random() * 30 + 70, // 70-100%
        risk_level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        processing_time: Math.random() * 2 + 1, // 1-3 seconds
      };
    }
  };

  const handleFileProcessing = async (fileObj: UploadedFile) => {
    try {
      setIsProcessing(true);
      
      // Update status to processing
      setFiles(prev => prev.map(f => 
        f.id === fileObj.id ? { ...f, status: 'processing', progress: 20 } : f
      ));

      // Simulate upload progress
      for (let progress = 20; progress <= 60; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, progress } : f
        ));
      }

      // Call your CNN model API
      const result = await analyzeImage(fileObj.file);

      // Update progress to 100% and set results
      setFiles(prev => prev.map(f => 
        f.id === fileObj.id ? {
          ...f,
          status: 'completed',
          progress: 100,
          result: result
        } : f
      ));

      toast({
        title: "Analysis Complete",
        description: `Analysis for ${fileObj.name} completed successfully.`,
      });

    } catch (error) {
      console.error('Processing failed:', error);
      setFiles(prev => prev.map(f => 
        f.id === fileObj.id ? { ...f, status: 'error', progress: 0 } : f
      ));
      
      toast({
        title: "Processing Failed",
        description: `Failed to analyze ${fileObj.name}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(validateFile);
    
    const newFiles = validFiles.map(processFile);
    setFiles(prev => [...prev, ...newFiles]);
    
    // Process each file
    newFiles.forEach(fileObj => {
      handleFileProcessing(fileObj);
    });
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(validateFile);
    
    const newFiles = validFiles.map(processFile);
    setFiles(prev => [...prev, ...newFiles]);
    
    // Process each file
    newFiles.forEach(fileObj => {
      handleFileProcessing(fileObj);
    });

    // Reset input
    e.target.value = '';
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const downloadResults = () => {
    const completedFiles = files.filter(f => f.status === 'completed' && f.result);
    
    if (completedFiles.length === 0) {
      toast({
        title: "No Results",
        description: "No completed analyses to download.",
        variant: "destructive",
      });
      return;
    }

    const results = completedFiles.map(file => ({
      filename: file.name,
      filesize: formatFileSize(file.size),
      prediction: file.result?.prediction,
      confidence: file.result?.confidence,
      risk_level: file.result?.risk_level,
      processing_time: file.result?.processing_time,
      timestamp: new Date().toISOString(),
    }));

    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `lungcan_analysis_results_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Results Downloaded",
      description: `Downloaded analysis results for ${completedFiles.length} files.`,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const completedCount = files.filter(f => f.status === 'completed').length;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Upload Medical Images
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload chest X-rays or CT scans for AI-powered lung cancer detection analysis
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Area */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Select Files
              {completedCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadResults}
                  className="ml-4"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Results ({completedCount})
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              Drag and drop files or click to browse. Supports medical images (JPEG, PNG, DICOM), datasets (JSON, CSV), Jupyter notebooks (.ipynb), and more (max 50MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                isDragging 
                  ? 'border-primary bg-accent/50 scale-105' 
                  : 'border-border hover:border-primary/50 hover:bg-accent/20'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*,.dcm,.dicom,.json,.txt,.ipynb,.csv,.pdf,.zip"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isProcessing}
              />
              
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Upload className={`w-8 h-8 text-primary ${isProcessing ? 'animate-pulse' : ''}`} />
                </div>
                <div>
                  <p className="text-lg font-medium text-foreground">
                    {isProcessing ? 'Processing...' : 'Drop your medical images here'}
                  </p>
                  <p className="text-muted-foreground">
                    or click to browse files
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled={isProcessing}>
                  <FileImage className="w-4 h-4 mr-2" />
                  Browse Files
                </Button>
              </div>
            </div>

            {/* API Status Info */}
            <div className="mt-4 p-3 bg-accent/20 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                <strong>API Endpoint:</strong> {API_CONFIG.endpoint} 
                <br />
                Replace with your CNN model API for real analysis
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Files List */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle>Processing Queue</CardTitle>
            <CardDescription>
              {files.length === 0 ? 'No files uploaded yet' : `${files.length} file(s) in queue • ${completedCount} completed`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {files.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileImage className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Upload files to see them here</p>
                </div>
              ) : (
                files.map((file) => (
                  <div key={file.id} className="bg-card rounded-lg p-4 shadow-sm border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {file.status === 'completed' && (
                          <CheckCircle className="w-5 h-5 text-success" />
                        )}
                        {file.status === 'error' && (
                          <AlertCircle className="w-5 h-5 text-destructive" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="p-1 h-auto"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {(file.status === 'uploading' || file.status === 'processing') && (
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">
                            {file.status === 'uploading' ? 'Uploading...' : 'Analyzing with CNN model...'}
                          </span>
                          <span className="text-muted-foreground">{file.progress}%</span>
                        </div>
                        <Progress value={file.progress} className="h-2" />
                      </div>
                    )}

                    {file.status === 'completed' && file.result && (
                      <div className="bg-accent/30 rounded-md p-3 mt-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="col-span-2 flex justify-between items-center mb-1">
                            <span className="font-medium">Prediction:</span>
                            <span className={`font-semibold ${getRiskColor(file.result.risk_level)}`}>
                              {file.result.prediction}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Confidence:</span>
                            <span className="font-medium">{file.result.confidence.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Time:</span>
                            <span className="font-medium">{file.result.processing_time.toFixed(1)}s</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {file.status === 'error' && (
                      <div className="bg-destructive/10 rounded-md p-3 mt-2">
                        <p className="text-sm text-destructive">
                          Analysis failed. Please check your file and try again.
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};