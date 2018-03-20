const axios = require('axios')
const HTMLParser = require('fast-html-parser')
const querystring = require('querystring')

const DEFAULT_EXPIRE_DAYS = '7'
const DEFAULT_EXPIRE_VIEWS = '5'

const onResponseComplete = (response) => {
  const rawHtml = response.data
  const $dom = HTMLParser.parse(rawHtml)

  try {
    return {
      _: response,
      text: getResultText($dom),
    }
  } catch(err) {
    return {
      _: response,
      error: `Something gets wrong!!`,
    }
  }
}

const getResultText = ($dom) => {
  return `
    \r${getExpirationDate($dom)}
    \r${getUrlValue($dom)}
  `
}

const getUrlValue = ($dom) => `> ${$dom.querySelector('#url').attributes.value}`
const getExpirationDate = ($dom) => $dom.querySelectorAll('p')[3].text.replace(/\n/g, ' ').trim()

const exec = ({password, expire_days = DEFAULT_EXPIRE_DAYS, expire_views = DEFAULT_EXPIRE_VIEWS}) => {
  if (!password) {
    throw new Error(`A @password is required!`)
  }

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
  
  return axios(reqOptions)
    .then(onResponseComplete)
}

module.exports = {
  DEFAULT_EXPIRE_DAYS,
  DEFAULT_EXPIRE_VIEWS,
  exec
}
