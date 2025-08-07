/**
 * Filter controls component for the cloud infrastructure graph
 */

import { memo } from "react";

import type { FilterType, FilterControlsProps } from "../../types";

const FilterControls = memo(
  ({
    activeFilter,
    onFilterChange,
    alertCount,
    misconfigCount,
    totalCount,
  }: FilterControlsProps) => {
    const filters = [
      {
        id: "all" as FilterType,
        label: "All",
        count: totalCount,
        color: "#6b7280",
        bgColor: "#f3f4f6",
      },
      {
        id: "alerts" as FilterType,
        label: "Alerts",
        count: alertCount,
        color: "#ef4444",
        bgColor: "#fee2e2",
      },
      {
        id: "misconfigurations" as FilterType,
        label: "Misconfigurations",
        count: misconfigCount,
        color: "#f59e0b",
        bgColor: "#fef3c7",
      },
    ];

    return (
      <div className="filter-controls">
        <div className="filter-buttons">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.id;

            return (
              <button
                key={filter.id}
                className={`filter-button ${isActive ? "active" : ""}`}
                onClick={() => onFilterChange(filter.id)}
                data-filter={filter.id}
                style={
                  {
                    "--filter-color": filter.color,
                    "--filter-bg": filter.bgColor,
                  } as React.CSSProperties
                }
              >
                <span className="filter-label">{filter.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);

FilterControls.displayName = "FilterControls";

export default FilterControls;
