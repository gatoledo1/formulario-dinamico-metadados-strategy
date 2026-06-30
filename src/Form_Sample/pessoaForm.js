import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { metaPessoaFormik } from './formikMetadado';
import {
  Alert,
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Snackbar,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import DynamicForm from '../form/DynamicForm';
import { inputsMetadado } from './inputsMetadado';
import { getNestedFormikValue, validateField } from '../form/DynamicForm/validatorFieldsValue';
import { get } from '../HttpUtils/FetchApi';

const PessoaForm = ({ closeModal, inputValue = undefined }) => {
  //Uso geral para todos os formularios com metadado
  const [stateSnack, setStateSnack] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    severity: 'warning',
    message: '',
    status: '200'
  })
  const errors = {};
  const formik = useFormik({
    ...metaPessoaFormik(closeModal, setStateSnack, stateSnack),
    validate: (values) => {
      inputsMetadado(formik).forEach((field) => {
        const error = validateField(field.name, getNestedFormikValue(values, field.name), inputsMetadado(formik));
        if (error) {
          errors[field.name] = error;
        }
      });

      console.log(errors)
      return errors;
    },
  });

  const scrollToError = () => {
    if(errors) {
      const keys = Object.keys(errors)
      const inputDOM = document?.querySelector(`[name='${keys[0]}']`)
        inputDOM?.focus()
        inputDOM?.scrollIntoView(true, { block: "nearest", behavior: 'smooth' });
    }
  }

  // --Fim uso geral--


  // Especifico para este componente
  const [tab, setTab] = useState(0);

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
        return
    }
    setStateSnack({ ...stateSnack, open: false })
}

  const arrayFormData = inputsMetadado(formik, setStateSnack);
  const arrayFormData2 = [];

  useEffect(() => {
    formik.setFieldValue("pessoa.razaoNome", inputValue)
    formik.setFieldValue("pessoa.pessoaFisica.regimeTributarioIcms", 'NAO_CONTRIBUINTE')
    formik.setFieldValue("contato.telefonesTransient", [{ tipo: 'CELULAR', numero: "" }])
  }, [])
  
  const handleChange = (event, newValue) => {
    setTab(newValue);
  };


  return (
    <>
      <Grid container>

        <Grid item xs={6} sm={10}>
          <DialogTitle
            id="draggable-dialog-title"
            sx={{
              fontSize: { xs: '1rem', sm: '1.25rem' },
              padding: { xs: '1rem 0 1rem 1rem' },
            }}
          >
            <strong>{jQuery.i18n.prop('label.pessoa')}</strong>
          </DialogTitle>
        </Grid>
      </Grid>
      <Divider variant="middle" className="dsl-divider-desktop" />

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={handleChange} aria-label="tabs" centered>
          <Tab label={jQuery.i18n.prop('label.fisica')} />
          <Tab label={jQuery.i18n.prop('label.juridica')} />
        </Tabs>
      </Box>

      <Snackbar
        open={stateSnack.open}
        onClose={handleCloseSnack}
        severity={stateSnack.severity}
        anchorOrigin={{
          vertical: stateSnack.vertical,
          horizontal: stateSnack.horizontal,
        }}
      >
        <Alert 
          elevation={6}
          variant="filled"
          severity={stateSnack.severity}
        >
          {Array.isArray(stateSnack.message) ? (
            <ul>
              {stateSnack.message.map((msg, index) => (
                <li key={index}>{msg.chave}</li>
              ))}
            </ul>
          ) : (
            <Typography>{stateSnack.message}</Typography>
          )}
        </Alert>
      </Snackbar>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent
          className="content-form"
          sx={{ width: '100%', maxHeight: 'calc(100vh - 15rem)' }}
        >
          <DynamicForm dataFields={tab === 0 ? arrayFormData : arrayFormData2} props={{nome: inputValue}} />
        </DialogContent>

        <DialogActions sx={{padding: 2, borderTop: "1px solid #dadada"}}>
          <Button
            id="botao-cancelar-novo-titular"
            onClick={closeModal}
            className="cores-botao-cancelar"
            color="primary"
            variant="standard"
          >
            {jQuery.i18n.prop('label.cancelar')}
          </Button>
          <Button
            id="botao-enviar-novo-titular"
            color="primary"
            variant="contained"
            type="submit"
            onClick={() => setTimeout(() => {
              scrollToError()
            }, 200)}
          >
            {jQuery.i18n.prop('label.salvar')}
          </Button>
        </DialogActions>
      </form>
    </>
  );
};

export default PessoaForm;
