var fs = require('fs');
var dataToAppend ='<!DOCTYPE html>'
       + '<html><header>' + header + '</header><body>' + body + '</body></html>';

fs.appendFile('example.html', dataToAppend, (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});
