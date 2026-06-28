interface StatsBarProps {
  toRead: number;
  reading: number;
  finished: number;
  avgRating: number | null;
}

export default function StatsBar({toRead,reading,finished,avgRating} : StatsBarProps){
  return <div className="flex gap-4 border-2">
    <span>{toRead} to read</span>
    <span>{reading} reading</span>
    <span>{finished} finished</span>
    <span>Avg Rating: {avgRating !== null ? avgRating.toFixed(1): "----"}
    </span>
  </div>;
}
