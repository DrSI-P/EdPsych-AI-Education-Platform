'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Smartphone,
  Tablet,
  Download,
  Apple,
  Play,
  Chrome,
  Globe,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Signal,
  SignalHigh,
  SignalLow,
  SignalZero,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Settings,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Zap,
  Shield,
  Lock,
  Fingerprint,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Share2,
  RefreshCw,
  Home,
  User,
  BookOpen,
  MessageSquare,
  Calendar,
  BarChart,
  Award,
  HelpCircle,
  Star,
  Heart,
  ThumbsUp,
  TrendingUp,
  Activity,
  Database,
  Cloud,
  CloudOff,
  Save,
  Upload,
  FolderOpen,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  File,
  Trash2,
  Archive,
  Package,
  Box,
  Layers,
  Grid,
  List,
  LayoutGrid,
  Maximize,
  Minimize,
  Move,
  Rotate3D,
  FlipHorizontal,
  FlipVertical,
  Monitor,
  Laptop,
  Watch,
  Headphones,
  Speaker,
  Bluetooth,
  Cast,
  Airplay,
  Navigation,
  Compass,
  Map,
  MapPin,
  Target,
  Crosshair,
  Send,
  Mail,
  Phone,
  PhoneCall,
  PhoneMissed,
  PhoneOff,
  Voicemail,
  MessageCircle,
  MessagesSquare,
  Users,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  LogIn,
  LogOut,
  Key,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  AlertTriangle,
  HelpCircle as Help,
  LifeBuoy,
  Flag,
  Bookmark,
  Tag,
  Tags,
  Hash,
  AtSign,
  DollarSign,
  Percent,
  Calculator,
  Calendar as CalendarIcon,
  Clock,
  Timer,
  AlarmClock
} from 'lucide-react';

interface MobileProps {
  className?: string;
}

export function Mobile({ className = '' }: MobileProps) {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'web'>('ios');
  const [isInstalled, setIsInstalled] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({
    type: 'Unknown',
    os: 'Unknown',
    browser: 'Unknown',
    screenSize: 'Unknown'
  });

  // Mobile app features
  const mobileFeatures = [
    {
      title: 'Offline Access',
      description: 'Download content for learning without internet',
      icon: WifiOff,
      status: 'available'
    },
    {
      title: 'Push Notifications',
      description: 'Stay updated with assignments and messages',
      icon: Bell,
      status: 'available'
    },
    {
      title: 'Biometric Login',
      description: 'Secure access with fingerprint or face ID',
      icon: Fingerprint,
      status: 'available'
    },
    {
      title: 'Camera Integration',
      description: 'Scan documents and submit visual assignments',
      icon: Camera,
      status: 'available'
    },
    {
      title: 'Voice Input',
      description: 'Use voice commands and dictation',
      icon: Mic,
      status: 'available'
    },
    {
      title: 'Dark Mode',
      description: 'Reduce eye strain with dark theme',
      icon: Moon,
      status: 'available'
    }
  ];

  // Device optimization features
  const deviceOptimizations = [
    {
      device: 'Smartphone',
      icon: Smartphone,
      features: [
        'One-handed navigation',
        'Compact layouts',
        'Swipe gestures',
        'Portrait optimization'
      ]
    },
    {
      device: 'Tablet',
      icon: Tablet,
      features: [
        'Split-screen support',
        'Enhanced multitasking',
        'Landscape layouts',
        'Stylus support'
      ]
    },
    {
      device: 'Foldable',
      icon: Maximize,
      features: [
        'Adaptive layouts',
        'Multi-window mode',
        'Flex mode support',
        'Dynamic resizing'
      ]
    }
  ];

  // App statistics
  const appStats = {
    downloads: '100K+',
    rating: 4.8,
    reviews: 5432,
    size: {
      ios: '89 MB',
      android: '76 MB'
    },
    lastUpdated: '2025-06-10',
    version: {
      ios: '3.2.1',
      android: '3.2.0'
    }
  };

  // User testimonials
  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Year 10 Student',
      rating: 5,
      comment: 'The mobile app makes it so easy to keep up with assignments on the go!'
    },
    {
      name: 'James T.',
      role: 'Parent',
      rating: 5,
      comment: 'Love being able to check my child\'s progress from my phone.'
    },
    {
      name: 'Ms. Wilson',
      role: 'Teacher',
      rating: 4,
      comment: 'Great for quick updates and marking while commuting.'
    }
  ];

  // Detect device info
  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent;
      let type = 'Desktop';
      let os = 'Unknown';
      let browser = 'Unknown';

      // Detect device type
      if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
        type = 'Tablet';
      } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
        type = 'Smartphone';
      }

      // Detect OS
      if (/android/i.test(userAgent)) {
        os = 'Android';
        setPlatform('android');
      } else if (/iphone|ipad|ipod/i.test(userAgent)) {
        os = 'iOS';
        setPlatform('ios');
      } else if (/windows/i.test(userAgent)) {
        os = 'Windows';
      } else if (/mac/i.test(userAgent)) {
        os = 'macOS';
      } else if (/linux/i.test(userAgent)) {
        os = 'Linux';
      }

      // Detect browser
      if (/chrome/i.test(userAgent) && !/edge/i.test(userAgent)) {
        browser = 'Chrome';
      } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
        browser = 'Safari';
      } else if (/firefox/i.test(userAgent)) {
        browser = 'Firefox';
      } else if (/edge/i.test(userAgent)) {
        browser = 'Edge';
      }

      // Get screen size
      const screenSize = `${window.screen.width}x${window.screen.height}`;

      setDeviceInfo({ type, os, browser, screenSize });
    };

    detectDevice();
    
    // Check if app is installed (PWA)
    if ('standalone' in window.navigator) {
      setIsInstalled((window.navigator as any).standalone);
    }
  }, []);

  return (
    <div className={`container mx-auto py-8 px-4 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <div className="flex items-center justify-center mb-4">
          <Smartphone className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Mobile Experience</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Access EdPsych Connect on any device with our optimized mobile experience
        </p>
      </motion.div>

      {/* Device Detection Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-8"
      >
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Detected Device:</strong> {deviceInfo.type} • {deviceInfo.os} • {deviceInfo.browser} • {deviceInfo.screenSize}
            {deviceInfo.type !== 'Desktop' && (
              <span className="block mt-1">You're viewing the mobile-optimized version of our platform.</span>
            )}
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* App Download Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-12"
      >
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">Download Our Mobile App</CardTitle>
              <CardDescription>
                Get the full EdPsych Connect experience with our native mobile apps
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {/* iOS App */}
                <Card className={`hover:shadow-lg transition-shadow cursor-pointer ${platform === 'ios' ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setPlatform('ios')}
                >
                  <CardContent className="p-6 text-center">
                    <Apple className="h-12 w-12 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">iOS App</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      iPhone & iPad
                    </p>
                    <Badge variant="outline" className="mb-3">v{appStats.version.ios}</Badge>
                    <Button className="w-full" variant={platform === 'ios' ? 'default' : 'outline'}>
                      <Apple className="h-4 w-4 mr-2" />
                      App Store
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Requires iOS 14.0+
                    </p>
                  </CardContent>
                </Card>

                {/* Android App */}
                <Card className={`hover:shadow-lg transition-shadow cursor-pointer ${platform === 'android' ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setPlatform('android')}
                >
                  <CardContent className="p-6 text-center">
                    <Play className="h-12 w-12 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Android App</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Phone & Tablet
                    </p>
                    <Badge variant="outline" className="mb-3">v{appStats.version.android}</Badge>
                    <Button className="w-full" variant={platform === 'android' ? 'default' : 'outline'}>
                      <Play className="h-4 w-4 mr-2" />
                      Play Store
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Requires Android 8.0+
                    </p>
                  </CardContent>
                </Card>

                {/* Web App */}
                <Card className={`hover:shadow-lg transition-shadow cursor-pointer ${platform === 'web' ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setPlatform('web')}
                >
                  <CardContent className="p-6 text-center">
                    <Globe className="h-12 w-12 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Web App</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Any Browser
                    </p>
                    <Badge variant="outline" className="mb-3">PWA</Badge>
                    <Button className="w-full" variant={platform === 'web' ? 'default' : 'outline'}>
                      <Chrome className="h-4 w-4 mr-2" />
                      Install PWA
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Works offline
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* App Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{appStats.downloads}</p>
                  <p className="text-sm text-muted-foreground">Downloads</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{appStats.rating}</p>
                  <p className="text-sm text-muted-foreground">Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{appStats.size[platform === 'android' ? 'android' : 'ios']}</p>
                  <p className="text-sm text-muted-foreground">App Size</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{appStats.reviews}</p>
                  <p className="text-sm text-muted-foreground">Reviews</p>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="features" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="setup">Setup Guide</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mobile App Features</CardTitle>
              <CardDescription>
                Enhanced functionality designed for mobile learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mobileFeatures.map((feature, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <feature.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                          {feature.status === 'available' && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Available
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Fast loading times
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Smooth animations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Battery optimized
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Low data usage
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-500" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    End-to-end encryption
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Biometric authentication
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Secure data storage
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Privacy controls
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Screen reader support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Voice control
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Large text options
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    High contrast mode
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Device-Specific Optimizations</CardTitle>
              <CardDescription>
                Tailored experiences for different device types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {deviceOptimizations.map((device, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <device.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{device.device}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {device.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Our mobile apps are optimized for the best user experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>App Launch Time</span>
                    <span className="font-medium">1.2s</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Battery Efficiency</span>
                    <span className="font-medium">Excellent</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Memory Usage</span>
                    <span className="font-medium">Low</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Network Efficiency</span>
                    <span className="font-medium">Optimized</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Setup Guide Tab */}
        <TabsContent value="setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Setup Guide</CardTitle>
              <CardDescription>
                Get started with EdPsych Connect mobile in minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* iOS Setup */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Apple className="h-5 w-5 mr-2" />
                    iOS Setup
                  </h3>
                  <ol className="space-y-3">
                    <li className="flex items-start">
                      <span className="font-medium mr-2">1.</span>
                      <div>
                        <p>Open the App Store on your iPhone or iPad</p>
                        <p className="text-sm text-muted-foreground">Search for "EdPsych Connect"</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">2.</span>
                      <div>
                        <p>Tap "Get" to download the app</p>
                        <p className="text-sm text-muted-foreground">The app is free to download</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">3.</span>
                      <div>
                        <p>Open the app and sign in with your credentials</p>
                        <p className="text-sm text-muted-foreground">Use the same login as the web version</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">4.</span>
                      <div>
                        <p>Enable notifications when prompted</p>
                        <p className="text-sm text-muted-foreground">Stay updated with important alerts</p>
                      </div>
                    </li>
                  </ol>
                </div>

                {/* Android Setup */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Play className="h-5 w-5 mr-2" />
                    Android Setup
                  </h3>
                  <ol className="space-y-3">
                    <li className="flex items-start">
                      <span className="font-medium mr-2">1.</span>
                      <div>
                        <p>Open Google Play Store on your Android device</p>
                        <p className="text-sm text-muted-foreground">Search for "EdPsych Connect"</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">2.</span>
                      <div>
                        <p>Tap "Install" to download the app</p>
                        <p className="text-sm text-muted-foreground">Grant necessary permissions</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">3.</span>
                      <div>
                        <p>Launch the app and log in</p>
                        <p className="text-sm text-muted-foreground">Your data will sync automatically</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">4.</span>
                      <div>
                        <p>Configure your preferences</p>
                        <p className="text-sm text-muted-foreground">Set up notifications and offline mode</p>
                      </div>
                    </li>
                  </ol>
                </div>

                {/* PWA Setup */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Progressive Web App (PWA) Setup
                  </h3>
                  <ol className="space-y-3">
                    <li className="flex items-start">
                      <span className="font-medium mr-2">1.</span>
                      <div>
                        <p>Visit app.edpsychconnect.org in your mobile browser</p>
                        <p className="text-sm text-muted-foreground">Chrome or Safari recommended</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">2.</span>
                      <div>
                        <p>Look for the "Install App" banner or prompt</p>
                        <p className="text-sm text-muted-foreground">Or tap the share button and "Add to Home Screen"</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">3.</span>
                      <div>
                        <p>Confirm installation</p>
                        <p className="text-sm text-muted-foreground">The app icon will appear on your home screen</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">4.</span>
                      <div>
                        <p>Launch from home screen for full-screen experience</p>
                        <p className="text-sm text-muted-foreground">Works offline after first visit</p>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* First Time Setup */}
          <Card>
            <CardHeader>
              <CardTitle>First Time Setup</CardTitle>
              <CardDescription>
                Configure your mobile app for the best experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Fingerprint className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Enable Biometric Login:</strong> For quick and secure access, enable fingerprint or Face ID in Settings → Security.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <Download className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Download Content:</strong> Save lessons and resources for offline access in Settings → Offline Content.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <Bell className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Notification Preferences:</strong> Customize which alerts you receive in Settings → Notifications.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mobile Support</CardTitle>
              <CardDescription>
                Get help with the mobile app
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Common Issues</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium text-sm">App won't open</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Try restarting your device or reinstalling the app
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium text-sm">Can't log in</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Check your internet connection and credentials
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium text-sm">Sync issues</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pull down to refresh or check sync settings
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Contact Support</h3>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      In-App Chat Support
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Email: mobile@edpsychconnect.org
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      View FAQ
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>User Reviews</CardTitle>
              <CardDescription>
                What our mobile users are saying
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm">{testimonial.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Write a Review
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8"
      >
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Ready to go mobile?</h3>
              <p className="text-muted-foreground mb-4">
                Download the EdPsych Connect app today and take your learning anywhere
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" className="flex items-center">
                  <Apple className="h-5 w-5 mr-2" />
                  Download for iOS
                </Button>
                <Button size="lg" variant="outline" className="flex items-center">
                  <Play className="h-5 w-5 mr-2" />
                  Download for Android
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export { Mobile as default };