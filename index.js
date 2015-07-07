var request = require('request')
var series = require('run-series')
var exec = require('child_process').exec
var path = require('path')
var base = 'https://api.github.com'

module.exports = gitonup

function gitonup (token, service, cb) {
  var headers = {'user-agent': 'npm gitonup'}
  var dir = process.cwd()
  var input = {}
  var repo
  headers['Authorization'] = 'token ' + token
  var processList = [getModuleName, createGitHubrepo, gitRemoteAddOrigin,
    gitPush, changeDescription]

  series(processList, function (err) {
    if (err) {
      console.error('Error: ' + err.message)
    } else {
      console.log('Done.')
    }
  })

  // Steps
  function getModuleName (cb) {
    input.name = require(path.join(dir, 'package.json')).name
    cb()
  }

  function createGitHubrepo (cb) {
    console.log('Creating GitHub repo..')
    request.post(base + '/user/repos', {json: input, headers: headers}, function (err, res, repository) {
      if (err || repository.errors) return cb(err || repository.errors)
      repo = repository
      console.log('Created repo', repo.full_name)
      cb(null, repo)
    })
  }

  function gitRemoteAddOrigin (cb) {
    console.log('Adding remote origin ' + repo.clone_url)
    exec('git remote add origin ' + repo.clone_url, {cwd: dir}, function (err, stdo, stde) {
      process.stderr.write(stde)
      cb(err)
    })
  }

  function changeDescription (cb) {
    input.description = require(path.join(dir, 'package.json')).description
    var repoUrl = [base, 'repos', repo.full_name].join('/')
    request.patch(repoUrl, {json: input, headers: headers}, cb)
  }

  function gitPush (cb) {
    console.log('Push to GitHub: ' + dir)
    exec('git push origin master', {cwd: dir}, function (err, stdo, stde) {
      process.stderr.write(stde)
      cb(err)
    })
  }
}
