const osmosis = require('osmosis');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

module.exports = function (link, result) {
    osmosis
        .get(link)
        .set({ text: '.content' })
        .data(function (data) {
            console.log(data.text);
            result(sentiment.analyze(data.text).score);
        });
}

module.exports('https://ravernkoh.me/blog/collaborative-text-editing-with-logoot/', function (score) {
});
