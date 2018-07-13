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
    post.scores = {
        total: 0
    };
}

// Blocks a post.
function block(post) {
    const root = post.raw.parentNode.parentNode.parentNode;

    post.original = root.innerHTML;
    root.innerHTML = `<div style="display:flex; flex-direction: column; height: 600px; width: 500px; background-color: white; font-family: 'Lato', sans-serif; border-radius: 15px; justify-content: center; align-items: center;" id="${post.id}"><link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet">
    <img class="cat" src="https://image.ibb.co/njL3bo/cat.png" alt="cat" style="padding-bottom:60px; position: absolute; width: 250px; object-position: center; object-fit: fill;">
    <div style="flex: 9;"></div>
    <div style="flex: 5; width:100%; background-color: #f5f5f5f5; text-align: center; ">
        <br>
        <p>Meow!</p>
        <p>This news may be unreliable!</p>
    </div>
    <div style="float: bottom; width:100%; flex: 1; color: white; background-color: #D1D1D1;justify-content: center;">
        Why is there a fact cat?
    </div></div>`;

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