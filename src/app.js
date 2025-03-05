const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
//const bodyParser = require("body-parser");

const app = express();


const corsOptions = {
  origin: ["https://vin-core.vercel.app", "http://localhost:3000", "http://localhost:3001", "https://www.vincorereports.com/", "https://vincorereports.com/", "https://www.vincorereports.com", "https://vincorereports.com", "https://statuesque-salamander-8b733c.netlify.app/", "https://statuesque-salamander-8b733c.netlify.app", "https://gentle-croissant-7688ee.netlify.app/", "https://gentle-croissant-7688ee.netlify.app"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

// app.use(bodyParser.json({ limit: '25mb' }));

// Place webhook route before JSON middleware
const { StripeWebhook } = require('./routes/payment/stripe-payment-update');
app.use(StripeWebhook);


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Routers
// const AuthRoutes = require('./Routes/auth')
// const TransactionRoutes = require('./Routes/transaction')
const AdminRoutes = require('./routes/admin')
const OrderRoutes = require('./routes/order/index')
const PayPalRoutes = require('./routes/payment/paypal-payment')
const CreateSubscriptionSession = require('./routes/payment/subscription-payment')
const CreateReportSession = require('./routes/payment/report-payment')

const SessionStatus = require('./routes/payment/payment-success-cancel')
const { UpdateSubscription } = require('./routes/payment/stripe-payment-update')
const AuthRoutes = require('./routes/auth/index')

const ContactRoutes = require("./routes/contact/index")


// app.use('/user', AuthRoutes)
// app.use('/transaction', TransactionRoutes)
app.use('/admin', AdminRoutes)
// app.use('/team', TeamRoutes)
// app.use('/quantization', QuantizationRoutes)
app.use('/contact', ContactRoutes)

app.use('/order', OrderRoutes)

app.use('/user', AuthRoutes)

app.use('/payment', PayPalRoutes)
app.use('/payment', CreateSubscriptionSession)
app.use('/payment', CreateReportSession)
app.use('/payment', UpdateSubscription)
app.use(SessionStatus)


app.get('/', (req, res) => {
  res.send('Hello World!')
})



// Error handler and Not Found MiddleWare
const errorhandler = require('../middleware/error-handler')
const notFound = require('../middleware/not-found')

app.use(notFound)

app.use(errorhandler)

module.exports = app