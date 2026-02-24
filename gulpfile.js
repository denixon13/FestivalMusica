const {src, dest, watch, parallel} = require('gulp');

//Css
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

//Imagenes 
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = import('gulp-webp');
const avif = require('gulp-avif');

//JavaScript
const terser = require('gulp-terser-js');

function css (done) {
    src('src/scss/**/*.scss') //Identificar el archivo de sass
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass()) // Compilarlo
        .pipe( postcss([ autoprefixer(), cssnano() ]) ) 
        .pipe(sourcemaps.write('.')) 
        .pipe(dest("build/css")) // Almacenarla en el disco duro
    done(); // callback que avisa a gulp cuando llegamos al final de la funcion
}

function imagenes (done) {
    const opciones = {
        optimazationLevel: 3
    }
    src('src/img/**/*.{png,jpg}')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'))
    done();
}

async function versionWebp(done) {
    const opciones = {
        quality: 50
    };
    //Aquí está la clave para que funcione y evitar los problemas que ya había 
    const webpModule = await webp;
    src('src/img/**/*.{png,jpg}')
        .pipe(webpModule.default(opciones))
        .pipe(dest('build/img'));
    done();
}

function versionAvif(done) {
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'));
    done();
}

function javascript(done){
    src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/js'));

    done();
}

function dev(done) {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);
    done();
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev);

