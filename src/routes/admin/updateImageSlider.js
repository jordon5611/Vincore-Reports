const ImageSlider = require('../../models/ImageSlider');
const { BadRequestError } = require('../../errors');

// Update ImageSlider to add an image
const updateImageSlider = async (req, res) => {
    const { image } = req.body;

    if (!image) {
        throw new BadRequestError('Image is required' );
    }

    // Check if an ImageSlider document already exists, if not, create one
    let imageSlider = await ImageSlider.findOne();
    if (!imageSlider) {
        imageSlider = new ImageSlider({ images: [] });
    }

    // Check if the image already exists
    const existingImage = imageSlider.images.find(img => img.image === image);
    if (existingImage) {
        throw new BadRequestError('This image already exists' );
    }

    // Add the new image to the images array
    imageSlider.images.push({ image });

    // Save the updated ImageSlider
    await imageSlider.save();

    res.status(200).json({ status: 'success', imageSlider });
};

module.exports = { updateImageSlider };
