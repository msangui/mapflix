const gulp = require('gulp');
const browserSync = require('browser-sync');
const spa = require('browser-sync-spa');
const nodemon = require('gulp-nodemon');
const conf = require('../conf/gulp.conf');

const browserSyncConf = require('../conf/browsersync.conf');
const browserSyncDistConf = require('../conf/browsersync-dist.conf');



browserSync.use(spa());

gulp.task('nodemon', nodemonTask);
gulp.task('serverDist', serverDistTask);
gulp.task('browsersync', gulp.series('nodemon', browserSyncServe));
gulp.task('browsersync:dist', gulp.series('serverDist', browserSyncDist));

function browserSyncServe(done) {
  browserSync.init(browserSyncConf());
  done();
}

function browserSyncDist(done) {
  browserSync.init(browserSyncDistConf());
  done();
}

function serverDistTask(done) {
  require('../server/index');
  done();
}


function nodemonTask(done) {
  var callbackCalled = false;
  return nodemon({script: './server/index.js'}).on('start', function () {
    if (!callbackCalled) {
      callbackCalled = true;
      done();
    }
  });
}
