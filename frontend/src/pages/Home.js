import { useEffect, useRef, useState } from 'react'
import {
  API_URL,
  RECAPTCHA_KEY,
  SUBJECT_ENABLED,
  SECRET_MAX_SUBJECT_LENGTH,
  SECRET_MAX_BODY_LENGTH,
} from '../constants'
import useClipboard from '../clipboard'
import { useHistory, useLocation } from 'react-router'
import { useTranslation } from '../i18n'

const emptyData = {
  subject: '',
  body: '',
  days: 1,
  captcha: '',
}

function Home() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(emptyData)
  const [secret, setSecret] = useState(null)
  const [error, setError] = useState(null)
  const history = useHistory()
  const location = useLocation()
  const clipboardButtonRef = useRef()
  const clipboardTargetRef = useRef()

  useClipboard(clipboardButtonRef, clipboardTargetRef, t('clipboard.label'))

  useEffect(() => {
    if (location.pathname === '/') {
      reset()
    }
  }, [location])

  const reset = () => {
    setLoading(false)
    setSecret(null)
    setError(null)
    setData(emptyData)
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault()
    if (loading) {
      return;
    }
    setLoading(true)
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(RECAPTCHA_KEY, { action: 'submit' }).then(async (token) => {
        const url = `${API_URL}/secrets`
        const resp = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            captcha: token
          })
        })
        const result = await resp.json()
        setLoading(false)
        if (resp.ok) {
          setSecret(result)
          history.push('/done')
        } else {
          if (typeof (result.detail) === 'object' && result.detail.length) {
            const errors = []
            result.detail.forEach(detail => {
              const loc = detail.loc.join('.')
              errors.push(`${loc}: ${detail.msg}`)
            })
            setError(errors.join('. '))
          } else {
            setError(result.detail)
          }
        }
      });
    });
  }

  const changeSubject = (e) => {
    let value = (e.target.value || '')
    if (value > SECRET_MAX_SUBJECT_LENGTH) {
      value = value.substring(0, SECRET_MAX_SUBJECT_LENGTH)
    }
    setData({ ...data, subject: value })
  }

  const changeBody = (e) => {
    let value = (e.target.value || '')
    if (value > SECRET_MAX_BODY_LENGTH) {
      value = value.substring(0, SECRET_MAX_BODY_LENGTH)
    }
    setData({ ...data, body: value })
  }

  return (
    <div>
      <div className="container">
        {!!secret ? (
          <div>
            <div className="input-group mb-3">
              <span className="input-group-text">{t('form.success.title')}</span>
              <input
                type="text"
                ref={clipboardTargetRef}
                className="form-control bg-white"
                value={`${window.location.origin}/${secret.password}`}
                autoFocus={true}
                readOnly={true}
                onClick={(e) => e.target.select()} />
              <button className="btn btn-secondary btn-clipboard" type="button" ref={clipboardButtonRef}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard" viewBox="0 0 16 16">
                  <path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zM3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z"/>
                </svg>
              </button>
            </div>
            <div className="mb-3 d-grid">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={reset}>
                {t('form.btn.generate_again')}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {SUBJECT_ENABLED && (
              <div className="mb-3" style={{ position: 'relative ' }}>
                <label className="visually-hidden">{t('form.field.subject.label')}</label>
                <input
                  placeholder={t('form.field.subject.placeholder')}
                  type="text"
                  value={data.subject}
                  onChange={changeSubject}
                  className="form-control"
                  required={true}
                  disabled={loading}
                  style={{ paddingRight: '70px' }}
                  maxLength={SECRET_MAX_SUBJECT_LENGTH} />
                {SECRET_MAX_SUBJECT_LENGTH && (
                  <span className="badge bg-secondary chars-counter">
                    {data.subject.length} / {SECRET_MAX_SUBJECT_LENGTH}
                  </span>
                )}
              </div>
            )}
            <div className="mb-3" style={{ position: 'relative ' }}>
              <label className="visually-hidden">{t('form.field.body.label')}</label>
              <textarea
                placeholder={t('form.field.body.placeholder')}
                value={data.body}
                onChange={changeBody}
                className="form-control"
                required={true}
                disabled={loading}
                rows={12}
                maxLength={SECRET_MAX_BODY_LENGTH} />
              {SECRET_MAX_BODY_LENGTH && (
                <span className="badge bg-secondary chars-counter">
                  {data.body.length} / {SECRET_MAX_BODY_LENGTH}
                </span>
              )}
            </div>
            <div className="row">
              <div className="col-sm-6">
                <div className="mb-3">
                  <input 
                    className="form-range"
                    type="range"
                    step="1"
                    min="1"
                    max="30"
                    value={data.days}
                    onChange={e => setData({ ...data, days: parseInt(e.target.value) || 1})} />
                    <label className="form-label">{t('form.field.expire_in.label', { days: data.days })}</label>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="mb-3 d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}>
                    {loading && (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    )}
                    {t('form.btn.generate')}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Home
