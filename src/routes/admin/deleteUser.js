const User = require('../../models/User')
const { NotFoundError } = require('../../../errors');

const deleteUser = async (req, res) => {

    const id = req.params.userId

    const user = await User.findById(id)

    if(!user){
        throw new NotFoundError('User not found')
    }

    const DirectReferralUsers = await User.find({referrer: id})

    for (const user of DirectReferralUsers) {
        user.referrer = undefined;
        await user.save();
    }

    // Check if the user has any SenderId in EarningsHistory
    const hasEarnings = await EarningsHistory.exists({ senderUserId: id });

    const updateTeamCommunityAndReferrals = async (referrerId, userId) => {
        const referrer = await User.findById(referrerId);
        if (referrer) {

            referrer.directReferrals = referrer.directReferrals.filter(referralId => referralId.toString() !== userId.toString());
            referrer.indirectReferrals = referrer.indirectReferrals.filter(referralId => referralId.toString() !== userId.toString());
            
            console.log("Direct Referrals after filtering:", referrer.directReferrals);
            console.log("Indirect Referrals after filtering:", referrer.indirectReferrals);

            // Update TeamCommunity
            const referrerMetrics = await TeamCommunity.findOne({ userId: referrerId });
            if (referrerMetrics) {
                referrerMetrics.totalPeople -= 1;
                if (!hasEarnings) {
                    referrerMetrics.newRegistration -= 1;
                }
                await referrerMetrics.save();
            }
        }
    };



    // Update referrer (direct) and referrer2 (indirect) metrics and remove from referrals
    if (user.referrer) {
        await updateTeamCommunityAndReferrals(user.referrer, user._id);

        const directReferrer = await User.findById(user.referrer);
        if (directReferrer && directReferrer.referrer) {
            await updateTeamCommunityAndReferrals(directReferrer.referrer, user._id);

            const indirectReferrer = await User.findById(directReferrer.referrer);
            if (indirectReferrer && indirectReferrer.referrer) {
                await updateTeamCommunityAndReferrals(indirectReferrer.referrer, user._id);
            }
        }
    }


    await User.findByIdAndDelete(id);

    res.status(200).json({ status: 'success', message: 'Successfully Delete the Account' });

};

module.exports = { deleteUser }