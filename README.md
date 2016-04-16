# Votingapp with Node, Riot and Docker

Welcome to the Votingapp example project.

## Prerequisites

* [Docker](https://www.docker.com/)
* [Node](https://nodejs.org/)

## Installation

    docker-compose build

## Running

    docker-compose up -d

## Testing (backend)

    cd backend
    npm install
    npm test

## Run commands

### Prepare database

    psql -c "CREATE ROLE votingapp WITH CREATEDB LOGIN PASSWORD 'votingapp'"
    psql -c "CREATE DATABASE votingapp WITH OWNER votingapp"
    psql -c "CREATE DATABASE votingapp_test WITH OWNER votingapp"

### Backend

    npm start

### Frontend

    npm run serve


    ssh -i "eficodedocker.pem" ubuntu@ec2-52-30-177-248.eu-west-1.compute.amazonaws.com
    sudo docker-compose up -d


