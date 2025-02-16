const ImageSlider = require('../../models/ImageSlider');

// Update ImageSlider to add an image
const getImageSlider = async (req, res) => {

    const existingImage = await ImageSlider.find({});

    res.status(200).json({ status: 'success', existingImage });
};

module.exports = { getImageSlider };
