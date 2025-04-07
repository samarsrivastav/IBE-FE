export interface SummaryItem {
  label: string;
  value: string | number | null;
  type?: "price" | "text" | "date";
}

export interface ExpandableSectionProps {
  title: string;
  items: SummaryItem[];
  forceExpand?: boolean;
}
