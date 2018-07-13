var osmosis = require('osmosis');

let reputableDomain = new RegExp('(www.|https:\/\/).*([^\.]+)(.gov.sg|.edu.sg)');
let reputableSource = new RegExp('(https?:\/\/(.+?\.)?(straitstimes|tnp|todayonline|businesstimes|zaobao|beritaharian|channelnewsasia|theindependent)\.(com|sg)(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&\'\(\)\*\+,;\=]*)?)');

// TEMP building as script
let build = async (link) => {
    let sentiment = 0.0;
    console.log(`🔎 Forming graph for link ${link}`);
    // Verifies if govt 
    if (link.match(reputableDomain)) {
        console.log('👍 Very reliable');
        return 1;
    };

    if (link.match(reputableSource)) return 0.5;

    return 0;

    // Return score
}

async function scrape(link) {
    let links = [];
    await osmosis.get(link)
        .find('a')
        .set({
            'link': '@href'
        })
        .data((listing) => {
            links.push(listing.link);
        })
        .log(console.log);
    return (links);
}

build("https://www.gov.sg/factually/all/");