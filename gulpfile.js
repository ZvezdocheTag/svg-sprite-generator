var gulp = require('gulp');
var svgstore = require('gulp-svgstore');
var path = require('path');
var del = require('del');
var svgmin = require('gulp-svgmin')
var cheerio = require('gulp-cheerio')
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var through2 = require('through2');
var cheerioTrue = require('cheerio');
var gutil = require('gulp-util');
var fs = require('fs');
var metadataFile = require('./test/metadata.json');


gulp.task('svg', function () {
    return gulp
        .src('sv/*.svg')
        .pipe(rename({prefix: 'svg-icon-'}))
        .pipe(svgmin(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        // remove all fill, style and stroke declarations in out shapes
        .pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: {xmlMode: true}
		}))
		// cheerio plugin create unnecessary string '&gt;', so replace it.
		.pipe(replace('&gt;', '>'))
        .pipe(svgstore())
        .pipe(through2.obj(function (file, encoding, cb) {
    var $ = cheerioTrue.load(file.contents.toString(), {xmlMode: true});
    var data = $('svg > symbol').map(function () {
        return {
            name: $(this).attr('id'),
            viewBox: $(this).attr('viewBox')
        };
    }).get();

    var jsonFile = new gutil.File({
        path: 'metadata.json',
        contents: new Buffer(JSON.stringify(data))
    });
    this.push(jsonFile);
    this.push(file);
    cb();
}))
  .pipe(gulp.dest('test'));
});

gulp.task('clean', function(){ //создаем таск для очишения папки build перед сборкой
	return del('test');
});

gulp.task('html', function(){ //создаем таск для очишения папки build перед сборкой

  function decorator(f, after, before) {
    return function(){
      return before + f.apply(this.arguments) + after
    }
  }
    var dataToAppend ='<!DOCTYPE html>'
           + '<html><header>'  + '</header><body>'  + '<h1>Htlll</h2>'  +  '</body></html>';

    var $ = cheerioTrue.load(file.contents.toString(), {xmlMode: true});
    fs.appendFile('data.html', dataToAppend);
});
