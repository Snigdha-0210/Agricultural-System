exports.getCropRecommendation = async (req, res) => {
  try {
    const { nitrogen, phosphorus, potassium, ph, rainfall, temperature, soilType } = req.body;
    
    // Mock ML model logic for hackathon
    let recommendedCrop = 'Wheat';
    if (rainfall > 150 && temperature > 25) recommendedCrop = 'Rice';
    else if (ph < 6.5 && potassium > 40) recommendedCrop = 'Potato';
    else if (nitrogen > 80) recommendedCrop = 'Sugarcane';
    
    res.json({
      recommendedCrop,
      confidence: 0.92,
      reason: `Based on your soil's NPK values and expected rainfall, ${recommendedCrop} is highly suitable.`
    });
  } catch (error) {
    res.status(500).json({ message: 'AI Recommendation Error', error: error.message });
  }
};

exports.getAIAdvisory = async (req, res) => {
  try {
    // Generate simple dynamic advice based on mock conditions
    const advisory = [
      { type: 'warning', title: 'Rain Expected Tomorrow', advice: 'Delay pesticide application to prevent wash-off. Irrigate less today.' },
      { type: 'success', title: 'Optimal Soil Moisture', advice: 'Soil moisture is at 62%. No immediate irrigation required for your crop.' },
      { type: 'info', title: 'Fertilizer Reminder', advice: 'Apply Nitrogen-based fertilizer by next week for optimal growth phase.' }
    ];
    
    res.json({ advisory });
  } catch (error) {
    res.status(500).json({ message: 'Error generating advisory', error: error.message });
  }
};