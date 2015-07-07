# gitonup
[![NPM](https://nodei.co/npm/gitonup.png)](https://nodei.co/npm/gitonup/)

Helper tool, intended to be ran after create-module was ran in offline mode

## Install
```sh
npm install gitonup -g
```

## Usage
```
gitonup
```

Does the following work-flow:
```sh
#create <github repo> for <module name>
git remote add origin <github repo>
git push origin master
# set github repo description to package.json description
```
