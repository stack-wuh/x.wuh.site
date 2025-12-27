import React from 'react'

const Layout: React.FC<{ children: React.ReactNode }> = (props) => {
  return (<>
    <div>Layout</div>

    <div>
      {props.children}
    </div>
  </>)
}

export default Layout