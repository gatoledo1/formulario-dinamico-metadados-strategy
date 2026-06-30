import React from 'react'
import { get } from '../../HttpUtils/FetchApi'
import { ListItemText, MenuItem } from '@mui/material'

export const stepFormMetadados = (formik) => {

  return [
    // ABA 1 - DADOS PESSOAIS
    {
      step: 1,
      title: jQuery.i18n.prop('label.dados.pessoais'),
      fields: [
        {
          type: 'section',
          name: jQuery.i18n.prop('label.dados.pessoais'),
          sectionMargin: "0",
          className: 'none',
          fontSize: "0.875rem"
        },
        {
          type: 'inputTextOrNumber',
          xs: 12,
          sm: 8,
          md: 8,
          lg: 8,
          className: 'text-field',
          fullWidth: true,
          id: 'nome',
          name: 'nome',
          disabled: true,
          autoFocus: true,
          value: formik.values?.nome || '',
          label: jQuery.i18n.prop('label.nome.completo'),
          size: 'small',
          inputProps: {
            'id-robot': 'nome',
            maxLength: 150,
          },
          onInput: undefined,
          onChange: (e) => {
            formik.setFieldValue('nome', e?.target?.value);
          },
        },
        {
          type: 'datepicker',
          xs: 6,
          sm: 4,
          md: 4,
          lg: 4,
          name: 'dataNascimento',
          label: jQuery.i18n.prop('label.data.nascimento') + '*',
          className: 'datepicker-wrapper',
          disablePast: false,
          readOnly: false,
          value: formik.values?.dataNascimento ? moment(formik.values?.dataNascimento, 'DD/MM/YYYY').toDate() : undefined,
          inputProps: {
            'id-robot': 'drawer-dataNascimento',
          },
          maxDate: () => moment().toDate(),
          onChange: (value) => {
            const valorFormatado = moment(value).format('DD/MM/YYYY');
            formik.setFieldValue(
              'dataNascimento',
              value ? valorFormatado : ''
            );
            formik.setFieldValue('idade', moment().diff(moment(valorFormatado, 'DD/MM/YYYY'), 'years'))

            const documento = validateDoc()
            //...
          },
          validate: (value) => {
            if (!value) return jQuery.i18n.prop('label.campo.obrigatorio');
            return '';
          },
          error: formik.touched?.dataNascimento && Boolean(formik.errors?.dataNascimento),
          helperText: formik.touched?.dataNascimento && formik.errors?.dataNascimento,
        },
        {
          type: 'infiniteScrollAutocomplete',
          xs: 6,
          sm: 4,
          md: 4,
          lg: 4,
          freeSolo: false,
          name: 'nacionalidade',
          autoComplete: true,
          includeInputInList: true,
          filterSelectedOptions: true,
          size: 'small',
          value: formik.values?.nacionalidade,
          TextField: {
            label: jQuery.i18n.prop('label.cadastro.nacionalidade') + '*',
            size: 'small',
            autoFocus: false,
            SelectProps: undefined,
          },
          inputProps: {
            'id-robot': 'nacionalidade',
          },
          getOptionLabel: (option) => option?.nome || option?.label || '',
          isOptionEqualToValue: (option, value) => option.value === value?.id,
          onChange: (e, value) =>
            formik.setFieldValue('nacionalidade', {
              id: value?.value || null,
              nome: value?.label || ''
            }),
          noOptionsText: jQuery.i18n.prop('label.registro.nao.encontrado'),
          fetchFunction: get,
          getUrl: (term) =>
            `/tecnico/pais?term=${term || ''}`,
          initialOptions: (term) =>
            get(
              `/tecnico/pais?term=${term || formik.values?.nacionalidade?.id || ''}&pagina=0`
          ),
          validate: (value) => {
            if (!value) return jQuery.i18n.prop('label.campo.obrigatorio');
            return '';
          },
          error: formik.touched?.nacionalidade && Boolean(formik.errors?.nacionalidade),
          helperText: formik.touched?.nacionalidade && formik.errors?.nacionalidade,
        },
        {
          type: 'inputTextOrNumber',
          condition: formik.values.nacionalidade && formik.values.nacionalidade?.nome?.includes('BRASIL'),
          xs: 6,
          sm: 4,
          md: 4,
          lg: 4,
          className: 'text-field',
          fullWidth: true,
          name: 'cpf',
          value: formatarDocumento(formik.values?.cpf) || formik.values?.cpf,
          label: jQuery.i18n.prop('label.cpf') + '*',
          size: 'small',
          inputProps: {
            'id-robot': 'cpf',
            maxLength: 14,
          },
          onInput: (e) => e.target.value = e.target.value.replace(/[^0-9]/g, ''),
          onChange: (e) => {
            formik.setFieldValue('cpf', e?.target?.value)
          },
          onBlur: (e) => {
            const formatedValue = formatarDocumento(e?.target?.value)
            formik.setFieldValue('cpf', formatedValue)
            const dataNascimento = formik.values?.dataNascimento
            const documento = validateDoc()
            //...
          },
          validate: (value) => {
            if (value && !validaCPF(value)) {
              return jQuery.i18n.prop('erro.CPF.invalido')
            }

            return ''
          },
          error: formik.touched?.cpf && Boolean(formik.errors?.['cpf']),
          helperText: formik.touched?.cpf && formik.errors?.['cpf'],
        },
        {
          type: 'inputTextOrNumber',
          condition: formik.values.nacionalidade
              && formik.values.nacionalidade?.nome?.includes("BRASIL")
              && formik.values?.idade < 18,
          xs: 6,
          sm: 4,
          md: 4,
          lg: 4,
          className: 'text-field',
          fullWidth: true,
          id: 'certidaoNascimento',
          name: 'certidaoNascimento',
          value: formik.values?.certidaoNascimento,
          label: jQuery.i18n.prop('label.cer-nasc'),
          size: 'small',
          inputProps: {
            'id-robot': 'certidao-nascimento',
            maxLength: 50,
          },
          onChange: formik.handleChange,
        },
        {
          type: 'section',
          name: jQuery.i18n.prop('label.complemento'),
          sectionMargin: "0",
          className: 'none',
          fontSize: "0.875rem"
        },
        {
          type: 'infiniteScrollAutocomplete',
          xs: 12,
          sm: 6,
          md: 6,
          lg: 6,
          freeSolo: false,
          id: undefined,
          inputProps: {
            'id-robot': 'profissao',
          },
          autoComplete: true,
          includeInputInList: true,
          filterSelectedOptions: true,
          size: 'small',
          name: 'profissao',
          value: formik.values?.profissao,
          TextField: {
            label: jQuery.i18n.prop('menu.profissao'),
            size: 'small',
            autoFocus: false,
            SelectProps: undefined,
          },
          getOptionLabel: (option) => option?.nome || option?.label || '',
          isOptionEqualToValue: (option, value) => option?.value === value?.id,
          onChange: (e, value) => {
            formik.setFieldValue('profissao', {
              id: value?.value,
              nome: value?.label
            })
          },
          noOptionsText: jQuery.i18n.prop('label.registro.nao.encontrado'),
          fetchFunction: get,
          getUrl: (term) => `/profissao/autocomplete?term=${term || ''}`,
          initialOptions: (term) => get(`/profissao/autocomplete?term=${term || ''}&pagina=0`),
        },
        {
          type: 'inputTextOrNumber',
          xs: 12,
          sm: 6,
          md: 6,
          lg: 6,
          className: 'text-field',
          fullWidth: true,
          disabled: false,
          inputProps: {
              'id-robot': 'email',
          },
          name: 'email',
          value: formik.values?.email,
          label: jQuery.i18n.prop('menu.email'),
          size: 'small',
          onChange: (e) => formik.setFieldValue('email', e?.target?.value),
          onBlur: formik.handleBlur,
        },
        {
          type: 'inputTextOrNumber',
          xs: 6,
          sm: 6,
          md: 6,
          lg: 6,
          className: 'text-field',
          fullWidth: true,
          disabled: false,
          inputProps: {
            'id-robot': 'foneCelular',
          },
          name: 'foneCelular',
          value: formik.values?.foneCelular || '',
          label: jQuery.i18n.prop('label.celular'),
          size: 'small',
          onInput: (e) => e.target.value = e.target.value.replace(/[^0-9]/g, ''),
          onChange: (e) => formik.setFieldValue('foneCelular', e?.target?.value),
          onBlur: formik.handleBlur,
        },
        {
          type: 'inputTextOrNumber',
          xs: 6,
          sm: 6,
          md: 6,
          lg: 6,
          className: 'text-field',
          fullWidth: true,
          disabled: false,
          inputProps: {
            'id-robot': 'foneFixo',
          },
          name: 'foneFixo',
          value: formik.values?.foneFixo || '',
          label: jQuery.i18n.prop('label.telefone.fixo'),
          size: 'small',
          onInput: (e) => e.target.value = e.target.value.replace(/[^0-9]/g, ''),
          onChange: (e) => formik.setFieldValue('foneFixo', e?.target?.value),
          onBlur: formik.handleBlur,
        },
        {
          type: 'section',
          name: jQuery.i18n.prop('label.endereco'),
          sectionMargin: '0',
          className: 'none',
          fontSize: '0.875rem'
        },
        {
          type: 'infiniteScrollAutocomplete',
          xs: 12,
          sm: 4,
          md: 4,
          lg: 4,
          inputProps: {
            'id-robot': 'FHRH-cidade-residencia',
          },
          freeSolo: false,
          name: 'cidadeResidencia.nome',
          autoComplete: true,
          includeInputInList: true,
          filterSelectedOptions: true,
          size: 'small',
          value: formik.values?.cidadeResidencia || '',
          TextField: {
            label: jQuery.i18n.prop('menu.cidade'),
            size: 'small',
            autoFocus: false,
            SelectProps: undefined,
          },
          onBlur: formik.handleBlur,
          getOptionLabel: (option) => option?.nome || option?.label || '',
          isOptionEqualToValue: (option, value) => option?.value === value?.id,
          onChange: (e, value) => {
            formik.setFieldValue('cidadeResidencia', {
              id: value?.value || '',
              nome: value?.label || value,
              unidadeFederativa: formik.values?.cidadeResidencia?.unidadeFederativa,
            })
          },
          noOptionsText: jQuery.i18n.prop('label.registro.nao.encontrado'),
          fetchFunction: get,
          getUrl: (term) => {
            const idUf = formik.values?.cidadeResidencia?.unidadeFederativa?.id
            return `/cidade/findByUnidadeFederativaAutocomplete?term=${term || ''}&idUf=${idUf}`
          },
          initialOptions: (term) => {
            const idUf = formik.values?.cidadeResidencia?.unidadeFederativa?.id
            return idUf ? get(`/cidade/findByUnidadeFederativaAutocomplete?term=${term || ''}&idUf=${idUf}&pagina=0`) : null
          },
          renderOptions: (props, option) => (
              <MenuItem {...props} sx={{ whiteSpace: 'wrap' }}>
                <ListItemText primary={option?.adicional} />
              </MenuItem>
          ),
          dependencyValueToUpdate: formik.values?.cidadeResidencia?.unidadeFederativa,
        },
        {
          type: 'inputTextWithButtonInside',
          condition: formik.values.cidadeResidencia?.unidadeFederativa?.pais?.nome !== '' 
            && formik.values.cidadeResidencia?.unidadeFederativa?.pais?.nome?.includes('BRASIL'),
          xs: 12,
          sm: 4,
          md: 4,
          lg: 4,
          className: 'text-field',
          fullWidth: true,
          disabled: false,
          inputProps: {
            'id-robot': 'cep',
          },
          name: 'cep',
          value: formik.values?.cep,
          label: jQuery.i18n.prop('label.cep') + '*',
          size: 'small',
          iconActionBtn: async () => {
            try {
              const dataCep = await get(`https://viacep.com.br/ws/${formik.values?.cep}/json/`)
              if (dataCep) {
                const { logradouro, complemento, bairro, localidade, uf } = dataCep
                try {
                  let cidadeResidencia = await get(`/cidade/findCidadeByNomeAndUf?cidade=${localidade}&uf=${uf}&pagina=0`)

                  formik.setValues({
                    ...formik.values,
                    cidadeResidencia: cidadeResidencia,
                    logradouro: logradouro,
                    complemento: complemento,
                    bairro: bairro
                  })

                } catch (error) {
                  console.log(error)
                }
              }
            } catch (error) {
              console.log(error)
            }
          },
          onInput: (e) => e.target.value = e.target.value.replace(/[^0-9]/g, ''),
          onChange: (e) => formik.setFieldValue('cep', e?.target?.value.replace(/[-.]/g, '')),
          validate: (value) => {
            if (!value) return jQuery.i18n.prop('label.campo.obrigatorio');
            return '';
          },
          error: formik.touched?.cep && Boolean(formik.errors?.cep),
          helperText: formik.touched?.cep && formik.errors?.cep,
        },
        {
          type: 'inputTextOrNumber',
          condition: formik.values.cidadeResidencia?.unidadeFederativa?.pais?.nome !== '' &&
            formik.values.cidadeResidencia?.unidadeFederativa?.pais?.nome !== 'BRASIL',
          xs: 12,
          sm: 4,
          md: 4,
          lg: 4,
          className: 'text-field',
          fullWidth: true,
          inputProps: {
            'id-robot': 'codigo-postal',
          },
          name: 'codigoPostal',
          value: formik.values?.cep || '',
          label: jQuery.i18n.prop('label.codigopostal'),
          size: 'small',
          onInput: (e) => e.target.value = e.target.value.replace(/[^0-9]/g, ''),
          onChange: (e) => formik.setFieldValue('cep', e?.target?.value.replace(/[-.]/g, '')),
        },
        {
          type: 'inputTextOrNumber',
          condition: formik.values.cidadeResidencia?.unidadeFederativa?.pais?.nome !== '' 
            && formik.values.cidadeResidencia?.unidadeFederativa?.pais?.nome?.includes('BRASIL'),
          xs: 12,
          sm: 4,
          md: 4,
          lg: 4,
          className: 'text-field',
          fullWidth: true,
          disabled: false,
          inputProps: {
            'id-robot': 'logradouro',
          },
          name: 'logradouro',
          value: formik.values?.logradouro,
          label: jQuery.i18n.prop('label.logradouro'),
          size: 'small',
          onChange: (e) => formik.setFieldValue('logradouro', e?.target?.value),
          onBlur: formik.handleBlur,
        },
        {
          type: 'inputTextOrNumber',
          condition: formik.values.cidadeResidencia?.unidadeFederativa?.pais?.nome !== '' 
            && formik.values.cidadeResidencia?.unidadeFederativa?.pais?.nome?.includes("BRASIL"),
          xs: 12,
          sm: 4,
          md: 2,
          lg: 2,
          className: 'text-field',
          fullWidth: true,
          disabled: false,
          inputProps: {
            'id-robot': 'numero',
          },
          name: 'numero',
          value: formik.values?.numero || '',
          label: jQuery.i18n.prop('label.numero.extenso'),
          size: 'small',
          onInput: (e) => e.target.value = e.target.value.replace(/[^0-9]/g, ''),
          onChange: (e) => formik.setFieldValue('numero', e?.target?.value),
        },
        {
          type: 'inputTextOrNumber',
          condition: formik.values.cidadeResidencia?.unidadeFederativa?.pais?.nome !== '' &&
            formik.values.cidadeResidencia?.unidadeFederativa?.pais?.nome !== 'BRASIL',
          xs: 12,
          sm: 12,
          md: 12,
          lg: 12,
          className: 'text-field',
          fullWidth: true,
          inputProps: {
            'id-robot': 'endereco2',
          },
          name: 'endereco2',
          value: formik.values.complemento,
          label: jQuery.i18n.prop('label.endereco2'),
          size: 'small',
          onChange: (e) => formik.setFieldValue('complemento', e?.target?.value),
          onBlur: formik.handleBlur,
        },
      ],
    },

    // ABA 2 - VIAGENS
    {
      step: 2,
      title: jQuery.i18n.prop('label.viagens'),
      fields: [
          //Motivo da Viagem
        {
          type: 'section',
          name: jQuery.i18n.prop('label.motivo.viagem'),
          sectionMargin: "0",
          className: 'none',
          fontSize: '0.875rem'
        },
        {
          type: 'select',
          xs: 6,
          sm: 4,
          md: 4,
          lg: 4,
          name: 'meioTransporte',
          className: 'text-field',
          fullWidth: true,
          inputProps: {
            'id-robot': 'meio-transporte',
          },
          value: formik.values?.meioTransporte,
          label: jQuery.i18n.prop('label.meio.transporte'),
          size: 'small',
          hideSelecione: true,
          options: [
            { value: 'AVIAO', label: jQuery.i18n.prop('label.aviao') },
            { value: 'AUTOMOVEL', label: jQuery.i18n.prop('label.automovel') },
            { value: 'ONIBUS', label: jQuery.i18n.prop('label.onibus') },
            { value: 'OUTRO', label: jQuery.i18n.prop('label.outro') },
          ],
          onChange: (e) => formik.setFieldValue('meioTransporte', e.target.value)
        },
      ],
    },

    // ABA 3 - OBSERVAES
    {
      step: 3,
      title: jQuery.i18n.prop('label.observacoes'),
      fields: [
        {
            type: 'section',
            name: jQuery.i18n.prop('label.observacoes'),
            sectionMargin: "0",
            className: 'none',
            fontSize: "0.875rem"
          },
        {
            type: 'textArea',
            xs: 12,
            sm: 12,
            md: 12,
            lg: 12,
            id: "observacao",
            inputProps: {
              "id-robot": "observacao",
            },
            name: 'observacao',
            value: formik.values?.observacao,
            label: jQuery.i18n.prop('label.observacoes'),
            size: "small",
            onInput: undefined,
            minRows: 3,
            onChange: (e) => formik.setFieldValue('observacao', e?.target?.value),
            onBlur: formik.handleBlur,
          },
      ],
    },
  ];
};

