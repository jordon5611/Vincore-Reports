const ImageSlider = require('../../models/ImageSlider');
const { NotFoundError } = require('../../errors');

// Delete an image from the slider
const deleteImageFromSlider = async (req, res) => {
    const { imageId } = req.params;

    // Find the ImageSlider document
    let imageSlider = await ImageSlider.findOne();
    if (!imageSlider) {
        throw new NotFoundError('Image slider not found' );
    }

    // Find the index of the image to be deleted
    const imageIndex = imageSlider.images.findIndex(img => img._id.toString() === imageId);
    if (imageIndex === -1) {
        throw new NotFoundError('Image not found' );
    }

    // Remove the image from the images array
    imageSlider.images.splice(imageIndex, 1);

    // Save the updated ImageSlider
    await imageSlider.save();

    res.status(200).json({ status: 'success', message: 'Image deleted successfully', imageSlider });
};

module.exports = { deleteImageFromSlider };
