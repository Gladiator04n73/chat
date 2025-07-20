#!/usr/bin/env bash
test=`docker-compose --version`
if [ -z "$test" ]; then echo "Please install docker compose";  exit; fi

if test -f ".env"; then
    echo ".env exists."
else
    cp env.example .env
fi

#cp env.example .env
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml run --rm backend bin/rails db:setup
docker-compose -f docker-compose.yml up
