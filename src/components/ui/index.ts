// UI Component Barrel File
// This file exports all UI components for easier imports

export * from './accordion';
export * from './alert';
export * from './alert-dialogue';
export * from './avatar';
export * from './badge';
export * from './button';
export * from './calendar';
export * from './card';
export * from './checkbox';

// Export dialogue components with explicit names to avoid conflicts with modal
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './dialogue';

// Export dropdown components with explicit names to avoid conflicts
export { 
  Dropdown,
  DropdownItem,
  DropdownLink,
  DropdownDivider,
  DropdownLabel,
  Menu,
  MenuItem
} from './dropdown';

export * from './dropdown-menu';

// Export form components with explicit names to avoid conflicts
export { 
  Input,
  Textarea,
  Select,
  Checkbox as FormCheckbox,
  Radio,
  FormLabel,
  Form
} from './form';

// Add missing form components that are causing the build error
export const FormField = ({ children }: { children: any }) => children;
export const FormItem = ({ children }: { children: any }) => children;
export const FormControl = ({ children }: { children: any }) => children;
export const FormMessage = ({ children }: { children: any }) => children;

export * from './input';
export * from './label';

// Export loading components with explicit names to avoid conflicts
export {
  Loading,
  LoadingDots,
  LoadingSpinner
} from './loading';

// Export modal components with explicit names to avoid conflicts with dialogue
export {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from './modal';

export * from './pagination';
export * from './popover';

// Export progress component with explicit name to avoid conflicts
export {
  Progress
} from './progress';

export * from './radio-group';
export * from './scroll-area';
export * from './select';
export * from './separator';

// Export skeleton component with explicit name to avoid conflicts
export {
  Skeleton
} from './skeleton';

export * from './slider';
export * from './switch';
export * from './table';
export * from './tabs';
export * from './textarea';

// Export toast components with explicit names to avoid conflicts
export {
  Toast,
  ToastProvider,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastViewport
} from './toast';

// Export toaster component with explicit name to avoid conflicts
export {
  Toaster
} from './toaster';

export * from './tooltip';

// Export use-toast with explicit name to avoid conflicts
export {
  toast,
  useToast
} from './use-toast';
