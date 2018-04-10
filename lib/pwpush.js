const axios = require('axios')
const clip = require('node-clipboard')
const owasp = require('owasp-password-strength-test')
const storage = require('user-settings').file('.pwpushcli');
const querystring = require('querystring')

const DEFAULT_EXPIRE_DAYS = '7'
const DEFAULT_EXPIRE_VIEWS = '5'
const DEFAULT_LAST_ITEMS = '5'
const HOST = 'https://pwpush.com'
const PERMALINK = `${HOST}/p`

const onApiResponseComplete = (response) => {
  const json = response.data

  if( !json.url_token || !json.expire_after_days || !json.expire_after_views) {
    throw new Error(`Something gets wrong!!`)
  }

  const url = getUrlValue(json)

  clip(url)
  setHistory(url, json)

  return {
    _: response,
    text: getResultText(url, json),
  }
}

const getResultText = (url, json) => {
  return ` ${url}
    \r=> ${getExpirationDate(json)}`
}
const getUrlValue = ({url_token}) => `${PERMALINK}/${url_token}`
const getExpirationDate = ({expire_after_days, expire_after_views}) => (
  `This secret link will be deleted in ${expire_after_days} day or ${expire_after_views} more views`
)

const clearHistory = () => {
  storage.unset('history')
}
const showHistory = () => {
  return getHistory()
    .map((item) => `- [${formatDate(item.date)}] ${item.url} (days ${item.days}, views ${item.views})`)
    .join('\n')
}
const getHistory = () => []
  .concat(storage.get('history'))
  .filter(item => !!item)

const setHistory = (url, {expire_after_days, expire_after_views}) => {
  storage.set('history', [
    {
      date: Date.now(),
      url: url,
      days: expire_after_days,
      views: expire_after_views,
    }]
    .concat(getHistory())
    .slice(0, DEFAULT_LAST_ITEMS)
  )
}

const formatDate = (date) => {
  const d = new Date(date)
  const strDate = `${d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })}`

  return strDate
}

module.exports = ({
  password,
  expire_days = DEFAULT_EXPIRE_DAYS,
  expire_views = DEFAULT_EXPIRE_VIEWS,
  allow_weak = false,
  showHistory
}) => {
  if (!password) {
    throw new Error(`A password is required!`)
  }

  const owaspResult = owasp.test(password)
  if (!allow_weak && !owaspResult.strong) {
    throw new Error(`The password is too weak!
      \r -${owaspResult.errors.join('\n\r -')}
      \n\rCheck OWASP Guidelines for enforcing secure passwords
      \r=> https://bit.ly/owasp-secure-guideline`)
  }

  const reqOptions = {
    method: 'post',
    url: `${HOST}/p.json`,
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
    .then(onApiResponseComplete)
}

module.exports.clearHistory = clearHistory
module.exports.showHistory = showHistory
