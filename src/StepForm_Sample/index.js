/* global */
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { metaFormik } from "./formikMetadado";
import {
  Alert,
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import DynamicForm from "../../form/DynamicForm";
import { stepFormMetadados } from "./inputsMetadado";
import {
  getNestedFormikValue,
  validateField,
} from "../../form/DynamicForm/validatorFieldsValue";
import submitficha from "../utils/submitficha";
import DebouncedButton from "../../../../components/DebouncedButton";

const FormSteps = ({ closeModal, data }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [stateSnack, setStateSnack] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    severity: "warning",
    message: "",
    status: "200",
  });
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(null);

  const handleClose = () => {
    setOpen(false);
  };

  const errors = {};
  const formik = useFormik({
    ...metaFormik(closeModal, data?.ficha),
    validate: (values) => {
      const fields = stepFormMetadados(formik).find((step) => step.step === activeStep + 1)?.fields;
      fields?.forEach((field) => {
        const error = validateField(field.name, getNestedFormikValue(values, field.name), fields);
        if (error) {
          errors[field.name] = error;
        }
      });
      return errors;
    },
    onSubmit: (values) => {
      if (isLastStep) {
        submitficha(values, data, closeModal);
      }
    },
  });

  const scrollToError = () => {
    const keys = Object.keys(errors);
    if (keys.length !== 0) {
      const inputDOM = document?.querySelector(`[name='${keys[0]}']`);
      inputDOM?.focus();
      inputDOM?.scrollIntoView(true, { block: "nearest", behavior: "smooth" });
      return true;
    }
    return false;
  };
  
  const currentStepData = stepFormMetadados(formik).find((step) => step.step === activeStep + 1);
  const steps = stepFormMetadados(formik).map((item) => item.title);
  const [skipped, setSkipped] = useState(new Set());
  const isLastStep = activeStep === steps.length - 1;

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setStateSnack({ ...stateSnack, open: false });
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container>
        <Grid item xs={12}>
          <DialogTitle
            id="modal-drawer"
            sx={{
              fontSize: { xs: "1rem", sm: "1.15rem" },
            }}
          >
            <strong>{jQuery.i18n.prop("label.titulo")}</strong>
          </DialogTitle>
        </Grid>
      </Grid>
      <Stepper
        activeStep={activeStep}
        sx={{
          padding: { xs: "1rem 1rem 0 1rem" },
          flexWrap: "wrap",
          rowGap: "1rem",
        }}
      >
        {stepFormMetadados(formik).map((step, index) => (
          <Step key={index}>
            <StepLabel>{step.title}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent
          className="content-form"
          sx={{ width: "100%", height: "calc(100vh - 17rem)" }}
        >
          <DynamicForm dataFields={currentStepData.fields} />
        </DialogContent>

        <DialogActions
          sx={{
            padding: 2,
            position: "relative",
            borderTop: "1px solid var(--gray-500)",
          }}
        >
          <Button
            id="botao-cancelar"
            color="error"
            onClick={closeModal}
            sx={{ position: "absolute", top: "1rem", left: "1rem" }}
          >
            {jQuery.i18n.prop("label.cancelar")}
          </Button>

          <Button
            id="botao-voltar"
            color="primary"
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            {jQuery.i18n.prop("label.voltar")}
          </Button>

          {isLastStep ? (
            <DebouncedButton
              id="botao-finalizar"
              color="primary"
              type="submit"
              onClick={(e) => {
                setTimeout(() => {
                  scrollToError();
                }, 200);
              }}
            >
              {jQuery.i18n.prop("label.finalizar")}
            </DebouncedButton>
          ) : (
            <DebouncedButton
              id="botao-continuar"
              color="primary"
              type="submit"
              debounceTime={500}
              onClick={() => {
                setTimeout(() => {
                  scrollToError();
                }, 0);

                setTimeout(() => {
                  if (Object.keys(errors).length === 0) {
                    handleNext();
                  }
                }, 300);
              }}
            >
              {jQuery.i18n.prop("label.continuar")}
            </DebouncedButton>
          )}
        </DialogActions>
      </form>

      <Snackbar
        open={stateSnack.open}
        onClose={handleCloseSnack}
        severity={stateSnack.severity}
        anchorOrigin={{
          vertical: stateSnack.vertical,
          horizontal: stateSnack.horizontal,
        }}
        autoHideDuration={stateSnack.autoHideDuration}
      >
        <Alert elevation={6} variant="filled" severity={stateSnack.severity}>
          {Array.isArray(stateSnack.message) ? (
            <ul>
              {stateSnack.message.map((msg, index) => (
                <li key={index}>{jQuery.i18n.prop(msg.chave)}</li>
              ))}
            </ul>
          ) : (
            <Typography>{jQuery.i18n.prop(stateSnack.message)}</Typography>
          )}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FormSteps;
