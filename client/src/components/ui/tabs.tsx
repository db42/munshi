import * as React from "react";

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
}>({
  value: "",
  onValueChange: () => {},
});

export const Tabs: React.FC<TabsProps> = ({
  value,
  onValueChange,
  children,
  className = "",
}) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<TabsListProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 ${className}`}
      role="tablist"
    >
      {children}
    </div>
  );
};

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  className = "",
  disabled = false,
}) => {
  const { value: selectedValue, onValueChange } = React.useContext(TabsContext);
  const isSelected = selectedValue === value;

  return (
    <button
      role="tab"
      aria-selected={isSelected}
      disabled={disabled}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isSelected
          ? "bg-white text-blue-700 shadow-sm"
          : "text-gray-500 hover:text-gray-900"
      } ${className}`}
      onClick={() => onValueChange(value)}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className = "",
}) => {
  const { value: selectedValue } = React.useContext(TabsContext);
  const isSelected = selectedValue === value;

  if (!isSelected) return null;

  return (
    <div
      role="tabpanel"
      className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${className}`}
    >
      {children}
    </div>
  );
}; 