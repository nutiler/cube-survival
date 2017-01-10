const express = require('express');
const app = express();
const http = require('http')
    .Server(app);
const io = require('socket.io')(http);
const util = require('util');
const sockets = require('./sockets');
const gameserver = require('./game');
const path = require('path');
const scores = require('./routes/scores')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'cubeworld';
const users = require('./routes/users');
const auth = require('./routes/auth');
const hbs = require('hbs');

var game;
var socket;

// parse application/x-www-form-urlencoded
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 800);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(cookieSession({
  secret: "survivalsquares",
}))

// handlebars
hbs.registerHelper('select', function(selected, options) {
  return options.fn(this).replace(
        new RegExp(' value=\"' + selected + '\"'),
        '$& selected="selected"');
});

app.use(express.static(__dirname + '/public'));
app.use('/scores', scores);
app.use('/add', scores);
app.use('/users', users);
app.use('/auth', auth);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

http.listen(process.env.PORT, function() {
    console.log('Survival Squares Server Launching ON *:800');
    init();
});

function init() {
    game = new gameserver();
    socket = sockets(io, game);
    game.init(socket);
    socket.init();
}
