interface PianoKeyProps {
  note: string;
  isBlack: boolean;
  isHighlighted: boolean;
  isRoot: boolean;
  onClick: () => void;
}

export default function PianoKey({
  note,
  isBlack,
  isHighlighted,
  isRoot,
  onClick,
}: PianoKeyProps) {
  const baseClasses = isBlack
    ? "w-full h-full rounded-b-md border border-gray-700 text-[10px] flex items-end justify-center pb-1 cursor-pointer transition-colors duration-150"
    : "relative w-[calc(100%/7)] h-full rounded-b-md border border-gray-300 text-xs flex items-end justify-center pb-2 cursor-pointer transition-colors duration-150";

  let colorClasses: string;
  if (isRoot) {
    colorClasses = isBlack
      ? "bg-amber-500 text-white hover:bg-amber-400"
      : "bg-amber-400 text-gray-900 hover:bg-amber-300";
  } else if (isHighlighted) {
    colorClasses = isBlack
      ? "bg-blue-600 text-white hover:bg-blue-500"
      : "bg-blue-400 text-white hover:bg-blue-300";
  } else {
    colorClasses = isBlack
      ? "bg-gray-900 text-gray-400 hover:bg-gray-800"
      : "bg-white text-gray-600 hover:bg-gray-100";
  }

  return (
    <button
      className={`${baseClasses} ${colorClasses} active:scale-95`}
      onClick={onClick}
      aria-label={`Play ${note}`}
    >
      {isHighlighted || isRoot ? note.replace(/\d/, "") : ""}
    </button>
  );
}
