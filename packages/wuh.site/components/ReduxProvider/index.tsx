import React from 'react'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import ErrorBoundary from '../ErrorBoundary'

const ReduxProvider: React.FC<{}> = (props) => {
  return <ErrorBoundary>
    <Provider store={store}>{props.children}</Provider>
  </ErrorBoundary>
}

export default ReduxProvider