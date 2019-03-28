/*
* Middleware to check whether or not the user is a prospect or customer.
* We assume that if the user is authenticated, at least they are either of them -- not a total stranger.
* A prospect does not have an account in SAP -- so we will not call the backend SAP.
* A customer has an account in SAP  -- we will call the backend SAP.
*/
require('dotenv').config()

const Users = [
  { userId: process.env.USER1, SAPCustomerNumber: '17100001' },
  { userId: process.env.USER2, SAPCustomerNumber: null } // SAPCustomerNumber null means that they are a prospect.
]

async function findSAPCustomerNumber (userId) {
  const user = await Users.find(user => user.userId === userId)
  console.log('Found this as an SAP customer number:', user.SAPCustomerNumber)
  return user.SAPCustomerNumber
}

module.exports = function filterUser (req, res, next) {
  console.log('calling filterUser() with user id: ', req.user.id)
  findSAPCustomerNumber(req.user.id)
    .then(customerNumber => {
      if (customerNumber) {
        req.SAPCustomerNumber = customerNumber
        next()
      } else {
        next()
      }
    })
    .catch(error => {
      res.send(error)
    })
}
