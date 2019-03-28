const axios = require('axios')
const xsenv = require('@sap/xsenv')
const Utils = require('./Utils')
const loadDest = require('./Destination')

module.exports = setup

async function getDestination () {
  console.log('ConnectSCC.js calling getHost()')
  let destination = await loadDest('diy-s4hana')
  return destination
}

async function getAccessTokenForProxy () {
  console.log('ConnectSCC.js calling getAccessTokenForProxy()')
  let JWTtoken = await Utils.getJWTTokenForService('connectivity')
  return JWTtoken
}

function setup (req, res, next) {
  console.log('ConnectSCC.js calling setup()')
  try {
    /**
     * Set header SAP-Connectivity-Authentication with usertoken (uaa)
     */
    axios.defaults.headers.common['SAP-Connectivity-Authentication'] =
      'Bearer ' + req.authInfo.token // assumed Passportjs to attach authInfo to req

    /**
     * Set header Proxy-Authorization for connectivity service
     */
    const services = xsenv.getServices({ connectivity: { tag: 'connectivity' } })
    axios.defaults.proxy = { 'host': services.connectivity.onpremise_proxy_host,
      'port': services.connectivity.onpremise_proxy_port }
    console.log('header proxy auth: ', axios.defaults.proxy)

    /**
    * Get proxy JWT, and
    * Get virtual host from destination service
     */
    Promise.all([
      getAccessTokenForProxy(), // output in data[0]
      getDestination() // output in data[1]
    ]).then(data => {
      console.log('proxy access token: ', data[0])
      axios.defaults.headers.common['Proxy-Authorization'] = 'Bearer ' + data[0]

      console.log('destination: ', data[1])
      axios.defaults.baseURL = data[1].destinationConfiguration.URL
      /* Basic authorization assumed */
      axios.defaults.headers.common['Authorization'] = 'Basic ' + data[1].authTokens[0].value // assumed only one authTokens

      console.log('baseURL: ', axios.defaults.baseURL)
      console.log('headers: ', axios.defaults.headers.common)

      req.axios = axios
      next()
    }).catch(e => next(e))
  } catch (e) {
    next('Error')
  }
}
