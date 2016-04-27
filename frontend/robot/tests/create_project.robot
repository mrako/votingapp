*** Settings ***

Library          Selenium2Library

Test Setup       Open browser and go to homepage
Test Teardown    Close Browser

*** Variables ***

${BROWSER}       firefox
${HOMEPAGE}      http://localhost:3000/new.html

*** Test Cases ***

Create a new project
  Input Text              name=title    New project name
  Input Text              name=team     Teamname
  Submit Form
  Page Should Contain     New project name

*** Keywords ***

Open browser and go to homepage
  Open Browser    ${HOMEPAGE}    ${BROWSER}
