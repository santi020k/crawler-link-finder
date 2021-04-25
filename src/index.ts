#!/usr/bin/env node

// Libs
const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const fs = require('fs');
// const path = require('path')
const program = require('commander')
const Crawler = require('node-html-crawler')
// Interfaces
import { IData, ISiteTree } from './index.inteface'

const base = {
  domain: 'www.iban.com',
  key: 'bank',
  protocol: 'https:'
}

clear()

console?.log(chalk?.red(figlet?.textSync('Crawler-cli', { horizontalLayout: 'full' })))

program
  .version('0.0.1')
  .description("An spider CLI for clawer wensite url")
  .option('-K, --key <key>', `Search for key '${base?.key}'`)
  .option('-P, --protocol <protocol>', `Protocol default '${base?.protocol}'`)
  .option('-D, --domain <domain>', `Domain default '${base?.domain}'`)
  .option('-C, --limitForConnections <connections>', 'Cumber of simultaneous connections, default 15')
  .option('-R, --limitForRedirects <redirects>', 'possible number of redirects, default 5')
  .option('-T, --timeout', 'Number of milliseconds between pending connection, default 300')
  .parse(process?.argv)

program?.outputHelp();

console.log('\n\r')

const options = program?.opts()

const domain = options?.domain ?? base?.domain

const siteTree: ISiteTree = { pages: [], urls: {}, redirects: {} };

const getFinalStatusCodeOfRedirects = (url: string): string => {
  if (/30\d/.test(siteTree.urls[url])) return getFinalStatusCodeOfRedirects(siteTree?.redirects[url]);
  return siteTree.urls[url];
};

const crawler = new Crawler({
  protocol: options?.protocol ?? base?.protocol,
  domain: domain,
  limitForConnections: options?.connections ?? 15, // number of simultaneous connections, default 15
  limitForRedirects: options?.redirects ?? 5, // possible number of redirects, default 5
  timeout: options?.timeout ?? 500, // number of milliseconds between pending connection, default 300
  headers: { 'User-Agent': 'Mozilla/5.0' },
  // urlFilter: (url: string) => true,
})

crawler.crawl();

crawler.on('data', (data: IData) => {
  if (data?.url) {
    siteTree.urls[data?.url] = data?.result?.statusCode?.toString() ?? '';
    siteTree.pages.push({
      url: data?.url,
      links: data?.result?.links ?? [],
    });

    process.stdout.write(`${crawler?.countOfProcessedUrls} out of ${crawler?.foundLinks?.size}\n\r`);

    if (/30\d/.test(data?.result?.statusCode?.toString() ?? '') && data?.result?.links?.[0]?.url) siteTree.redirects[data?.url] = data?.result?.links?.[0]?.url;
  }
});

crawler.on('error', (error: Record<string, unknown>) => console.error(error))

crawler.on('end', () => {
  siteTree.pages.forEach((page, pageIndex) => {
    const urlOfPage = siteTree?.pages?.[pageIndex]?.url;

    siteTree?.pages?.[pageIndex]?.links?.forEach((link, linkIndex) => {
      const urlOfLink = siteTree?.pages?.[pageIndex]?.links?.[linkIndex]?.url;

      if (urlOfLink) {
        const hrefOfLink = siteTree?.pages?.[pageIndex]?.links?.[linkIndex]?.href;
        const statusCodeOfLink = (/30\d/.test(siteTree.urls[urlOfLink])) ? getFinalStatusCodeOfRedirects(urlOfLink) : siteTree.urls[urlOfLink];

        if (statusCodeOfLink && urlOfPage?.includes(base?.key)) {
          console.log(`"${urlOfPage}" ; "${hrefOfLink}" ; "${statusCodeOfLink}"\r\n`);
        }
      }
    });
  });

  console.log(`\r\nFinish! All ${crawler?.foundLinks?.size} links on pages on domain ${domain} a checked!`);
});