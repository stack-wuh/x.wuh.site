import withConfig from '@/hooks/useConfig'
const Footer = () => {
  const config = withConfig()

  return (
    <footer className="ww_footer">
      <p className="f__row">
        {config?.footer.prefixTitle} | {config?.footer.mainTitle} |{' '}
        <strong>{config?.footer.suffixTitle}</strong>
      </p>
      <p className="footer__copyright f__row">
        <span>{config?.footer.copyright}</span>
        <span>
          <a href="https://beian.miit.gov.cn/" rel="noreferrer" target="_blank">
            {config?.footer.domain}
          </a>
        </span>
      </p>
    </footer>
  )
}

export default Footer
