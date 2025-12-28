import { CSSTransition, SwitchTransition } from 'react-transition-group'

type withTransition = {}

export default function withTransition<
  T extends withTransition = withTransition
>(WrappedComponent: React.ComponentType<T>) {
  // Try to create a nice displayName for React Dev Tools.
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component'

  // Creating the inner component. The calculated Props type here is the where the magic happens.
  const ComponentWithTheme = (props: Omit<T, keyof withTransition>) => {
    // Fetch the props you want to inject. This could be done with context instead.
    console.log('=== [math]', Math.random())
    // props comes afterwards so the can override the default ones.
    return (
      <SwitchTransition mode="out-in">
        <CSSTransition in timeout={1000} classNames="fade" unmountOnExit>
          <div className="page-transition">
            <WrappedComponent {...(props as T)} />
          </div>
        </CSSTransition>
      </SwitchTransition>
    )
  }

  ComponentWithTheme.displayName = `withTranstion(${displayName})`

  return ComponentWithTheme
}
