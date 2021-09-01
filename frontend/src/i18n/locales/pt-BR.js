const trans = {
  translation: {
    header: {
      title: 'OnceOn.ly',
      subtitle: 'Compartilhe conteúdos de forma segura que se autodesturirão no primeiro acesso.',
    },
    menu: {
      home: 'Início',
      faq: 'FAQ',
    },
    clipboard: {
      label: 'Copiado!',
    },
    loading: {
      label: 'Carregando...',
    },
    form: {
      field: {
        subject: {
          label: 'Assunto',
          placeholder: 'Assunto',
        },
        body: {
          label: 'Corpo',
          placeholder: 'Digite o conteúdo a ser criptografado',
        },
        expire_in: {
          label: 'Expira em {{ days }} dia(s)',
        },
      },
      success: {
        title: 'Seu link',
      },
      btn: {
        generate: 'Gerar link',
        generate_again: 'Gerar outro link',
      },
    },
    view: {
      secret: {
        title: 'Seu segredo',
        description: 'O link expirou e não poderá ser visualizado novamente. Tome nota em um local seguro se precisar acessar este conteúdo no futuro.',
        field: {
          subject: 'Assunto',
        },
        btn: {
          generate: 'Gerar outro link',
        },
      },
      preview: {
        title: 'Essa mensagem irá se autodestruir!',
        description: 'Uma vez visualizada, você não mais poderá acessar o seu conteúdo novamente. Se você precisa acessar esta informação no futuro, por favor faça uma cópia para um local seguro.',
        btn: {
          reveal: 'Continuar',
        },
      },
      secret_not_found_message: 'O segredo não foi encontrado.',
    },
    faq: {
      title: 'FAQ',
      what_is_onceonly: {
        title: 'O que é OnceOn.ly?',
        text: 'OnceOn.ly é um sistema de compartilhamento de segredos temporário. O sistema baseia-se no conceito de mensagens autodestrutivas: um remetente envia uma mensagem a um destinatário e esta mensagem se auto destrói depois da primeira visualização — se uma mensagem só pode ser visualizada uma única vez e você é a pessoa que a está visualizando, então a mensagem não foi vista por mais ninguém além de quem a escreveu. Através do OnceOn.ly você pode gravar mensagens contendo informações sensíveis e enviá-las a terceiros que, ao conseguir abri-las, saberão que as mensagens não vazaram.',
      },
      what_is_temp_secret: {
        title: 'O que é um Segredo Temporário?',
        text: 'São segredos que só precisam ser mantidos em sigilo por um curto período de tempo, pois logo tornam-se informações obsoletas. Um exemplo muito comum é uma senha inicial de um sistema que, ao ser utilizado pela primeira vez, exige que o usuário a altere. Em um caso como esse, depois que a senha inicial for utilizada, ela deixará de ter qualquer valor.',
      },
      what_if_message_read_by_another_person: {
        title: 'E se a minha mensagem foi visualizada por terceiros?',
        text: 'No evento da mensagem já ter sido visualizada (e portanto destruída), você verá um erro ao tentar visualizá-la e saberá que algo está errado. Nesse caso, podemos afirmar com certeza que alguém acessou uma informação destinada a você. A partir daí você pode comunicar o incidente ao remetente para que eventuais segredos contidos na mensagem sejam atualizados (ex: apagar ou alterar as informações sensíveis que vazaram) e iniciar uma investigação forense para determinar como a informação vazou e quais impactos deste vazamento.',
      },
      why_onceonly_was_created: {
        title: 'Qual a motivação por trás do OnceOn.ly?',
        text: 'Em face do crescente número de leis introduzidas com o intuito de prover transparência sobre a maneira como informações pessoais são tratadas (como LGPD no Brasil e GDPR na União Européia), todo tipo de compartilhamento de informações sensíveis viu-se sob escrutínio. Embora soluções parecidas com OnceOn.ly já existam e funcionem adequadamente em suas esferas, elas são uma caixa preta aos olhos dos usuários que as utilizam, que não podem atestar que seus segredos não estejam sendo copiados sem o seu consentimento. Daí surgiu a necessidade de um sistema de compartilhamento de segredos que tivesse código completamente aberto para auditoria por qualquer parte interessada.',
      },
      who_is_the_onceonly_creator: {
        title: 'Qual a relação do OnceOn.ly com a Teramundi?',
        text: 'A <a href="https://www.teramundi.com/" className="text-dark" target="_blank" rel="noreferrer">Teramundi</a> é uma empresa de hospedagem gerenciada que, ao trabalhar no processo de certificação ISO 27001, visando conformidade com LGPD e GDPR, identificou a necessidade de um sistema de compartilhamento de segredos temporários. Ao analisar as opções disponíveis na Internet, determinou que a criação do OnceOn.ly seria a maneira mais eficiente e transparente de obter o produto desejado.',
      },
      who_is_the_logo_creator: {
        title: 'Quem foi responsável pela criação do logo?',
        text: 'O designer Bruno Madeira (<a href="mailto:brn@secunit.org" className="text-dark">brn@secunit.org</a>) contribuiu com este projeto open source com seu tempo e criatividade.',
      },
    },
    footer: {
      message: 'Todos os direitos reservados',
    },
  }
}

export default trans
