
export const metaFormik = (closeModal, ficha) => {

    return {
      initialValues: {
        id: ficha?.id || '',
        nome: ficha?.nome || '',
        idHospedagem: ficha?.idHospedagem || '',
        nacionalidade: ficha?.nacionalidade || {
          id: '',
          nome: ''
        },
        dataNascimento: '',
        cpf: ficha?.cpf || '',
        cedulaIdentidade: ficha?.cedulaIdentidade || '',
        orgaoExpedidor: ficha?.orgaoExpedidor || '',
        certidaoNascimento: ficha?.certidaoNascimento || '',
        idade: ficha?.idade || moment().diff(moment(ficha?.dataNascimento?.valorFormatado, 'DD/MM/YYYY'), 'years'),
        email: ficha?.email || '',
        foneFixo: ficha?.foneFixo || '',
        foneCelular: ficha?.foneCelular || '',
        cep: ficha?.cep || '',
      },
    }

}

