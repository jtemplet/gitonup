var ghauth = require('ghauth')
var authOptions = {
  configName: 'gitonup',

  // (optional) whatever GitHub auth scopes you require
  scopes: ['public_repo'],

  // (optional) saved with the token on GitHub
  note: 'npm gitonup',

  // (optional)
  userAgent: 'npm gitonup'
}
var argv = require('minimist')(process.argv.slice(2))
var service

if (argv._.length === 0) {
  service = 'github'
}
// TODO: Support other git servers e.g. bitbucket

ghauth(authOptions, function (err, authData) {
  if (err) return console.error(err)
  require('../')(authData.token, service, function (err) {
    if (err) return console.error(err)
  })
})
