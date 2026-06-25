import React, { useEffect, useState } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import usePaginatedOptions from './hooks/usePaginatedOptions';

const InfiniteScrollAutocomplete = ({
  initialOptions = [],
  getUrl,
  fetchFunction,
  idRobot,
  dependencyValueToUpdate,
  props,
}) => {
  const [term, setTerm] = useState('')
  const [fetchOptions, setFetchOptions] = useState([])

  const { options, handleScroll, hasMore, loading } = usePaginatedOptions(getUrl(term), fetchFunction);
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const handleCustomOpen = () => {
    setOpen(true)
  }
  
  //Removendo duplicatas com base no valor
  const loadMoreOptions = [...(fetchOptions || []), ...(options || [])].filter((currentItem, index, array) =>
    //Verifica se o index atual é igual ao primeiro index encontrado com o mesmo valor
    index === array?.findIndex((item) => (item.value || item.label) === (currentItem.value || currentItem.label))
  )

  useEffect(() => {
    (async () => {
      try {
        const response = await initialOptions?.(term) || []
        setFetchOptions(response)
      } catch (error) {
        console.error("error", error)
      }
    })()
  }, [term, dependencyValueToUpdate])

  return (
    <Autocomplete
      inputValue={inputValue}
      open={open}
      onClose={() => {
        setOpen(false)
      }}
      options={loadMoreOptions}
      ListboxProps={{ onScroll: hasMore ? handleScroll : null }}
      id={props.id}
      getOptionLabel={props.getOptionLabel}
      isOptionEqualToValue={props.isOptionEqualToValue}
      filterOptions={(x) => x}
      onInputChange={(e, newInput) => {
        setTerm(e?.target?.value)
        setInputValue(newInput)
      }}
      onChange={(e, value) => {
        props.onChange && props.onChange(e, value)
        setTerm('')
      }}
      onBlur={() => setTerm('')}
      noOptionsText={props.noOptionsText || undefined}
      value={props.value}
      autoComplete
      includeInputInList
      filterSelectedOptions
      size={props.size}
      disableClearable={props.disableClearable}
      disabled={props.disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          {...(props.mobileBlockTyping && { className: 'hidden-textfield' })}
          name={props.TextField.name}
          label={props.TextField.label}
          size={props.TextField.size}
          autoComplete="no-autofill"
          onFocus={() => {
            if (!props.disabled) handleCustomOpen()
          }}
          onClick={() => {
            if (!props.disabled) handleCustomOpen()
          }}
          autoFocus={props.TextField.autoFocus}
          SelectProps={props.TextField.SelectProps}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'no-autofill', 
          }}
          InputProps={{
            ...params.InputProps,
            'id-robot': idRobot,
            endAdornment: (
              <>
                {
                  loading ? <CircularProgress color="inherit" sx={{position: "absolute", left: "1rem"}} size={20} /> 
                  : null
                }
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          error={props.error}
          helperText={props.helperText}
        />
      )}
      renderOption={props.renderOption}
    />
  );
};

export default InfiniteScrollAutocomplete;
