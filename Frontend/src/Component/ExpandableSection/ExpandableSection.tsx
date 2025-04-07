import React, { useEffect, useState } from "react";
import { ExpandableSectionHeader } from "./ExpandableSectionHeader";
import { ExpandableSectionContent } from "./ExpandableSectionContent";
import { ExpandableSectionProps } from "./types";
import "./ExpandableSection.scss";

export const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  items,
  forceExpand = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (forceExpand) {
      setIsOpen(true);
    }
  }, [forceExpand]);

  return (
    <div className="expandable-section">
      <ExpandableSectionHeader
        title={title}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && <ExpandableSectionContent items={items} />}
    </div>
  );
};
