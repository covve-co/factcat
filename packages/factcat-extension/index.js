const posts = require('./posts');

const CONTENT_SELECTOR = 'body';

document.addEventListener('DOMContentLoaded', function () {
    const content = document.querySelector(CONTENT_SELECTOR);
    content.addEventListener('DOMSubtreeModified', posts.modified);
});