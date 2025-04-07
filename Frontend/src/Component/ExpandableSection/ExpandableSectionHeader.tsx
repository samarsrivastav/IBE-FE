import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import "./ExpandableSection.scss";

interface ExpandableSectionHeaderProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  forceExpand?: boolean;
}

export const ExpandableSectionHeader: React.FC<
  ExpandableSectionHeaderProps
> = ({ title, isOpen, onToggle, forceExpand }) => {
  return (
    <button
      onClick={onToggle}
      className="expandable-section__header"
      disabled={forceExpand}
    >
      {!forceExpand && (isOpen ? <ChevronUp /> : <ChevronDown />)}
      <p>{title}</p>
    </button>
  );
};
