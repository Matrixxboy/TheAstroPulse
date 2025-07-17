import React from "react";

const LoShuReport = ({ gridData }) => {
  const numberMeanings = {
    1: "Water / Career: Leadership, independence, and career focus.",
    2: "Earth / Relationships: Emotions, love, and partnerships.",
    3: "Wood / Creativity: Creativity, joy, and communication.",
    4: "Wood / Wealth: Prosperity, wealth, and resourcefulness.",
    5: "Earth / Balance: Stability, balance, and adaptability.",
    6: "Metal / Luxury: Luxury, comfort, and relationships.",
    7: "Metal / Spirituality: Spirituality, intuition, and introspection.",
    8: "Earth / Knowledge: Knowledge, wisdom, and authority.",
    9: "Fire / Recognition: Fame, recognition, and success."
  };

  const missingMeanings = {
    1: "Missing 1: May cause lack of confidence or career instability.",
    2: "Missing 2: May result in emotional disconnect or relationship issues.",
    3: "Missing 3: Can reduce creativity and communication.",
    4: "Missing 4: Might show poor discipline or structure.",
    5: "Missing 5: Resistance to change or lack of adaptability.",
    6: "Missing 6: Trouble in family and emotional security.",
    7: "Missing 7: Weak spiritual connection or inner reflection.",
    8: "Missing 8: Difficulty with finances or decision-making.",
    9: "Missing 9: Trouble gaining recognition or success."
  };

  // Count each number (1–9) from gridData content length
  const countMap = {};
  gridData.forEach((val, i) => {
    const digit = i + 1;
    countMap[digit] = val.length; // e.g. "444" = 3
  });

  // Lo Shu display order
  const loShuOrder = [4, 9, 2, 3, 5, 7, 8, 1, 6];

  const classifyStrength = (count) => {
    if (count === 1) return "Present (Normal Influence)";
    if (count === 2) return "Strong (Double Power)";
    if (count >= 3) return "Dominant (Triple or More)";
    return "Missing";
  };

  return (
    <div className="max-w-3xl mx-auto px-4 mt-10 space-y-6">
      <h2 className="text-2xl font-bold text-center">🧿 Lo Shu Grid Report</h2>

      <div>
        <h3 className="text-xl font-semibold text-green-700 mb-2">🧠 Numbers (In Lo Shu Order)</h3>
        <ul className="list-disc pl-5 space-y-2">
          {loShuOrder.map((num) => {
            const count = countMap[num] || 0;
            if (count > 0) {
              return (
                <li key={num} className="text-gray-800">
                  <span className="font-bold">Number {num}:</span>{" "}
                  {numberMeanings[num]} <br />
                  <span className="text-sm text-blue-600 italic">
                    → {classifyStrength(count)} (Appears {count} time{count > 1 ? "s" : ""})
                  </span>
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>

      {loShuOrder.filter((n) => !countMap[n] || countMap[n] === 0).length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-red-600 mb-2">🚫 Missing Numbers (In Lo Shu Order)</h3>
          <ul className="list-disc pl-5 space-y-1">
            {loShuOrder
              .filter((num) => !countMap[num] || countMap[num] === 0)
              .map((num) => (
                <li key={num} className="text-gray-700">
                  {missingMeanings[num]}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LoShuReport;
