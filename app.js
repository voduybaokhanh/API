var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//config mogoose
const mongoose = require('mongoose');
require('./models/Category');
require('./models/Product');
require('./models/Order');
require('./models/OrderItem');
require('./models/Payment');
require('./models/User');
require('./models/Exam');
require('./models/Fine');
require('./models/Vacine');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/products');
var categoryRouter = require('./routes/categories');
var ordersRouter = require('./routes/orders');
var orderitemsRouter = require('./routes/orderitems');
var paymentsRouter = require('./routes/payments');
var examsRouter = require('./routes/exams');
var workerRouter = require('./routes/worker');
var fineRouter = require('./routes/fines');
var vacineRouter = require('./routes/vacines');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./utils/configSwagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//connect database
//mongodb://localhost:27017/
mongoose.connect('mongodb://localhost:27017/MD19201', {
  // mongoose.connect('mongodb+srv://khanhvo908:0774749399@cluster0.g5qbg.mongodb.net/MD19201', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('>>>>>>>>>> DB Connected!!!!!!'))
  .catch(err => console.log('>>>>>>>>> DB Error: ', err));


//http://localhost:3000/home
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/order', ordersRouter);
app.use('/orderitem', orderitemsRouter);
app.use('/payment', paymentsRouter);
app.use('/product', productRouter);
app.use('/worker', workerRouter);
app.use('/category', categoryRouter);
app.use('/exam', examsRouter);
app.use('/fine', fineRouter);
app.use('/vacine', vacineRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
