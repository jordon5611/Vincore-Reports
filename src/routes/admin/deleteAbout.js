const About = require('../../models/About');
const {  NotFoundError } = require('../../errors')

const deleteAbout = async (req, res) => {

    const about = await About.findOne();

    if (!about) {
        throw new NotFoundError('About document not found');
    }

    await about.deleteOne();

    res.status(200).json({ status: 'success', message: 'About document deleted successfully' });

};

module.exports = { deleteAbout };
