const uuid = require('uuid/v4');

const POST_SELECTOR = '._5pcr.userContentWrapper';
const LINK_SELECTOR = 'a._52c6';

const posts = [];
let processed = 0;

module.exports.modified = function () {
    const rawPosts = [...document.querySelectorAll(POST_SELECTOR)];
    if (rawPosts.length <= posts.length) {
        return;
    }

    for (let i = processed; i < rawPosts.length; i++) {
        const post = extract(rawPosts[i]);
        posts.push(post);

        const score = process(post);
    }

    processed = posts.length;
};

// Gets various scores from each attribute and evaluates them. The closer to 0
// a score is, the more fake it is.
function process(post) {
    return 0;
}

// Extracts relevant information out of a raw post element.
function extract(rawPost) {
    const post = {
        id: uuid(),
    };

    const a = rawPost.querySelector(LINK_SELECTOR);
    if (a) {
        post.type = 'link';
        post.href = a.getAttribute('href');
    }

    return post;
}
