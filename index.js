#!/usr/bin/env node

const parseArgs = require('minimist')
const pwpush = require('./lib/pwpush')

const showHelp = (txt = '\r') => {
  console.log(`${txt}
    \rUsage:
    \r  $ pwpush <password> [parameters] [options]

    \rParameters
    \r  --days | -d   Days until the password is deleted. Default is ${pwpush.DEFAULT_EXPIRE_DAYS}
    \r  --views | -v  Number of visualizations until the password is deleted. Default is ${pwpush.DEFAULT_EXPIRE_VIEWS}

    \rOptions
    \r  --version     Display package version.
    \r  --help | -h   Display help usage information.

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

pwpush.exec({
  password: cli._[0],
  expire_days: cli.days,
  expire_views: cli.views
})
.then(res => console.log(res.text))
.catch(res => console.error(res.error))
