const ProgressBar = ({ value }) => {
  const pct = Math.min(100, Math.max(0, value || 0));

  return (
    <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
      <div
        className="h-4 bg-green-500"
        style={{ width: `${pct}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
