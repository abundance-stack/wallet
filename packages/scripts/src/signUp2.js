import WalletSDK from '../../sdk/src'
import { ethers } from 'ethers'
const walletSDK = new WalletSDK({})

;(async () => {
  const ensName = Math.random()
    .toString(36)
    .substring(2, 15)

  const saltNonce = new Date().getTime().toString()
  console.log('ensName: ', ensName)
  console.log('saltNonce: ', saltNonce)

  let {
    safe,
    linkdropModule,
    recoveryModule,
    creationCosts,
    waitForBalance,
    deploy,
    account,
    token
  } = await walletSDK.create({
    owner: '0x9b5FEeE3B220eEdd3f678efa115d9a4D91D5cf0A',
    ensName,
    saltNonce,
    gasPrice: ethers.utils.parseUnits('5', 'gwei').toString(),
    email: 'amir@23432',
    passwordHash: '#',
    passwordDerivedKeyHash: '#',
    encryptedEncryptionKey: '#',
    encryptedMnemonicPhrase: '#'
  })

  console.log({
    safe,
    linkdropModule,
    recoveryModule,
    creationCosts,
    waitForBalance,
    deploy,
    account,
    token
  })

  console.log('Waiting for balance...')
  await waitForBalance()

  console.log('Deploying wallet...')
  const { success, txHash, account: sdf, errors } = await deploy()
  console.log({ txHash, success, sdf, errors })
})()
