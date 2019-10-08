#!/usr/bin/env node

const ora = require('ora')
const parseArgs = require('minimist')
const pwpush = require('./lib/pwpush')

const showHelp = (txt = '\r') => {
  console.log(`${txt}
    \rUsage:
    \r  $ pwpush <password> [parameters] [options]

    \rParameters
    \r  --days            | -d  Days until the password is deleted. Default is ${pwpush.DEFAULT_EXPIRE_DAYS}
    \r  --views           | -v  Number of visualizations until the password is deleted. Default is ${pwpush.DEFAULT_EXPIRE_VIEWS}
    \r  --list            | -l  List last ${pwpush.DEFAULT_LAST_ITEMS} pushed passwords.
    \r  --disallow-delete | -r  Disallow viewers to delete password before expiration Default is ${pwpush.DEFAULT_ALLOW_DELETE}

    \rOptions
    \r  --allow-weak  Allow weak passwords to be used.
    \r  --version     Display package version.
    \r  --help | -h   Display help usage information.

    \rExample
    \r  $ pwpush MySuperSecretPassword --days 1 --views 2
  `)

  process.exit(0)
}

const cli = parseArgs(process.argv.slice(2), {
  boolean: ['version', 'help', 'allow-weak', 'allow-delete', 'list'],
  alias: {
    d: 'days',
    v: 'views',
    r: 'disallow-delete',
    l: 'list',
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
if (!!cli.list) {
  console.log(pwpush.showHistory())
  process.exit(0)
}
if (!!cli.help || !cli._[0]) {
  showHelp()
}

const spinner = ora().start()

try {
  pwpush({
    password: cli._[0],
    expire_days: cli.days,
    expire_views: cli.views,
    allow_delete: cli['disallow-delete'],
    allow_weak: cli['allow-weak'],
  })
  .then(res => {
    spinner.succeed(res.text)
    process.exit(0)
  })
  .catch(err => {
    spinner.fail(err)
    process.exit(1)
  })
} catch (err) {
  spinner.fail(err)
}
