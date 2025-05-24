import React from 'react';

export type SortDirection = 'asc' | 'desc' | null;

interface SortableColumnProps {
  label: string;
  field: string;
  currentSortField: string | null;
  currentSortDirection: SortDirection;
  onSort: (field: string, direction: SortDirection) => void;
}

const SortableColumn: React.FC<SortableColumnProps> = ({
  label,
  field,
  currentSortField,
  currentSortDirection,
  onSort,
}) => {
  const isSorted = currentSortField === field;

  const handleSort = () => {
    let nextDirection: SortDirection = null;
    if (isSorted) {
      if (currentSortDirection === 'asc') {
        nextDirection = 'desc';
      } else if (currentSortDirection === 'desc') {
        nextDirection = null;
      } else {
        nextDirection = 'asc';
      }
    } else {
      nextDirection = 'asc';
    }

    onSort(field, nextDirection);
  };

  return (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
      onClick={handleSort}
    >
      <div className="flex items-center">
        <span>{label}</span>
        <div className="ml-1">
          {isSorted ? (
            currentSortDirection === 'asc' ? (
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : currentSortDirection === 'desc' ? (
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : null
          ) : (
            <svg className="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
    </th>
  );
};

export default SortableColumn;
