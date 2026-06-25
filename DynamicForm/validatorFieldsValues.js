export const validateField = (name, value, validations) => {
  const validation = validations.find(val => val.name === name);
  //Executa a validação, mas antes verifica se a condição para exibição do campo está true, se não for, o campo está oculto
  return  validation?.condition !== false ? validation.validate?.(value) : '';
};

/**
 * @param {object} obj
 * @param {string} path
 * @returns {number, string, object, array} - valor da propriedade requerida
 */
export const getNestedFormikValue = (obj, path) => {
  const keys = path?.split('.');
  //Reduz o array para acessar a propriedade
  return keys?.reduce((acc, key) => acc && acc[key], obj) || null;
};
