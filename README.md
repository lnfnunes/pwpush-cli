# pwpush-cli

[![Greenkeeper badge](https://badges.greenkeeper.io/lnfnunes/pwpush-cli.svg)](https://greenkeeper.io/)

> A nodeJS CLI wrapper to easily push passwords to pwpush.com

[![NPM][npm-image] ][npm-url]

[![npm version][version-image]][version-url]
[![Build Status][ci-image]][ci-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Maintainability][quality-image]][quality-url]\
[![Downloads/month][npmcharts-image]][npmcharts-url]
[![Download-size][download-size-image]][download-size-url]


![image](https://user-images.githubusercontent.com/2450417/37249539-122d2056-24c8-11e8-860c-ca4609ef4073.png)

## Install
```bash
npm install -g pwpush-cli
```

## Usage
```bash
pwpush <password> [parameters] [options]

# Long version
pwpush MyVerySecretP@sswd2BeBroken --days 1 --views 2

# Short version
pwpush MyVerySecretP@sswd2BeBroken -d 1 -v 2
```

**Tip:** The secure generated link should be automatically be copied to the clipboard. Just paste it 🍻

## Parameters

### --days | -d

Type: `integer` \
Default value: `7`

Number of days until the password is deleted.

### --views | -v

Type: `integer` \
Default value: `5`

Number of visualizations until the password is deleted.

### --disallow-delete | -r
Disallow the viewer to delete the password before expiration (by default viewers are allowed to delete the password)

## Options

###  --allow-weak
Disable password strength verification. **Not recommended!!** \
Read more about [OWASP security guideline](https://bit.ly/owasp-secure-guideline).

###  --version
Display package version.

### --help | -h
Display help usage information.

## Contributing
Bug reports and Pull Requests are welcome!

## License
[MIT License](LICENSE) © Leandro Nunes



[npm-image]: https://nodei.co/npm/pwpush-cli.svg?downloads=true
[npm-url]: https://npmjs.org/package/pwpush-cli
[version-image]: https://badge.fury.io/js/pwpush-cli.svg
[version-url]: https://badge.fury.io/js/pwpush-cli
[ci-image]: https://travis-ci.org/lnfnunes/pwpush-cli.svg?branch=master
[ci-url]: https://travis-ci.org/lnfnunes/pwpush-cli
[coverage-image]: https://coveralls.io/repos/github/lnfnunes/pwpush-cli/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/lnfnunes/pwpush-cli?branch=master
[quality-image]: https://api.codeclimate.com/v1/badges/bbb9ff8b5e698891fe56/maintainability
[quality-url]: https://codeclimate.com/github/lnfnunes/pwpush-cli/maintainability
[npmcharts-image]: https://img.shields.io/npm/dm/pwpush-cli.svg
[npmcharts-url]: https://npmcharts.com/compare/pwpush-cli?minimal=true
[download-size-image]: https://packagephobia.now.sh/badge?p=pwpush-cli
[download-size-url]: https://packagephobia.now.sh/result?p=pwpush-cli
