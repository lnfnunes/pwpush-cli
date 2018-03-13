#!/usr/bin/env node

const meow = require('meow');
const axios = require('axios')
const querystring = require('querystring')
const HTMLParser = require('fast-html-parser');

const cli = meow(`
	Usage
	  $ pwpush <password> [parameters] [options]

	Parameters
    -d | --days   Days until the password is deleted. Default is 7
    -v | --views  Number of visualizations until the password is deleted. Default is 5

  Options
    --version     Display package version.
    --help        Display this help information.

	Example
	  $ pwpush MySuperSecretPassword --days 1 --views 2
`, {
	flags: {
		days: {
			type: 'number',
			alias: 'd'
		},
		views: {
			type: 'number',
			alias: 'v'
		}
	}
})

if (!cli.input.length) {
  cli.showHelp()
}

const password = cli.input[0]
const expire_days = cli.flags.days || 7
const expire_views = cli.flags.views || 5

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
