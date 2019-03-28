const express = require('express')
const app = express()
const path = require('path')
const passport = require('passport')
const xsenv = require('@sap/xsenv')
const JWTStrategy = require('@sap/xssec').JWTStrategy
const services = xsenv.getServices({ uaa: 'diy-s4hana-uaa' })
const sccConnector = require('./ConnectSCC')
const filterUser = require('./filterUser')

passport.use(new JWTStrategy(services.uaa))

app.use(passport.initialize())
app.use(passport.authenticate('JWT', { session: false }))

app.use(sccConnector)

app.get('/test', function (req, res) {
  res.json(req.user)
})

app.get('/sap/ping', function (req, res) {
  req.axios.get('/sap/bc/ping')
    .then(response => {
      res.json(response.data)
    })
    .catch(error => {
      console.log(error)
    })
})

app.use(filterUser)

app.get('/sap/bills', function (req, res) {
  if (req.SAPCustomerNumber) {
    req.axios.get(`/sap/opu/odata/sap/CB_CUSTOMER_SRV/Customers('${req.SAPCustomerNumber}')/CCUST_BILL_DOCS?$format=json`)
      .then(response => {
        const bills = response.data.d.results
        res.json(bills)
      })
      .catch(error => {
        console.log(error)
      })
  }
})

app.use(express.static(path.join(__dirname, 'web')))

const port = process.env.PORT || 3000
app.listen(port, function () {
  console.log('s4h listening on port ' + port)
})
