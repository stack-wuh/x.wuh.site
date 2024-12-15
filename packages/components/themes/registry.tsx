'use client';

import * as React from 'react'
import { useServerInsertedHTML } from 'next/navigation';
import { StyleRegistry, createStyleRegistry } from 'styled-jsx';

type jsxRegistry = {
  children: React.ReactNode
}

export default function StyledJsxRegistry(props: jsxRegistry) {
   // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  // https://github.com/vercel/next-app-router-playground/blob/main/app/styling/styled-jsx/registry.tsx
  const [jsxStyleRegistry] = React.useState(() => createStyleRegistry());

  useServerInsertedHTML(() => {
    const styles = jsxStyleRegistry.styles();
    jsxStyleRegistry.flush();
    return <>{styles}</>;
  });

  return <StyleRegistry registry={jsxStyleRegistry}>{props.children}</StyleRegistry>
}