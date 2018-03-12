#!/usr/bin/env node

const meow = require('meow');
const axios = require('axios')
const querystring = require('querystring')
const htmlparser = require("htmlparser")
const select = require('soupselect').select

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

const data = querystring.stringify({
  'password[payload]': password,
  'password[expire_after_days]': expire_days,
  'password[expire_after_views]': expire_views,
  'password[deletable_by_viewer]': 'on',
})

axios({
  method: 'post',
  url: 'https://pwpush.com/p',
  data: data,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'text/html,application/xhtml+xml,application/xml',
  },
})
.then((response) => {
  const rawHtml = response.data
  const handler = new htmlparser.DefaultHandler((error, dom) => {
    if (error) {
      console.error('Error while parsing the HTML !', error)
      process.exit()
    }

    try {
      const $url = select(dom, "#url")[0]
      console.log($url.attribs.value)
    } catch(err) {
      console.error('Something gets wrong! No URL value was found!!')
    }
  })

  const parser = new htmlparser.Parser(handler)
  parser.parseComplete(rawHtml)
})
.catch((error) => error)
