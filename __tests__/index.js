const fs = require('fs')
const path = require('path')
const querystring = require('querystring')
const axios = require('axios')
const httpAdapter = require('axios/lib/adapters/http')
const nock = require('nock')
const pwpush = require('../lib/pwpush')

const DEFAULT_EXPIRE_DAYS = '7'
const DEFAULT_EXPIRE_VIEWS = '5'
const DEFAULT_LAST_ITEMS = '5'
const DEFAULT_DISALLOW_DELETE = false;
const HOST = 'https://pwpush.com'
const PERMALINK = `${HOST}/p`

axios.defaults.host = HOST
axios.defaults.adapter = httpAdapter

const objDefault = {
  password: 'MyVerySecretP@sswd2BeBroken',
  expire_days: '7',
  expire_views: '5',
  disallow_delete: false,
}
const responseValid = require('./fixture/jsonValid.json')
const responseInvalid = require('./fixture/jsonInvalid.json')

const mockRequest = (json) => {
  const api = nock(HOST)
    .post('/p.json')
    .reply(200, json)
    .on('replied', (req) => {
      expect(api.isDone()).toBe(true)
    })

  return api
}

beforeEach(() => {
  pwpush.clearHistory()
})
afterEach(() => {
  nock.cleanAll()
})

test(`Should throw an Error with message "A password is required!" if password was not provided`, () => {
  expect(() => {
    pwpush({
      expire_days: 1,
      expire_views: 1
    })
  })
  .toThrowError(`A password is required!`)
})
test(`Should throw an Error with message "The password is too weak!" if password don't pass the OWASP test`, () => {
  expect(() => {
    pwpush({
      password: 'weakP@ssword'
    })
  })
  .toThrowError(`The password is too weak!`)
})
test(`Should throw an Error with message containing security issues about OWASP test requirements`, () => {
  expect(() => {
    pwpush({
      password: 'p@ssw0rd'
    })
  })
  .toThrowError(`The password must be at least 10 characters long`)
})
test(`Should throw an Error with message containing a link to OWASP security guideline`, () => {
  expect(() => {
    pwpush({
      password: 'p@ssw0rd'
    })
  })
  .toThrowError(`https://bit.ly/owasp-secure-guideline`)
})

test(`Should have ${objDefault.expire_days} as default value for --days flag`, () => {
  expect(DEFAULT_EXPIRE_DAYS).toBe(objDefault.expire_days)
})
test(`Should have ${objDefault.expire_views} as default value for --views flag`, () => {
  expect(DEFAULT_EXPIRE_VIEWS).toBe(objDefault.expire_views)
})
test(`Should have ${objDefault.disallow_delete} as default value for --disallow-delete flag`, () => {
  expect(DEFAULT_DISALLOW_DELETE).toBe(objDefault.disallow_delete)
})
test(`Should allow weak password if --allow-weak flag is set`, () => {
  expect(() => {
    pwpush(Object.assign({}, objDefault, {
      password: 'weakpass',
      allow_weak: true,
    }))
  })
  .not.toThrow()
})
test(`Should disallow viewers to delete password if --disallow-delete flag is set`, (done) => {
  mockRequest(responseValid)

  pwpush({ 'disallow-delete': true, password: objDefault.password })
    .then((res) => {
      result = querystring.parse(res._.config.data)
      expected = {
        'password[payload]': objDefault.password,
        'password[expire_after_days]': objDefault.expire_days,
        'password[expire_after_views]': objDefault.expire_views,
        'password[deletable_by_viewer]': 'on',
      }

      expect(result).toEqual(expected)
      done()
    })
})

test(`Should call pwpush.com with default request parameters`, (done) => {
  mockRequest(responseValid)

  pwpush({password: objDefault.password})
    .then((res) => {
      result = querystring.parse(res._.config.data)
      expected = {
        'password[payload]': objDefault.password,
        'password[expire_after_days]': objDefault.expire_days,
        'password[expire_after_views]': objDefault.expire_views,
        'password[deletable_by_viewer]': 'on',
      }

      expect(result).toEqual(expected)
      done()
    })
})
test(`Should call pwpush.com API with custom request parameters`, (done) => {
  mockRequest(responseValid)

  pwpush(
    {
      password: objDefault.password,
      expire_days: 1,
      expire_views: 2,
    })
    .then((res) => {
      result = querystring.parse(res._.config.data)
      expected = {
        'password[payload]': objDefault.password,
        'password[expire_after_days]': '1',
        'password[expire_after_views]': '2',
        'password[deletable_by_viewer]': 'on',
      }

      expect(result).toEqual(expected)
      done()
    })
})
test(`Should return an text message with "${PERMALINK}/${responseValid.url_token}" when response is valid`, (done) => {
  mockRequest(responseValid)

  pwpush(
    {
      password: objDefault.password,
      expire_days: 1,
      expire_views: 1
    })
    .then((res) => {
      expect(res.text).toBeTruthy()
      expect(res.text).toContain(`${PERMALINK}/${responseValid.url_token}`)
      done()
    })
})
test(`Should reject the promise with Error containing message "Something gets wrong!!" when response is invalid`, (done) => {
  mockRequest(responseInvalid)

  pwpush(objDefault)
    .catch(err => {
      expect(err).toEqual(Error(`Something gets wrong!!`))
      done()
    })
})

test(`Should clear the list of pushed passwords`, async () => {
  pwpush.clearHistory()

  const result = pwpush.showHistory().split('')
  const expected = 0
  expect(result).toHaveLength(expected)
})
test(`Should show a list of pushed password urls when --list flag is set`, async () => {
  const max = parseInt(DEFAULT_LAST_ITEMS, 10)
  for (let i=1; i<=max; i++) {
    mockRequest(responseValid)
    await pwpush({password: objDefault.password})

    expect(pwpush.showHistory().split('\n')).toHaveLength(i)
  }
})
test(`Should show a list with no more than ${DEFAULT_LAST_ITEMS} pushed password items`, async () => {
  const max = parseInt(DEFAULT_LAST_ITEMS, 10)
  for (let i=1; i<=max + 1; i++) {
    mockRequest(responseValid)
    await pwpush({password: objDefault.password})
  }

  expect(pwpush.showHistory().split('\n')).toHaveLength(max)
})
