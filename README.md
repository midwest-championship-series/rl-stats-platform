# MNRL Stats

This service exists to provide the Minnesota Rocket League community with the ability to manage players and their stats through the Minnesota Championship Series (MNCS) league play and tournament.

## Developing

### Dependencies

You'll need both node an python in order to run these services. I'd recommend getting [nvm](https://github.com/nvm-sh/nvm) and [pyenv](https://github.com/pyenv/pyenv) to manage versions, which are specified in [serverless.yml](./serverless.yml).

Also get `yarn` for node package management
```bash
brew install yarn
```

Still working on successfully managing python packages, but I've been using `pipenv` with success locally. The problem so far has been that the package apparently does not work on lambda. `python-lambda-requirements` was supposed to fix this, and it does for packages like `numpy`, but it does not apparently work for `carball` yet.

### Setup

After deps are installed, `yarn install` and `pipenv install` in order to get the required packages.

### Deployment

This service only lives on CloudFormation, and everything is managed via the Serverless framework.

Command:
```bash
sls deploy
```

Note that you may have to have an aws profile called `personal`, although that can be parameterized in the future