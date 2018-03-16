# pwpush-cli [![Build Status](https://travis-ci.org/lnfnunes/pwpush-cli.svg?branch=master)](https://travis-ci.org/lnfnunes/pwpush-cli)

> A nodeJS CLI wrapper to easily push passwords to pwpush.com

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
