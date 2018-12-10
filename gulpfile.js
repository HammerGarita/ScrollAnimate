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
    server: './example/'
  }),

gulp.watch('./src/example/scss/**/*.scss', ['scss']),
gulp.watch('./src/example/pug/*.pug', ['pug']).on('change', browserSync.reload),
gulp.watch('./src/ScrollAnimate/scrollAnimate.js', ['babel']).on('change', browserSync.reload)
)

// Compile ES6 into Javascript
gulp.task('babel', () => {
  return gulp.src('./src/ScrollAnimate/scrollAnimate.js')
    .pipe(babel({
      presets: ['@babel/env'],
      parserOpts: { sourceType: 'script' }
    }))
    .pipe(gulp.dest('./dist/ScrollAnimate/uncompressed'))
    .pipe(gulp.dest('./example/js/'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist/ScrollAnimate/minified'))
})

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', () => {
  return gulp.src('./src/example/scss/*.scss')
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
    }))
    .pipe(gulp.dest('./example/'))
    .pipe(browserSync.stream())
})

// Compile pug into HTML
gulp.task('pug', () => {
  return gulp.src('./src/example/pug/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('./example/'))
})

gulp.task('default', ['serve'])
