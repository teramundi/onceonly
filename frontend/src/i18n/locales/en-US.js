const trans = {
  translation: {
    header: {
      title: 'OnceOn.ly',
      subtitle: 'Securely share content that will self-destruct on first access.',
    },
    menu: {
      home: 'Home',
      faq: 'FAQ',
    },
    clipboard: {
      label: 'Copied!',
    },
    loading: {
      label: 'Loading...',
    },
    form: {
      field: {
        subject: {
          label: 'Subject',
          placeholder: 'Subject',
        },
        body: {
          label: 'Body',
          placeholder: 'Fill here the secret body to be crypted',
        },
        expire_in: {
          label: 'Expires in {{ days }} day(s)',
        },
      },
      success: {
        title: 'Your link',
      },
      btn: {
        generate: 'Generate link',
        generate_again: 'Generate another link',
      },
    },
    view: {
      secret: {
        title: 'Your secret',
        description: 'The link has expired and cannot be viewed again. Please make a note in a safe place if you need to access this content in the future.',
        field: {
          subject: 'Subject',
        },
        btn: {
          generate: 'Generate another secret',
        },
      },
      preview: {
        title: 'This message will self destruct!',
        description: 'Once viewed you can not view this note again. If you need access to this information again please copy it to a secure location.',
        btn: {
          reveal: 'Continue',
        },
      },
      secret_not_found_message: 'Secret not found.',
    },
    faq: {
      title: 'FAQ',
      what_is_onceonly: {
        title: 'What is OnceOn.ly?',
        text: 'OnceOn.ly is a temporary secret sharing system. The system is based on the concept of self-destructive messages: a sender sends a message to a recipient and that message self-destructs after the first viewing — if a message can only be viewed once and you are the person viewing it, then the message has not been seen by anyone but who wrote it. Through OnceOn.ly you can write messages containing sensitive information and send them to third parties, to be able to open them, they will know that the messages are leaked.',
      },
      what_is_temp_secret: {
        title: 'What is a Temporary Secret?',
        text: 'These are secrets that only need to be kept confidential for a short period of time, as they soon become obsolete information. A very common example is an initial system password that, when first used, requires the user to change it. In a case like this, once the initial password is used, it will no longer have any value.',
      },
      what_if_message_read_by_another_person: {
        title: 'What if my message was viewed by a third party?',
        text: 'In the event that the message has already been viewed (and therefore destroyed), you will see an error when trying to view it and you will know that something is wrong. In this case, we can be confident that someone has accessed information intended for you. From there, you can report the incident to the sender so that any secrets contained in the message are updated (eg, erase or change the leaked sensitive information) and initiate a forensic investigation to determine how the information was leaked and what impacts this leak has.',
      },
      why_onceonly_was_created: {
        title: 'What is the motivation behind OnceOn.ly?',
        text: 'Given the growing number of laws introduced to provide transparency about the way personal information is handled (such as LGPD in Brazil and GDPR in the European Union), all kinds of sharing of sensitive information has come under scrutiny. Although solutions similar to OnceOn.ly already exist and function properly in their spheres, they are a black box in the eyes of users that use them, who can not certify that their secrets are not being copied without your consent. Hence the need for a secret sharing system that was completely open source for auditing by any interested party.',
      },
      who_is_the_onceonly_creator: {
        title: 'What is OnceOn.ly\'s relationship with Teramundi?',
        text: '<a href="https://www.teramundi.com/" className="text-dark" target="_blank" rel="noreferrer">Teramundi</a> is a managed hosting company that, while working on the ISO 27001 certification process for LGPD and GDPR compliance, identified the need for a temporary secret sharing system. By analyzing the options available on the Internet, he determined that creating OnceOn.ly would be the most efficient and transparent way to obtain the desired product.',
      },
      who_is_the_logo_creator: {
        title: 'Who was responsible for creating the logo?',
        text: 'Bruno Madeira (<a href="mailto:brn@secunit.org" className="text-dark">brn@secunit.org</a>) contributed to this open source project with his time and creativity.',
      },
    },
    footer: {
      message: 'All rights reserved',
    },
  }
}

export default trans
