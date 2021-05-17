require('dotenv').config();
const morgan = require('morgan')
const express = require('express');
const path = require("path");
const bodyParser = require("body-parser");
const router = require("./server/router/router");

const port = parseInt(process.env.APP_PORT, 10);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('.html', require('ejs').__express);
app.use(express.static('../dist'));
app.use(morgan('combined'));
app.set('views', path.join(__dirname, '/server/views'));
app.set('view engine', 'html');

app.use(express.static(path.join('dist')));

// setupLti(app);

app.get('/', (req, res) => {
  res.render("index", {
    data: {
      launchInfo: {},
      user: {},
    },
    isLti: false,
  });
});

router(app);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});


