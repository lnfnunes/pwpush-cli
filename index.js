#!/usr/bin/env node

const parseArgs = require('minimist')
const axios = require('axios')
const querystring = require('querystring')
const HTMLParser = require('fast-html-parser');

const DEFAULT_EXPIRE_DAYS = 7
const DEFAULT_EXPIRE_VIEWS = 5

const showHelp = (txt = '\r') => {
  console.log(`${txt}
    \rUsage:
    \r  $ pwpush <password> [parameters] [options]

    \rParameters
    \r  --days | -d   Days until the password is deleted. Default is ${DEFAULT_EXPIRE_DAYS}
    \r  --views | -v  Number of visualizations until the password is deleted. Default is ${DEFAULT_EXPIRE_VIEWS}

    \rOptions
    \r  --version     Display package version.
    \r  --help | -h   Display this help information.

    \rExample
    \r  $ pwpush MySuperSecretPassword --days 1 --views 2
  `)
  process.exit(0)
}

const cli = parseArgs(process.argv.slice(2), {
  boolean: ['version', 'help'],
  alias: {
    d: 'days',
    v: 'views',
    h: 'help',
  },
  unknown: (value) => {
    if (process.argv.slice(2, 3)[0] !== value) {
      showHelp(`Unknown value: ${value}\n`)
    }
  },
});

if (!!cli.version) {
  console.log(`${require('./package.json').version}`)
  process.exit(0)
}
if (!!cli.help || !cli._[0]) {
  showHelp()
}

const password = cli._[0]
const expire_days = cli.days || DEFAULT_EXPIRE_DAYS
const expire_views = cli.views || DEFAULT_EXPIRE_VIEWS

const reqData = querystring.stringify({
  'password[payload]': password,
  'password[expire_after_days]': expire_days,
  'password[expire_after_views]': expire_views,
  'password[deletable_by_viewer]': 'on',
})

const reqOptions = {
  method: 'post',
  url: 'https://pwpush.com/p',
  data: reqData,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'text/html,application/xhtml+xml,application/xml',
  },
}

const onResponseComplete = (response) => {
  const rawHtml = response.data
  const $dom = HTMLParser.parse(rawHtml)

  try {
    getResultText($dom)
  } catch(err) {
    console.error(`Something gets wrong!! ${err}`)
  }
}

const getResultText = ($dom) => {
  console.log(getExpirationDate($dom))
  console.log(getUrlValue($dom))
}

const getUrlValue = ($dom) => `> ${$dom.querySelector('#url').attributes.value}`
const getExpirationDate = ($dom) => $dom.querySelectorAll('p')[3].text.replace(/\n/g, ' ').trim()

axios(reqOptions)
  .then(onResponseComplete)
  .catch(console.error)
