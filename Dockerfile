FROM ruby:3.2.5-slim

RUN apt-get update -qq && apt-get install -yq --no-install-recommends \
    build-essential \
    gnupg2 \
    less \
    git \
    telnet \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN apt-get update -qq && apt-get install -y default-libmysqlclient-dev

ENV LANG=C.UTF-8 \
  BUNDLE_JOBS=4 \
  BUNDLE_RETRY=3

RUN gem update --system && gem install bundler

WORKDIR /usr/src/app

COPY entrypoint.sh ./

ENTRYPOINT ["./entrypoint.sh"]

EXPOSE 3001

CMD ["bundle", "exec", "rails", "s", "-b", "0.0.0.0", "-p", "3001"]
