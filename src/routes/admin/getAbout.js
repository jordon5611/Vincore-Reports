const About = require('../../models/About');
const {  NotFoundError } = require('../../errors')

const getAbout = async (req, res) => {

    const about = await About.findOne();

    if (!about) {
        throw new NotFoundError('About document not found');
    }

    res.status(200).json({ status: 'success', about });

};

module.exports = { getAbout };
