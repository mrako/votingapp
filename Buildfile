#!/bin/bash

npm uninstall bcrypt && npm install bcrypt
npm install
npm run test:xunit
