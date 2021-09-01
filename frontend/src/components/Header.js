import { Link } from 'react-router-dom'
import { useTranslation } from '../i18n'
import LanguageChooser from './LanguageChooser'

function Header() {
  const { t } = useTranslation()

  return (
    <header className="my-3">
      <div className="container">
        <div className="row">
          <div className="col-sm-6">
            <h1>
              <Link to="/">
                <img src="/logo.png" title={t('header.title')} alt={t('header.title')} className="img-fluid" />
              </Link>
            </h1>
          </div>
          <div className="col-sm-6">
            <LanguageChooser />
            <h2>{t('header.subtitle')}</h2>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
