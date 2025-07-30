interface TabsProps<T extends string> {
  tabs: string[];
  selectedTab: string;
  onChange: (value: T) => void;
  t: (key: string) => string;
}

export default function Tabs<T extends string>({
  tabs = [],
  selectedTab,
  onChange,
  t,
}: TabsProps<T>) {
  // Calculate the width for each tab
  const tabWidths: Record<string, string> = tabs.reduce((acc, tab) => {
    acc[tab] = `${100 / tabs.length}%`;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="tabs tabs-box w-full mb-3 flex-nowrap">
      {tabs.map((tab) => (
        <input
          key={tab}
          type="radio"
          name="tabmode"
          className="tab md:text-lg font-semibold"
          style={{ width: tabWidths[tab] }}
          aria-label={t(tab)}
          onChange={() => onChange(tab as T)}
          checked={selectedTab === tab}
        />
      ))}
    </div>
  );
}
