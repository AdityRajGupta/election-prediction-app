import Prediction from "../models/Prediction.js";

export const getAllPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find()
      .populate("booth")
      .populate("party")
      .populate("submittedBy");
    res.json(predictions);
  } catch (err) {
    console.error("Get all predictions error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPredictionById = async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id)
      .populate("booth")
      .populate("party")
      .populate("submittedBy");
    if (!prediction) {
      return res.status(404).json({ message: "Prediction not found" });
    }
    res.json(prediction);
  } catch (err) {
    console.error("Get prediction by ID error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createPrediction = async (req, res) => {
  try {
    const predictionData = {
      ...req.body,
      submittedBy: req.user._id,
    };
    const prediction = await Prediction.create(predictionData);
    res.status(201).json(prediction);
  } catch (err) {
    console.error("Create prediction error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePrediction = async (req, res) => {
  try {
    const prediction = await Prediction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!prediction) {
      return res.status(404).json({ message: "Prediction not found" });
    }
    res.json(prediction);
  } catch (err) {
    console.error("Update prediction error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePrediction = async (req, res) => {
  try {
    const prediction = await Prediction.findByIdAndDelete(req.params.id);
    if (!prediction) {
      return res.status(404).json({ message: "Prediction not found" });
    }
    res.json({ message: "Prediction deleted successfully" });
  } catch (err) {
    console.error("Delete prediction error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
