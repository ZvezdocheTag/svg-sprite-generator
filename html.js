var fs = require('fs');
var dataToAppend ='<!DOCTYPE html>'
       + '<html><header>'  + '</header><body>'  + '</body></html>';

fs.appendFile('example.html', dataToAppend);
