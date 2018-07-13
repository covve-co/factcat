const posts = require('./posts');

const CONTENT_SELECTOR = '#globalContainer #contentArea';

document.addEventListener('DOMContentLoaded', function () {
    const content = document.querySelector(CONTENT_SELECTOR);
    content.addEventListener('DOMSubtreeModified', posts.modified);
});
