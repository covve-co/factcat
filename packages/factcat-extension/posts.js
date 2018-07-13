const uuid = require('uuid/v4');
const blubber = require('./blubber');

const POST_SELECTOR = '._5pcr.userContentWrapper';
const LINK_SELECTOR = 'a._52c6';

const THRESHOLD = 0.5;

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

        if (post.type == 'link') {
            process(post);
            if (post.scores.total < THRESHOLD) {
                block(post);
            }
        }
    }

    processed = posts.length;
};

// Gets various scores from each attribute and evaluates them. The closer to 0
// a score is, the more fake it is.
function process(post) {
    post.scores = { total: 0 };
}

// Blocks a post.
function block(post) {
    const root = post.raw.parentNode.parentNode.parentNode;

    post.original = root.innerHTML;
    root.innerHTML = `<div id="${post.id}">BOOM</div>`;

    blubber.create(post);
}

// Extracts relevant information out of a raw post element.
function extract(rawPost) {
    const post = {
        id: uuid(),
        raw: rawPost,
    };

    const a = rawPost.querySelector(LINK_SELECTOR);
    if (a) {
        post.type = 'link';
        post.href = a.getAttribute('href');
    }

    return post;
}
