module.exports = {
  IMDB: {
    LIST_URL: (page, votes = 5000) => `http://www.imdb.com/search/title?count=100&num_votes=${votes},&title_type=feature&view=simple&page=${page}&sort=release_date,asc`,
    EVENT_URL: (year, eventId) => `http://www.imdb.com/event/${eventId}/${year}`,
    MOVIE_URL: 'http://www.imdb.com/title/',
    OSCARS_EVENT_ID: 'ev0000003',
    GOLDEN_GLOBES_EVENT_ID: 'ev0000292',
    BAFTA_EVENT_ID: 'ev0000123',
    MOVIE_REGEXP: '[a-z]*\/title\/([a-z0-9]+)\?(.*)',
    ACTOR_REGEXP: '[a-z]*\/name\/([a-z0-9]+)\?(.*)',
    CHARACTER_REGEXP: '[a-z]*\/character\/([a-z0-9]+)\?(.*)'
  }
};
