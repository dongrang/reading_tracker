interface StatsBarProps {
  toRead: number;
  reading: number;
  finished: number;
  avgRating: number | null;
}

//helper function for displaying stats
function Stat({label,value}:{label:string;value:number|string}) {
  return (
    <div className="flex-1 min-w-[80px] text-center">
      <p className="text-xl font-semibold">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}

export default function StatsBar({
  toRead,
  reading,
  finished,
  avgRating,
}: StatsBarProps) {
  return (
    <div className="flex flex-wrap gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3">
      <Stat label="To Read" value={toRead}/>
      <Stat label="Reading" value={reading}/>
      <Stat label="Finished" value={finished}/>
      <Stat label="Average Waiting" value={avgRating !== null ? avgRating.toFixed(1):"-----"}/>
    </div>
  );
}
