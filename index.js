/* import environmental variables */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express'),
      app = express(),
      server = require('http').Server(app),
      path = require('path'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose');

/* declare all models */
const User = require('./database/user'),
      Competition =  require('./database/competition'),
      Notification =  require('./database/notification'),
      Request =  require('./database/request'),
      Test =  require('./database/test'),
      Contest =  require('./database/contest'),
      Problem =  require('./database/problem'),
      Solution = require('./database/solution');

if (process.env.NODE_ENV !== 'production') {
  app.use(require('morgan')('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

/* start database connection */
mongoose.connect(process.env.DB_URL, { 
  useMongoClient: true,
  promiseLibrary: require('bluebird') 
});

/* route endpoints */
const authRouter = require('./routes/auth'),
      userRouter = require('./routes/users'),
      contestRouter = require('./routes/contests'),
      compRouter = require('./routes/competitions');
app.use('/', authRouter);
app.use('/api/users', userRouter);
app.use('/api/contests', contestRouter);
app.use('/api/competitions', compRouter);

/* serve home page */
app.get('/*', (req, res) => {
   res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

/* start http server */
server.listen(process.env.PORT, () => {
  const port = server.address().port;
  console.log('USMCA running on port', port);
});

/* start socket.io server */
require('./config/socket')(server);
