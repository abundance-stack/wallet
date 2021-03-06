import { put, select } from 'redux-saga/effects'

const generator = function * ({ payload }) {
  try {
    const { tokenType } = payload
    const email = yield select(generator.selectors.email)
    const sdk = yield select(generator.selectors.sdk)
    const { isDeployed, safe } = yield sdk.isDeployed(email)
    yield put({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId: null } })
    yield put({ type: 'ASSETS.SET_LINK', payload: { link: null } })
    if (isDeployed) {
      // linkdrop sdk
      if (tokenType === 'erc20') {
        console.log('claiming erc20...')
        return yield put({ type: '*TOKENS.CLAIM_TOKENS_ERC20', payload: { ...payload, wallet: safe } })
      }

      if (tokenType === 'erc721') {
        console.log('claiming erc721...')
        return yield put({ type: '*TOKENS.CLAIM_TOKENS_ERC721', payload: { ...payload, wallet: safe } })
      }
    } else {
      // wallet sdk
      if (tokenType === 'erc20') {
        console.log('claiming erc20 and deploy...')
        return yield put({ type: '*TOKENS.CLAIM_TOKENS_ERC20_AND_DEPLOY', payload: { ...payload, email } })
      }

      if (tokenType === 'erc721') {
        console.log('claiming erc721 and deploy...')
        return yield put({ type: '*TOKENS.CLAIM_TOKENS_ERC721_AND_DEPLOY', payload: { ...payload, email } })
      }
    }
  } catch (error) {
    console.error(error)
  }
}

export default generator
generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk,
  email: ({ user: { email } }) => email
}
