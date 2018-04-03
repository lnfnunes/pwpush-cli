const axios = require('axios')
const querystring = require('querystring')

const DEFAULT_EXPIRE_DAYS = '7'
const DEFAULT_EXPIRE_VIEWS = '5'
const HOST = 'https://pwpush.com'
const PERMALINK = `${HOST}/p`

const onResponseComplete = (response) => {
  const json = response.data

  if( !json.url_token || !json.expire_after_days || !json.expire_after_views) {
    throw new Error(`Something gets wrong!!`)
  }

  return {
    _: response,
    text: getResultText(json),
  }
}

const getResultText = (json) => (
  ` ${getUrlValue(json)}
  \r=> ${getExpirationDate(json)}`
)

const getUrlValue = ({url_token}) => `${PERMALINK}/${url_token}`
const getExpirationDate = ({expire_after_days, expire_after_views}) => (
  `This secret link will be deleted in ${expire_after_days} day or ${expire_after_views} more views`
)

module.exports = ({password, expire_days = DEFAULT_EXPIRE_DAYS, expire_views = DEFAULT_EXPIRE_VIEWS}) => {
  if (!password) {
    throw new Error(`A @password is required!`)
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
    .then(onResponseComplete)
}
