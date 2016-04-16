var express = require('express');
var app = express();

app.use('/dist', express.static(__dirname + '/dist'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(express.static('.'));

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
