const About = require('../../models/About');

const updateAbout = async (req, res) => {
    const { content } = req.body;

    let about = await About.findOne();

    if (!about) {
        about = new About({ content });
    } else {
        about.content = content;
    }

    await about.save();

    res.status(200).json({ status: 'success', about });
}


module.exports = { updateAbout }
