export const viagens = (formik) => {
    return [
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
        //...

        //...
      ]
}