// Visits the main pages and requests every optimized image once,
// so the first real visitor gets them instantly from cache.
// Usage:  node scripts/warm-images.js https://www.grameenkalyan.com
const BASE = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');

const PAGES = [
    '/', '/about', '/healthcare', '/health-packages', '/services', '/corporate',
    '/health-force', '/join-us', '/stories', '/news-events', '/videos',
    '/photo-gallery', '/locator', '/newsletter',
];

(async() => {
    const urls = new Set();

    for (const page of PAGES) {
        try {
            const html = await (await fetch(BASE + page)).text();
            for (const m of html.matchAll(/\/_next\/image\?[^"'\s,]+/g)) {
                urls.add(m[0].replace(/&amp;/g, '&'));
            }
        } catch (e) {
            console.log('skipped', page);
        }
    }

    const list = [...urls];
    console.log(`${list.length} images found`);

    let index = 0;
    const worker = async() => {
        while (index < list.length) {
            const url = list[index];
            index += 1;
            try {
                await fetch(BASE + url, { headers: { accept: 'image/webp,image/*,*/*' } });
            } catch (e) {
                // ignore, it will be converted on first real visit
            }
        }
    };

    await Promise.all(Array.from({ length: 4 }, worker));
    console.log('done');
})();