import { add } from 'mathjs'
import { utils } from 'ethers'

export default (arr) => {
  return arr.reduce((res, { tokenAddress: newId, tokenId, balanceFormatted, decimals, icon, price, image, name, symbol, type, balance }) => {
    var previouslyAdded = res.find(({ tokenAddress: prevId }) => prevId === newId)
    if (type === 'erc721') {
      if (previouslyAdded && previouslyAdded.tokenId === tokenId) { return res }
      return res.concat({ tokenAddress: newId, name, tokenId, balanceFormatted, decimals, icon, price, symbol, image, type, balance })
    }

    if (!previouslyAdded) {
      return res.concat({ tokenAddress: newId, balanceFormatted, decimals, icon, price, symbol, image, type, balance })
    } else {
      return res.map(item => {
        if (item.tokenAddress === previouslyAdded.tokenAddress) {
          const commonBalanceFormatted = add(Number(balanceFormatted), Number(previouslyAdded.balanceFormatted))
          const balance = utils.parseUnits(
            String(commonBalanceFormatted),
            item.decimals
          )
          return { ...item, balance, balanceFormatted: commonBalanceFormatted }
        } else {
          return item
        }
      })
    }
  }, [])
}
