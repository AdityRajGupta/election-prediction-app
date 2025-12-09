import { useState } from "react";

const PredictionForm = ({ booth, onSubmit }) => {
  const [turnout, setTurnout] = useState(
    booth.prediction?.turnoutPercentage || ""
  );
  const [confidence, setConfidence] = useState(
    booth.prediction?.confidenceLevel || 3
  );
  const [data, setData] = useState(
    booth.prediction?.data || {
      BJP: 0,
      INC: 0,
      AAP: 0,
      OTH: 0,
    }
  );

  const handlePartyChange = (party, value) => {
    setData((prev) => ({ ...prev, [party]: Number(value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      boothId: booth.boothId,
      turnoutPercentage: Number(turnout),
      data,
      confidenceLevel: Number(confidence),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm mb-1">Turnout %</label>
          <input
            type="number"
            min="0"
            max="100"
            value={turnout}
            onChange={(e) => setTurnout(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Confidence (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={confidence}
            onChange={(e) => setConfidence(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {Object.keys(data).map((party) => (
          <div key={party}>
            <label className="block text-sm mb-1">
              {party} % vote share
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={data[party]}
              onChange={(e) => handlePartyChange(party, e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>
        ))}
      </div>

      <button className="mt-2 px-4 py-2 rounded bg-blue-600 text-white text-sm">
        Save Prediction
      </button>
    </form>
  );
};

export default PredictionForm;
