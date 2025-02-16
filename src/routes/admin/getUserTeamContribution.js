const User = require('../../models/User');
const EarningsHistory = require('../../models/EarningsHistory');
const { NotFoundError } = require('../../errors');
const moment = require('moment');

const getUserTeamContribution = async (req, res) => {
    const userId = req.params.userId;

    // Ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError('User not found');
    }

        // Date ranges
        const todayStart = moment().startOf('day').toDate();
        const todayEnd = moment().endOf('day').toDate();
    
        const yesterdayStart = moment().subtract(1, 'days').startOf('day').toDate();
        const yesterdayEnd = moment().subtract(1, 'days').endOf('day').toDate();
    
        const lastWeekStart = moment().subtract(1, 'weeks').startOf('week').toDate();
        const lastWeekEnd = moment().subtract(1, 'weeks').endOf('week').toDate();
    
        const fetchReferralData = async (referrals, type) => {
            return Promise.all(referrals.map(async referral => {
                const incomeToday = await EarningsHistory.find({
                    senderUserId: referral._id,
                    receiverUserId: userId,
                    createdAt: { $gte: todayStart, $lt: todayEnd }
                });
    
                const incomeYesterday = await EarningsHistory.find({
                    senderUserId: referral._id,
                    receiverUserId: userId,
                    createdAt: { $gte: yesterdayStart, $lt: yesterdayEnd }
                });
    
                const incomeLastWeek = await EarningsHistory.find({
                    senderUserId: referral._id,
                    receiverUserId: userId,
                    createdAt: { $gte: lastWeekStart, $lt: lastWeekEnd }
                });
    
                const totalIncomeToday = incomeToday.reduce((acc, curr) => acc + curr.amount, 0);
                const totalIncomeYesterday = incomeYesterday.reduce((acc, curr) => acc + curr.amount, 0);
                const totalIncomeLastWeek = incomeLastWeek.reduce((acc, curr) => acc + curr.amount, 0);
    
                return {
                    email: referral.email,
                    type,
                    today: totalIncomeToday,
                    yesterday: totalIncomeYesterday,
                    lastWeek: totalIncomeLastWeek
                };
            }));
        };
    
        // Fetch direct referrals
        const directReferrals = await User.find({ _id: { $in: user.directReferrals } }).select('email');
        const directReferralData = await fetchReferralData(directReferrals, 'Direct');
    
        // Fetch indirect referrals
        const indirectReferrals = await User.find({ _id: { $in: user.indirectReferrals } }).select('email');
        const indirectReferralData = await fetchReferralData(indirectReferrals, 'Indirect');
    
        // Combine direct and indirect referral data
        const data = [...directReferralData, ...indirectReferralData];

 

    res.status(200).json({ status: 'success', data });
};

module.exports = { getUserTeamContribution };
