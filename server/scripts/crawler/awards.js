const Crawler = require('crawler');
const url = require('url');
const _ = require('lodash')
const moment = require('moment');
const Promise = require('promise');
const IMDB = require('../../constants').IMDB;

const movieRegExp = new RegExp(IMDB.MOVIE_REGEXP);
const actorRegExp = new RegExp(IMDB.ACTOR_REGEXP);

const crawl = (year, type) => {
  return new Promise((resolve, reject) => {
    crawler.queue({
      uri: IMDB.EVENT_URL(year, type),
      // The global callback won't be called
      callback: (err, res, done) => {
        if (err) {
          reject(err);
          return;
        }

        const $ = res.$;

        const movies = {};

        $('blockquote').first().find('h2').each((index, element) => {
          const $elem = $(element);
          const awardName = _.trim($elem.text());

          let winner;
          $elem.next('blockquote').children().each((index, element) => {
            const $elem = $(element);
            let movieId;
            let movieName;
            let person;
            if ($elem.is('h3')) {
              winner = /WINNER/.test($elem.text());
              return;
            }

            if ($elem.is('div')) {

              $elem.find('a').each((index, element) => {
                const $href = $(element);
                const href = $href.attr('href');
                let match;

                // check if it is a movie
                if (movieRegExp.test(href)) {
                  match = href.match(IMDB.MOVIE_REGEXP);
                  movieId = match[1];
                  movieName = $href.text();
                  return;
                }

                if (actorRegExp.test(href)) {
                  match = href.match(IMDB.ACTOR_REGEXP);
                  person = {id: match[1], name: $href.text()};
                }
              });

              if (!movieId) {
                return;
              }

              if (!movies[movieId]) {
                movies[movieId] = [];
              }


              movies[movieId].push({name: awardName, winner, person, eventType: type});
            }
          });
        });

        resolve(movies);
        done();
      }
    });
  });
};


const crawler = new Crawler({
  maxConnections: 8,
  retries: 10,
  retryTimeout: 10
});


module.exports = {
  crawl
};
