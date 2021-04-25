#!/usr/bin/env node
"use strict";
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
// Libs
var chalk = require('chalk');
var clear = require('clear');
var figlet = require('figlet');
var fs = require('fs');
// const path = require('path')
var program = require('commander');
var Crawler = require('node-html-crawler');
var base = {
    domain: 'www.iban.com',
    key: 'bank',
    protocol: 'https:'
};
clear();
console === null || console === void 0 ? void 0 : console.log(chalk === null || chalk === void 0 ? void 0 : chalk.red(figlet === null || figlet === void 0 ? void 0 : figlet.textSync('Crawler-cli', { horizontalLayout: 'full' })));
program
    .version('0.0.1')
    .description("An spider CLI for clawer wensite url")
    .option('-K, --key <key>', "Search for key '" + (base === null || base === void 0 ? void 0 : base.key) + "'")
    .option('-P, --protocol <protocol>', "Protocol default '" + (base === null || base === void 0 ? void 0 : base.protocol) + "'")
    .option('-D, --domain <domain>', "Domain default '" + (base === null || base === void 0 ? void 0 : base.domain) + "'")
    .option('-C, --limitForConnections <connections>', 'Cumber of simultaneous connections, default 15')
    .option('-R, --limitForRedirects <redirects>', 'possible number of redirects, default 5')
    .option('-T, --timeout', 'Number of milliseconds between pending connection, default 300')
    .parse(process === null || process === void 0 ? void 0 : process.argv);
program === null || program === void 0 ? void 0 : program.outputHelp();
console.log('\n\r');
var options = program === null || program === void 0 ? void 0 : program.opts();
var domain = (_a = options === null || options === void 0 ? void 0 : options.domain) !== null && _a !== void 0 ? _a : base === null || base === void 0 ? void 0 : base.domain;
var siteTree = { pages: [], urls: {}, redirects: {} };
var getFinalStatusCodeOfRedirects = function (url) {
    if (/30\d/.test(siteTree.urls[url]))
        return getFinalStatusCodeOfRedirects(siteTree === null || siteTree === void 0 ? void 0 : siteTree.redirects[url]);
    return siteTree.urls[url];
};
var crawler = new Crawler({
    protocol: (_b = options === null || options === void 0 ? void 0 : options.protocol) !== null && _b !== void 0 ? _b : base === null || base === void 0 ? void 0 : base.protocol,
    domain: domain,
    limitForConnections: (_c = options === null || options === void 0 ? void 0 : options.connections) !== null && _c !== void 0 ? _c : 15,
    limitForRedirects: (_d = options === null || options === void 0 ? void 0 : options.redirects) !== null && _d !== void 0 ? _d : 5,
    timeout: (_e = options === null || options === void 0 ? void 0 : options.timeout) !== null && _e !== void 0 ? _e : 500,
    headers: { 'User-Agent': 'Mozilla/5.0' },
    // urlFilter: (url: string) => true,
});
crawler.crawl();
crawler.on('data', function (data) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    if (data === null || data === void 0 ? void 0 : data.url) {
        siteTree.urls[data === null || data === void 0 ? void 0 : data.url] = (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.result) === null || _a === void 0 ? void 0 : _a.statusCode) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : '';
        siteTree.pages.push({
            url: data === null || data === void 0 ? void 0 : data.url,
            links: (_e = (_d = data === null || data === void 0 ? void 0 : data.result) === null || _d === void 0 ? void 0 : _d.links) !== null && _e !== void 0 ? _e : [],
        });
        process.stdout.write((crawler === null || crawler === void 0 ? void 0 : crawler.countOfProcessedUrls) + " out of " + ((_f = crawler === null || crawler === void 0 ? void 0 : crawler.foundLinks) === null || _f === void 0 ? void 0 : _f.size) + "\n\r");
        if (/30\d/.test((_j = (_h = (_g = data === null || data === void 0 ? void 0 : data.result) === null || _g === void 0 ? void 0 : _g.statusCode) === null || _h === void 0 ? void 0 : _h.toString()) !== null && _j !== void 0 ? _j : '') && ((_m = (_l = (_k = data === null || data === void 0 ? void 0 : data.result) === null || _k === void 0 ? void 0 : _k.links) === null || _l === void 0 ? void 0 : _l[0]) === null || _m === void 0 ? void 0 : _m.url))
            siteTree.redirects[data === null || data === void 0 ? void 0 : data.url] = (_q = (_p = (_o = data === null || data === void 0 ? void 0 : data.result) === null || _o === void 0 ? void 0 : _o.links) === null || _p === void 0 ? void 0 : _p[0]) === null || _q === void 0 ? void 0 : _q.url;
    }
});
crawler.on('error', function (error) { return console.error(error); });
crawler.on('end', function () {
    var _a;
    siteTree.pages.forEach(function (page, pageIndex) {
        var _a, _b, _c, _d, _e;
        var urlOfPage = (_b = (_a = siteTree === null || siteTree === void 0 ? void 0 : siteTree.pages) === null || _a === void 0 ? void 0 : _a[pageIndex]) === null || _b === void 0 ? void 0 : _b.url;
        (_e = (_d = (_c = siteTree === null || siteTree === void 0 ? void 0 : siteTree.pages) === null || _c === void 0 ? void 0 : _c[pageIndex]) === null || _d === void 0 ? void 0 : _d.links) === null || _e === void 0 ? void 0 : _e.forEach(function (link, linkIndex) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            var urlOfLink = (_d = (_c = (_b = (_a = siteTree === null || siteTree === void 0 ? void 0 : siteTree.pages) === null || _a === void 0 ? void 0 : _a[pageIndex]) === null || _b === void 0 ? void 0 : _b.links) === null || _c === void 0 ? void 0 : _c[linkIndex]) === null || _d === void 0 ? void 0 : _d.url;
            if (urlOfLink) {
                var hrefOfLink = (_h = (_g = (_f = (_e = siteTree === null || siteTree === void 0 ? void 0 : siteTree.pages) === null || _e === void 0 ? void 0 : _e[pageIndex]) === null || _f === void 0 ? void 0 : _f.links) === null || _g === void 0 ? void 0 : _g[linkIndex]) === null || _h === void 0 ? void 0 : _h.href;
                var statusCodeOfLink = (/30\d/.test(siteTree.urls[urlOfLink])) ? getFinalStatusCodeOfRedirects(urlOfLink) : siteTree.urls[urlOfLink];
                if (statusCodeOfLink && (urlOfPage === null || urlOfPage === void 0 ? void 0 : urlOfPage.includes(base === null || base === void 0 ? void 0 : base.key))) {
                    console.log("\"" + urlOfPage + "\" ; \"" + hrefOfLink + "\" ; \"" + statusCodeOfLink + "\"\r\n");
                }
            }
        });
    });
    console.log("\r\nFinish! All " + ((_a = crawler === null || crawler === void 0 ? void 0 : crawler.foundLinks) === null || _a === void 0 ? void 0 : _a.size) + " links on pages on domain " + domain + " a checked!");
});
