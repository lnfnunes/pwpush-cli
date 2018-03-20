# pwpush-cli
> A nodeJS CLI wrapper to easily push passwords to pwpush.com

[![NPM][npm-image] ][npm-url]

[![npm version][version-image]][version-url]
[![Build Status][ci-image]][ci-url]
[![Coverage Status][coverage-image]][coverage-url]

![image](https://user-images.githubusercontent.com/2450417/37249539-122d2056-24c8-11e8-860c-ca4609ef4073.png)

## Install
```bash
npm install -g pwpush-cli
```

## Usage
```bash
pwpush <password> [parameters] [options]

# Example
pwpush MySuperSecretPassword --days 1 --views 2
```

## Parameters

### --days | -d

Type: `integer` \
Default value: `7`

Days until the password is deleted.

### --views | -v

Type: `integer` \
Default value: `5`

Number of visualizations until the password is deleted.

## Options

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
