const fs = require('fs')
const path = require('path')
const querystring = require('querystring')
const axios = require('axios')
const httpAdapter = require('axios/lib/adapters/http')
const nock = require('nock')
const pwpush = require('../lib/pwpush')

const HOST = 'https://pwpush.com';
axios.defaults.host = HOST;
axios.defaults.adapter = httpAdapter;

const objDefault = {
  password: 'MySecretPassword',
  expire_days: '7',
  expire_views: '5'
}
const htmlValid = fs.readFileSync(path.resolve(__dirname, 'fixture/htmlValid.html'), 'utf-8')
const htmlInvalid = fs.readFileSync(path.resolve(__dirname, 'fixture/htmlInvalid.html'), 'utf-8')

const mockRequest = (html) => {
  const api = nock(HOST)
    .post('/p')
    .reply(200, html)
    .on('replied', (req) => {
      expect(api.isDone()).toBe(true)
    })

  return api
}

afterEach(() => {
  nock.cleanAll()
})

test(`Should have ${objDefault.expire_days} as default value for --days flag`, () => {
  expect(pwpush.DEFAULT_EXPIRE_DAYS).toBe(objDefault.expire_days);
});
test(`Should have ${objDefault.expire_views} as default value for --views flag`, () => {
  expect(pwpush.DEFAULT_EXPIRE_VIEWS).toBe(objDefault.expire_views);
});

test(`Should call pwpush.com with default request parameters`, (done) => {
  mockRequest(htmlValid)
  
  pwpush.exec({password: objDefault.password})
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
});

test(`Should call pwpush.com with custom request parameters`, (done) => {
  mockRequest(htmlValid)
  
  pwpush.exec(
    {
      password: objDefault.password,
      expire_days: 1,
      expire_views: 1
    })
    .then((res) => {
      result = querystring.parse(res._.config.data)
      expected = {
        'password[payload]': objDefault.password,
        'password[expire_after_days]': '1',
        'password[expire_after_views]': '1',
        'password[deletable_by_viewer]': 'on',
      }

      expect(result).toEqual(expected)
      done()
    })
});

test(`Should return an text message if html response if valid`, (done) => {
  mockRequest(htmlValid)
  
  pwpush.exec(
    {
      password: objDefault.password,
      expire_days: 1,
      expire_views: 1
    })
    .then((res) => {
      expect(res.text).toBeTruthy()
      done()
    })
});

test(`Should return an error message if html response is invalid`, (done) => {
  mockRequest(htmlInvalid)
  
  pwpush.exec(objDefault)
    .then((res) => {
      result = res.error
      expected = 'Something gets wrong!!'

      expect(result).toEqual(expected)
      done()
    })
});

test(`Should throw and error if password was not provided`, () => {
  mockRequest(htmlValid)

  try {
    pwpush.exec({
      expire_days: 1,
      expire_views: 1
    })
  } catch (err) {
    expect(err).toEqual(Error(`A @password is required!`))
  }
});
