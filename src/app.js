const express = require("express");
const bodyParser = require("body-parser");

const app = express();


// const corsOptions = {
//   origin: ["https://uhcstock.com", "http://192.168.100.5:3000", "https://admin.uhcstock.com", "http://localhost:3000", "http://localhost:3001"],
//   optionsSuccessStatus: 200,
// };

// app.use(cors(corsOptions));

// app.options('*', cors(corsOptions));

app.use(bodyParser.json({ limit: '25mb' }));


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Routers
// const AuthRoutes = require('./Routes/auth')
// const TransactionRoutes = require('./Routes/transaction')
// const AdminRoutes = require('./Routes/admin')
// const TeamRoutes = require('./Routes/teams')
// const QuantizationRoutes = require('./Routes/quantization')
// const SettingRoutes = require('./Routes/setting')
const CreateSubscriptionSession = require('./routes/payment/subscription-payment')
const CreateReportSession = require('./routes/payment/report-payment')

const SessionStatus = require('./routes/payment/payment-success-cancel')
const UpdateSubscription = require('./routes/payment/stripe-payment-update')


// app.use('/user', AuthRoutes)
// app.use('/transaction', TransactionRoutes)
// app.use('/admin', AdminRoutes)
// app.use('/team', TeamRoutes)
// app.use('/quantization', QuantizationRoutes)
// app.use('/setting', SettingRoutes)
app.use('/payment' , CreateSubscriptionSession)
app.use('/payment' , CreateReportSession)
app.use('/payment' , UpdateSubscription)
app.use( SessionStatus)

app.get('/', (req, res) => {
    res.send('Hello World!')
})



// Error handler and Not Found MiddleWare
const errorhandler = require('../middleware/error-handler')
const notFound = require('../middleware/not-found')

app.use(notFound)

app.use(errorhandler)

module.exports = app