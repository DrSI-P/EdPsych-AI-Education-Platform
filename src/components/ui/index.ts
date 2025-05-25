import * as React from "react";
import { Input } from "./input";
import { Progress } from "./progress";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableFooter, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "./table";

import { Alert as AlertComponent, AlertDescription, AlertTitle } from './alert';
import { Button } from './button';
import { Badge } from './badge';
import { Label } from './label';
import { Textarea } from './textarea';
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './select';

// Export all UI components
export const Alert = AlertComponent;
export const AlertDescription = AlertDescription;
export const AlertTitle = AlertTitle;
export { Button };
export { Badge };
export { Label };
export { Input };
export { Progress };
export { Textarea };

// Export Table components
export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
};

// Export Select components
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};

export default AlertComponent;
