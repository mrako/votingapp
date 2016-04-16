# NodeJS Template Project

This app is the NodeJS backend example project using Koa.

## Install

    npm install

## Run

    node server.js

## Init database

    psql -c "CREATE ROLE votingapp WITH CREATEDB LOGIN PASSWORD 'votingapp'"
    psql -c "CREATE DATABASE votingapp WITH OWNER votingapp"

## Request examples

### Signup

    curl --data "email=me@mrako.com&password=test" http://localhost:8080/api/v1/signup

### Signin

    curl --data "email=me@mrako.com&password=test" http://localhost:8080/api/v1/login

### Using authorization token

    curl -H "Authorization: Bearer WXH9OBkuYvEPF5SLPD9SoM89QuS-Vvam" --data "manufacturer=Volkswagen&model=Passat&nameplate=ABC-123" http://localhost:8080/api/v1/vehicles

    curl -H "Authorization: Bearer WXH9OBkuYvEPF5SLPD9SoM89QuS-Vvam" http://localhost:8080/api/v1/vehicles
