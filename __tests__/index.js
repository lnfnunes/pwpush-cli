const masterPassword = 'MySecretPassword'
const defaultExpireDays = 7
const defaultExpireViews = 5

process.argv[2] = masterPassword

const pwpush = require('../index')
const querystring = require('querystring')

test(`Should have "${masterPassword}" as password value`, () => {
  expect(pwpush.password).toBe(masterPassword);
});
test(`Should have ${defaultExpireDays} as default value for --days flag`, () => {
  expect(pwpush.expire_days).toBe(defaultExpireDays);
});
test(`Should have ${defaultExpireViews} as default value for --views flag`, () => {
  expect(pwpush.expire_views).toBe(defaultExpireViews);
});

test(`Should reqOptions have "post" as method and "https://pwpush.com/p" as target url`, () => {
  expect(pwpush.reqOptions.method).toBe('post');
  expect(pwpush.reqOptions.url).toBe('https://pwpush.com/p');
});
test(`Should reqOptions "data" contains a queryfied payload according to passed values`, () => {
  const result = pwpush.reqOptions.data
  const expected = querystring.stringify({
    'password[payload]': masterPassword,
    'password[expire_after_days]': defaultExpireDays,
    'password[expire_after_views]': defaultExpireViews,
    'password[deletable_by_viewer]': 'on',
  })

  expect(result).toEqual(expected);
});
