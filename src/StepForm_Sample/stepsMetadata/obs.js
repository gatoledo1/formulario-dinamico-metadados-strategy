export const observacoes = (formik) => {
    return [
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
          //...

          //...
      ]
}