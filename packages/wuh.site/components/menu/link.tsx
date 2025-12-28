import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import React, { Children } from 'react'

export type linkTypeProps = LinkProps & {
  children: React.ReactElement
  activeClassName: string
}

export default function ActiveLink(props: linkTypeProps) {
  const { children, activeClassName } = props
  const { asPath } = useRouter()
  const child = Children.only(children)
  const childClassName = child.props.className || ''

  // @refs https://github.com/vercel/next.js/blob/canary/examples/active-class-name/components/ActiveLink.js
  // pages/index.js will be matched via props.href
  // pages/about.js will be matched via props.href
  // pages/[slug].js will be matched via props.as
  const className =
    asPath === props.href || asPath === props.as
      ? `${childClassName} ${activeClassName}`.trim()
      : childClassName

  return (
    <Link {...props}>
      {React.cloneElement(child, {
        className: className || null,
      })}
    </Link>
  )
}
