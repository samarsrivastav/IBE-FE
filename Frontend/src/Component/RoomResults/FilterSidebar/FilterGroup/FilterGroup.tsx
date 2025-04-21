import React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import styles from "./FilterGroup.module.scss";

type FilterKeys = "bedType" | "location" | "stars";

interface FilterGroupProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

const FilterGroup: React.FC<FilterGroupProps> = ({
  title,
  expanded,
  onToggle,
  children,
}) => {
  return (
    <div className={styles.filter}>
      <div className={styles.filter__header} onClick={onToggle}>
        <span className={styles.filter__title}>{title}</span>
        {expanded ? (
          <KeyboardArrowUpIcon className={styles.filter__icon} />
        ) : (
          <KeyboardArrowDownIcon className={styles.filter__icon} />
        )}
      </div>
      {expanded && (
        <div className={styles.filter__content}>
          <div className={styles.filter__options}>{children}</div>
        </div>
      )}
    </div>
  );
};

export default FilterGroup;