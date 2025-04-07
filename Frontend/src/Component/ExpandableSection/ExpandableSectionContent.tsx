import React from "react";
import { SummaryItem } from "./types";
import "./ExpandableSection.scss";

interface ExpandableSectionContentProps {
  items: SummaryItem[];
}

export const ExpandableSectionContent: React.FC<
  ExpandableSectionContentProps
> = ({ items }) => {
  const formatValue = (item: SummaryItem) => {
    if (item.value === null) return "-";

    switch (item.type) {
      case "price":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(Number(item.value));
      case "date":
        return new Date(item.value).toLocaleDateString();
      default:
        return String(item.value);
    }
  };

  return (
    <div className="expandable-section__content">
      {items.map((item) => (
        <div key={item.label} className="content-row">
          <span className="label">{item.label}</span>
          <span className={`value ${item.type || "text"}`}>
            {formatValue(item)}
          </span>
        </div>
      ))}
    </div>
  );
};
