
export interface ITRViewerStepConfig {
  id: string;
  title: string;
  associatedSchedules?: string[]; // e.g., ["PartA"], ["ScheduleS", "ScheduleHP"]
  isConditional?: boolean;
  conditionField?: string; // Path in ITRData to check for conditional rendering
} 