const express = require('express');
const exphbs = require('express-handlebars');
const handlebars = require ('handlebars');
const fs = require ('fs');

const port = process.env.PORT || 3000;

var app = express();
var hbsConfig = {
    defaultLayout: 'main',
    helpers: {
        getCurrentYear: () => {
            return new Date().getFullYear();
        },
        link: (text, url) => {
            handlebars.Utils.escapeExpression(text);
            handlebars.Utils.escapeExpression(url);
            var result = '<a href="' + url + '">' + text + '</a>';

            return new handlebars.SafeString(result);
        }
    }
}

app.engine('handlebars', exphbs(hbsConfig));
app.set('view engine', 'handlebars');

// middleware
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use((req, resp, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log+'\n', (err)=>{
        if (err) {
            console.log ('Could not append to server.log');
        }
    });
    next();
});

// app.use((req, resp, next) => {
//     resp.render('maintanance');
// });

app.use(express.static(__dirname + '/public'));

//routes
app.get('/', (req, res) => {
    res.send('<h1>Hello Express!</h1>');
});

app.get('/about', (req,res) => {
    res.render('about', {
        pageTitle: 'About page',
        content: 'Some Text'
    });
});

app.get('/projects', (req,res) => {
    res.render('projects', {
        pageTitle: 'Current Projects',
        content: 'A list of current projects'
    });
});

app.get ('/bad', (req, res) => {
    res.send({errorMessage: 'Error'});
});
app.listen(port, () => {
    console.log(`Node Server running on port ${port}.`);
});
