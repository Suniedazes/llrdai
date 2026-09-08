// Corporate website operations only. Product availability claims are not changed here.
export const operations = {
 site: 'https://llrd.ai', recipient: 'contactus@llrd.ai', timezone: 'America/Chicago',
 cron: '0 0,6,12,13,14,18 * * *', reportHour: 8, retentionDays: 93,
 endpoints: ['/', '/contact', '/products', '/robots.txt', '/sitemap.xml'],
 products: [{name:'SONIE',url:'https://app.sonie.ai'}, {name:'ElseSide',url:'https://app.elseside.ai'}],
 timeoutMs: 8000, maxBodyBytes: 512000, slowMs: 3000, consecutiveFailures: 2,
 expiryDays: [90,60,30,14,7,1], crawlLimit: 20,
 integrations: {googleProperty:'https://llrd.ai/',bingSite:'https://llrd.ai/'},
} as const;

