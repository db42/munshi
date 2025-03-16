import * as React from "react";

interface TableProps {
  className?: string;
  children: React.ReactNode;
}

interface TableHeaderProps {
  className?: string;
  children: React.ReactNode;
}

interface TableBodyProps {
  className?: string;
  children: React.ReactNode;
}

interface TableFooterProps {
  className?: string;
  children: React.ReactNode;
}

interface TableRowProps {
  className?: string;
  children: React.ReactNode;
}

interface TableHeadProps {
  className?: string;
  children: React.ReactNode;
}

interface TableCellProps {
  className?: string;
  children: React.ReactNode;
  colSpan?: number;
}

export const Table: React.FC<TableProps> = ({ className = "", children }) => {
  return (
    <div className="w-full overflow-auto">
      <table className={`w-full caption-bottom text-sm ${className}`}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader: React.FC<TableHeaderProps> = ({
  className = "",
  children,
}) => {
  return (
    <thead className={`[&_tr]:border-b ${className}`}>
      {children}
    </thead>
  );
};

export const TableBody: React.FC<TableBodyProps> = ({
  className = "",
  children,
}) => {
  return (
    <tbody className={`[&_tr:last-child]:border-0 ${className}`}>
      {children}
    </tbody>
  );
};

export const TableFooter: React.FC<TableFooterProps> = ({
  className = "",
  children,
}) => {
  return (
    <tfoot
      className={`border-t bg-gray-100/50 font-medium [&>tr]:last:border-b-0 ${className}`}
    >
      {children}
    </tfoot>
  );
};

export const TableRow: React.FC<TableRowProps> = ({
  className = "",
  children,
}) => {
  return (
    <tr
      className={`border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 ${className}`}
    >
      {children}
    </tr>
  );
};

export const TableHead: React.FC<TableHeadProps> = ({
  className = "",
  children,
}) => {
  return (
    <th
      className={`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 ${className}`}
    >
      {children}
    </th>
  );
};

export const TableCell: React.FC<TableCellProps> = ({
  className = "",
  children,
  colSpan,
}) => {
  return (
    <td
      className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
}; 