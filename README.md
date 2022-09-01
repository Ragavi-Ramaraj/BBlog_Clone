#End to End cypress automation for commissioning application

#Project details:

Application: https://commissioning-accept.saltoks.com/
Hardware used: CATE QA03
Environment: Accept
Installer: ragavi+cate@my-clay.com


#Master branch location:

Path: https://gitlab.com/claysolutions/clp/qa/commissioning-tests/-/tree/master/cypress/integration/Commissioning-E2E


#Data config:

Input data are passed from: https://gitlab.com/claysolutions/clp/qa/commissioning-tests/-/blob/master/cypress/fixtures/datarep.json


#Pipeline config:

Run: Headless mode
Browser: Chrome

npm run cy:run
