### This is a demo for deploying web app to azure app service
just a simple todo-list app
deploy method: Azure App Service for container (connecting to ACR for continuous deployment)
#### include the following Azure resources
1. app registraion (for MSAL authentication and authorization)
2. protected web api (shouls retrieve access token to validate the api)
3. managed identity (for sql database connection)
