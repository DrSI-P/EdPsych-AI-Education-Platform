'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { 
  MessageSquare, 
  Calendar, 
  FileText, 
  Users, 
  Target, 
  BookOpen, 
  Video, 
  Award, 
  Share2, 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  Send, 
  Paperclip, 
  Image, 
  Mic, 
  Globe, 
  ChevronDown, 
  MoreHorizontal, 
  Star, 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  HelpCircle, 
  Settings, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Download, 
  Upload, 
  Trash, 
  Edit, 
  Save, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  RefreshCw, 
  ExternalLink, 
  Link, 
  Copy, 
  Clipboard, 
  ClipboardCheck, 
  FileQuestion, 
  FilePlus, 
  FileCheck, 
  Folder, 
  FolderPlus, 
  Archive, 
  Inbox, 
  Bookmark, 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  Tag, 
  Printer, 
  Camera, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Mail, 
  MessageCircle, 
  Share, 
  Zap, 
  Layers, 
  List, 
  Grid, 
  Table, 
  BarChart, 
  PieChart, 
  LineChart, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Loader, 
  Loader2, 
  Maximize, 
  Minimize, 
  Repeat, 
  Shuffle, 
  RotateCw, 
  RotateCcw, 
  ChevronUp, 
  ChevronRight, 
  ChevronLeft, 
  ArrowUp, 
  ArrowDown, 
  ArrowUpRight, 
  ArrowUpLeft, 
  ArrowDownRight, 
  ArrowDownLeft, 
  ChevronsUp, 
  ChevronsDown, 
  ChevronsRight, 
  ChevronsLeft, 
  Sliders, 
  Briefcase, 
  Book, 
  Bookmark as BookmarkIcon, 
  Star as StarIcon, 
  Heart as HeartIcon, 
  ThumbsUp as ThumbsUpIcon, 
  ThumbsDown as ThumbsDownIcon, 
  Flag as FlagIcon, 
  Award as AwardIcon, 
  Gift, 
  Package, 
  ShoppingBag, 
  ShoppingCart, 
  CreditCard, 
  DollarSign, 
  Percent, 
  Truck, 
  Map, 
  MapPin, 
  Navigation, 
  Compass, 
  Globe as GlobeIcon, 
  Crosshair, 
  Anchor, 
  Briefcase as BriefcaseIcon, 
  Clipboard as ClipboardIcon, 
  ClipboardCheck as ClipboardCheckIcon, 
  FileText as FileTextIcon, 
  FileQuestion as FileQuestionIcon, 
  FilePlus as FilePlusIcon, 
  FileCheck as FileCheckIcon, 
  File, 
  FileMinus, 
  Folder as FolderIcon, 
  FolderPlus as FolderPlusIcon, 
  FolderMinus, 
  Archive as ArchiveIcon, 
  Inbox as InboxIcon, 
  Database, 
  Server, 
  HardDrive, 
  Disc, 
  Cpu, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Tv, 
  Wifi, 
  WifiOff, 
  Bluetooth, 
  Battery, 
  BatteryCharging, 
  Home, 
  Building, 
  School, 
  Landmark, 
  Navigation as NavigationIcon, 
  MapPin as MapPinIcon, 
  Crosshair as CrosshairIcon, 
  Anchor as AnchorIcon, 
  Compass as CompassIcon, 
  Thermometer, 
  Umbrella, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudDrizzle, 
  Sun, 
  Moon, 
  Sunrise, 
  Sunset, 
  Wind, 
  Clock as ClockIcon, 
  Calendar as CalendarIcon, 
  Watch, 
  AlarmClock, 
  Bell as BellIcon, 
  BellOff, 
  Music, 
  Headphones, 
  Radio, 
  Tv as TvIcon, 
  Film, 
  Image as ImageIcon, 
  Camera as CameraIcon, 
  Video as VideoIcon, 
  Aperture, 
  Mic as MicIcon, 
  VolumeX as VolumeXIcon, 
  Volume1, 
  Volume2 as Volume2Icon, 
  Volume, 
  Voicemail, 
  Phone as PhoneIcon, 
  PhoneCall as PhoneCallIcon, 
  PhoneForwarded, 
  PhoneIncoming, 
  PhoneMissed, 
  PhoneOff as PhoneOffIcon, 
  PhoneOutgoing, 
  MessageSquare as MessageSquareIcon, 
  MessageCircle as MessageCircleIcon, 
  Mail as MailIcon, 
  Send as SendIcon, 
  Share as ShareIcon, 
  Share2 as Share2Icon, 
  Link as LinkIcon, 
  ExternalLink as ExternalLinkIcon, 
  Paperclip as PaperclipIcon, 
  Bookmark as BookmarkIcon2, 
  Star as StarIcon2, 
  Heart as HeartIcon2, 
  ThumbsUp as ThumbsUpIcon2, 
  ThumbsDown as ThumbsDownIcon2, 
  Flag as FlagIcon2, 
  Award as AwardIcon2, 
  Gift as GiftIcon, 
  Package as PackageIcon, 
  ShoppingBag as ShoppingBagIcon, 
  ShoppingCart as ShoppingCartIcon, 
  CreditCard as CreditCardIcon, 
  DollarSign as DollarSignIcon, 
  Percent as PercentIcon, 
  Truck as TruckIcon, 
  Map as MapIcon, 
  MapPin as MapPinIcon2, 
  Navigation as NavigationIcon2, 
  Compass as CompassIcon2, 
  Globe as GlobeIcon2, 
  Crosshair as CrosshairIcon2, 
  Anchor as AnchorIcon2, 
  Briefcase as BriefcaseIcon2, 
  Clipboard as ClipboardIcon2, 
  ClipboardCheck as ClipboardCheckIcon2, 
  FileText as FileTextIcon2, 
  FileQuestion as FileQuestionIcon2, 
  FilePlus as FilePlusIcon2, 
  FileCheck as FileCheckIcon2, 
  File as FileIcon, 
  FileMinus as FileMinusIcon, 
  Folder as FolderIcon2, 
  FolderPlus as FolderPlusIcon2, 
  FolderMinus as FolderMinusIcon, 
  Archive as ArchiveIcon2, 
  Inbox as InboxIcon2, 
  Database as DatabaseIcon, 
  Server as ServerIcon, 
  HardDrive as HardDriveIcon, 
  Disc as DiscIcon, 
  Cpu as CpuIcon, 
  Monitor as MonitorIcon, 
  Smartphone as SmartphoneIcon, 
  Tablet as TabletIcon, 
  Tv as TvIcon2, 
  Wifi as WifiIcon, 
  WifiOff as WifiOffIcon, 
  Bluetooth as BluetoothIcon, 
  Battery as BatteryIcon, 
  BatteryCharging as BatteryChargingIcon, 
  Home as HomeIcon, 
  Building as BuildingIcon, 
  School as SchoolIcon, 
  Landmark as LandmarkIcon, 
  Thermometer as ThermometerIcon, 
  Umbrella as UmbrellaIcon, 
  Cloud as CloudIcon, 
  CloudRain as CloudRainIcon, 
  CloudSnow as CloudSnowIcon, 
  CloudLightning as CloudLightningIcon, 
  CloudDrizzle as CloudDrizzleIcon, 
  Sun as SunIcon, 
  Moon as MoonIcon, 
  Sunrise as SunriseIcon, 
  Sunset as SunsetIcon, 
  Wind as WindIcon, 
  Clock as ClockIcon2, 
  Calendar as CalendarIcon2, 
  Watch as WatchIcon, 
  AlarmClock as AlarmClockIcon, 
  Bell as BellIcon2, 
  BellOff as BellOffIcon, 
  Music as MusicIcon, 
  Headphones as HeadphonesIcon, 
  Radio as RadioIcon, 
  Film as FilmIcon, 
  Image as ImageIcon2, 
  Aperture as ApertureIcon, 
  VolumeX as VolumeXIcon2, 
  Volume1 as Volume1Icon, 
  Volume2 as Volume2Icon2, 
  Volume as VolumeIcon, 
  Voicemail as VoicemailIcon, 
  Phone as PhoneIcon2, 
  PhoneCall as PhoneCallIcon2, 
  PhoneForwarded as PhoneForwardedIcon, 
  PhoneIncoming as PhoneIncomingIcon, 
  PhoneMissed as PhoneMissedIcon, 
  PhoneOff as PhoneOffIcon2, 
  PhoneOutgoing as PhoneOutgoingIcon, 
  User as UserIcon, 
  UserPlus, 
  UserMinus, 
  UserCheck, 
  Users as UsersIcon, 
  Lock as LockIcon, 
  Unlock as UnlockIcon, 
  Eye as EyeIcon, 
  EyeOff as EyeOffIcon, 
  Settings as SettingsIcon, 
  HelpCircle as HelpCircleIcon, 
  Info as InfoIcon, 
  AlertTriangle as AlertTriangleIcon, 
  AlertCircle as AlertCircleIcon, 
  CheckCircle as CheckCircleIcon, 
  X as XIcon, 
  Menu as MenuIcon, 
  MoreHorizontal as MoreHorizontalIcon, 
  MoreVertical, 
  Copy as CopyIcon, 
  Scissors, 
  Trash as TrashIcon, 
  Edit as EditIcon, 
  Save as SaveIcon, 
  Upload as UploadIcon, 
  Download as DownloadIcon, 
  Loader as LoaderIcon, 
  Loader2 as Loader2Icon, 
  RefreshCw as RefreshCwIcon, 
  RotateCw as RotateCwIcon, 
  RotateCcw as RotateCcwIcon, 
  Maximize as MaximizeIcon, 
  Minimize as MinimizeIcon, 
  Plus as PlusIcon, 
  Minus, 
  Divide, 
  ChevronDown as ChevronDownIcon, 
  ChevronUp as ChevronUpIcon, 
  ChevronRight as ChevronRightIcon, 
  ChevronLeft as ChevronLeftIcon, 
  ArrowRight as ArrowRightIcon, 
  ArrowLeft as ArrowLeftIcon, 
  ArrowUp as ArrowUpIcon, 
  ArrowDown as ArrowDownIcon, 
  ArrowUpRight as ArrowUpRightIcon, 
  ArrowUpLeft as ArrowUpLeftIcon, 
  ArrowDownRight as ArrowDownRightIcon, 
  ArrowDownLeft as ArrowDownLeftIcon, 
  CornerUpRight, 
  CornerUpLeft, 
  CornerDownRight, 
  CornerDownLeft, 
  ChevronsUp as ChevronsUpIcon, 
  ChevronsDown as ChevronsDownIcon, 
  ChevronsRight as ChevronsRightIcon, 
  ChevronsLeft as ChevronsLeftIcon, 
  Search as SearchIcon, 
  Filter as FilterIcon, 
  List as ListIcon, 
  Grid as GridIcon, 
  Table as TableIcon, 
  BarChart as BarChartIcon, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  Activity as ActivityIcon, 
  TrendingUp as TrendingUpIcon, 
  TrendingDown as TrendingDownIcon, 
  Zap as ZapIcon, 
  Layers as LayersIcon, 
  Book as BookIcon, 
  BookOpen as BookOpenIcon, 
  FileText as FileTextIcon3, 
  Tag as TagIcon, 
  Tags, 
  Target as TargetIcon, 
  Sliders as SlidersIcon, 
  Play as PlayIcon, 
  Pause as PauseIcon, 
  Square, 
  SkipBack as SkipBackIcon, 
  SkipForward as SkipForwardIcon, 
  Repeat as RepeatIcon, 
  Shuffle as ShuffleIcon
} from "lucide-react";

// Mock data for messages
const MOCK_MESSAGES = [
  {
    id: 'msg1',
    sender: {
      id: 'teacher1',
      name: 'Ms. Johnson',
      role: 'Teacher',
      avatar: '/avatars/teacher1.png'
    },
    recipient: {
      id: 'parent1',
      name: 'Mr. Smith',
      role: 'Parent',
      avatar: '/avatars/parent1.png'
    },
    student: {
      id: 'student1',
      name: 'Emma Smith',
      year: 'Year 4'
    },
    content: 'Hello Mr. Smith, I wanted to update you on Emma\'s progress in maths. She\'s been doing exceptionally well with multiplication tables this week.',
    timestamp: '2025-05-16T14:30:00Z',
    read: true,
    attachments: [],
    priority: 'normal',
    translated: false,
    originalLanguage: 'en'
  },
  {
    id: 'msg2',
    sender: {
      id: 'parent1',
      name: 'Mr. Smith',
      role: 'Parent',
      avatar: '/avatars/parent1.png'
    },
    recipient: {
      id: 'teacher1',
      name: 'Ms. Johnson',
      role: 'Teacher',
      avatar: '/avatars/teacher1.png'
    },
    student: {
      id: 'student1',
      name: 'Emma Smith',
      year: 'Year 4'
    },
    content: 'That\'s wonderful to hear! We\'ve been practicing at home as well. She seems much more confident with numbers lately.',
    timestamp: '2025-05-16T15:45:00Z',
    read: true,
    attachments: [],
    priority: 'normal',
    translated: false,
    originalLanguage: 'en'
  },
  {
    id: 'msg3',
    sender: {
      id: 'teacher1',
      name: 'Ms. Johnson',
      role: 'Teacher',
      avatar: '/avatars/teacher1.png'
    },
    recipient: {
      id: 'parent1',
      name: 'Mr. Smith',
      role: 'Parent',
      avatar: '/avatars/parent1.png'
    },
    student: {
      id: 'student1',
      name: 'Emma Smith',
      year: 'Year 4'
    },
    content: 'Absolutely! I\'ve attached a few additional resources you might want to try at home. These games make multiplication practise fun and engaging.',
    timestamp: '2025-05-16T16:20:00Z',
    read: true,
    attachments: [
      {
        id: 'att1',
        name: 'Multiplication Games.pdf',
        type: 'application/pdf',
        size: '1.2 MB',
        url: '/attachments/multiplication-games.pdf'
      }
    ],
    priority: 'normal',
    translated: false,
    originalLanguage: 'en'
  },
  {
    id: 'msg4',
    sender: {
      id: 'teacher2',
      name: 'Mr. Williams',
      role: 'PE Teacher',
      avatar: '/avatars/teacher2.png'
    },
    recipient: {
      id: 'parent1',
      name: 'Mr. Smith',
      role: 'Parent',
      avatar: '/avatars/parent1.png'
    },
    student: {
      id: 'student1',
      name: 'Emma Smith',
      year: 'Year 4'
    },
    content: 'Just wanted to let you know that Emma showed great teamwork during PE today. She helped organise her team and encouraged everyone to participate.',
    timestamp: '2025-05-17T10:15:00Z',
    read: false,
    attachments: [],
    priority: 'normal',
    translated: false,
    originalLanguage: 'en'
  },
  {
    id: 'msg5',
    sender: {
      id: 'school1',
      name: 'Oakwood Primary',
      role: 'School Admin',
      avatar: '/avatars/school1.png'
    },
    recipient: {
      id: 'parent1',
      name: 'Mr. Smith',
      role: 'Parent',
      avatar: '/avatars/parent1.png'
    },
    student: null,
    content: 'REMINDER: School will be closed for teacher training on Friday, 23rd May. Please make alternative arrangements for childcare if needed.',
    timestamp: '2025-05-17T11:00:00Z',
    read: false,
    attachments: [],
    priority: 'high',
    translated: false,
    originalLanguage: 'en'
  }
];

// Mock data for goals
const MOCK_GOALS = [
  {
    id: 'goal1',
    student: {
      id: 'student1',
      name: 'Emma Smith',
      year: 'Year 4'
    },
    title: 'Improve reading comprehension',
    description: 'Work on understanding and analysing more complex texts, focusing on inference and prediction skills.',
    category: 'Academic',
    subject: 'English',
    startDate: '2025-04-01',
    targetDate: '2025-06-30',
    status: 'In Progress',
    progress: 65,
    schoolActions: [
      'Provide targeted reading materials',
      'Weekly guided reading sessions',
      'Comprehension exercises with feedback'
    ],
    homeActions: [
      'Daily reading for 20 minutes',
      'Discussion about stories and characters',
      'Use of provided comprehension questions'
    ],
    updates: [
      {
        date: '2025-04-15',
        content: 'Emma is showing good progress with literal comprehension questions.',
        author: 'Ms. Johnson (Teacher)'
      },
      {
        date: '2025-05-01',
        content: 'We\'ve been reading together every evening and discussing the stories.',
        author: 'Mr. Smith (Parent)'
      },
      {
        date: '2025-05-10',
        content: 'Emma is now beginning to make predictions about what might happen next in stories.',
        author: 'Ms. Johnson (Teacher)'
      }
    ],
    evidence: [
      {
        id: 'ev1',
        type: 'document',
        name: 'Reading Assessment - April.pdf',
        date: '2025-04-10',
        url: '/evidence/reading-assessment-april.pdf'
      },
      {
        id: 'ev2',
        type: 'document',
        name: 'Reading Assessment - May.pdf',
        date: '2025-05-08',
        url: '/evidence/reading-assessment-may.pdf'
      }
    ]
  },
  {
    id: 'goal2',
    student: {
      id: 'student1',
      name: 'Emma Smith',
      year: 'Year 4'
    },
    title: 'Develop confidence in mathematics',
    description: 'Build confidence in applying mathematical skills to problem-solving tasks, particularly with multiplication and division.',
    category: 'Academic',
    subject: 'Mathematics',
    startDate: '2025-04-15',
    targetDate: '2025-07-15',
    status: 'In Progress',
    progress: 40,
    schoolActions: [
      'Regular practise with varied problem types',
      'Small group work for collaborative learning',
      'Positive reinforcement of effort and strategies'
    ],
    homeActions: [
      'Practise multiplication tables 3 times weekly',
      'Use of recommended math games and apps',
      'Apply math to everyday situations (shopping, cooking)'
    ],
    updates: [
      {
        date: '2025-04-30',
        content: 'Emma is becoming more confident with multiplication tables up to 5x.',
        author: 'Ms. Johnson (Teacher)'
      },
      {
        date: '2025-05-12',
        content: 'We\'ve been playing math games at home and Emma is enjoying the challenge.',
        author: 'Mr. Smith (Parent)'
      }
    ],
    evidence: [
      {
        id: 'ev3',
        type: 'document',
        name: 'Math Skills Assessment.pdf',
        date: '2025-04-20',
        url: '/evidence/math-skills-assessment.pdf'
      }
    ]
  },
  {
    id: 'goal3',
    student: {
      id: 'student1',
      name: 'Emma Smith',
      year: 'Year 4'
    },
    title: 'Improve handwriting consistency',
    description: 'Work on maintaining consistent letter size, spacing, and formation in all written work.',
    category: 'Academic',
    subject: 'English',
    startDate: '2025-03-15',
    targetDate: '2025-05-30',
    status: 'Completed',
    progress: 100,
    schoolActions: [
      'Daily handwriting practise',
      'Regular feedback on written work',
      'Use of handwriting guides and templates'
    ],
    homeActions: [
      'Practise with provided handwriting sheets',
      'Encourage neat writing in all home activities',
      'Use of pencil grips if needed'
    ],
    updates: [
      {
        date: '2025-04-01',
        content: 'Emma is showing good improvement in letter formation.',
        author: 'Ms. Johnson (Teacher: any)'
      },
      {
        date: '2025-04-20',
        content: 'We\'ve been practicing handwriting at home regularly.',
        author: 'Mr. Smith (Parent: any)'
      },
      {
        date: '2025-05-15',
        content: 'Emma\'s handwriting is now consistently neat and legible across all subjects.',
        author: 'Ms. Johnson (Teacher: any)'
      },
      {
        date: '2025-05-30',
        content: 'Goal completed successfully! Emma has made excellent progress with her handwriting.',
        author: 'Ms. Johnson (Teacher: any)'
      }
    ],
    evidence: [
      {
        id: 'ev4',
        type: 'image',
        name: 'Handwriting Sample - March.jpg',
        date: '2025-03-20',
        url: '/evidence/handwriting-march.jpg'
      },
      {
        id: 'ev5',
        type: 'image',
        name: 'Handwriting Sample - May.jpg',
        date: '2025-05-25',
        url: '/evidence/handwriting-may.jpg'
      }
    ]
  }
];

// Mock data for home strategies
const MOCK_STRATEGIES = [
  {
    id: 'strat1',
    title: 'Reading Comprehension Strategies',
    description: 'Techniques to help your child understand and engage with texts more deeply.',
    category: 'Literacy',
    ageRange: '7-9 years',
    format: 'PDF Guide',
    thumbnail: '/thumbnails/reading-comprehension.jpg',
    rating: 4.8,
    downloads: 156,
    dateAdded: '2025-03-10',
    tags: ['reading', 'comprehension', 'literacy', 'KS2'],
    file: {
      name: 'Reading Comprehension Strategies.pdf',
      size: '2.4 MB',
      url: '/strategies/reading-comprehension-strategies.pdf'
    }
  },
  {
    id: 'strat2',
    title: 'Multiplication Games for Home',
    description: 'Fun and engaging games to practise multiplication facts at home.',
    category: 'Numeracy',
    ageRange: '7-11 years',
    format: 'PDF Guide',
    thumbnail: '/thumbnails/multiplication-games.jpg',
    rating: 4.9,
    downloads: 203,
    dateAdded: '2025-04-05',
    tags: ['mathematics', 'multiplication', 'games', 'KS2'],
    file: {
      name: 'Multiplication Games for Home.pdf',
      size: '3.1 MB',
      url: '/strategies/multiplication-games-for-home.pdf'
    }
  },
  {
    id: 'strat3',
    title: 'Supporting Phonics at Home',
    description: 'Activities and resources to reinforce phonics learning for early readers.',
    category: 'Literacy',
    ageRange: '4-7 years',
    format: 'PDF Guide with Audio',
    thumbnail: '/thumbnails/phonics.jpg',
    rating: 4.7,
    downloads: 189,
    dateAdded: '2025-02-20',
    tags: ['phonics', 'reading', 'literacy', 'KS1'],
    file: {
      name: 'Supporting Phonics at Home.pdf',
      size: '4.2 MB',
      url: '/strategies/supporting-phonics-at-home.pdf'
    }
  },
  {
    id: 'strat4',
    title: 'Developing Fine Motor Skills',
    description: 'Activities to help develop hand strength and coordination for writing.',
    category: 'Physical Development',
    ageRange: '4-8 years',
    format: 'PDF Guide with Video',
    thumbnail: '/thumbnails/fine-motor.jpg',
    rating: 4.6,
    downloads: 142,
    dateAdded: '2025-03-25',
    tags: ['motor skills', 'handwriting', 'coordination', 'EYFS', 'KS1'],
    file: {
      name: 'Developing Fine Motor Skills.pdf',
      size: '3.8 MB',
      url: '/strategies/developing-fine-motor-skills.pdf'
    }
  },
  {
    id: 'strat5',
    title: 'Supporting Emotional Regulation',
    description: 'Strategies to help children recognise and manage their emotions effectively.',
    category: 'Social-Emotional',
    ageRange: '5-11 years',
    format: 'PDF Guide with Printables',
    thumbnail: '/thumbnails/emotional-regulation.jpg',
    rating: 4.9,
    downloads: 217,
    dateAdded: '2025-04-15',
    tags: ['emotions', 'wellbeing', 'behaviour', 'SEMH'],
    file: {
      name: 'Supporting Emotional Regulation.pdf',
      size: '5.2 MB',
      url: '/strategies/supporting-emotional-regulation.pdf'
    }
  }
];

// Mock data for upcoming meetings
const MOCK_MEETINGS = [
  {
    id: 'meet1',
    title: 'Parent-Teacher Conference',
    date: '2025-05-25',
    time: '16:00-16:30',
    teacher: {
      id: 'teacher1',
      name: 'Ms. Johnson',
      role: 'Class Teacher',
      avatar: '/avatars/teacher1.png'
    },
    student: {
      id: 'student1',
      name: 'Emma Smith',
      year: 'Year 4'
    },
    location: 'Virtual (Zoom: any)',
    status: 'Scheduled',
    description: 'Regular end-of-term progress discussion focusing on literacy and numeracy development.',
    agenda: [
      'Review of current progress',
      'Discussion of recent assessments',
      'Setting goals for next term',
      'Any concerns or questions'
    ],
    documents: [
      {
        id: 'doc1',
        name: 'Term Progress Report.pdf',
        url: '/documents/term-progress-report.pdf'
      }
    ],
    joinLink: 'https://zoom.us/j/123456789'
  },
  {
    id: 'meet2',
    title: 'SEND Review Meeting',
    date: '2025-06-02',
    time: '15:30-16:15',
    teacher: {
      id: 'senco1',
      name: 'Dr. Roberts',
      role: 'SENCO',
      avatar: '/avatars/senco1.png'
    },
    student: {
      id: 'student1',
      name: 'Emma Smith',
      year: 'Year 4'
    },
    location: 'School - Meeting Room 2',
    status: 'Scheduled',
    description: 'Review of current support plan and discussion of progress against targets.',
    agenda: [
      'Review of current support plan',
      'Progress against targets',
      'Input from subject teachers',
      'Adjustments to provision if needed',
      'Next steps and actions'
    ],
    documents: [
      {
        id: 'doc2',
        name: 'Current Support Plan.pdf',
        url: '/documents/current-support-plan.pdf'
      },
      {
        id: 'doc3',
        name: 'Progress Tracking.pdf',
        url: '/documents/progress-tracking.pdf'
      }
    ],
    joinLink: null
  }
];

// Mock data for celebrations
const MOCK_CELEBRATIONS = [
  {
    id: 'cel1',
    student: {
      id: 'student1',
      name: 'Emma Smith',
      year: 'Year 4'
    },
    title: 'Star Mathematician Award',
    description: 'Emma received the Star Mathematician award for her excellent progress with multiplication tables and problem-solving skills.',
    date: '2025-05-15',
    category: 'Academic Achievement',
    postedBy: {
      id: 'teacher1',
      name: 'Ms. Johnson',
      role: 'Teacher',
      avatar: '/avatars/teacher1.png'
    },
    media: [
      {
        id: 'med1',
        type: 'image',
        url: '/celebrations/star-mathematician.jpg',
        caption: 'Emma receiving her certificate in assembly'
      }
    ],
    reactions: {
      likes: 12,
      hearts: 8,
      celebrations: 5
    },
    comments: [
      {
        id: 'com1',
        author: {
          id: 'parent1',
          name: 'Mr. Smith',
          role: 'Parent',
          avatar: '/avatars/parent1.png'
        },
        content: 'We\'re so proud of Emma! She\'s been working really hard on her times tables at home.',
        timestamp: '2025-05-15T14:30:00Z'
      },
      {
        id: 'com2',
        author: {
          id: 'teacher1',
          name: 'Ms. Johnson',
          role: 'Teacher',
          avatar: '/avatars/teacher1.png'
        },
        content: 'Emma\'s dedication is really showing in her work. She\'s becoming very confident with problem-solving too.',
        timestamp: '2025-05-15T15:45:00Z'
      }
    ]
  },
  {
    id: 'cel2',
    student: {
      id: 'student1',
      name: 'Emma Smith',
      year: 'Year 4'
    },
    title: 'Creative Writing Success',
    description: 'Emma wrote an outstanding story about space exploration that showed exceptional creativity and use of descriptive language.',
    date: '2025-05-08',
    category: 'Academic Achievement',
    postedBy: {
      id: 'teacher1',
      name: 'Ms. Johnson',
      role: 'Teacher',
      avatar: '/avatars/teacher1.png'
    },
    media: [
      {
        id: 'med2',
        type: 'document',
        url: '/celebrations/space-story.pdf',
        caption: 'Emma\'s space exploration story'
      }
    ],
    reactions: {
      likes: 9,
      hearts: 7,
      celebrations: 3
    },
    comments: [
      {
        id: 'com3',
        author: {
          id: 'parent1',
          name: 'Mr. Smith',
          role: 'Parent',
          avatar: '/avatars/parent1.png'
        },
        content: 'Emma loves reading space books at home. It\'s wonderful to see her using that knowledge in her writing!',
        timestamp: '2025-05-08T16:20:00Z'
      }
    ]
  },
  {
    id: 'cel3',
    student: {
      id: 'student1',
      name: 'Emma Smith',
      year: 'Year 4'
    },
    title: 'Sports Day Achievement',
    description: 'Emma showed great determination in the long-distance race, finishing in second place and supporting her teammates throughout the day.',
    date: '2025-05-01',
    category: 'Sports Achievement',
    postedBy: {
      id: 'teacher2',
      name: 'Mr. Williams',
      role: 'PE Teacher',
      avatar: '/avatars/teacher2.png'
    },
    media: [
      {
        id: 'med3',
        type: 'image',
        url: '/celebrations/sports-day.jpg',
        caption: 'Emma receiving her medal at Sports Day'
      }
    ],
    reactions: {
      likes: 14,
      hearts: 10,
      celebrations: 8
    },
    comments: [
      {
        id: 'com4',
        author: {
          id: 'parent1',
          name: 'Mr. Smith',
          role: 'Parent',
          avatar: '/avatars/parent1.png'
        },
        content: 'Emma came home so excited about Sports Day! She\'s been practicing running in the park at weekends.',
        timestamp: '2025-05-01T15:10:00Z'
      },
      {
        id: 'com5',
        author: {
          id: 'teacher2',
          name: 'Mr. Williams',
          role: 'PE Teacher',
          avatar: '/avatars/teacher2.png'
        },
        content: 'The practise is definitely paying off! Emma showed great endurance and sportsmanship.',
        timestamp: '2025-05-01T16:30:00Z'
      }
    ]
  }
];

export default function ParentSchoolCollaboration() {
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null: any);
  const [newMessage, setNewMessage] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(null: any);
  const [selectedStrategy, setSelectedStrategy] = useState(null: any);
  const [selectedMeeting, setSelectedMeeting] = useState(null: any);
  const [selectedCelebration, setSelectedCelebration] = useState(null: any);
  const [language, setLanguage] = useState('en');
  
  // Filter messages based on search and selected student
  const filteredMessages = MOCK_MESSAGES.filter(message => {
    const matchesSearch = message.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (message.sender.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (message.recipient.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStudent = selectedStudent === 'all' || 
                          (message.student && message.student.id === selectedStudent: any);
    
    return matchesSearch && matchesStudent;
  });
  
  // Filter goals based on search and selected student
  const filteredGoals = MOCK_GOALS.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          goal.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStudent = selectedStudent === 'all' || goal.student.id === selectedStudent;
    
    return matchesSearch && matchesStudent;
  });
  
  // Filter strategies based on search
  const filteredStrategies = MOCK_STRATEGIES.filter(strategy => {
    return strategy.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           strategy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           strategy.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
  });
  
  // Filter meetings based on search and selected student
  const filteredMeetings = MOCK_MEETINGS.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          meeting.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStudent = selectedStudent === 'all' || meeting.student.id === selectedStudent;
    
    return matchesSearch && matchesStudent;
  });
  
  // Filter celebrations based on search and selected student
  const filteredCelebrations = MOCK_CELEBRATIONS.filter(celebration => {
    const matchesSearch = celebration.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          celebration.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStudent = selectedStudent === 'all' || celebration.student.id === selectedStudent;
    
    return matchesSearch && matchesStudent;
  });
  
  // Handle message selection
  const handleMessageSelect = (message: any) => {
    setSelectedMessage(message: any);
  };
  
  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    // In a real implementation, this would send the message to the API
    console.log('Sending message:', newMessage);
    
    // Clear the message input
    setNewMessage('');
  };
  
  // Handle goal selection
  const handleGoalSelect = (goal: any) => {
    setSelectedGoal(goal: any);
  };
  
  // Handle strategy selection
  const handleStrategySelect = (strategy: any) => {
    setSelectedStrategy(strategy: any);
  };
  
  // Handle meeting selection
  const handleMeetingSelect = (meeting: any) => {
    setSelectedMeeting(meeting: any);
  };
  
  // Handle celebration selection
  const handleCelebrationSelect = (celebration: any) => {
    setSelectedCelebration(celebration: any);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-centre">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parent-School Collaboration</h1>
          <p className="text-muted-foreground">
            Strengthen the home-school partnership for student success
          </p>
        </div>
        <div className="flex items-centre space-x-4">
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Student" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students</SelectItem>
              <SelectItem value="student1">Emma Smith (Year 4: any)</SelectItem>
              <SelectItem value="student2">James Smith (Year 7: any)</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="pl">Polski</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
              <SelectItem value="ur">اردو</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Unread Messages</p>
                <p className="text-3xl font-bold">2</p>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-centre text-xs text-muted-foreground">
              <span>Last message received 2 hours ago</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Active Goals</p>
                <p className="text-3xl font-bold">2</p>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <Target className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-centre text-xs text-muted-foreground">
              <span>1 goal recently updated</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Upcoming Meetings</p>
                <p className="text-3xl font-bold">2</p>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-centre text-xs text-muted-foreground">
              <span>Next meeting in 8 days</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Recent Celebrations</p>
                <p className="text-3xl font-bold">3</p>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <Award className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-centre text-xs text-muted-foreground">
              <span>Latest celebration 2 days ago</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex items-centre space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search messages, goals, or resources..."
            className="pl-8"
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value: any)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="messages" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="strategies">Home Strategies</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="celebrations">Celebrations</TabsTrigger>
        </TabsList>
        
        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4">
          {selectedMessage ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-centre">
                  <div className="flex items-centre">
                    <Avatar className="h-10 w-10 mr-2">
                      <AvatarFallback>{selectedMessage.sender.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedMessage.sender.name}</CardTitle>
                      <CardDescription>{selectedMessage.sender.role}</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedMessage(null: any)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Messages
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-centre mb-2">
                      <div>
                        <p className="text-sm font-medium">
                          {selectedMessage.student ? `Re: ${selectedMessage.student.name} (${selectedMessage.student.year})` : 'School Announcement'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(selectedMessage.timestamp: any).toLocaleString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {selectedMessage.priority === 'high' && (
                        <Badge className="bg-red-500">High Priority</Badge>
                      )}
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p>{selectedMessage.content}</p>
                      {selectedMessage.translated && (
                        <div className="mt-2 pt-2 border-t border-border">
                          <p className="text-xs text-muted-foreground flex items-centre">
                            <Globe className="h-3 w-3 mr-1" /> Translated from {selectedMessage.originalLanguage}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {selectedMessage.attachments.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Attachments</p>
                      <div className="space-y-2">
                        {selectedMessage.attachments.map(attachment => (
                          <div key={attachment.id} className="flex items-centre bg-muted/30 p-2 rounded-md">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">{attachment.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">({attachment.size})</span>
                            <Button variant="ghost" size="sm" className="ml-auto">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Reply</p>
                    <div className="space-y-4">
                      <Textarea 
                        placeholder="Type your reply here..." 
                        className="min-h-[100px]"
                        value={newMessage}
                        onChange={(e: any) => setNewMessage(e.target.value: any)}
                      />
                      <div className="flex justify-between items-centre">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Paperclip className="h-4 w-4 mr-1" /> Attach
                          </Button>
                          <Button variant="outline" size="sm">
                            <Image className="h-4 w-4 mr-1" /> Image
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mic className="h-4 w-4 mr-1" /> Voice
                          </Button>
                        </div>
                        <Button onClick={handleSendMessage}>
                          <Send className="h-4 w-4 mr-1" /> Send
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {filteredMessages.map((message: any) => (
                <Card key={message.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleMessageSelect(message: any)}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{message.sender.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between">
                          <div className="font-medium">{message.sender.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(message.timestamp: any).toLocaleString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-centre">
                          {message.sender.role}
                          {message.student && (
                            <>
                              <span className="mx-1">•</span>
                              <span>Re: {message.student.name} ({message.student.year})</span>
                            </>
                          )}
                        </div>
                        <p className="text-sm line-clamp-2">{message.content}</p>
                        <div className="flex items-centre pt-1">
                          {message.attachments.length > 0 && (
                            <span className="text-xs flex items-centre text-muted-foreground">
                              <Paperclip className="h-3 w-3 mr-1" />
                              {message.attachments.length} attachment{message.attachments.length !== 1 ? 's' : ''}
                            </span>
                          )}
                          {message.priority === 'high' && (
                            <Badge className="ml-2 bg-red-500">High Priority</Badge>
                          )}
                          {!message.read && (
                            <Badge className="ml-auto bg-blue-500">New</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredMessages.length === 0 && (
                <Card>
                  <CardContent className="p-8 flex flex-col items-centre justify-centre">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-centre">No messages found</h3>
                    <p className="text-sm text-muted-foreground text-centre mt-1">Try adjusting your search or filters</p>
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" /> New Message
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
        
        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-4">
          {selectedGoal ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-centre">
                  <div>
                    <CardTitle>{selectedGoal.title}</CardTitle>
                    <CardDescription>
                      {selectedGoal.student.name} ({selectedGoal.student.year}) • {selectedGoal.category} • {selectedGoal.subject}
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedGoal(null: any)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Goals
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Description</h3>
                    <p className="mt-1">{selectedGoal.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-medium">{selectedGoal.startDate}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Target Date</p>
                      <p className="font-medium">{selectedGoal.targetDate}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className={
                        selectedGoal.status === 'Completed' ? 'bg-green-500' :
                        selectedGoal.status === 'In Progress' ? 'bg-blue-500' :
                        'bg-amber-500'
                      }>
                        {selectedGoal.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Progress</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Overall Completion</span>
                        <span className="font-medium">{selectedGoal.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${selectedGoal.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">School Actions</h3>
                      <ul className="space-y-2">
                        {selectedGoal.schoolActions.map((action: any, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Home Actions</h3>
                      <ul className="space-y-2">
                        {selectedGoal.homeActions.map((action: any, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Updates</h3>
                    <div className="space-y-4">
                      {selectedGoal.updates.map((update: any, index) => (
                        <div key={index} className="bg-muted/50 p-4 rounded-lg">
                          <div className="flex justify-between items-start">
                            <p>{update.content}</p>
                          </div>
                          <div className="flex justify-between items-centre mt-2 text-xs text-muted-foreground">
                            <span>{update.author}</span>
                            <span>{update.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <Textarea placeholder="Add an update..." className="min-h-[100px]" />
                      <div className="flex justify-end mt-2">
                        <Button>
                          <Plus className="mr-2 h-4 w-4" /> Add Update
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {selectedGoal.evidence.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Evidence</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedGoal.evidence.map((item) => (
                          <div key={item.id} className="bg-muted/30 p-4 rounded-lg flex items-centre">
                            {item.type === 'document' ? (
                              <FileText className="h-8 w-8 mr-3 text-primary" />
                            ) : (
                              <Image className="h-8 w-8 mr-3 text-primary" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.date}</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" /> Edit Goal
                </Button>
                {selectedGoal.status !== 'Completed' && (
                  <Button>
                    <Upload className="mr-2 h-4 w-4" /> Add Evidence
                  </Button>
                )}
              </CardFooter>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between items-centre">
                <h2 className="text-xl font-semibold">Student Goals</h2>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> New Goal
                </Button>
              </div>
              
              {filteredGoals.map((goal: any) => (
                <Card key={goal.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleGoalSelect(goal: any)}>
                  <CardContent className="p-6">
                    <div className="flex justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">{goal.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{goal.description}</p>
                      </div>
                      <Badge className={
                        goal.status === 'Completed' ? 'bg-green-500' :
                        goal.status === 'In Progress' ? 'bg-blue-500' :
                        'bg-amber-500'
                      }>
                        {goal.status}
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-centre">
                      <div className="flex items-centre">
                        <Badge variant="outline" className="mr-2">{goal.category}</Badge>
                        <Badge variant="outline">{goal.subject}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Target: {goal.targetDate}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredGoals.length === 0 && (
                <Card>
                  <CardContent className="p-8 flex flex-col items-centre justify-centre">
                    <Target className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-centre">No goals found</h3>
                    <p className="text-sm text-muted-foreground text-centre mt-1">Try adjusting your search or filters</p>
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" /> Create New Goal
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
        
        {/* Home Strategies Tab */}
        <TabsContent value="strategies" className="space-y-4">
          {selectedStrategy ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-centre">
                  <div>
                    <CardTitle>{selectedStrategy.title}</CardTitle>
                    <CardDescription>
                      {selectedStrategy.category} • {selectedStrategy.ageRange} • {selectedStrategy.format}
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedStrategy(null: any)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Strategies
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="aspect-video bg-muted rounded-lg flex items-centre justify-centre">
                    <img 
                      src={selectedStrategy.thumbnail} 
                      alt={selectedStrategy.title}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Description</h3>
                    <p className="mt-1">{selectedStrategy.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <div className="flex items-centre">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 font-medium">{selectedStrategy.rating}</span>
                        <span className="text-xs text-muted-foreground ml-1">({selectedStrategy.downloads} downloads: any)</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Age Range</p>
                      <p className="font-medium">{selectedStrategy.ageRange}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Added</p>
                      <p className="font-medium">{selectedStrategy.dateAdded}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedStrategy.tags.map((tag: any, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg flex items-centre">
                    <FileText className="h-8 w-8 mr-3 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">{selectedStrategy.file.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedStrategy.file.size}</p>
                    </div>
                    <Button>
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Feedback</h3>
                    <Textarea placeholder="Share your experience with this strategy..." className="min-h-[100px]" />
                    <div className="flex items-centre justify-between mt-2">
                      <div className="flex items-centre">
                        <p className="text-sm mr-2">Rate this resource:</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star: any) => (
                            <Star key={star} className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <Button>
                        <Send className="mr-2 h-4 w-4" /> Submit Feedback
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-centre">
                <h2 className="text-xl font-semibold">Home Learning Strategies</h2>
                <div className="flex space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="literacy">Literacy</SelectItem>
                      <SelectItem value="numeracy">Numeracy</SelectItem>
                      <SelectItem value="physical">Physical Development</SelectItem>
                      <SelectItem value="social">Social-Emotional</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Age Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ages</SelectItem>
                      <SelectItem value="4-7">4-7 years</SelectItem>
                      <SelectItem value="7-11">7-11 years</SelectItem>
                      <SelectItem value="11-14">11-14 years</SelectItem>
                      <SelectItem value="14-16">14-16 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredStrategies.map((strategy) => (
                  <Card key={strategy.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleStrategySelect(strategy: any)}>
                    <div className="aspect-video bg-muted">
                      <img 
                        src={strategy.thumbnail} 
                        alt={strategy.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">{strategy.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{strategy.description}</p>
                        <div className="flex justify-between items-centre">
                          <Badge variant="outline">{strategy.category}</Badge>
                          <div className="flex items-centre">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 text-sm">{strategy.rating}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-centre text-xs text-muted-foreground">
                          <span>{strategy.ageRange}</span>
                          <span>{strategy.downloads} downloads</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredStrategies.length === 0 && (
                <Card>
                  <CardContent className="p-8 flex flex-col items-centre justify-centre">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-centre">No strategies found</h3>
                    <p className="text-sm text-muted-foreground text-centre mt-1">Try adjusting your search or filters</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
        
        {/* Meetings Tab */}
        <TabsContent value="meetings" className="space-y-4">
          {selectedMeeting ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-centre">
                  <div>
                    <CardTitle>{selectedMeeting.title}</CardTitle>
                    <CardDescription>
                      {selectedMeeting.date} • {selectedMeeting.time} • {selectedMeeting.location}
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedMeeting(null: any)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Meetings
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Teacher</p>
                      <div className="flex items-centre">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback>{selectedMeeting.teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{selectedMeeting.teacher.name}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{selectedMeeting.teacher.role}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Student</p>
                      <p className="font-medium">{selectedMeeting.student.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedMeeting.student.year}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className={
                        selectedMeeting.status === 'Completed' ? 'bg-green-500' :
                        selectedMeeting.status === 'Scheduled' ? 'bg-blue-500' :
                        'bg-amber-500'
                      }>
                        {selectedMeeting.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Description</h3>
                    <p className="mt-1">{selectedMeeting.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Agenda</h3>
                    <ul className="space-y-2">
                      {selectedMeeting.agenda.map((item: any, index) => (
                        <li key={index} className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-centre justify-centre mr-2 mt-0.5 text-xs font-medium">
                            {index + 1}
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {selectedMeeting.documents.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Documents</h3>
                      <div className="space-y-2">
                        {selectedMeeting.documents.map((doc: any) => (
                          <div key={doc.id} className="bg-muted/30 p-3 rounded-lg flex items-centre">
                            <FileText className="h-6 w-6 mr-2 text-primary" />
                            <span className="flex-1">{doc.name}</span>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Notes</h3>
                    <Textarea placeholder="Add meeting notes here..." className="min-h-[100px]" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" /> Reschedule
                </Button>
                {selectedMeeting.joinLink && (
                  <Button>
                    <Video className="mr-2 h-4 w-4" /> Join Meeting
                  </Button>
                )}
              </CardFooter>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-centre">
                <h2 className="text-xl font-semibold">Upcoming Meetings</h2>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Schedule Meeting
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {filteredMeetings.map((meeting: any) => (
                  <Card key={meeting.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleMeetingSelect(meeting: any)}>
                    <CardContent className="p-6">
                      <div className="flex justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium">{meeting.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{meeting.description}</p>
                        </div>
                        <Badge className={
                          meeting.status === 'Completed' ? 'bg-green-500' :
                          meeting.status === 'Scheduled' ? 'bg-blue-500' :
                          'bg-amber-500'
                        }>
                          {meeting.status}
                        </Badge>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-4">
                        <div className="flex items-centre">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-sm">{meeting.date}</span>
                        </div>
                        <div className="flex items-centre">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-sm">{meeting.time}</span>
                        </div>
                        <div className="flex items-centre">
                          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-sm">{meeting.location}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-centre">
                        <div className="flex items-centre">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback>{meeting.teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm">{meeting.teacher.name}</p>
                            <p className="text-xs text-muted-foreground">{meeting.teacher.role}</p>
                          </div>
                        </div>
                        <div className="flex items-centre">
                          <p className="text-sm mr-2">{meeting.student.name}</p>
                          <p className="text-xs text-muted-foreground">({meeting.student.year})</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredMeetings.length === 0 && (
                  <Card>
                    <CardContent className="p-8 flex flex-col items-centre justify-centre">
                      <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="font-medium text-centre">No meetings found</h3>
                      <p className="text-sm text-muted-foreground text-centre mt-1">Try adjusting your search or filters</p>
                      <Button className="mt-4">
                        <Plus className="mr-2 h-4 w-4" /> Schedule Meeting
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </TabsContent>
        
        {/* Celebrations Tab */}
        <TabsContent value="celebrations" className="space-y-4">
          {selectedCelebration ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-centre">
                  <div>
                    <CardTitle>{selectedCelebration.title}</CardTitle>
                    <CardDescription>
                      {selectedCelebration.student.name} ({selectedCelebration.student.year}) • {selectedCelebration.category} • {selectedCelebration.date}
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedCelebration(null: any)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Celebrations
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {selectedCelebration.media.map((item: any) => (
                    <div key={item.id} className="aspect-video bg-muted rounded-lg overflow-hidden">
                      {item.type === 'image' ? (
                        <img 
                          src={item.url} 
                          alt={item.caption || selectedCelebration.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-centre justify-centre">
                          <FileText className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      {item.caption && (
                        <div className="p-2 text-sm text-centre text-muted-foreground">
                          {item.caption}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <div>
                    <div className="flex items-centre mb-2">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>{selectedCelebration.postedBy.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{selectedCelebration.postedBy.name}</p>
                        <p className="text-xs text-muted-foreground">{selectedCelebration.postedBy.role}</p>
                      </div>
                    </div>
                    <p>{selectedCelebration.description}</p>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button variant="outline" size="sm" className="flex items-centre">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <span>Like</span>
                      {selectedCelebration.reactions.likes > 0 && (
                        <span className="ml-1 text-xs bg-muted rounded-full px-1.5">{selectedCelebration.reactions.likes}</span>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-centre">
                      <Heart className="h-4 w-4 mr-1" />
                      <span>Love</span>
                      {selectedCelebration.reactions.hearts > 0 && (
                        <span className="ml-1 text-xs bg-muted rounded-full px-1.5">{selectedCelebration.reactions.hearts}</span>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-centre">
                      <Award className="h-4 w-4 mr-1" />
                      <span>Celebrate</span>
                      {selectedCelebration.reactions.celebrations > 0 && (
                        <span className="ml-1 text-xs bg-muted rounded-full px-1.5">{selectedCelebration.reactions.celebrations}</span>
                      )}
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Comments</h3>
                    <div className="space-y-4">
                      {selectedCelebration.comments.map((comment: any) => (
                        <div key={comment.id} className="bg-muted/50 p-4 rounded-lg">
                          <div className="flex items-centre mb-2">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback>{comment.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{comment.author.name}</p>
                              <p className="text-xs text-muted-foreground">{comment.author.role}</p>
                            </div>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(comment.timestamp: any).toLocaleString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <Textarea placeholder="Add a comment..." className="min-h-[100px]" />
                      <div className="flex justify-end mt-2">
                        <Button>
                          <Send className="mr-2 h-4 w-4" /> Post Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-centre">
                <h2 className="text-xl font-semibold">Student Celebrations</h2>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Celebration
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {filteredCelebrations.map((celebration: any) => (
                  <Card key={celebration.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleCelebrationSelect(celebration: any)}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {celebration.media.length > 0 && celebration.media[0].type === 'image' && (
                          <div className="w-24 h-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={celebration.media[0].url} 
                              alt={celebration.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{celebration.title}</h3>
                            <Badge variant="outline">{celebration.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{celebration.description}</p>
                          <div className="flex justify-between items-centre">
                            <div className="flex items-centre">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarFallback>{celebration.postedBy.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm">{celebration.postedBy.name}</p>
                                <p className="text-xs text-muted-foreground">{celebration.postedBy.role}</p>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {celebration.date}
                            </div>
                          </div>
                          <div className="flex space-x-4">
                            <div className="flex items-centre text-xs text-muted-foreground">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              <span>{celebration.reactions.likes}</span>
                            </div>
                            <div className="flex items-centre text-xs text-muted-foreground">
                              <Heart className="h-3 w-3 mr-1" />
                              <span>{celebration.reactions.hearts}</span>
                            </div>
                            <div className="flex items-centre text-xs text-muted-foreground">
                              <Award className="h-3 w-3 mr-1" />
                              <span>{celebration.reactions.celebrations}</span>
                            </div>
                            <div className="flex items-centre text-xs text-muted-foreground">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              <span>{celebration.comments.length}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredCelebrations.length === 0 && (
                  <Card>
                    <CardContent className="p-8 flex flex-col items-centre justify-centre">
                      <Award className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="font-medium text-centre">No celebrations found</h3>
                      <p className="text-sm text-muted-foreground text-centre mt-1">Try adjusting your search or filters</p>
                      <Button className="mt-4">
                        <Plus className="mr-2 h-4 w-4" /> Add Celebration
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
