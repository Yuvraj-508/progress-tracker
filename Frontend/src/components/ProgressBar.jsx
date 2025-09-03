const ProgressBar = ({ sections }) => {
  const total = sections.length;
  const completed = sections.filter(s => s.locked).length;
  const progress = (completed / total) * 100; // 0-100%

  return (
    <div className="w-[45%] mb-6">
      {/* Background track */}
      <div className="relative w-full h-5 bg-gray-200 rounded-full shadow-inner overflow-hidden">
        {/* Gradient fill */}
        <div
          className="h-5 rounded-full transition-all duration-700 ease-in-out"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #4f46e5, #06b6d4)', // purple to cyan
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
        ></div>

        {/* Glow effect */}
        <div
          className="absolute top-0 left-0 h-5 rounded-full opacity-50 pointer-events-none"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #4f46e5, #06b6d4)',
            filter: 'blur(4px)',
          }}
        ></div>
      </div>

      {/* Percentage label */}
      <p className="text-right text-sm text-gray-700 mt-1 font-semibold">
        {Math.round(progress)}% Complete
      </p>
    </div>
  );
};
export default ProgressBar;