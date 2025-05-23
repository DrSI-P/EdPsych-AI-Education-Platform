declare module 'react-big-calendar' {
  import { ComponentType, ReactNode } from 'react';
  
  export interface CalendarProps {
    localizer: any;
    events: any[];
    startAccessor?: string | ((event: any) => Date);
    endAccessor?: string | ((event: any) => Date);
    titleAccessor?: string | ((event: any) => string);
    tooltipAccessor?: string | ((event: any) => string);
    allDayAccessor?: string | ((event: any) => boolean);
    resourceAccessor?: string | ((event: any) => any);
    resourceIdAccessor?: string | ((resource: any) => string | number);
    resourceTitleAccessor?: string | ((resource: any) => string);
    resources?: any[];
    selectable?: boolean | 'ignoreEvents';
    longPressThreshold?: number;
    onSelecting?: (range: { start: Date; end: Date }) => boolean | undefined | null;
    onSelectSlot?: (slotInfo: {
      start: Date;
      end: Date;
      slots: Date[];
      action: 'select' | 'click' | 'doubleClick';
    }) => void;
    onSelectEvent?: (event: any, e: React.SyntheticEvent) => void;
    onDoubleClickEvent?: (event: any, e: React.SyntheticEvent) => void;
    onKeyPressEvent?: (event: any, e: React.SyntheticEvent) => void;
    onDrillDown?: (date: Date, view: View) => void;
    onNavigate?: (newDate: Date, view: View, action: NavigateAction) => void;
    onView?: (view: View) => void;
    onRangeChange?: (range: { start: Date; end: Date }, view: View) => void;
    onShowMore?: (events: any[], date: Date) => void;
    defaultView?: View;
    defaultDate?: Date;
    views?: Views;
    view?: View;
    date?: Date;
    min?: Date;
    max?: Date;
    scrollToTime?: Date;
    culture?: string;
    formats?: any;
    components?: Components;
    messages?: any;
    timeslots?: number;
    rtl?: boolean;
    style?: React.CSSProperties;
    className?: string;
    elementProps?: React.HTMLAttributes<HTMLElement>;
    dayPropGetter?: (date: Date) => { className?: string; style?: React.CSSProperties };
    slotPropGetter?: (date: Date) => { className?: string; style?: React.CSSProperties };
    showMultiDayTimes?: boolean;
    getDrilldownView?: (targetDate: Date, currentViewName: View, configuredViewNames: View[]) => View | null;
    onDragStart?: (event: any) => void;
    onDrag?: (event: any) => void;
    onDragEnd?: (event: any) => void;
    resizable?: boolean;
    step?: number;
    toolbar?: boolean;
    popup?: boolean;
    popupOffset?: number | { x: number; y: number };
    drilldownView?: View;
    titleFormat?: any;
    getNow?: () => Date;
    onEventDrop?: (args: {
      event: any;
      start: Date;
      end: Date;
      allDay: boolean;
    }) => void;
    onEventResize?: (args: {
      event: any;
      start: Date;
      end: Date;
      allDay: boolean;
    }) => void;
    [key: string]: any;
  }

  export type View = 'month' | 'week' | 'work_week' | 'day' | 'agenda';
  export type Views = View[] | { [key in View]?: boolean | ComponentType<any> };
  export type NavigateAction = 'PREV' | 'NEXT' | 'TODAY' | 'DATE';

  export interface Components {
    event?: ComponentType<any>;
    eventWrapper?: ComponentType<any>;
    dayWrapper?: ComponentType<any>;
    dateCellWrapper?: ComponentType<any>;
    timeSlotWrapper?: ComponentType<any>;
    timeGutterHeader?: ComponentType<any>;
    timeGutterWrapper?: ComponentType<any>;
    toolbar?: ComponentType<any>;
    agenda?: {
      date?: ComponentType<any>;
      time?: ComponentType<any>;
      event?: ComponentType<any>;
    };
    day?: {
      header?: ComponentType<any>;
      event?: ComponentType<any>;
    };
    week?: {
      header?: ComponentType<any>;
      event?: ComponentType<any>;
    };
    month?: {
      header?: ComponentType<any>;
      dateHeader?: ComponentType<any>;
      event?: ComponentType<any>;
    };
    [key: string]: any;
  }

  export class Calendar extends React.Component<CalendarProps> {}
  
  export function momentLocalizer(moment: any): any;
  export function dateFnsLocalizer(params: any): any;
  export function globalizeLocalizer(globalizeInstance: any): any;
}