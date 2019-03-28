# diy-s4h-scp
Do-It-Yourself SAP S/4HANA connected securely via SAP Cloud Connector with a Node.js application

## blog
My blog walk you through the app. Link TBD -- it's being written.

## .env
Modify `.env` file under `diy-app` folder. Add a real email address as a user ID to authenticate to SAP Cloud Platform.

This is used in `filterUser.js` in `diy-app` as a dummy substitute for a user database.
USER1 is for a customer who will see a list of bills -- mapped to S/4HANA customer 17100001. 
USER2 is for a prospect who has a SCP ID but not mapped to an S/4HANA customer.

## Notes on JavaScript Coding Style
I use JavaScript Standard Style; I have adjusted most of the source code from tutorials and other resources accordingly. Notably, statements in my code does not end with a semi-colon, “;”. 
