# Component Documentation for EdPsych-AI-Education-Platform

## Overview

This document provides detailed documentation for the key components of the EdPsych-AI-Education-Platform. It serves as a reference for developers working on the platform, explaining the purpose, structure, and usage of each component.

## UI Components

### Theme Provider

**File:** `src/components/theme-provider.tsx`

**Purpose:** Manages the application's theme settings, including light/dark mode, age-appropriate styling, and accessibility features.

**Key Features:**
- Theme switching (light, dark, high-contrast, system)
- Age group theming (nursery, early-primary, late-primary, secondary)
- Accessibility settings (dyslexic font, font size, reduced motion)
- Local storage persistence of user preferences

**Usage Example:**
```tsx
import { ThemeProvider } from '@/components/theme-provider';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider defaultTheme="system" defaultAgeGroup="late-primary">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
```

**Hook Usage:**
```tsx
import { useTheme } from '@/components/theme-provider';

function ThemeSwitcher() {
  const { theme, setTheme, ageGroup, setAgeGroup } = useTheme();
  
  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
        <option value="high-contrast">High Contrast</option>
      </select>
      
      <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
        <option value="nursery">Nursery</option>
        <option value="early-primary">Early Primary</option>
        <option value="late-primary">Late Primary</option>
        <option value="secondary">Secondary</option>
      </select>
    </div>
  );
}
```

### Learning Card

**File:** `src/components/ui/LearningCard.tsx`

**Purpose:** Displays learning content in a card format with age-appropriate styling.

**Props:**
- `title`: Card title
- `description`: Brief description of the learning content
- `imageUrl`: URL for the card image
- `href`: Link destination when card is clicked
- `category`: Content category (e.g., "Mathematics")
- `level`: Difficulty level (e.g., "Beginner", "Intermediate")
- `className`: Optional additional CSS classes

**Usage Example:**
```tsx
import LearningCard from '@/components/ui/LearningCard';

function LearningModules() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <LearningCard
        title="Introduction to Fractions"
        description="Learn the basics of fractions and how to use them."
        imageUrl="/images/fractions.jpg"
        href="/modules/fractions"
        category="Mathematics"
        level="Beginner"
      />
      {/* More cards... */}
    </div>
  );
}
```

### Achievement Card

**File:** `src/components/ui/AchievementCard.tsx`

**Purpose:** Displays student achievements and badges with age-appropriate styling.

**Props:**
- `title`: Achievement title
- `description`: Description of how the achievement was earned
- `iconUrl`: URL for the achievement icon/badge
- `earnedDate`: Date when the achievement was earned
- `points`: Points awarded for the achievement
- `className`: Optional additional CSS classes

**Usage Example:**
```tsx
import AchievementCard from '@/components/ui/AchievementCard';

function StudentAchievements() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AchievementCard
        title="Math Master"
        description="Completed all mathematics modules with a score of 90% or higher."
        iconUrl="/images/badges/math-master.svg"
        earnedDate="2025-05-15"
        points={500}
      />
      {/* More achievements... */}
    </div>
  );
}
```

### Feedback Message

**File:** `src/components/ui/FeedbackMessage.tsx`

**Purpose:** Displays feedback messages to users with appropriate styling based on message type.

**Props:**
- `type`: Message type ("success", "error", "warning", "info")
- `message`: The feedback message text
- `title`: Optional title for the message
- `onDismiss`: Optional callback function when message is dismissed
- `autoHideDuration`: Optional duration in milliseconds before auto-hiding
- `className`: Optional additional CSS classes

**Usage Example:**
```tsx
import FeedbackMessage from '@/components/ui/FeedbackMessage';

function AssessmentSubmission() {
  const [feedback, setFeedback] = useState(null);
  
  const handleSubmit = async (data) => {
    try {
      await submitAssessment(data);
      setFeedback({
        type: 'success',
        title: 'Assessment Submitted',
        message: 'Your assessment has been submitted successfully.'
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        title: 'Submission Failed',
        message: error.message
      });
    }
  };
  
  return (
    <div>
      {feedback && (
        <FeedbackMessage
          type={feedback.type}
          title={feedback.title}
          message={feedback.message}
          onDismiss={() => setFeedback(null)}
          autoHideDuration={5000}
        />
      )}
      {/* Assessment form... */}
    </div>
  );
}
```

### Celebration Overlay

**File:** `src/components/ui/CelebrationOverlay.tsx`

**Purpose:** Displays an animated celebration overlay when students achieve significant milestones.

**Props:**
- `show`: Boolean to control visibility
- `title`: Celebration title
- `message`: Congratulatory message
- `achievement`: Optional achievement details
- `confettiDuration`: Optional duration for confetti animation
- `onClose`: Callback function when overlay is closed
- `className`: Optional additional CSS classes

**Usage Example:**
```tsx
import CelebrationOverlay from '@/components/ui/CelebrationOverlay';

function ModuleCompletion() {
  const [showCelebration, setShowCelebration] = useState(false);
  const [achievement, setAchievement] = useState(null);
  
  useEffect(() => {
    if (moduleCompleted) {
      setAchievement({
        title: "Module Mastery",
        points: 100,
        iconUrl: "/images/badges/module-master.svg"
      });
      setShowCelebration(true);
    }
  }, [moduleCompleted]);
  
  return (
    <div>
      <CelebrationOverlay
        show={showCelebration}
        title="Congratulations!"
        message="You've completed this module with excellent results."
        achievement={achievement}
        onClose={() => setShowCelebration(false)}
      />
      {/* Module content... */}
    </div>
  );
}
```

### Voice Input

**File:** `src/components/ui/VoiceInput.tsx`

**Purpose:** Provides voice input capabilities for students who struggle with typing.

**Props:**
- `onTranscript`: Callback function receiving the transcribed text
- `language`: Speech recognition language (default: "en-GB")
- `continuous`: Boolean to enable continuous recording
- `interimResults`: Boolean to enable interim results
- `placeholder`: Placeholder text for the input field
- `className`: Optional additional CSS classes

**Usage Example:**
```tsx
import VoiceInput from '@/components/ui/VoiceInput';

function AssessmentQuestion() {
  const [answer, setAnswer] = useState('');
  
  const handleTranscript = (transcript) => {
    setAnswer(transcript);
  };
  
  return (
    <div>
      <h3>Your answer:</h3>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <VoiceInput
        onTranscript={handleTranscript}
        language="en-GB"
        continuous={false}
        placeholder="Click to speak your answer"
      />
    </div>
  );
}
```

### Accessibility Controls

**File:** `src/components/ui/AccessibilityControls.tsx`

**Purpose:** Provides controls for adjusting accessibility settings.

**Props:**
- `className`: Optional additional CSS classes

**Usage Example:**
```tsx
import AccessibilityControls from '@/components/ui/AccessibilityControls';

function SettingsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Accessibility</h2>
        <AccessibilityControls />
      </div>
    </div>
  );
}
```

### Multilingual Support

**File:** `src/components/ui/MultilingualSupport.tsx`

**Purpose:** Provides language selection and translation capabilities.

**Props:**
- `defaultLanguage`: Default language code (default: "en-GB")
- `availableLanguages`: Array of available language objects
- `onLanguageChange`: Callback function when language is changed
- `className`: Optional additional CSS classes

**Usage Example:**
```tsx
import MultilingualSupport from '@/components/ui/MultilingualSupport';

const languages = [
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'fr-FR', name: 'Français' },
  { code: 'es-ES', name: 'Español' },
  { code: 'de-DE', name: 'Deutsch' }
];

function Header() {
  const handleLanguageChange = (languageCode) => {
    console.log(`Language changed to ${languageCode}`);
  };
  
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-2 flex justify-between items-centre">
        <Logo />
        <nav>{/* Navigation items */}</nav>
        <MultilingualSupport
          defaultLanguage="en-GB"
          availableLanguages={languages}
          onLanguageChange={handleLanguageChange}
        />
      </div>
    </header>
  );
}
```

## Voice Input Components

### Universal Voice Input

**File:** `src/components/voice-input/universal-voice-input.tsx`

**Purpose:** Core voice input component that can be used throughout the platform.

**Key Features:**
- Speech recognition with UK accent support
- Visual feedback during recording
- Error handling for unsupported browsers
- Transcript processing and filtering

**Usage Example:**
```tsx
import { UniversalVoiceInput } from '@/components/voice-input/universal-voice-input';

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleTranscript = (transcript) => {
    setSearchQuery(transcript);
  };
  
  return (
    <div className="flex items-centre">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 p-2 border rounded-l"
        placeholder="Search for learning materials..."
      />
      <UniversalVoiceInput
        onTranscript={handleTranscript}
        buttonClassName="p-2 bg-blue-500 text-white rounded-r"
      />
    </div>
  );
}
```

### Assessment Voice Input

**File:** `src/components/voice-input/activity-specific/assessment-voice-input.tsx`

**Purpose:** Specialised voice input component for assessments with education-specific vocabulary support.

**Key Features:**
- Subject-specific terminology recognition
- Mathematical and scientific term handling
- Extended recording time for longer answers
- Answer formatting assistance

**Usage Example:**
```tsx
import { AssessmentVoiceInput } from '@/components/voice-input/activity-specific/assessment-voice-input';

function MathAssessment() {
  const [answer, setAnswer] = useState('');
  
  const handleTranscript = (transcript) => {
    setAnswer(transcript);
  };
  
  return (
    <div className="assessment-question">
      <h3>Solve the following equation: 2x + 5 = 15</h3>
      <div className="answer-input">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Type your answer here..."
        />
        <AssessmentVoiceInput
          onTranscript={handleTranscript}
          subject="mathematics"
          buttonText="Speak your answer"
        />
      </div>
    </div>
  );
}
```

### Global Voice Input

**File:** `src/components/voice-input/global-voice-input.tsx`

**Purpose:** Platform-wide voice command system for navigation and actions.

**Key Features:**
- Command recognition ("go to", "search for", etc.)
- Navigation support
- Action triggering
- Help system for available commands

**Usage Example:**
```tsx
import { GlobalVoiceInput } from '@/components/voice-input/global-voice-input';

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-2 flex justify-between items-centre">
          <Logo />
          <nav>{/* Navigation items */}</nav>
          <GlobalVoiceInput
            commands={[
              { phrase: "go to dashboard", action: () => router.push('/dashboard') },
              { phrase: "search for", action: (param) => router.push(`/search?q=${param}`) },
              { phrase: "help", action: () => setShowHelp(true) }
            ]}
          />
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer>{/* Footer content */}</footer>
    </div>
  );
}
```

## Accessibility Components

### Accessibility Wrapper

**File:** `src/components/accessibility-wrapper.tsx`

**Purpose:** Provides accessibility features for wrapped components.

**Key Features:**
- Keyboard navigation support
- Screen reader announcements
- Focus management
- ARIA attribute handling

**Usage Example:**
```tsx
import { AccessibilityWrapper } from '@/components/accessibility-wrapper';

function InteractiveExercise({ children, title, instructions }) {
  return (
    <AccessibilityWrapper
      role="application"
      ariaLabel={title}
      ariaDescription={instructions}
    >
      <div className="exercise-container">
        <h2>{title}</h2>
        <p>{instructions}</p>
        {children}
      </div>
    </AccessibilityWrapper>
  );
}
```

### Integrated Accessibility Wrapper

**File:** `src/components/integrated-accessibility-wrapper.tsx`

**Purpose:** Combines multiple accessibility features into a single wrapper component.

**Key Features:**
- Voice input integration
- Theme and preference application
- Keyboard shortcuts
- Focus trapping for modals
- Screen reader optimizations

**Usage Example:**
```tsx
import { IntegratedAccessibilityWrapper } from '@/components/integrated-accessibility-wrapper';

function AssessmentModule({ assessment }) {
  return (
    <IntegratedAccessibilityWrapper
      voiceEnabled={true}
      keyboardShortcuts={true}
      preferredTheme={assessment.preferredTheme}
      ageGroup={assessment.ageGroup}
    >
      <div className="assessment-container">
        <h1>{assessment.title}</h1>
        {/* Assessment content */}
      </div>
    </IntegratedAccessibilityWrapper>
  );
}
```

## AI Avatar Components

### Avatar Creator

**File:** `src/components/ai-avatar/avatar-creator.tsx`

**Purpose:** Interface for creating and customising AI avatars.

**Key Features:**
- Avatar style selection
- Voice selection with UK accent options
- Preview generation
- Customization options
- Age-appropriate styling

**Usage Example:**
```tsx
import { AvatarCreator } from '@/components/ai-avatar/avatar-creator';

function CreateAvatarPage() {
  const handleAvatarCreated = (avatarData) => {
    console.log('Avatar created:', avatarData);
    // Save avatar or proceed to video generation
  };
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Teaching Avatar</h1>
      <AvatarCreator
        defaultStyle="teacher"
        defaultVoice="british-female"
        onAvatarCreated={handleAvatarCreated}
      />
    </div>
  );
}
```

### Video Generator

**File:** `src/components/ai-avatar/video-generator.tsx`

**Purpose:** Interface for generating educational videos with AI avatars.

**Key Features:**
- Script input and editing
- Avatar selection
- Background selection
- Age-appropriate content adaptation
- Generation progress tracking
- Preview and download options

**Usage Example:**
```tsx
import { VideoGenerator } from '@/components/ai-avatar/video-generator';

function CreateVideoPage() {
  const [avatars, setAvatars] = useState([]);
  
  useEffect(() => {
    // Fetch user's saved avatars
    fetchUserAvatars().then(setAvatars);
  }, []);
  
  const handleVideoGenerated = (videoData) => {
    console.log('Video generated:', videoData);
    // Save video to user's library
  };
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Educational Video</h1>
      <VideoGenerator
        avatars={avatars}
        defaultAgeGroup="late-primary"
        onVideoGenerated={handleVideoGenerated}
      />
    </div>
  );
}
```

## Utility Components

### Root Layout Wrapper

**File:** `src/components/root-layout-wrapper.tsx`

**Purpose:** Wraps the entire application with necessary providers and global components.

**Key Features:**
- Theme provider integration
- Authentication state management
- Global error boundary
- Analytics tracking
- Accessibility features

**Usage Example:**
```tsx
// src/app/layout.tsx
import { RootLayoutWrapper } from '@/components/root-layout-wrapper';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <RootLayoutWrapper>
          {children}
        </RootLayoutWrapper>
      </body>
    </html>
  );
}
```

## Utility Libraries

### Validation

**File:** `src/lib/validation.ts`

**Purpose:** Provides validation functions for forms and data.

**Key Functions:**
- `validateEmail(email: string): boolean`
- `validatePassword(password: string): boolean`
- `validateName(name: string): boolean`
- `validatePostcode(postcode: string): boolean` (UK format)
- `validatePhoneNumber(phone: string): boolean` (UK format)

**Usage Example:**
```tsx
import { validateEmail, validatePassword } from '@/lib/validation';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit form...
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Database Utilities

**File:** `src/lib/db-utils.ts`

**Purpose:** Provides utility functions for database operations.

**Key Functions:**
- `getPaginatedResults<T>(model: PrismaModel, options: PaginationOptions): Promise<PaginatedResult<T>>`
- `safeTransaction<T>(prisma: PrismaClient, callback: (tx: PrismaTransaction) => Promise<T>): Promise<T>`
- `createSearchQuery(searchTerm: string, fields: string[]): Prisma.StringFilter`

**Usage Example:**
```tsx
import { getPaginatedResults } from '@/lib/db-utils';
import { prisma } from '@/lib/prisma';

async function getModules(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const subject = req.query.subject;
  
  try {
    const result = await getPaginatedResults(prisma.module, {
      page,
      limit,
      where: subject ? { subject } : undefined,
      orderBy: { createdAt: 'desc' }
    });
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching modules:', error);
    return res.status(500).json({ error: 'Failed to fetch modules' });
  }
}
```

### Database Maintenance

**File:** `src/lib/db-maintenance.ts`

**Purpose:** Provides functions for database maintenance operations.

**Key Functions:**
- `backupDatabase(outputPath: string): Promise<string>`
- `restoreDatabase(backupPath: string): Promise<boolean>`
- `pruneOldData(options: PruneOptions): Promise<PruneResult>`
- `optimizeTables(): Promise<OptimizeResult>`

**Usage Example:**
```tsx
import { backupDatabase, optimizeTables } from '@/lib/db-maintenance';

// In a scheduled maintenance job
async function performMaintenance() {
  try {
    // Backup database
    const backupPath = await backupDatabase('/backups/daily');
    console.log(`Database backed up to ${backupPath}`);
    
    // Optimise tables
    const optimizeResult = await optimizeTables();
    console.log('Tables optimised:', optimizeResult);
  } catch (error) {
    console.error('Maintenance failed:', error);
  }
}
```

## AI Avatar Service

**File:** `src/lib/ai-avatar/avatar-service.ts`

**Purpose:** Provides services for AI avatar creation and video generation.

**Key Classes and Functions:**
- `AvatarService`: Main service class for avatar operations
- `createAvatar(options: AvatarOptions): Promise<Avatar>`
- `generateVideo(options: VideoGenerationOptions): Promise<VideoGeneration>`
- `getVideoStatus(id: string): Promise<VideoStatus>`

**Usage Example:**
```tsx
import { AvatarService } from '@/lib/ai-avatar/avatar-service';

// In an API route handler
async function generateAvatarVideo(req, res) {
  const { script, avatarStyle, ageGroup, voice } = req.body;
  
  if (!script || !avatarStyle || !ageGroup || !voice) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const avatarService = new AvatarService();
    
    const generation = await avatarService.generateVideo({
      script,
      avatarStyle,
      ageGroup,
      voice,
      userId: req.user.id
    });
    
    return res.status(202).json(generation);
  } catch (error) {
    console.error('Error generating avatar video:', error);
    return res.status(500).json({ error: 'Failed to generate avatar video' });
  }
}
```

## Conclusion

This component documentation provides a comprehensive reference for the key components of the EdPsych-AI-Education-Platform. Developers should refer to this documentation when working with these components to ensure consistent implementation and usage across the platform.

For more detailed information about specific components, refer to the inline documentation in the component files and the associated test files.
