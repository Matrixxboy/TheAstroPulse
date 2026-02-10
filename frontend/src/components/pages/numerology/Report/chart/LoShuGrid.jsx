import React from "react";

const LoShuGrid = ({ gridData }) => {
  return (
    <div className="flex justify-center items-center mb-10">
      <div className="grid grid-cols-3 gap-2">
        {gridData.map((value, index) => (
          <div
            key={index}
            className={`w-20 h-20 flex justify-center items-center text-xl font-semibold rounded-md border-2 ${
              value
                ? "bg-white/40  border-gray-300 shadow-sm text-ash"
                : "bg-white/30  border-gray-700 text-ash"
            }`}
          >
            {value || "-"}
          </div>
        ))}
      </div>
    </div>
  )
};

export default LoShuGrid;
