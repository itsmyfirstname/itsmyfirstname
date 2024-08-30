build:
  cd ./docs
  pip3 install --upgrade jupyter
  export JEKYLL_ENV=production
  bundle exec jekyll build

clean-up:
  cd ./docs
  npm install -g purgecss
  purgecss -c purgecss.config.js