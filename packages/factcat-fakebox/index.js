const osmosis = require('osmosis');
const axios = require('axios');

module.exports = function (link, result) {
    link = unescape(getParameterByName('u', link));

    let title = '';
    let content = [];

    osmosis
        .get(link)
        .find('p')
        .set('text')
        .find('title')
        .set('title')
        .debug(function (s) {
            if (s[13] == 0) {
                submit({
                    url: link,
                    title,
                    content,
                }, result);
            }
        })
        .data(function (data) {
            title = data.title;
            content.push(data.text);
        });
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function submit(data, result) {
    data.content = data.content.slice(1, data.content.length - 2).join(' ');
    axios
        .post('http://localhost:8080/fakebox/check', data)
        .then(function (response) {
            const data = response.data;
            if (!data.success) {
                return;
            }

            const score = data.title.score / 2 + data.content.score / 2;
            result(score);
        })
        .catch(console.error);
}
