const axios = require('axios')
const HTMLParser = require('fast-html-parser')
const querystring = require('querystring')

const DEFAULT_EXPIRE_DAYS = '7'
const DEFAULT_EXPIRE_VIEWS = '5'
const HOST = 'https://pwpush.com'

const onResponseComplete = (response) => {
  const rawHtml = response.data
  const $dom = HTMLParser.parse(rawHtml)

  try {
    return {
      _: response,
      text: getResultText($dom),
    }
  } catch(err) {
    throw new Error(`Something gets wrong!!`)
  }
}

const getResultText = ($dom) => {
  return ` ${getUrlValue($dom)}
    \r=> ${getExpirationDate($dom)}`
}

const getUrlValue = ($dom) => `${$dom.querySelector('#url').attributes.value}`
const getExpirationDate = ($dom) => $dom.querySelectorAll('p')[3].text.replace(/\n/g, ' ').trim()

module.exports = ({password, expire_days = DEFAULT_EXPIRE_DAYS, expire_views = DEFAULT_EXPIRE_VIEWS}) => {
  if (!password) {
    throw new Error(`A @password is required!`)
  }

  const reqOptions = {
    method: 'post',
    url: `${HOST}/p`,
    data: querystring.stringify({
      'password[payload]': password,
      'password[expire_after_days]': expire_days,
      'password[expire_after_views]': expire_views,
      'password[deletable_by_viewer]': 'on',
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'text/html,application/xhtml+xml,application/xml',
    },
  }

  return axios(reqOptions)
    .then(onResponseComplete)
}

module.exports = Object.assign(module.exports, {
  HOST,
  DEFAULT_EXPIRE_DAYS,
  DEFAULT_EXPIRE_VIEWS,
})
