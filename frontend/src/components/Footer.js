import { useTranslation } from '../i18n'

function Footer() {
  const { t } = useTranslation()

  return (
    <footer>
      <div className="container">
        <p>© 2021 Copyright <a href="https://www.teramundi.com/" className="text-dark" target="_blank" rel="noreferrer">Teramundi</a>. {t('footer.message')}.</p>
      </div>
    </footer>
  )
}

export default Footer
