import * as React from 'react'

type ErrorBoundaryStateProps = {
  hasError: boolean,
  errorInfo: string,
  error: string,
}
class ErrorBoundary extends React.Component<{}, ErrorBoundaryStateProps> {
  constructor(props: any) {
    super(props)
    this.state = {
      hasError: false,
      error: '',
      errorInfo: ''
    }
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error: error.toString(),
      errorInfo: errorInfo.componentStack
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h3>Error</h3>
          <p>服务器渲染错误!</p>
          <details>
            <p>{this.state.error}</p>
            <p>{this.state.errorInfo}</p>
          </details>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
