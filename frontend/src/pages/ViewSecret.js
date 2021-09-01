import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router"
import {
  API_URL,
  SUBJECT_ENABLED,
} from '../constants'
import useClipboard from '../clipboard'
import { Link } from 'react-router-dom'
import { useTranslation } from '../i18n'

function ViewSecret() {
  const { key } = useParams();
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [secret, setSecret] = useState(null)
  const [agreed, setAgreed] = useState(false)
  const clipboardButtonRef = useRef()
  const clipboardTargetRef = useRef()

  useClipboard(clipboardButtonRef, clipboardTargetRef, t('clipboard.label'))

  useEffect(() => {
    setLoading(false)
    setAgreed(false)
    setSecret(null)
  }, [key])

  const handleRevealScret = async () => {
    setAgreed(true)
    setLoading(true)
    const url = `${API_URL}/secrets/${key}`
    const resp = await fetch(url, {
      headers: {
        'Content-type': 'application/json',
      }
    })
    if (resp.ok) {
      const result = await resp.json()
      setSecret(result)
    }
    setLoading(false)
  }

  return (
    <div>
      <div className="container">
        {loading && (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">{t('loading.label')}</span>
            </div>
          </div>
        )}
        {!loading && agreed && secret && (<>
          <h3>{t('view.secret.title')}</h3>
          <div className="alert alert-warning" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill me-2" viewBox="0 0 16 16">
              <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
              <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
            </svg>
            {t('view.secret.description')}
          </div>
          {SUBJECT_ENABLED && (
            <div className="mb-3">
              <label>{t('view.secret.field.subject')}</label>
              <input
                type="text"
                value={secret.subject}
                className="form-control"
                readOnly={true} />
            </div>
          )}
          <div className="card bg-light mb-3">
            <div className="card-body">
              <button ref={clipboardButtonRef} className="btn btn-secondary btn-sm btn-clipboard">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard" viewBox="0 0 16 16">
                  <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                  <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                </svg>
              </button>
              <pre ref={clipboardTargetRef} className="font-monospace">{secret.body}</pre>
            </div>
          </div>
          <Link to="/" className="btn btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-compact-left" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223z"/>
            </svg>
            {t('view.secret.btn.generate')}
          </Link>
        </>)}
        {!loading && agreed && !secret && (
          <div className="alert alert-danger" role="alert">
            {t('view.secret_not_found_message')}
          </div>
        )}
        {!loading && !agreed && (
          <div className="bg-light p-4">
            <h3>{t('view.preview.title')}</h3>
            <p>{t('view.preview.description')}</p>
            <div className="text-end">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleRevealScret}>
                {t('view.preview.btn.reveal')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewSecret
