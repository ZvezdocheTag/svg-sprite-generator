var gulp = require('gulp');
var path = require('path');
var del = require('del');
var rename = require('gulp-rename');
var fs = require('fs');
var runSequence = require('run-sequence');


var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin')
var cheerio = require('gulp-cheerio')
var replace = require('gulp-replace');
var through2 = require('through2');
var cheerioTrue = require('cheerio');
var gutil = require('gulp-util');
var prettify = require('gulp-html-prettify');
var beautify = require('gulp-beautify');

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
        .pipe(cheerio({
			run: function ($) {
    //             $('[fill]').removeAttr('fill');
    //             $('[style]').removeAttr('style');
				// $('defs').find('*').remove();
			},
			parserOptions: {xmlMode: true}
		}))
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
    var header = '<link rel="stylesheet" href="../main.css">';
    var body = '' ;
      

      for(var i = 0; i < data.length; i++) {
        body +=  
                '<li class="svg-lib__item">'
                + '<div class="title">' + data[i].name  + '</div>'
                + '<div class="img-wrap">'
                + '<svg class="svg-icon">'
                + '<use xlink:href="#' + data[i].name  + '"></use>'
                + '<svg>'
                +'</div>'
                +'</li>';
      }
    var contentS = $('svg');    
    var htmlFile = new gutil.File({
        path: 'metadata.html',
        contents: new Buffer('<!DOCTYPE html>'
           + '<html><head>'
           + header
           + '</head><body>' + contentS
           + '<ul class="svg-lib__list">'
           + body +  '</body></html>')
    });

    this.push(jsonFile);
    this.push(htmlFile);
    this.push(file);
    cb();

}))
  .pipe(gulp.dest('test'));
});
gulp.task('templates', function() {
  gulp.src(['test/metadata.html', 'test/metadata.json'])
    .pipe(prettify({indent_char: ' ', indent_size: 4}))
    .pipe(gulp.dest('test/'))
});
gulp.task('beautify', function() {
  gulp.src('test/metadata.json')
    .pipe(beautify({indent_size: 2}))
    .pipe(gulp.dest('test/'))
});
gulp.task('clean', function(){ //создаем таск для очишения папки build перед сборкой
    return del('test');
});
gulp.task('svgsprite', function(callback) {
  runSequence('clean','svg', 'beautify','templates', callback);
});
