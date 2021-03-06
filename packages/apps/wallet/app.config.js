/* global
  MASTER_COPY,
  FACTORY,
  CLAIM_HOST,
  API_HOST_MAINNET,
  API_HOST_RINKEBY,
  API_HOST_GOERLI,
  API_HOST_WALLET_RINKEBY,
  API_HOST_WALLET_MAINNET,
  API_HOST_WALLET_GOERLI,
  INITIAL_BLOCK_MAINNET,
  INITIAL_BLOCK_RINKEBY,
  INITIAL_BLOCK_GOERLI,
  AUTH_CLIENT_ID,
  AUTH_API_KEY,
  AUTH_DISCOVERY_DOCS,
  AUTH_SCOPE_CONTACTS,
  AUTH_SCOPE_DRIVE,
  INFURA_PK,
  DEFAULT_CHAIN_ID,
  OPENSEA_API_KEY
*/

let config
let authConfig
try {
  config = require('../../../configs/app.config.json')
} catch (e) {
  config = {}
}

try {
  authConfig = require('../../../configs/auth.config.json')
} catch (e) {
  authConfig = {
    scopes: {},
    discoveryDocs: []
  }
}

const masterCopy = MASTER_COPY || String(config.masterCopy)
const factory = FACTORY || String(config.factory)
const claimHost = CLAIM_HOST || String(config.claimHost)

const initialBlockMainnet = INITIAL_BLOCK_MAINNET || config.initialBlockMainnet
const initialBlockRinkeby = INITIAL_BLOCK_RINKEBY || config.initialBlockRinkeby
const initialBlockGoerli = INITIAL_BLOCK_GOERLI || config.initialBlockGoerli

const infuraPk = INFURA_PK || config.infuraPk
const authClientId = AUTH_CLIENT_ID || authConfig.clientId
const authApiKey = AUTH_API_KEY || authConfig.apiKey
const authDiscoveryDocs =
  (AUTH_DISCOVERY_DOCS !== undefined && JSON.parse(AUTH_DISCOVERY_DOCS)) ||
  authConfig.discoveryDocs
const authScopeContacts = AUTH_SCOPE_CONTACTS || authConfig.scopes.contacts
const authScopeDrive = AUTH_SCOPE_DRIVE || authConfig.scopes.drive
const defaultChainId = DEFAULT_CHAIN_ID || config.defaultChainId

const apiHostRinkeby = API_HOST_RINKEBY || String(config.apiHostRinkeby)
const apiHostMainnet = API_HOST_MAINNET || String(config.apiHostMainnet)
const apiHostGoerli = API_HOST_GOERLI || String(config.apiHostGoerli)

const apiHostWalletRinkeby =
  API_HOST_WALLET_RINKEBY || String(config.apiHostWalletRinkeby)
const apiHostWalletMainnet =
  API_HOST_WALLET_MAINNET || String(config.apiHostWalletMainnet)
const apiHostWalletGoerli =
  API_HOST_WALLET_GOERLI || String(config.apiHostWalletGoerli)

const openseaApiKey = OPENSEA_API_KEY || String(config.openseaApiKey)

module.exports = {
  claimHost,
  apiHostMainnet,
  apiHostRinkeby,
  apiHostGoerli,
  apiHostWalletRinkeby,
  apiHostWalletMainnet,
  apiHostWalletGoerli,
  masterCopy,
  factory,
  initialBlockMainnet,
  initialBlockGoerli,
  initialBlockRinkeby,
  authClientId,
  authApiKey,
  authDiscoveryDocs,
  authScopeContacts,
  authScopeDrive,
  infuraPk,
  openseaApiKey,
  defaultChainId
}
