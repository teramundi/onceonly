import { useTranslation } from '../i18n'

function Faq() {
  const { t } = useTranslation()

  return (
    <div className="container faq">
      <h3>{t('faq.title')}</h3>
      <details>
        <summary>{t('faq.what_is_onceonly.title')}</summary>
        <p>{t('faq.what_is_onceonly.text')}</p>
      </details>
      <details>
        <summary>{t('faq.what_is_temp_secret.title')}</summary>
        <p>{t('faq.what_is_temp_secret.text')}</p>
      </details>
      <details>
        <summary>{t('faq.what_if_message_read_by_another_person.title')}</summary>
        <p>{t('faq.what_if_message_read_by_another_person.text')}</p>
      </details>
      <details>
        <summary>{t('faq.why_onceonly_was_created.title')}</summary>
        <p>{t('faq.why_onceonly_was_created.text')}</p>
      </details>
      <details>
        <summary>{t('faq.who_is_the_onceonly_creator.title')}</summary>
        <p dangerouslySetInnerHTML={{__html: t('faq.who_is_the_onceonly_creator.text')}}></p>
      </details>
      <details>
        <summary>{t('faq.who_is_the_logo_creator.title')}</summary>
        <p dangerouslySetInnerHTML={{__html: t('faq.who_is_the_logo_creator.text')}}></p>
      </details>
    </div>
  )
}

export default Faq
