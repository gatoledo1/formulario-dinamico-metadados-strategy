import { ListItemText, MenuItem } from '@mui/material';
import { get, post } from '../HttpUtils/FetchApi'

export const inputsMetadado = (formik, setStateSnack) => {    

    const formFields = [
      {
        type: 'section',
        name: jQuery.i18n.prop('label.identificacao'),
        paisHomologado: undefined,
        condition: undefined
    },
      {
        type: 'inputTextOrNumber',
        xs: 6,
        sm: 4,
        md: 4,
        lg: 4,
        className: "text-field",
        fullWidth: true,
        id: "codigo",
        name: "pessoa.codigo",
        value: formik.values.pessoa?.codigo || '',
        label: jQuery.i18n.prop('label.codigo') + "*",
        size: "small",
        inputProps: {
          "id-robot": "drawer-cadastroPessoa-codigo",
        },
        onInput: (e) => e.target.value = e.target.value.replace(/[^0-9]/g, ''),
        onChange: (e) => formik.setFieldValue("pessoa.codigo", e?.target?.value),
        inputRef: (input) => {
          if(input && !input.requestMade) {
            input.requestMade = true //para evitar novas requests
            get('/pessoaResumida/getCodigoSequencial').then(res => {
              input.value = res
              formik.setFieldValue("pessoa.codigo", res)
          })
        }},
        onBlur: formik.handleBlur,
        validate: (value) => {
          if (!value) return jQuery.i18n.prop('label.campo.obrigatorio');
          return '';
        },
        error: formik.touched?.pessoa?.codigo && Boolean(formik.errors?.['pessoa.codigo']),
        helperText: formik.touched?.pessoa?.codigo && formik.errors?.['pessoa.codigo'],
      },
      {
        type: 'inputTextOrNumber',
        xs: 6,
        sm: 4,
        md: 4,
        lg: 4,
        className: "text-field",
        fullWidth: true,
        id: "nome",
        name: "pessoa.razaoNome",
        autoFocus: true,
        value: formik.values.pessoa?.razaoNome || '',
        label: jQuery.i18n.prop('label.nome') + "*",
        size: "small",
        inputProps: {
          "id-robot": "drawer-cadastroPessoa-nome",
          maxLength: 150
        },
        onInput: undefined,
        onChange: (e) => {
          formik.setFieldValue("pessoa.razaoNome", e?.target?.value)
        },
        onBlur: (e) => {
          formik.setFieldValue("contato.nome", `${e?.target?.value} ${formik.values.pessoa?.fantasiaSobrenome || ''}`)
        },
        validate: (value) => {
          if (!value) return jQuery.i18n.prop('label.campo.obrigatorio');
          return '';
        },
        error: formik.touched?.pessoa?.razaoNome && Boolean(formik.errors?.['pessoa.razaoNome']),
        helperText: formik.touched?.pessoa?.razaoNome && formik.errors?.['pessoa.razaoNome'],
      },
      {
        type: 'inputTextOrNumber',
        xs: 6,
        sm: 4,
        md: 4,
        lg: 4,
        className: "text-field",
        fullWidth: true,
        id: "sobrenome",
        name: "pessoa.fantasiaSobrenome",
        value: formik.values.pessoa?.fantasiaSobrenome || '',
        label: jQuery.i18n.prop('label.sobrenome') + "*",
        size: "small",
        inputProps: {
          "id-robot": "drawer-cadastroPessoa-sobrenome",
          maxLength: 150
        },
        onInput: undefined,
        onChange: (e) => {
          formik.setFieldValue("pessoa.fantasiaSobrenome", e?.target?.value)
        },
        onBlur: (e) => {
          formik.setFieldValue("contato.nome", `${formik.values.pessoa?.razaoNome || ''} ${e?.target?.value}`)
        },
        validate: (value) => {
          if (!value) return jQuery.i18n.prop('label.campo.obrigatorio');
          return '';
        },
        error: formik.touched?.pessoa?.fantasiaSobrenome && Boolean(formik.errors?.['pessoa.fantasiaSobrenome']),
        helperText: formik.touched?.pessoa?.fantasiaSobrenome && formik.errors?.['pessoa.fantasiaSobrenome'],
      },  
        {
          type: 'datepicker',
          xs: 6,
          sm: 4,
          md: 4,
          lg: 4,
          name: 'pessoa.dataRegistro',
          label: jQuery.i18n.prop('label.data.nascimento') + "*",
          className: 'datepicker-wrapper',
          disablePast: false,
          readOnly: false,
          value: formik.values.pessoa?.dataRegistro || "",
          inputProps: {
            "id-robot": "drawer-cadastroPessoa-dataNascimento",
          },
          maxDate: () => moment().toDate(),
          onChange: (value) => {
            const valorFormatado = moment(value).format('DD/MM/YYYY');
            formik.setFieldValue('pessoa.dataRegistro', value ? valorFormatado : '');
          },
          validate: (value) => {
            if (!value) return jQuery.i18n.prop('label.campo.obrigatorio');
            return '';
          },
          error: formik.touched?.pessoa?.dataRegistro && Boolean(formik.errors?.['pessoa.dataRegistro']),
          helperText: formik.touched?.pessoa?.dataRegistro && formik.errors?.['pessoa.dataRegistro'],
        },
        {
          type: 'infiniteScrollAutocomplete',
          xs: 12,
          sm: 8,
          md: 4,
          lg: 4,
          className: "",
          freeSolo: false,
          id: undefined,
          name: "pessoa.nacionalidade",
          autoComplete: true,
          includeInputInList: true,
          filterSelectedOptions: true,
          size: "small",
          value: formik.values.pessoa?.nacionalidade,
          TextField: {
              name: "pessoa.nacionalidade",
              label: jQuery.i18n.prop('label.cadastro.nacionalidade') + "*",
              size: "small",
              autoFocus: false,
              SelectProps: undefined,
          },
          inputProps: {
            "id-robot": "drawer-cadastroPessoa-nacionalidade",
          },
          onBlur: formik.handleBlur,
          getOptionLabel: (option) => option.nacionalidade || option.label || '',
          isOptionEqualToValue: (option, value) => option.value === value.id,
          onChange: (e, value) => formik.setFieldValue("pessoa.nacionalidade", {
            id: value?.value,
            nacionalidade: value?.label
          }),
          fetchFunction: get,
          getUrl: (term) => `/tecnico/pais/findAutoCompleteNacionalidadeComCodigoIbgeEMercosul?term=${term || ''}`,
          initialOptions: (term) => get(`/tecnico/pais/findAutoCompleteNacionalidadeComCodigoIbgeEMercosul?term=${term || ''}&pagina=0`),
          validate: (value) => {
            if (!value) return jQuery.i18n.prop('label.campo.obrigatorio');
            return '';
          },
          error: Boolean(formik.touched?.pessoa?.nacionalidade) && Boolean(formik.errors?.['pessoa.nacionalidade']),
          helperText: Boolean(formik.touched?.pessoa?.nacionalidade) && formik.errors?.['pessoa.nacionalidade'],
        },
        {
          type: "radioGroup",
          xs: 12,
          sm: 12,
          md: 4,
          lg: 4,
          name: "pessoa.pessoaFisica.genero",
          label: jQuery.i18n.prop('label.genero') + "*",
          options: [
            {
              value: "MASCULINO",
              label: jQuery.i18n.prop('label.masculino'),
              onChange: (e) => formik.setFieldValue("pessoa.pessoaFisica.genero", e?.target?.value)
            },
            {
              value: "FEMININO",
              label: jQuery.i18n.prop('label.feminino'),
              onChange: (e) => formik.setFieldValue("pessoa.pessoaFisica.genero", e?.target?.value)
            },
          ],
          validate: (value) => {
            if (!value) return jQuery.i18n.prop('label.campo.obrigatorio');
            return '';
          },
          error: formik.touched?.pessoa?.pessoaFisica?.genero && Boolean(formik.errors?.['pessoa.pessoaFisica.genero']),
          helperText: formik.touched?.pessoa?.pessoaFisica?.genero && formik.errors?.['pessoa.pessoaFisica.genero'],
        },
        {
          type: 'section',
          name: jQuery.i18n.prop('label.cadastro.documentacao'),
      },
        {
          type: 'inputTextOrNumber',
          paisHomologado: "Brasil",
          xs: 6,
          sm: 4,
          md: 4,
          lg: 4,
          className: "text-field",
          fullWidth: true,
          id: "",
          name: "pessoa.pessoaFisica.cpf", //caminho inteiro do objeto
          value: formik.values.pessoa?.pessoaFisica?.cpf,
          label: jQuery.i18n.prop('label.cpf'),
          size: "small",
          inputProps: {
            "id-robot": "drawer-cadastroPessoa-cpf",
            maxLength: 14,
          },
          onInput: (e) => e.target.value = e.target.value.replace(/[^0-9]/g, ''),
          onChange: (e) => {
            formik.setFieldValue("pessoa.pessoaFisica.cpf", e.target.value)
          },
          onBlur: (e) => {
            const formatedValue = formatarDocumento(e?.target?.value)
            formik.setFieldValue("pessoa.pessoaFisica.cpf", formatedValue)

            if(e?.target?.value?.length > 10) {
              post('/pessoaResumida/isCpfCnpjJaExisite?documento=' + e?.target?.value)
              .then((res) => {
                if(res) {
                  setStateSnack((stateSnack) => { 
                    return {...stateSnack, open: true, message: jQuery.i18n.prop('erro.cpf.existente') }
                  });
                } else {
                  setStateSnack((stateSnack) => { 
                    return {...stateSnack, open: false, message: '' }
                  });
                }
              });
            }
          },
          validate: () => {
            let response = ''
            if(
              (formik.values.pessoa?.nacionalidade?.nacionalidade?.includes("BRASIL") &&
              !formik.values.pessoa?.pessoaFisica?.cedulaIdentidade &&
              !formik.values.pessoa?.pessoaFisica?.cpf &&
              !formik.values.pessoa?.pessoaFisica?.certidaoNascimento) || 
                !formik.values.pessoa?.nacionalidade?.nacionalidade?.includes("BRASIL") && 
                !formik.values.pessoa?.pessoaFisica?.passaPorte &&
                !formik.values.pessoa?.pessoaFisica?.cie
            ) {
              response = jQuery.i18n.prop('erro.rgcpfcn.empty')
            }
            return response;
          },
          error: formik.touched?.pessoa?.pessoaFisica?.cpf && Boolean(formik.errors?.['pessoa.pessoaFisica.cpf']),
          helperText: formik.touched?.pessoa?.pessoaFisica?.cpf && formik.errors?.['pessoa.pessoaFisica.cpf'],
        },
        {
          type: 'inputTextOrNumber',
          condition: formik.values.pessoa?.nacionalidade?.nacionalidade && 
            !formik.values.pessoa?.nacionalidade?.nacionalidade?.includes("BRASIL") || 
              false,
          xs: 6,
          sm: 4,
          md: 4,
          lg: 4,
          className: "text-field",
          fullWidth: true,
          disabled: false,
          id: "",
          inputProps: {
            "id-robot": "drawer-cadastroPessoa-passaporte",
          },
          name: "pessoa.pessoaFisica.passaPorte",
          value: formik.values.pessoa?.pessoaFisica?.passaPorte,
          label: jQuery.i18n.prop('label.PASSAPORTE'),
          size: "small",
          onInput: undefined,
          onChange: (e) => formik.setFieldValue("pessoa.pessoaFisica.passaPorte", e?.target?.value),
          onBlur: formik.handleBlur,
        },
        {
          type: 'inputTextOrNumber',
          paisHomologado: "Brasil",
          condition: formik.values.pessoa?.nacionalidade?.nacionalidade && 
            ["PARAGUAI", "URUGUAI", "ARGENTINA", "VENEZUELA",].includes(
              formik.values.pessoa?.nacionalidade?.nacionalidade?.replace(/.* - (.*)/, '$1')
            ) || 
              false,
          xs: 6,
          sm: 4,
          md: 4,
          lg: 4,
          className: "text-field",
          fullWidth: true,
          disabled: false,
          id: "",
          inputProps: {
            "id-robot": "drawer-cadastroPessoa-cie",
          },
          name: "pessoa.pessoaFisica.cie",
          value: formik.values.pessoa?.pessoaFisica?.cie,
          label: jQuery.i18n.prop('label.cie'),
          size: "small",
          onInput: undefined,
          onChange: (e) => formik.setFieldValue("pessoa.pessoaFisica.cie", e?.target?.value),
          onBlur: formik.handleBlur,
        },
        {
          type: 'inputTextOrNumber',
          paisHomologado: "Brasil",
          condition: formik.values.pessoa?.nacionalidade?.nacionalidade?.includes("BRASIL"),
          xs: 6,
          sm: 4,
          md: 4,
          lg: 4,
          className: "text-field",
          fullWidth: true,
          id: "",
          name: "pessoa.pessoaFisica.cedulaIdentidade",
          value: formik.values.pessoa?.pessoaFisica?.cedulaIdentidade,
          label: jQuery.i18n.prop('label.rg'),
          size: "small",
          onInput: (e) => e.target.value = e.target.value.replace(/[^0-9]/g, ''),
          inputProps: {
            "id-robot": "drawer-cadastroPessoa-rg",
          },
          onChange: (e) => formik.setFieldValue("pessoa.pessoaFisica.cedulaIdentidade", e?.target?.value),
          onBlur: formik.handleBlur,
        },
        {
          type: 'inputTextOrNumber',
          paisHomologado: "Brasil",
          condition: formik.values.pessoa?.nacionalidade?.nacionalidade?.includes("BRASIL"),
          xs: 6,
          sm: 4,
          md: 4,
          lg: 4,
          className: "text-field",
          fullWidth: true,
          id: "",
          name: "pessoa.pessoaFisica.orgaoExpedidor",
          value: formik.values.pessoa?.pessoaFisica?.orgaoExpedidor,
          label: jQuery.i18n.prop('label.orgao.expedidor'),
          size: "small",
          onInput: undefined,
          inputProps: {
            "id-robot": "drawer-cadastroPessoa-orgaoExpedidor",
          },
          onChange: (e) => formik.setFieldValue("pessoa.pessoaFisica.orgaoExpedidor", e?.target?.value),
          onBlur: formik.handleBlur,
        },
        {
          type: 'inputTextOrNumber',
          paisHomologado: "Brasil",
          condition: formik.values.pessoa?.nacionalidade?.nacionalidade?.includes("BRASIL"),
          xs: 6,
          sm: 4,
          md: 4,
          lg: 4,
          className: "text-field",
          fullWidth: true,
          id: "",
          name: "pessoa.pessoaFisica.certidaoNascimento",
          value: formik.values.pessoa?.pessoaFisica?.certidaoNascimento,
          label: jQuery.i18n.prop('label.cer-nasc'),
          size: "small",
          inputProps: {
            "id-robot": "drawer-cadastroPessoa-certidaoNascimento",
          },
          onInput: (e) => e.target.value = e.target.value.replace(/[^0-9.-]/g, ''),
          onChange: (e) => formik.setFieldValue("pessoa.pessoaFisica.certidaoNascimento", e?.target?.value),
          onBlur: formik.handleBlur,
        },
        {
          type: 'select',
          paisHomologado: "Brasil",
          condition: formik.values.pessoa?.nacionalidade?.nacionalidade?.includes("BRASIL"),
          xs: 6,
          sm: 4,
          md: 4,
          lg: 4,
          name: "pessoa.pessoaFisica.regimeTributarioIcms",          
          className: "text-field",
          fullWidth: true,
          inputProps: {
            "id-robot": "drawer-cadastroPessoa-regimeTributarioIcms",
          },
          value: formik.values.pessoa?.pessoaFisica?.regimeTributarioIcms,
          label: jQuery.i18n.prop('label.regime.trib.icms') + '*',
          size: "small",
          options: [
            {value: 'CONTRIBUINTE', label: jQuery.i18n.prop('label.contribuinte')}, 
            {value: 'ISENTO', label: jQuery.i18n.prop('label.isento')}, 
            {value: 'NAO_CONTRIBUINTE', label: jQuery.i18n.prop('label.nao.contribuinte')}
          ],
          onChange: (e) => {
              formik.setFieldValue("pessoa.pessoaFisica.regimeTributarioIcms", e.target.value)
              if(e.target.value === "ISENTO") {
                formik.setFieldValue("pessoa.pessoaFisica.inscricaoEstadual", "ISENTO")
              } else {
                formik.setFieldValue("pessoa.pessoaFisica.inscricaoEstadual", "")
              }
          },
          onBlur: formik.handleBlur,
          validate: (value) => {
            if (!value && formik.values.pessoa?.nacionalidade?.nacionalidade?.includes("BRASIL")) return jQuery.i18n.prop('label.campo.obrigatorio');
            return '';
          },
          error: formik.touched?.pessoa?.pessoaFisica?.regimeTributarioIcms && Boolean(formik.errors?.['pessoa.pessoaFisica.regimeTributarioIcms']),
          helperText: formik.touched?.pessoa?.pessoaFisica?.regimeTributarioIcms && formik.errors?.['pessoa.pessoaFisica.regimeTributarioIcms'],
        },
        {
          type: 'inputTextOrNumber',
          paisHomologado: "Brasil",
          condition: formik.values.pessoa?.nacionalidade?.nacionalidade?.includes("BRASIL"),
          xs: 6,
          sm: 4,
          md: 4,
          lg: 4,
          className: "text-field",
          fullWidth: true,
          disabled: !(formik.values.pessoa?.pessoaFisica?.regimeTributarioIcms === "CONTRIBUINTE"),
          id: "",
          inputProps: {
            "id-robot": "drawer-cadastroPessoa-inscricaoEstadual",
          },
          name: "pessoa.pessoaFisica.inscricaoEstadual",
          value: formik.values.pessoa?.pessoaFisica?.inscricaoEstadual,
          label: jQuery.i18n.prop('label.inscricao.estadual'),
          size: "small",
          onChange: (e) => formik.setFieldValue("pessoa.pessoaFisica.inscricaoEstadual", e?.target?.value),
          onInput: undefined,
          onBlur: formik.handleBlur,
        },
        {
          type: 'section',
          name: jQuery.i18n.prop('label.endereco'),
      },
      {
        type: 'infiniteScrollAutocomplete',
        xs: 6,
        sm: 4,
        md: 4,
        lg: 4,
        className: "",
        freeSolo: false,
        id: undefined,
        inputProps: {
          "id-robot": "drawer-cadastroPessoa-pais",
        },
        autoComplete: true,
        includeInputInList: true,
        filterSelectedOptions: true,
        size: "small",
        name: "endereco.cidade.unidadeFederativa.pais",
        value: formik.values.endereco?.cidade?.unidadeFederativa?.pais,
        TextField: {
            name: "endereco.cidade.unidadeFederativa.pais",
            label: jQuery.i18n.prop('menu.pais') + "*",
            size: "small",
            autoFocus: false,
            SelectProps: undefined,
        },
        onBlur: formik.handleBlur,
        getOptionLabel: (option) => option?.adicional || option?.nome || '',
        isOptionEqualToValue: (option, value) => option?.value === value?.id,
        onChange: (e, value) => {formik.setFieldValue("endereco.cidade.unidadeFederativa.pais", {
            codigoIbge: value?.codigoIbge,
            id: value?.value || '',
            nome: value?.adicional
          })
        },
        fetchFunction: get,
        getUrl: (term) => `/tecnico/pais/findAutoCompleteNacionalidadeComCodigoIbgeEMercosul?term=${term || ''}`,
        initialOptions: (term) => get(`/tecnico/pais/findAutoCompleteNacionalidadeComCodigoIbgeEMercosul?term=${term || ''}&pagina=0`),
        renderOptions: (props, option) => (
          <MenuItem {...props} sx={{ whiteSpace: 'wrap' }}>
              <ListItemText primary={option?.adicional} />
          </MenuItem>
        ),
        validate: (value) => {
          if (!value) return jQuery.i18n.prop('label.campo.obrigatorio');
          return '';
        },
        error: Boolean(formik.touched?.endereco?.cidade?.unidadeFederativa?.pais) && Boolean(formik.errors?.['endereco.cidade.unidadeFederativa.pais']),
        helperText: Boolean(formik.touched?.endereco?.cidade?.unidadeFederativa?.pais) && formik.errors?.['endereco.cidade.unidadeFederativa.pais'],
      },
      {
        type: 'inputTextWithButtonInside',
        paisHomologado: "Brasil",
        condition: formik.values.endereco?.cidade?.unidadeFederativa?.pais?.nome?.includes("BRASIL"),
        xs: 6,
        sm: 4,
        md: 4,
        lg: 4,
        className: "text-field",
        fullWidth: true,
        disabled: false,
        id: undefined,
        inputProps: {
          "id-robot": "drawer-cadastroPessoa-cep",
        },
        name: "endereco.cep",
        value: formik.values.endereco?.cep,
        label: jQuery.i18n.prop('label.cep') + "*",
        size: "small",
        iconActionBtn: async () => {
          try {
            const dataCep = await get(`https://viacep.com.br/ws/${formik.values.endereco?.cep}/json/`)
            if(dataCep) {
              const { logradouro, complemento, bairro, localidade, uf } = dataCep
              let cidadeLocalidade
              try {
                cidadeLocalidade = await get(`/cidade/findByPaisAutocomplete?term=${localidade}&idPais=${30}&pagina=0`)
              } catch (error) {
                console.log(error)
              }
              formik.setFieldValue('endereco', {
                ...formik.values.endereco,
                cidade: {
                  unidadeFederativa: {
                    pais: formik.values.endereco?.cidade?.unidadeFederativa?.pais || "",
                  },
                  id: cidadeLocalidade[0]?.value || '',
                  nome: cidadeLocalidade[0]?.label || ''
                },
                logradouro,
                bairro,
                complemento
              })
            }
          } catch (error) {
            console.log(error)
          }
        },
        onInput: undefined,
        onChange: (e) => formik.setFieldValue('endereco.cep', e?.target?.value.replace(/[-.]/g, "")),
        onBlur: formik.handleBlur,
        validate: (value) => {
          if (!value) return jQuery.i18n.prop('label.campo.obrigatorio');
          return '';
        },
        error: formik.touched?.endereco?.cep && Boolean(formik.errors?.['endereco.cep']),
        helperText: formik.touched?.endereco?.cep && formik.errors?.['endereco.cep'],
      },
      {
        type: 'select',
        paisHomologado: "Brasil",
        condition: formik.values.endereco?.cidade?.unidadeFederativa?.pais?.nome?.includes("BRASIL"),
        xs: 6,
        sm: 4,
        md: 4,
        lg: 4,        
        id: "",
        className: "text-field",
        fullWidth: true,
        name: "endereco.logradouroTipo",
        inputProps: {
          "id-robot": "drawer-cadastroPessoa-logradouroTipo",
        },
        value: formik.values.endereco?.logradouroTipo,
        label: jQuery.i18n.prop('label.tipo') + '*',
        size: "small",
        options: [
          {value: "ALM", label:"Alameda"},
          {value: "AVN", label:"Avenida"},
          {value: "BEC", label:"Beco"},
          {value: "FAV", label:"Favela"},
          {value: "JRD", label:"Jardim"},
          {value: "LAD", label:"Ladeira"},
          {value: "LRG", label:"Largo"},
          {value: "MRR", label:"Morro"},
          {value: "PQE", label:"Parque"},
          {value: "ROD", label:"Rodovia"},
          {value: "RUA", label:"Rua"},
          {value: "SRV", label: jQuery.i18n.prop('label.servidao')},
          {value: "TRV", label:"Travessia"},
          {value: "VIA", label:"Via"},
          {value: "VIL", label:"Vila"},
          {value: "OUT", label:"Outros"},
        ],
        onChange: (e) => formik.setFieldValue("endereco.logradouroTipo", e.target.value),
        onBlur: formik.handleBlur,
        validate: (value) => {
          if (!value) return jQuery.i18n.prop('label.campo.obrigatorio');
          return '';
        },
        error: formik.touched?.endereco?.logradouroTipo && Boolean(formik.errors?.['endereco.logradouroTipo']),
        helperText: formik.touched?.endereco?.logradouroTipo && formik.errors?.['endereco.logradouroTipo'],
      },
      {
        type: 'inputTextOrNumber',
        paisHomologado: "Brasil",
        condition: formik.values.endereco?.cidade?.unidadeFederativa?.pais?.nome?.includes("BRASIL"),
        xs: 6,
        sm: 6,
        md: 6,
        lg: 6,
        className: "text-field",
        fullWidth: true,
        disabled: false,
        id: "",
        inputProps: {
          "id-robot": "drawer-cadastroPessoa-logradouro",
        },
        name: "endereco.logradouro",
        value: formik.values.endereco?.logradouro,
        label: jQuery.i18n.prop('label.logradouro') + "*",
        size: "small",
        onInput: undefined,
        onChange: (e) => formik.setFieldValue("endereco.logradouro", e?.target?.value),
        onBlur: formik.handleBlur,
        validate: (value) => {
          if (!value) return jQuery.i18n.prop('label.campo.obrigatorio');
          return '';
        },
        error: formik.touched?.endereco?.logradouro && Boolean(formik.errors?.['endereco.logradouro']),
        helperText: formik.touched?.endereco?.logradouro && formik.errors?.['endereco.logradouro'],
      },
      {
        type: 'inputTextOrNumber',
        paisHomologado: "Brasil",
        condition: formik.values.endereco?.cidade?.unidadeFederativa?.pais?.nome?.includes("BRASIL"),
        xs: 6,
        sm: 2,
        md: 2,
        lg: 2,
        className: "text-field",
        fullWidth: true,
        disabled: false,
        id: "",
        inputProps: {
          "id-robot": "drawer-cadastroPessoa-numero",
        },
        name: "endereco.numero",
        value: formik.values.endereco?.numero,
        label: jQuery.i18n.prop('label.numero'),
        size: "small",
        onInput: (e) => e.target.value = e.target.value.replace(/[^0-9.-]/g, ''),
        onChange: (e) => formik.setFieldValue("endereco.numero", e?.target?.value),
        onBlur: formik.handleBlur,
      },
      {
        type: 'inputTextOrNumber',
        condition: paisHomologado.nome?.toUpperCase() !== "BRASIL" || 
          formik.values.endereco?.cidade?.unidadeFederativa?.pais?.id && 
            formik.values.endereco?.cidade?.unidadeFederativa?.pais?.id !== "30" || 
              false,
        xs: 6,
        sm: 8,
        md: 8,
        lg: 8,
        className: "text-field",
        fullWidth: true,
        disabled: false,
        id: "",
        inputProps: {
          "id-robot": "drawer-cadastroPessoa-endereco1",
        },
        name: "endereco.logradouro",
        value: formik.values.endereco?.logradouro,
        label: jQuery.i18n.prop('label.endereco1') + "*",
        size: "small",
        onInput: undefined,
        onChange: (e) => formik.setFieldValue("endereco.logradouro", e?.target?.value),
        onBlur: formik.handleBlur,
        validate: (value) => {
          if (!value) return jQuery.i18n.prop('label.campo.obrigatorio');
          return '';
        },
        error: formik.touched?.endereco?.logradouro && Boolean(formik.errors?.['endereco.logradouro']),
        helperText: formik.touched?.endereco?.logradouro && formik.errors?.['endereco.logradouro'],
      },
      {
        type: 'inputTextOrNumber',
        xs: 6,
        sm: 4,
        md: 4,
        lg: 4,
        className: "text-field",
        fullWidth: true,
        disabled: false,
        id: "",
        name: "endereco.bairro",
        inputProps: {
          "id-robot": "drawer-cadastroPessoa-bairro",
        },
        value: formik.values.endereco?.bairro,
        label: jQuery.i18n.prop('label.bairro') + "*",
        size: "small",
        onInput: undefined,
        onChange: (e) => formik.setFieldValue("endereco.bairro", e?.target?.value),
        onBlur: formik.handleBlur,
        validate: (value) => {
          if (!value) return jQuery.i18n.prop('label.campo.obrigatorio');
          return '';
        },
        error: formik.touched?.endereco?.bairro && Boolean(formik.errors?.['endereco.bairro']),
        helperText: formik.touched?.endereco?.bairro && formik.errors?.['endereco.bairro'],
      },
      {
        type: 'autocompleteUsar',
        condition: paisHomologado.nome?.toUpperCase() !== "BRASIL" || 
          formik.values.endereco?.cidade?.unidadeFederativa?.pais?.id && 
            formik.values.endereco?.cidade?.unidadeFederativa?.pais?.id !== "30" || 
              false,
        xs: 6,
        sm: 4,
        md: 4,
        lg: 4,
        inputProps: {
          "id-robot": "drawer-cadastroPessoa-estadoprovincia",
        },
        className: "",
        freeSolo: false,
        id: undefined,
        name: "endereco.cidade.unidadeFederativa.nome",
        autoComplete: true,
        includeInputInList: true,
        filterSelectedOptions: true,
        size: "small",
        value: formik.values.endereco?.cidade?.unidadeFederativa?.nome || '',
        TextField: {
            name: "endereco.cidade.unidadeFederativa.nome",
            label: jQuery.i18n.prop('label.estadoprovincia') + "*",
            size: "small",
            autoFocus: false,
            SelectProps: undefined,
        },
        onBlur: formik.handleBlur,
        isOptionEqualToValue: (option, value) => option && option?.label == value || "",
        onChange: (e, value) => {
          formik.setFieldValue("endereco.cidade.unidadeFederativa", {
            pais: formik.values.endereco?.cidade?.unidadeFederativa?.pais || "",
            id: value?.value || '',
            nome: value?.label || value,
          })
        },
        dependencyValueToUpdate: formik.values.endereco?.cidade?.unidadeFederativa?.pais?.id,
        initialOptions: (term) => {
          const idPais = formik.values.endereco?.cidade?.unidadeFederativa?.pais?.id
          return get(`/unidadeFederativa/findByPaisAutocomplete?term=${term || ''}&idPais=${idPais || 30}`)
        },
        error: formik.touched?.endereco?.cidade?.unidadeFederativa?.nome && Boolean(formik.errors?.['endereco.cidade.unidadeFederativa.nome']),
        helperText: formik.touched?.endereco?.cidade?.unidadeFederativa?.nome && formik.errors?.['endereco.cidade.unidadeFederativa.nome'],
      },
      {
        type: 'autocompleteUsar',
        condition: paisHomologado.nome?.toUpperCase() !== "BRASIL" || 
          formik.values.endereco?.cidade?.unidadeFederativa?.pais?.id && 
            formik.values.endereco?.cidade?.unidadeFederativa?.pais?.id !== "30" || 
              false,
        xs: 6,
        sm: 4,
        md: 4,
        lg: 4,
        inputProps: {
          "id-robot": "drawer-cadastroPessoa-cidade",
        },
        className: "",
        freeSolo: false,
        id: undefined,
        name: "endereco.cidade.nome",
        autoComplete: true,
        includeInputInList: true,
        filterSelectedOptions: true,
        size: "small",
        value: formik.values.endereco?.cidade?.nome || '',
        TextField: {
            name: "endereco.cidade.nome",
            label: jQuery.i18n.prop('menu.cidade') + "*",
            size: "small",
            autoFocus: false,
            SelectProps: undefined,
        },
        onBlur: formik.handleBlur,
        onChange: (e, value) => {
          formik.setFieldValue("endereco.cidade", {
            unidadeFederativa: {
              pais: formik.values.endereco?.cidade?.unidadeFederativa?.pais || "",
              id: formik.values.endereco?.cidade?.unidadeFederativa?.id,
              nome: formik.values.endereco?.cidade?.unidadeFederativa?.nome,
            },
            id: value?.value || '',
            nome: value?.label || value
          })
        },
        initialOptions: (term) => {
          const idPais = formik.values.endereco?.cidade?.unidadeFederativa?.pais?.id
          return get(`/cidade/findByPaisAutocomplete?term=${term || ''}&idPais=${idPais || ''}`) || []
        },
        dependencyValueToUpdate: formik.values.endereco?.cidade?.unidadeFederativa?.nome,
        validate: (value) => {
          if (!value) return jQuery.i18n.prop('label.campo.obrigatorio');
          return '';
        },
        error: formik.touched?.endereco?.cidade?.nome && Boolean(formik.errors?.['endereco.cidade.nome']),
        helperText: formik.touched?.endereco?.cidade?.nome && formik.errors?.['endereco.cidade.nome'],
      },
      {
        type: 'inputTextOrNumber',
        condition: paisHomologado.nome?.toUpperCase() !== "BRASIL" || 
          formik.values.endereco?.cidade?.unidadeFederativa?.pais?.id && 
            formik.values.endereco?.cidade?.unidadeFederativa?.pais?.id !== "30" || 
              false,
        xs: 6,
        sm: 4,
        md: 4,
        lg: 4,
        className: "text-field",
        fullWidth: true,
        disabled: false,
        id: "",
        inputProps: {
          "id-robot": "drawer-cadastroPessoa-codigo-postal",
        },
        name: "endereco.caixaPostal",
        value: formik.values.endereco?.caixaPostal || '',
        label: jQuery.i18n.prop('label.codigopostal'),
        size: "small",
        onInput: (e) => e.target.value = e.target.value.replace(/[^0-9]/g, ''),
        onChange: (e) => formik.setFieldValue("endereco.caixaPostal", e?.target?.value),
        onBlur: formik.handleBlur,
      },
      {
        type: 'infiniteScrollAutocomplete',
        condition: formik.values.endereco?.cidade?.unidadeFederativa?.pais?.nome?.includes("BRASIL"),
        xs: 12,
        sm: 4,
        md: 4,
        lg: 4,
        inputProps: {
          "id-robot": "drawer-cadastroPessoa-cidade",
        },
        className: "",
        freeSolo: false,
        id: undefined,
        name: "endereco.cidade.nome",
        autoComplete: true,
        includeInputInList: true,
        filterSelectedOptions: true,
        size: "small",
        value: formik.values.endereco?.cidade?.nome || '',
        TextField: {
            name: "endereco.cidade.nome",
            label: jQuery.i18n.prop('menu.cidade') + "*",
            size: "small",
            autoFocus: false,
            SelectProps: undefined,
        },
        onBlur: formik.handleBlur,
        onChange: (e, value) => {
          formik.setFieldValue("endereco.cidade", {
            unidadeFederativa: {
              pais: formik.values.endereco?.cidade?.unidadeFederativa?.pais || "",
            },
            id: value?.value || '',
            nome: value?.label || ''
          })
        },
        fetchFunction: get,
        getUrl: (term) => {
          const idPais = formik.values.endereco?.cidade?.unidadeFederativa?.pais.id
          return `/cidade/findByPaisAutocomplete?term=${term || ''}&idPais=${idPais || 30}`
        },
        initialOptions: (term) => {
          const idPais = formik.values.endereco?.cidade?.unidadeFederativa?.pais?.id
          return get(`/cidade/findByPaisAutocomplete?term=${term || ''}&idPais=${idPais || 30}&pagina=0`) || []
        },
        dependencyValueToUpdate: formik.values.endereco?.cidade?.unidadeFederativa?.pais?.id,
        validate: (value) => {
          if (!value) return jQuery.i18n.prop('label.campo.obrigatorio');
          return '';
        },
        error: formik.touched?.endereco?.cidade?.nome && Boolean(formik.errors?.['endereco.cidade.nome']),
        helperText: formik.touched?.endereco?.cidade?.nome && formik.errors?.['endereco.cidade.nome'],
      },
      {
        type: 'inputTextOrNumber',
        condition: formik.values.endereco?.cidade?.unidadeFederativa?.pais?.nome?.includes("BRASIL"),
        xs: 12,
        sm: 8,
        md: 8,
        lg: 8,
        className: "text-field",
        fullWidth: true,
        disabled: false,
        id: "",
        inputProps: {
          "id-robot": "drawer-cadastroPessoa-complemento",
        },
        name: "endereco.complemento",
        value: formik.values.endereco?.complemento || '',
        label: jQuery.i18n.prop('label.complemento'),
        size: "small",
        onInput: undefined,
        onChange: (e) => formik.setFieldValue("endereco.complemento", e?.target?.value),
        onBlur: formik.handleBlur,
      },
      
      {
        type: 'section',
        name: jQuery.i18n.prop('label.contato'),
      }, 
      {
        type: 'inputTextOrNumber',
        xs: 6,
        sm: 6,
        md: 6,
        lg: 6,
        className: "text-field",
        fullWidth: true,
        disabled: false,
        id: "",
        inputProps: {
          "id-robot": "drawer-cadastroPessoa-contatoNome",
        },
        name: "contato.nome",
        value: formik.values.contato?.nome || '' || '',
        label: jQuery.i18n.prop('label.nome.contato') + "*",
        size: "small",
        onInput: undefined,
        onChange: (e) => formik.setFieldValue("contato.nome", e?.target?.value),
        onBlur: formik.handleBlur,
        validate: (value) => {
          if (!value) return jQuery.i18n.prop('label.campo.obrigatorio');
          return '';
        },
        error: formik.touched?.contato?.nome && Boolean(formik.errors?.['contato.nome']),
        helperText: formik.touched?.contato?.nome && formik.errors?.['contato.nome'],
      },
      {
        type: 'inputTextOrNumber',
        xs: 6,
        sm: 6,
        md: 6,
        lg: 6,
        className: "text-field",
        fullWidth: true,
        disabled: false,
        id: "",
        inputProps: {
          "id-robot": "drawer-cadastroPessoa-contatoEmail",
        },
        name: "contato.email",
        value: formik.values.contato?.email,
        label: jQuery.i18n.prop('label.email'),
        size: "small",
        onChange: (e) => formik.setFieldValue("contato.email", e?.target?.value),
        onBlur: formik.handleBlur,
      },
      {
        type: 'select',
        xs: 6,
        sm: 6,
        md: 6,
        lg: 6,        
        id: "",
        className: "text-field",
        fullWidth: true,
        inputProps: {
          "id-robot": "drawer-cadastroPessoa-tipoTelefone",
        },
        name: "contato.telefonesTransient[0].tipo",
        value: formik.values.contato?.telefonesTransient[0]?.tipo || "",
        label: jQuery.i18n.prop('label.tipo.telefone') + '*',
        size: "small",
        options: [
          {value: "CELULAR", label: jQuery.i18n.prop('label.celular')},
          {value: "COMERCIAL", label: jQuery.i18n.prop('label.comercial')},
          {value: "RESIDENCIAL", label: jQuery.i18n.prop('label.residencial')},
          {value: "FAX", label: jQuery.i18n.prop('label.fax')},
          {value: "OUTRO", label: jQuery.i18n.prop('label.outro')},
        ],
        onChange: (e) => formik.setFieldValue("contato.telefonesTransient", [
          {
            tipo: e?.target?.value,
            numero: formik.values.contato?.telefonesTransient[0]?.numero || ""
          }
        ]),
        onBlur: formik.handleBlur,
      },
      {
        type: 'inputTextOrNumber',
        xs: 6,
        sm: 6,
        md: 6,
        lg: 6,
        className: "text-field",
        fullWidth: true,
        disabled: false,
        id: "",
        inputProps: {
          "id-robot": "drawer-cadastroPessoa-contatoNumero",
        },
        name: "contato.telefonesTransient[0].numero",
        value: formik.values.contato?.telefonesTransient[0]?.numero || "",
        label: jQuery.i18n.prop('label.numero') + "*",
        size: "small",
        onInput: (e) => e.target.value = e.target.value.replace(/[^0-9]/g, ''),
        onChange: (e) => formik.setFieldValue("contato.telefonesTransient", [
          {
            tipo: formik.values.contato?.telefonesTransient[0]?.tipo || "",
            numero: e?.target?.value
          }
        ]),
        onBlur: formik.handleBlur,
      },
      {
        type: 'section',
        name: jQuery.i18n.prop('label.complemento'),
      },
      {
        type: 'select',
        xs: 6,
        sm: 6,
        md: 6,
        lg: 6,        
        id: "",
        className: "text-field",
        fullWidth: true,
        inputProps: {
          "id-robot": "drawer-cadastroPessoa-idiomaSistema",
        },
        name: "pessoa.idiomaSistema",
        value: formik.values.pessoa?.idiomaSistema,
        label: jQuery.i18n.prop('label.idioma.sistema'),
        size: "small",
        options: [
          {value: "PT", label: jQuery.i18n.prop('label.portugues')},
          {value: "EN", label: jQuery.i18n.prop('label.ingles')},
          {value: "ES", label: jQuery.i18n.prop('label.espanhol')},
        ],
        onChange: (e) => formik.setFieldValue("pessoa.idiomaSistema", e.target.value),
        onBlur: formik.handleBlur,
      },
      {
        type: 'inputTextOrNumber',
        xs: 6,
        sm: 6,
        md: 6,
        lg: 6,
        className: "text-field",
        fullWidth: true,
        disabled: false,
        id: "",
        inputProps: {
          "id-robot": "drawer-cadastroPessoa-membership",
        },
        name: "pessoa.pessoaFisica.membership",
        value: formik.values.pessoa?.pessoaFisica?.membership,
        label: jQuery.i18n.prop('label.membership'),
        size: "small",
        onInput: undefined,
        onChange: (e) => formik.setFieldValue("pessoa.pessoaFisica.membership", e?.target?.value),
        onBlur: formik.handleBlur,
      },
      {
        type: 'inputTextOrNumber',
        paisHomologado: "Portugal",
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
        className: "text-field",
        fullWidth: true,
        disabled: false,
        id: "",
        inputProps: {
          "id-robot": "drawer-cadastroPessoa-nif",
        },
        name: "pessoa.nif",
        value: formik.values.pessoa?.nif,
        label: jQuery.i18n.prop('label.nif'),
        size: "small",
        helperText: jQuery.i18n.prop('helper.nif'),
        onInput: undefined,
        onChange: (e) => formik.setFieldValue("pessoa.nif", e?.target?.value),
        onBlur: formik.handleBlur,
      },
      {
        type: 'textArea',
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
        disabled: false,
        id: "",
        inputProps: {
          "id-robot": "drawer-cadastroPessoa-observacao",
        },
        name: "pessoa.observacao",
        value: formik.values.pessoa?.observacao,
        placeholder: jQuery.i18n.prop('label.observacao'),
        size: "small",
        onInput: undefined,
        onChange: (e) => formik.setFieldValue("pessoa.observacao", e?.target?.value),
        onBlur: formik.handleBlur,
      },

      //ANEXOS ========================
      {
        type: 'fileUpload',
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
        disabled: false,
        id: "",
        inputProps: {
          "id-robot": "drawer-cadastroPessoa-fileUpload",
        },
        name: "anexos",
        value: formik.values.anexos,
        label: jQuery.i18n.prop('label.novo'),
        color: "primary",
        loading: window && window.inputAnexos || 0,
        onChange: async (event) => {
          if(event && typeof event === 'string') {
            const removeFile = formik.values.anexos?.filter(file => file.arquivo !== event)
            formik.setFieldValue("anexos", removeFile)
            return
          } else {
            const uploadedFiles = Array.from(event?.target?.files || [])
            const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB em bytes
            let alert = ''

            uploadedFiles.forEach((file) => {
              if(file.size > MAX_FILE_SIZE) {
                alert = jQuery.i18n.prop('erro.arquivos.tamanho.maximo', file.name)
                return
              } 
            });

            if (alert) {
              setStateSnack((stateSnack) => { 
                return {...stateSnack, open: true, message: alert }
              });
              return
            } else {
              setStateSnack((stateSnack) => { 
                return {...stateSnack, open: false, message: '' }
              });
            }
            
            const processFile = (file) => {
              return new Promise((resolve, reject) => {
                let tipo
                if(file.type.includes("text")) {
                  tipo = jQuery.i18n.prop('label.documento').toUpperCase()
                } else if(file.type.includes("image")) {
                  tipo = jQuery.i18n.prop('label.foto').toUpperCase()
                } else if (file.type.includes("application")) {
                  tipo = jQuery.i18n.prop('label.outro').toUpperCase()
                }
                
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                  const base64String = reader.result;
                  const newFile = {
                    arquivo: file.name,
                    tamanho: Math.floor((file.size / 1024).toFixed(2)),
                    tipo,
                    descricao: "",
                    fileStringBase64: base64String.replace(`data:${file.type};base64,`, ''),
                    hash: "",
                    id: null,
                    imageWebcam: "",
                    index: formik.values.anexos.length > 0 ? formik.values.anexos[formik.values.anexos.length - 1].index + 1 : 0,
                    situacao: "INICIAL",
                  };
                  resolve(newFile)
                };
                reader.onerror = reject
              });
            };
            
            try {
              const newFiles = await Promise.all(uploadedFiles.map(processFile))
              formik.setFieldValue("anexos", [...formik.values.anexos, ...newFiles])
            } catch (error) {
              console.error("Erro ao processar os arquivos:", error)
            }
          }
        }
      },
    ];

    return formFields
    
  }
