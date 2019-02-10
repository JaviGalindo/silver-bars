# Silver-Bars

### Improvements
- I would add more validations for the createion of an Order. For example check the types.
- I would try to catch more errors and return more information about the error.
- It should be checked that the order has been deleted or it exists before deleting it.

### Comments
- I've implemented a microservices design because in that way this microservice can be used in any project just importing and calling the API.
- In the test folder there is a file to test the application. Please, run npm start in another terminal or add require('../server') in the file to run the server and then run npm run test.
- The result shows the type of the order to help to see how it works.
