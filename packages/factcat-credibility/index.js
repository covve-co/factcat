let reputableDomain = new RegExp('(www.|https:\/\/).*([^\.]+)(.gov.sg|.edu.sg)');
let reputableSource = new RegExp("(https?:\/\/(.+?\.)?(straitstimes|tnp|todayonline|businesstimes|zaobao|beritaharian|channelnewsasia|theindependent)\.(com|sg)(\/*)?)");

module.exports = (link) => {
    console.log(`🔎 Forming graph for link ${link}`);
    // Verifies if govt 
    if (link.match(reputableDomain)) {
        console.log('👍 Very reliable');
        return 1;
    };

    if (link.match(reputableSource)) return 0.5;

    return 0.3;

    // Return score
}