/* global */

import React from 'react';
import {
  Grid,
  Autocomplete,
  TextField,
  Typography,
  TextareaAutosize,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import brLocale from 'date-fns/locale/pt-BR';

import './styles.css'
import InfiniteScrollAutocomplete from '../InfiniteScrollAutocomplete';
import FileUpload from '../FileUpload';
import AutocompleteUsarInfiniteScroll from '../AutoCompleteUsar';
import SwitchWithLabel from '../SwitchWithLabel';


const DynamicForm = ({ props, dataFields }) => {

  const renderFormField = (field) => {
    // Verifica se `field.condition` está definido (não é null ou undefined)
    const hasCondition = field?.condition !== null && field?.condition !== undefined;
    const hasPaisHomologado = field?.paisHomologado !== null && field?.paisHomologado !== undefined;
    // Verifica se `field.condition` é um valor booleano (true ou false)
    const isConditionBoolean = typeof field?.condition === 'boolean';

    let shouldDisplayField;

    if (hasCondition && hasPaisHomologado) {
      shouldDisplayField = (isConditionBoolean ? field.condition : true) && field?.paisHomologado?.toUpperCase()?.includes(paisHomologado.nome)
    } else {
      shouldDisplayField = (hasCondition && (isConditionBoolean ? field?.condition : true)) ||
          (!hasCondition &&
              (!field?.paisHomologado ||
                  field?.paisHomologado?.toUpperCase()?.includes(paisHomologado.nome)));
    }

    switch (field.type) {
      case 'section':
        const isHighlight = field.className && field.className.includes('highlight');
        return (
            <>
              {
                  shouldDisplayField && (
                      <Grid item xs={12} sx={{marginBlock: field.sectionMargin || 1}}>
                        <div className={field.className || "section-title"}
                             style={{
                               padding: isHighlight ? '12px 16px' : undefined,
                               borderRadius: '4px'
                             }}
                        >
                          <Typography>
                            <b style={{fontSize: field.fontSize || "1rem"}}>{field.name}</b>
                          </Typography>
                        </div>

                      </Grid>
                  )
              }
            </>
        );

      case 'autocomplete':
        return (
          <>
            {
              shouldDisplayField && (
                <Grid item xs={field.xs} sm={field.sm} md={field.md} lg={field.lg} className={field.className}>
                  <Autocomplete 
                    id={field.id}
                    options={field.options || []}
                    getOptionLabel={field.getOptionLabel}
                    isOptionEqualToValue={field.isOptionEqualToValue}
                    filterOptions={(x) => x}
                    onChange={field.onChange}
                    onInputChange={field.onInputChange}
                    noOptionsText={field.noOptionsText}
                    value={field.value}
                    includeInputInList
                    filterSelectedOptions
                    size={field.size}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        {...(field.mobileBlockTyping && { className: 'hidden-textfield' })}
                        name={field.TextField.name}
                        autoComplete="no-autofill"
                        label={field.TextField.label}
                        size={field.TextField.size}
                        autoFocus={field.TextField.autoFocus}
                        SelectProps={field.TextField.SelectProps}
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'no-autofill',
                        }}
                        InputProps={{
                          ...params.InputProps,
                          ...field.inputProps
                        }}
                        {...(field.error && { error: field.error })}
                        {...(field.helperText && { helperText: field.helperText })}
                      />
                    )}
                    renderOption={field.renderOption}
                    {...props}
                  />
                </Grid>
              )
            }
          </>
        );

      case 'AutocompleteUsarInfiniteScroll':
        return (
          <>
            {
              shouldDisplayField && (
                <Grid  item xs={field.xs} sm={field.sm} md={field.md} lg={field.lg} className={field.className}>
                  <AutocompleteUsarInfiniteScroll
                    props={field}
                    dependencyValueToUpdate={field.dependencyValueToUpdate}
                    getUrl={field.getUrl}
                    fetchFunction={field.fetchFunction}
                    error={field.error}
                    helperText={field.helperText}
                  />
                </Grid>
              )
            }
          </>
        );

      case 'inputTextOrNumber':
        return (
          <>
            {
              shouldDisplayField && (
                <Grid item xs={field.xs} sm={field.sm} md={field.md} lg={field.lg} className={field.className}>
                  <TextField
                    className={field.className}
                    fullWidth={field.fullWidth}
                    onInput={field.onInput}
                    autoFocus={field.autoFocus}
                    id={field.id}
                    autoComplete="no-autofill"
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    inputRef={field.inputRef} //usado para get inicial com set de valor
                    onBlur={field.onBlur}
                    label={field.label}
                    size={field.size}
                    disabled={field.disabled}
                    inputProps={{ 
                      ...field.inputProps,
                      autoComplete: 'no-autofill',
                    }}
                    error={field.error}
                    helperText={field.helperText}
                    {...props}
                  />
                </Grid>
              )
            }
          </>
        );

        case 'inputTextWithButtonInside':
          return (
            <>
              {
                shouldDisplayField && (
                  <Grid item xs={field.xs} sm={field.sm} md={field.md} lg={field.lg} className={field.className}>
                    <TextField
                      className={field.className}
                      fullWidth={field.fullWidth}
                      onInput={field.onInput}
                      autoFocus={field.autoFocus}
                      id={field.id}
                      autoComplete="no-autofill"
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      label={field.label}
                      size={field.size}
                      disabled={field.disabled}
                      inputProps={{
                        autoComplete: 'no-autofill',
                      }}
                      InputProps={{
                        endAdornment: (
                          <Button 
                            disabled={field.disabled} 
                            onClick={field.value || paisHomologado.isArgentina() ? field.iconActionBtn : null} 
                            sx={{height: "48px"}}
                          >
                            <SearchIcon />
                          </Button>
                        ),
                      }}
                      {...(field.error && { error: field.error })}
                      {...(field.helperText && { helperText: field.helperText })}
                      {...props}
                    />
                  </Grid>
                )
              }
            </>
          );

      case 'infiniteScrollAutocomplete':
        return (
          <>
            {
              shouldDisplayField && (
                <Grid item xs={field.xs} sm={field.sm} md={field.md} lg={field.lg} className={field.className}>
                  <InfiniteScrollAutocomplete
                    initialOptions={field.initialOptions}
                    getUrl={field.getUrl}
                    fetchFunction={field.fetchFunction}
                    props={field}
                    idRobot={field.inputProps?.['id-robot']}
                    dependencyValueToUpdate={field.dependencyValueToUpdate}
                    error={field.error}
                    helperText={field.helperText}
                  />
                </Grid>
              )
            }
          </>
        );

      case 'textArea':
        return (
          <>
            {
              shouldDisplayField && (
                <Grid item xs={field.xs} sm={field.sm} md={field.md} lg={field.lg} className={field.className}>
                  <TextareaAutosize
                    minRows={field.minRows}
                    id={field.id}
                    name={field.name}
                    placeholder={field.placeholder}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    size={field.size}
                    value={field.value}
                    label={field.label}
                    {...props}
                  />
                </Grid>
              )
            }
          </>
        );

      case 'fileUpload':
        return (
          <>
            {
              shouldDisplayField && (
                <Grid item xs={field.xs} sm={field.sm} md={field.md} lg={field.lg} className={field.className}>
                  <FileUpload
                    id={field.id}
                    name={field.name}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    label={field.label}
                    color={field.color}
                    props={field}
                  />
                </Grid>
              )
            }
          </>
        );

      case 'select':
        return (
          <>
            {
              shouldDisplayField && (
                <Grid item xs={field.xs} sm={field.sm} md={field.md} lg={field.lg} className={field.className}>
                  <FormControl sx={{ m: 1, width: "100%" }} error={field.error ? true : false}>
                    <InputLabel id={`select-label-${field.name}`}>{field.label}</InputLabel>
                    <Select sx={{ m: 1, width: "100%" }}
                      labelId={`select-label-${field.name}`}
                      value={field.value || ''}
                      label={field.label}
                      onChange={field.onChange}
                      size="small"
                      name={field.name}
                      disabled={field.disabled}
                    >
                        { !field?.hideSelecione &&
                          <MenuItem value="">
                            <i>{jQuery.i18n.prop('label.selecione')}</i>
                          </MenuItem>
                        }
                        {
                          field.options?.length > 0 && 
                          field.options.map((item, index) => (
                            <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
                          ))
                        }
                    </Select>
                  </FormControl>  
                  {field.error && (
                    <Typography className='color-error'>{field.helperText}</Typography>
                  )}          
                </Grid>
              )
            }
          </>
        );

      case 'datepicker':
        return (
          <>
            {
              shouldDisplayField && (
                <Grid item xs={field.xs} sm={field.sm} md={field.md} lg={field.lg} className={field.className}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={brLocale} error={field.error}>
                    <DatePicker
                      id={field.id}
                      disabled={field.disabled}
                      open={field.disabled ? false : undefined}
                      className={field.className}
                      name={field.name}
                      disablePast={field.disablePast}
                      readOnly={false}
                      minDate={field.minDate}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      label={field.label}
                      size={field.size}
                      value={field.value}
                      slotProps={{
                        textField: {
                          inputProps: {...field.inputProps},
                          disabled: field.disabled,
                          helperText: field.helperText,
                          ...(field.readOnly && {
                            inputProps: {
                              readOnly: true,
                            },
                            readOnly: true,
                          })
                        },
                        openPickerButton: {
                          disabled: field.disabled,
                          sx: field.disabled
                            ? {
                                pointerEvents: 'none',
                                opacity: 0.5,
                              }
                            : {},
                        },

                      }}
                      {...props}
                      error={field.error}
                    />
                  </LocalizationProvider>
                </Grid>
              )
            }
          </>
        );

      case 'radioGroup':
        return (
          <>
            {
              shouldDisplayField && (
                <Grid item xs={field.xs} sm={field.sm} md={field.md} lg={field.lg} 
                  sx={{
                    display: {md: "block", xs: "flex"},
                    gap: {md: "inherit", xs: "8px"},
                    justifyContent: {md: "inherit", xs: "center"},
                    alignItems: {md: "inherit", xs: "center"},
                  }}
                  className={field.className}
                >
                  <FormLabel className='radio-label' id={`radio-buttons-group-${field.label}`}>{field.label}</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="radio-buttons-group"
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    sx={{
                      flexWrap: 'nowrap',
                      width: '50%',
                      justifyContent: { xs: 'flex-start', md: 'space-between' },
                    }}
                  >
                    {
                      field.options?.map((item, index) => (
                          <FormControlLabel
                              key={index}
                              className='radio-option'
                              control={
                                <Radio
                                    value={item.value}
                                    sx={{ paddingRight: '6px' }}
                                />
                              }
                              label={item.label}
                          />
                      ))
                    }
                  </RadioGroup>
                  {field.error && (
                    <Typography className='color-error'>{field.helperText}</Typography>
                  )}
                </Grid>
              )
            }
          </>
        );

      case 'switch':
        return (
            <>
              {
                shouldDisplayField && (
                  <Grid item xs={field.xs} >
                    <SwitchWithLabel field={field} />
                  </Grid>
                )
              }
            </>
        );

      default:
        return null;
    }
  };

  return (
    <Grid container spacing={2} className='dynamic-form'>
      {dataFields?.map((field, index) => (
        <React.Fragment key={(field.name + index) || (field.label + index) || index}>
          {renderFormField(field)}
        </React.Fragment>
      ))}
    </Grid>
  );
};

export default DynamicForm;
