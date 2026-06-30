import { dadosPessoais } from "./stepsMetadata/dadosPessoais";
import { observacoes } from "./stepsMetadata/obs";
import { viagens } from "./stepsMetadata/viagens";

export const stepFormMetadados = (formik) => {

  return [
    {
      step: 1,
      title: jQuery.i18n.prop('label.dados.pessoais'),
      fields: dadosPessoais(formik),
    },
    {
      step: 2,
      title: jQuery.i18n.prop('label.viagens'),
      fields: viagens(formik),
    },
    {
      step: 3,
      title: jQuery.i18n.prop('label.observacoes'),
      fields: observacoes(formik),
    },
  ];
};

