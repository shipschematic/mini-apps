import { Component, ReactNode } from 'react'
import './app.scss'

interface AppProps {
  children?: ReactNode
}

class App extends Component<AppProps> {
  constructor(props: AppProps) {
    super(props)
    console.log('=== [APP] constructor called ===')
  }

  componentDidMount() {
    console.log('=== [APP] componentDidMount ===')
  }

  componentDidShow() {
    console.log('=== [APP] componentDidShow ===')
  }

  componentDidHide() {
    console.log('=== [APP] componentDidHide ===')
  }

  componentDidCatchError(err: string) {
    console.error('=== [APP] componentDidCatchError ===', err)
  }

  onPageNotFound(obj: any) {
    console.error('=== [APP] onPageNotFound ===', obj)
  }

  render() {
    console.log('=== [APP] render called, children:', !!this.props.children)
    return this.props.children
  }
}

export default App
