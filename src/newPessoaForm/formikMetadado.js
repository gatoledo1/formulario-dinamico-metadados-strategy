import { useEffect, useState } from "react";
import { post } from "../HttpUtils/FetchApi"

export const metaPessoaFormik = (closeModal, setStateSnack, stateSnack) => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if(loading) {
      setStateSnack({ ...stateSnack, open: true, severity: 'info', message: jQuery.i18n.prop('label.carregando') })
    } else {
      return 
    }
  }, [loading])
  
    return {
      initialValues: {
        boolPessoaFisica: 'on',
        titular: true,
        pessoa: {
          codigo: '',
          razaoNome: '',
          fantasiaSobrenome: '',
          nacionalidade: '',
          dataRegistro: '',
          pessoaFisica: {
            genero: '',
            cpf: '',
            cedulaIdentidade: '',
            orgaoExpedidor: "",
            certidaoNascimento: "",
            regimeTributarioIcms: '',
            inscricaoEstadual: "",
            membership: "",
            //documentotipo: "",
            //passaPorte: "",
            //cie: "",
            //DNI == CPF

          },
          idiomaSistema: "",
          nif: "",
          observacao: ""
          //categoriaIva: ""
        },
        endereco: {
          cidade: {
            unidadeFederativa: {
              pais: "",
              //id: "",
              //nome: "",
            },
            id: '',
            nome: ''
          },
          cep: '',
          logradouroTipo: '',
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          //caixaPostal: "",
        },
        contato: {
          nome: "",
          email: "",
          telefonesTransient: 
            {
              tipo: "",
              numero: ""
            }
          
        },
        anexos: [],
      },
      onSubmit: (values) => {    
        const serializedForm = serializePayload(values)
        post(`/pessoaResumida/salvarDialog?${serializedForm}`, null, setLoading)
        .then(() => {
          setStateSnack({ ...stateSnack, open: true, severity: 'success', message: jQuery.i18n.prop('label.pessoa.resumida.salva.sucesso') })
          setTimeout(() => { 
            closeModal()
          }, 2500);
        })
        .catch((err) => {
          setStateSnack({ ...stateSnack, open: true, message: Array.isArray(err) ? err : err?.chave });
        });
      },
    }

}
