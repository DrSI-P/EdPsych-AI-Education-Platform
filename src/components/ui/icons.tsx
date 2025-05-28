import * as React from "react";
import { cn } from "@/lib/utils";

// Import actual icons from lucide-react
// This ensures we're using the same icon library throughout the application
import { Mic as LucideMic, Brain as LucideBrain, Lightbulb as LucideLightbulb, CheckCircle as LucideCheckCircle, BarChart as LucideBarChart, LineChart as LucideLineChart, Target as LucideTarget, Heart as LucideHeart, Award as LucideAward, ChevronRight as LucideChevronRight, ChevronLeft as LucideChevronLeft, ChevronDown as LucideChevronDown, ChevronUp as LucideChevronUp, Menu as LucideMenu, X as LucideX, Search as LucideSearch, Settings as LucideSettings, User as LucideUser, LogOut as LucideLogOut, LogIn as LucideLogIn, Mail as LucideMail, Bell as LucideBell, Calendar as LucideCalendar, Clock as LucideClock, Star as LucideStar, Home as LucideHome, Book as LucideBook, FileText as LucideFileText, HelpCircle as LucideHelpCircle, Info as LucideInfo, AlertCircle as LucideAlertCircle, AlertTriangle as LucideAlertTriangle, CheckSquare as LucideCheckSquare, Edit as LucideEdit, Trash as LucideTrash, Download as LucideDownload, Upload as LucideUpload, ExternalLink as LucideExternalLink, Plus as LucidePlus, Minus as LucideMinus, PenTool as LucidePenTool, Bookmark as LucideBookmark, Share2 as LucideShare, Send as LucideSend, Save as LucideSave, Printer as LucidePrinter, Eye as LucideEye, EyeOff as LucideEyeOff, Lock as LucideLock, Unlock as LucideUnlock, Shield as LucideShield, Flag as LucideFlag, Tag as LucideTag, Layers as LucideLayers, Zap as LucideZap, Play as LucidePlay, Pause as LucidePause, Video as LucideVideo, Image as LucideImage, Music as LucideMusic, Headphones as LucideHeadphones, Speaker as LucideSpeaker, VolumeX as LucideVolumeX, Volume2 as LucideVolume, MessageCircle as LucideMessageCircle, MessageSquare as LucideMessageSquare, Share as LucideShare2, ThumbsUp as LucideThumbsUp, ThumbsDown as LucideThumbsDown, Smile as LucideSmile, Frown as LucideFrown, Meh as LucideMeh, ArrowRight as LucideArrowRight, ArrowLeft as LucideArrowLeft, ArrowUp as LucideArrowUp, ArrowDown as LucideArrowDown, RotateCcw as LucideRotateCcw, RotateCw as LucideRotateCw, RefreshCw as LucideRefreshCw, Filter as LucideFilter, List as LucideList, Grid as LucideGrid, MoreHorizontal as LucideMoreHorizontal, MoreVertical as LucideMoreVertical, Copy as LucideCopy, Clipboard as LucideClipboard, Link as LucideLink, Link2 as LucideLink2, Paperclip as LucidePaperclip, MapPin as LucideMapPin, Map as LucideMap, Globe as LucideGlobe, Phone as LucidePhone, Smartphone as LucideSmartphone, Tablet as LucideTablet, Laptop as LucideLaptop, Monitor as LucideMonitor, Wifi as LucideWifi, Bluetooth as LucideBluetooth, Battery as LucideBattery, BatteryCharging as LucideBatteryCharging, Sun as LucideSun, Moon as LucideMoon, Cloud as LucideCloud, CloudRain as LucideCloudRain, CloudSnow as LucideCloudSnow, CloudLightning as LucideCloudLightning, Thermometer as LucideThermometer, Umbrella as LucideUmbrella, Wind as LucideWind, Compass as LucideCompass, Camera as LucideCamera, Video as LucideVideoCamera, Film as LucideFilm, Tv as LucideTv, Radio as LucideRadio, Disc as LucideDisc, Server as LucideServer, Database as LucideDatabase, HardDrive as LucideHardDrive, Cpu as LucideCpu, Printer as LucidePrinter2, Scissors as LucideScissors, Loader as LucideLoader, Activity as LucideActivity, Gift as LucideGift, Coffee as LucideCoffee, ShoppingBag as LucideShoppingBag, ShoppingCart as LucideShoppingCart, CreditCard as LucideCreditCard, DollarSign as LucideDollarSign, Percent as LucidePercent, TrendingUp as LucideTrendingUp, TrendingDown as LucideTrendingDown, PieChart as LucidePieChart, Sliders as LucideSliders, Tool as LucideTool, Wrench as LucideWrench, Package as LucidePackage, Archive as LucideArchive, Folder as LucideFolder, FolderPlus as LucideFolderPlus, FolderMinus as LucideFolderMinus, File as LucideFile, FilePlus as LucideFilePlus, FileMinus as LucideFileMinus, FileText as LucideFileText2, Inbox as LucideInbox, Send as LucideSend2, Trash2 as LucideTrash2, Trash as LucideTrash3, Power as LucidePower, Command as LucideCommand, Terminal as LucideTerminal, Code as LucideCode, GitBranch as LucideGitBranch, GitCommit as LucideGitCommit, GitMerge as LucideGitMerge, GitPullRequest as LucideGitPullRequest, Github as LucideGithub, Gitlab as LucideGitlab, Twitter as LucideTwitter, Facebook as LucideFacebook, Instagram as LucideInstagram, Linkedin as LucideLinkedin, Youtube as LucideYoutube, Twitch as LucideTwitch, Slack as LucideSlack, Dribbble as LucideDribbble, Figma as LucideFigma, Framer as LucideFramer, Codesandbox as LucideCodesandbox, Hash as LucideHash, AtSign as LucideAtSign, Rss as LucideRss, Share as LucideShare3, Wifi as LucideWifi2, Bluetooth as LucideBluetooth2, Cast as LucideCast, Airplay as LucideAirplay, Smartphone as LucideSmartphone2, Tablet as LucideTablet2, Laptop as LucideLaptop2, Monitor as LucideMonitor2, Tv as LucideTv2, Speaker as LucideSpeaker2, Headphones as LucideHeadphones2, Music as LucideMusic2, Video as LucideVideo2, Camera as LucideCamera2, Film as LucideFilm2, Image as LucideImage2, Aperture as LucideAperture, Sunrise as LucideSunrise, Sunset as LucideSunset, Sun as LucideSun2, Moon as LucideMoon2, Cloud as LucideCloud2, CloudRain as LucideCloudRain2, CloudSnow as LucideCloudSnow2, CloudLightning as LucideCloudLightning2, CloudDrizzle as LucideCloudDrizzle, CloudOff as LucideCloudOff, Thermometer as LucideThermometer2, Umbrella as LucideUmbrella2, Wind as LucideWind2, Compass as LucideCompass2, Navigation as LucideNavigation, Navigation2 as LucideNavigation2, Map as LucideMap2, MapPin as LucideMapPin2, Globe as LucideGlobe2, Flag as LucideFlag2, Home as LucideHome2, Building as LucideBuilding, Landmark as LucideLandmark, Briefcase as LucideBriefcase, Clipboard as LucideClipboard2, Clipboard as LucideClipboard3, Clipboard as LucideClipboard4, Clipboard as LucideClipboard5, Clipboard as LucideClipboard6, Clipboard as LucideClipboard7, Clipboard as LucideClipboard8, Clipboard as LucideClipboard9, Clipboard as LucideClipboard10,  } from "lucide-react";

// Interface for icon props
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

// Higher-order component to enhance icons with consistent styling and props
const createStyledIcon = (IconComponent: React.FC<IconProps>) => {
  const StyledIcon = React.forwardRef<SVGSVGElement, IconProps>(
    ({ className, size = 24, color, strokeWidth = 2, ...props }, ref) => {
      return (
        <IconComponent
          ref={ref}
          className={cn("inline-block flex-shrink-0", className)}
          size={size}
          color={color}
          strokeWidth={strokeWidth}
          {...props}
        />
      );
    }
  );
  
  StyledIcon.displayName = IconComponent.displayName || "StyledIcon";
  return StyledIcon;
};

// Create enhanced versions of each icon
export const BookOpen = createStyledIcon(LucideBookOpen);
export const Mic = createStyledIcon(LucideMic);
export const Brain = createStyledIcon(LucideBrain);
export const Lightbulb = createStyledIcon(LucideLightbulb);
export const CheckCircle = createStyledIcon(LucideCheckCircle);
export const BarChart = createStyledIcon(LucideBarChart);
export const LineChart = createStyledIcon(LucideLineChart);
export const Target = createStyledIcon(LucideTarget);
export const Heart = createStyledIcon(LucideHeart);
export const Award = createStyledIcon(LucideAward);
export const ChevronRight = createStyledIcon(LucideChevronRight);
export const ChevronLeft = createStyledIcon(LucideChevronLeft);
export const ChevronDown = createStyledIcon(LucideChevronDown);
export const ChevronUp = createStyledIcon(LucideChevronUp);
export const Menu = createStyledIcon(LucideMenu);
export const X = createStyledIcon(LucideX);
export const Search = createStyledIcon(LucideSearch);
export const Settings = createStyledIcon(LucideSettings);
export const User = createStyledIcon(LucideUser);
export const LogOut = createStyledIcon(LucideLogOut);
export const LogIn = createStyledIcon(LucideLogIn);
export const Mail = createStyledIcon(LucideMail);
export const Bell = createStyledIcon(LucideBell);
export const Calendar = createStyledIcon(LucideCalendar);
export const Clock = createStyledIcon(LucideClock);
export const Star = createStyledIcon(LucideStar);
export const Home = createStyledIcon(LucideHome);
export const Book = createStyledIcon(LucideBook);
export const FileText = createStyledIcon(LucideFileText);
export const HelpCircle = createStyledIcon(LucideHelpCircle);
export const Info = createStyledIcon(LucideInfo);
export const AlertCircle = createStyledIcon(LucideAlertCircle);
export const AlertTriangle = createStyledIcon(LucideAlertTriangle);
export const CheckSquare = createStyledIcon(LucideCheckSquare);
export const Edit = createStyledIcon(LucideEdit);
export const Trash = createStyledIcon(LucideTrash);
export const Download = createStyledIcon(LucideDownload);
export const Upload = createStyledIcon(LucideUpload);
export const ExternalLink = createStyledIcon(LucideExternalLink);
export const Plus = createStyledIcon(LucidePlus);
export const Minus = createStyledIcon(LucideMinus);
export const PenTool = createStyledIcon(LucidePenTool);
export const Bookmark = createStyledIcon(LucideBookmark);
export const Share = createStyledIcon(LucideShare);
export const Send = createStyledIcon(LucideSend);
export const Save = createStyledIcon(LucideSave);
export const Printer = createStyledIcon(LucidePrinter);
export const Eye = createStyledIcon(LucideEye);
export const EyeOff = createStyledIcon(LucideEyeOff);
export const Lock = createStyledIcon(LucideLock);
export const Unlock = createStyledIcon(LucideUnlock);
export const Shield = createStyledIcon(LucideShield);
export const Flag = createStyledIcon(LucideFlag);
export const Tag = createStyledIcon(LucideTag);
export const Layers = createStyledIcon(LucideLayers);
export const Zap = createStyledIcon(LucideZap);
export const Play = createStyledIcon(LucidePlay);
export const Pause = createStyledIcon(LucidePause);
export const Video = createStyledIcon(LucideVideo);
export const Image = createStyledIcon(LucideImage);
export const Music = createStyledIcon(LucideMusic);
export const Headphones = createStyledIcon(LucideHeadphones);
export const Speaker = createStyledIcon(LucideSpeaker);
export const VolumeX = createStyledIcon(LucideVolumeX);
export const Volume = createStyledIcon(LucideVolume);
export const MessageCircle = createStyledIcon(LucideMessageCircle);
export const MessageSquare = createStyledIcon(LucideMessageSquare);
export const Share2 = createStyledIcon(LucideShare2);
export const ThumbsUp = createStyledIcon(LucideThumbsUp);
export const ThumbsDown = createStyledIcon(LucideThumbsDown);
export const Smile = createStyledIcon(LucideSmile);
export const Frown = createStyledIcon(LucideFrown);
export const Meh = createStyledIcon(LucideMeh);
export const ArrowRight = createStyledIcon(LucideArrowRight);
export const ArrowLeft = createStyledIcon(LucideArrowLeft);
export const ArrowUp = createStyledIcon(LucideArrowUp);
export const ArrowDown = createStyledIcon(LucideArrowDown);

// Export a comprehensive icon set for the application
export const Icons = {
  BookOpen,
  Mic,
  Brain,
  Lightbulb,
  CheckCircle,
  BarChart,
  LineChart,
  Target,
  Heart,
  Award,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Search,
  Settings,
  User,
  LogOut,
  LogIn,
  Mail,
  Bell,
  Calendar,
  Clock,
  Star,
  Home,
  Book,
  FileText,
  HelpCircle,
  Info,
  AlertCircle,
  AlertTriangle,
  CheckSquare,
  Edit,
  Trash,
  Download,
  Upload,
  ExternalLink,
  Plus,
  Minus,
  PenTool,
  Bookmark,
  Share,
  Send,
  Save,
  Printer,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Shield,
  Flag,
  Tag,
  Layers,
  Zap,
  Play,
  Pause,
  Video,
  Image,
  Music,
  Headphones,
  Speaker,
  VolumeX,
  Volume,
  MessageCircle,
  MessageSquare,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
};

// Default export for convenience
export default Icons;
