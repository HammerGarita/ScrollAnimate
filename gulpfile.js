const gulp = require('gulp')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const pug = require('gulp-pug')
const browserSync = require('browser-sync').create()

// Static Server + watching scss/html/js files
gulp.task('serve', ['sass', 'pug'], () =>
  browserSync.init({
    server: './demo/'
  }),

gulp.watch('./src/demo/scss/**/*.scss', ['sass']),
gulp.watch('./src/demo/pug/*.pug', ['pug']).on('change', browserSync.reload),
gulp.watch('./src/ScrollFunny/ScrollFunny.js', ['babel']).on('change', browserSync.reload)
)

// Compile ES6 into Javascript
gulp.task('babel', () => {
  return gulp.src('./src/ScrollFunny/ScrollFunny.js')
    .pipe(babel({
      presets: ['@babel/env'],
      parserOpts: { sourceType: 'script' }
    }))
    .pipe(gulp.dest('./dist/ScrollFunny/uncompressed'))
    .pipe(gulp.dest('./demo/js/'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist/ScrollFunny/minified'))
})

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', () => {
  return gulp.src('./src/demo/scss/*.scss')
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
    }))
    .pipe(gulp.dest('./demo/'))
    .pipe(browserSync.stream())
})

// Compile pug into HTML
gulp.task('pug', () => {
  return gulp.src('./src/demo/pug/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('./demo/'))
})

gulp.task('default', ['serve'])

// npm install --save-dev gulp gulp-babel @babel/core @babel/preset-env gulp-autoprefixer gulp-pug gulp-rename gulp-sass gulp-uglify browser-sync
