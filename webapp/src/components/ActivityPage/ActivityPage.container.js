import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import {
  getPendingTransactions,
  getTransactionHistory
} from 'modules/transaction/selectors'
import {
  getNetwork,
  getAddress,
  isConnecting,
  isConnected,
  getWallet
} from 'modules/wallet/selectors'
import { clearTransactions } from 'modules/transaction/actions'

import ActivityPage from './ActivityPage'

const mapState = state => {
  const address = getAddress(state)

  const pendingTransactions = getPendingTransactions(state, address).reverse()
  const transactionHistory = getTransactionHistory(state, address).reverse()

  const totalSent = pendingTransactions.length + transactionHistory.length

  return {
    address,
    pendingTransactions,
    transactionHistory,
    network: getNetwork(state),
    isEmpty: totalSent <= 0,
    wallet: getWallet(state),
    isLoading: isConnecting(state),
    isConnected: isConnected(state)
  }
}

const mapDispatch = (dispatch, props) => ({
  onClear: address => dispatch(clearTransactions(address))
})

export default withRouter(connect(mapState, mapDispatch)(ActivityPage))
