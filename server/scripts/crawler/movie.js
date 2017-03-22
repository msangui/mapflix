const Crawler = require('crawler');
const url = require('url');
const _ = require('lodash')
const moment = require('moment');
const Promise = require('promise');
const IMDB = require('../../constants').IMDB;

const parseActor = ($, element) => {
  const $elem = $(element);

  return {
    name: _.trim($elem.text()),
    id: $elem.find('a').attr('href').match(IMDB.ACTOR_REGEXP)[1]
  }
};

const getMovieId = ($, element) => {
  const $elem = $(element);
  return $elem.attr('href').match(IMDB.MOVIE_REGEXP)[1]
};

const crawlMovieList = (page = 1) => {
  return new Promise((resolve, reject) => {
    movieCrawler.queue({
      uri: IMDB.LIST_URL(page),
      // The global callback won't be called
      callback: (err, res, done) => {
        if (err) {
          reject(err);
          return;
        }

        const $ = res.$;

        const movieElements = $('.lister-item.mode-simple .lister-item-header a');
        if (!movieElements.length ) {
          reject('no more movies');
          return;
        }

        const movieIds = movieElements.map((index, element) => {
          return getMovieId($, element);
        }).get();

        resolve(movieIds);
        done();
      }
    });
  });
};

const crawlDetails = (movieId) => {
  return new Promise((resolve, reject) => {
    movieCrawler.queue({
      uri: IMDB.MOVIE_URL + movieId,
      // The global callback won't be called
      callback: (err, res, done) => {
        if (err) {
          reject(err);
          return;
        }

        const $ = res.$;

        const movie = {_id: movieId};

        // *** movie details

        // movie name
        movie.name = _.trim($('.originalTitle').clone().children().remove().end().text()) || _.trim($('h1').clone().children().remove().end().text());

        // movie thumbnail
        movie.image = $('#title-overview-widget .poster img').attr('src');

        // stars
        movie.stars = $('.credit_summary_item span[itemprop=actors]').map((index, element) => {
          const $elem = $(element);

          return {
            name: _.trim($elem.text()).replace(/,$/,''),
            id: $elem.find('a').attr('href').match(IMDB.ACTOR_REGEXP)[1]
          }
        }).get();

        // rating
        movie.rating = {
          value: _.toNumber($('span[itemprop=ratingValue]').text()),
          count: _.toNumber(_.camelCase(($('span[itemprop=ratingCount]').text()))),
          metaScore: _.toNumber($('.metacriticScore span').text())
        };

        // genre
        movie.genres = $('div.see-more.inline.canwrap[itemprop=genre] a').map((index, element) => _.trim($(element).text())).get();

        // details

        $('#titleDetails .txt-block').each((index, element) => {
          const $elem = $(element);
          const section = $elem.find('h4').text();

          switch(section) {
            case 'Country:':
              movie.countries = $elem.find('a').map((index, element) => _.trim($(element).text())).get();
              break;
            case 'Language:':
              movie.languages = $elem.find('a').map((index, element) => _.trim($(element).text())).get();
              break;
            case 'Release Date:':
              movie.releaseDate = moment(_.trim($elem.clone().children().remove().end().text()), 'DD MMMM YYYY').toDate();
              break;
            case 'Budget:':
              movie.budget = _.toNumber(_.camelCase(_.trim($elem.clone().children().remove().end().text())));
              break;
            case 'Gross:':
              movie.gross = _.toNumber(_.camelCase(_.trim($elem.clone().children().remove().end().text())));
              break;
            case 'Runtime:':
              movie.runtime = _.toNumber(_.trimEnd($elem.find('time').first().text(), ' min'));
              break;
            case 'Color:':
              movie.color = $elem.find('a').map((index, element) => _.trim($(element).text())).get();
              break;
            default:
              break;
          }
        });

        if (!movie.releaseDate) {
          movie.releaseDate = moment(_.trim(_.camelCase($('#titleYear').text())) + '-01-01', 'YYYY-MM-DD').toDate();
        }
        resolve(movie);

        done();
      }
    });
  });
};

const crawlCast = (movieId) => {
  return new Promise((resolve, reject) => {
    movieCrawler.queue({
      uri: `${IMDB.MOVIE_URL}${movieId}/fullcredits`,
      // The global callback won't be called
      callback: (err, res, done) => {
        if (err) {
          reject(err);
          return;
        }

        const $ = res.$;

        const movie = {_id: movieId, cast: []};


        // directors, writers, producers & music
        $('#fullcredits_content .dataHeaderWithBorder').each((index, element) => {
          const castMapper = ($elem, role) => {
            return _.uniqBy($elem.next().find('.simpleTable tr td.name').map((index, element) => {
              return Object.assign({role: role}, parseActor($, element));
            }).get(), 'id')
          };

          const $elem = $(element);
          const sectionName = _.trim($elem.clone().children().remove().end().text());
          switch(sectionName) {
            case 'Directed by':
              castMapper($elem, 'director').forEach(person => {
                movie.cast.push(person);
              });
              break;
            case 'Writing Credits':
              castMapper($elem, 'writer').forEach(person => {
                movie.cast.push(person);
              });
              break;
            case 'Produced by':
              castMapper($elem, 'producer').forEach(person => {
                movie.cast.push(person);
              });
              break;
            case 'Music by':
              castMapper($elem, 'music').forEach(person => {
                movie.cast.push(person);
              });
              break;
            default:
              break;
          }
        });

        // actors & characters
        $('#fullcredits_content .cast_list tr').each((index, element) => {
          const $elem = $(element);

          if (!$elem.hasClass('odd') && !$elem.hasClass('even')) {
            return;
          }
          const $character = $elem.find('.character div');
          const character = {
            name: _.trim($character.text())
          };

          if ($character.find('a').length) {
            character.id = $character.find('a').attr('href').match(IMDB.CHARACTER_REGEXP)[1]
          }
          movie.cast.push(
            Object.assign({role: 'actor'}, parseActor($, $elem.find('.itemprop[itemprop=actor]')), {character})
          );

        });

        resolve(movie);

        done();
      }
    });
  });
};

const movieCrawler = new Crawler({
  maxConnections: 8,
  retries: 10,
  retryTimeout: 10
});


module.exports = {
  crawl(movieId) {
    return new Promise((resolve, reject) => {
      Promise.all([
        crawlDetails(movieId),
        crawlCast(movieId)
      ]).then(resolves => {
        console.log('fully', movieId)
        resolve(Object.assign({}, resolves[0], resolves[1]));
      }, err => {
        reject(err);
      });
    });
  },
  bulk(page) {
    return crawlMovieList(page);
  }
};
