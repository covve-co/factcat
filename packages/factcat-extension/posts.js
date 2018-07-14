const axios = require('axios');
const uuid = require('uuid/v4');

const POST_SELECTOR = '.userContentWrapper';
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
            process(post, function () {
                if (post.scores.total < THRESHOLD) {
                    block(post);
                }
            });
        }
    }

    processed = posts.length;
};

// Gets various scores from each attribute and evaluates them. The closer to 0
// a score is, the more fake it is.
function process(post, result) {
    post.scores = {};

    axios
        .post('http://localhost:9090/', {
            link: post.href,
        })
        .then(function (response) {
            post.scores.fakebox = response.data.score;
            post.scores.total = post.scores.fakebox;
            result();
        })
}

// Blocks a post.
function block(post) {
    const root = post.raw.parentNode.parentNode.parentNode;

    post.original = root.innerHTML;
    root.innerHTML = `<div style="display:flex; flex-direction: column; height: 600px; width: 500px; background-color: white; font-family: 'Lato', sans-serif; border-radius: 15px; justify-content: center; align-items: center;margin-bottom: 15px;" id="${post.id}">  <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet"> <div id="factcat-popup-${post.id}" style="transition-duration: 1s; display: none; position: absolute; z-index: 9999; background-color: white; border: solid  #5BD9BC 1px; border-radius: 15px; height: 300px; width: 250px; padding: 20px;font-family: 'Lato', sans-serif; color:white;"> <img src="https://s8.postimg.cc/6o16p3l1x/cat2.png" style=" margin:auto;width: 100px; height: 100px;"><h1 style="font-size:20px;">Analysis</h1> <label>Credibility</label> <br><progress value="0.5"></progress> <br><label>Language</label> <br><progress value="0.5"></progress> <br><label>Validity</label> <br><progress value="0.5"></progress> <br><button style="float:right;border: none; background-color:  #5BD9BC; color: white; height: 28px; font-size: 14px;font-weight: 700; border-radius: 10px;" onclick="document.getElementById('factcat-popup-${post.id}').style.display='none'">Close</button></div><img class="cat" src="https://image.ibb.co/njL3bo/cat.png" alt="cat" style="padding-bottom:100px; position: absolute; width: 250px; object-position: center; object-fit: fill;"> <div style="flex: 9;"></div><div style="flex: 5; width:100%; padding-top: 10%; background-color: #f5f5f5f5; text-align: center;"> <h1 style="font-size: 20px; font-weight: 700; ">Meow!</h1> <h2>This news may paw-sibly be unreliable!</h2> </div><div on class="factcat-footer" style="float: bottom; width:100%; flex: 1; color: white; background-color: #5BD9BC;"> <button onclick="document.getElementById('factcat-popup-${post.id}').style.display='block'" style="margin: 10px; font-size:16px; float: left; border: none; background-color: #5BD9BC; color: white;">Why is there a fact cat?</button><a href="https://ravernkoh.github.io/factcat" style="color: white"><p style="margin: 10px; font-size:16px; float: right;">FACTCAT</p></a></div><style>#factcat-popup>progress{margin-bottom: 10px; border: none; width: 80%;}#factcat-popup>label{margin-top: 10px;}</style></div>`;
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