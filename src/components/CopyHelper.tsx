import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';
import Snackbar from '@material-ui/core/Snackbar'
import copy from 'copy-to-clipboard'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import Button from '@material-ui/core/Button'


type Props = {
  data: any;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(1),
  }
}))

const Container = styled.div`
  margin: 16px;
`

const TextareaAutosizeStyled = styled(TextareaAutosize)`
  width: 100%;
  max-width: 100%;
`

const CopyHelper: React.FC<Props> = ({ data }: any) => {
  const classes = useStyles()

  const [fields, setFields] = useState<any>({'givenName': true, 'surname': true})
  const [selectedFields, setSelectedFields] = useState<any[]>(['givenName', 'surname'])
  const [fieldsDelimiter, setFieldsDelimiter] = useState<string>(' ')
  const [rowDelimiter, setRowDelimiter] = useState<string>('\n')
  const [rowWrapper, setRowWrapper] = useState<string>('')
  const [invertFields, setInvertFields] = useState<boolean>(false)
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)

  useEffect(() => {
    const newSelectedFields = Object.keys(_.pickBy(fields, (v) => v === true));
    if (invertFields) {
      setSelectedFields(newSelectedFields.reverse())
    } else {
      setSelectedFields(newSelectedFields)
    }
}, [fields, invertFields])

  const handleFieldCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [event.target.name]: event.target.checked });
  }

  const handleFieldDelimiterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldsDelimiter((event.target as HTMLInputElement).value);
  }

  const handleRowDelimiterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowDelimiter((event.target as HTMLInputElement).value.replace('\\n', '\n'));
  }

  const handleRowWrapperChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowWrapper((event.target as HTMLInputElement).value);
  }

  const handleInvertFieldsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInvertFields(event.target.checked);
    setSelectedFields(selectedFields.reverse());
  }

  const handleCopyToClipboard = () => {
    copy(data)
    setOpenSnackbar(true)
  }

  data = _.join(
    _.map(
      data,
      (obj) => `${rowWrapper}${_.join(
        Object.values(
          _.pick(
            obj,
            selectedFields
          )
        ),
        fieldsDelimiter
      )}${rowWrapper}`
    ),
    rowDelimiter
  )

  const { givenName, surname } = fields;
  const fieldsError = [givenName, surname].filter((v) => v).length < 1

  return (
    <Container>
      <div className={classes.root}>
      <FormControl required error={fieldsError} component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Fields to copy</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={givenName} onChange={handleFieldCheckboxChange} name="givenName" />}
            label="Given Name"
          />
          <FormControlLabel
            control={<Checkbox checked={surname} onChange={handleFieldCheckboxChange} name="surname" />}
            label="Surname"
          />
        </FormGroup>
        {fieldsError && <FormHelperText>Pick at least one</FormHelperText>}
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Fields delimiter</FormLabel>
        <RadioGroup aria-label="fields-delimiter" name="fields-delimiter" value={fieldsDelimiter} onChange={handleFieldDelimiterChange}>
          <FormControlLabel value=" " control={<Radio />} label="Space ( )" />
          <FormControlLabel value=", " control={<Radio />} label="Comma (, )" />
        </RadioGroup>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Row delimiter</FormLabel>
        <RadioGroup aria-label="row-delimiter" name="row-delimiter" value={rowDelimiter} onChange={handleRowDelimiterChange}>
          <FormControlLabel value="\n" control={<Radio />} label="Newline (\n)" checked={rowDelimiter === '\n'} />
          <FormControlLabel value=", " control={<Radio />} label="Comma (, )" />
          <FormControlLabel value="; " control={<Radio />} label="Semicolon (; )" />
          <FormControlLabel value=",\n" control={<Radio />} label="Comma + Newline (,\n)" checked={rowDelimiter === ',\n'} />
          <FormControlLabel value=";\n" control={<Radio />} label="Semicolon + Newline (;\n)" checked={rowDelimiter === ';\n'} />
        </RadioGroup>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Row wrapper</FormLabel>
        <RadioGroup aria-label="row-wrapper" name="row-wrapper" value={rowWrapper} onChange={handleRowWrapperChange}>
          <FormControlLabel value="" control={<Radio />} label="None" />
          <FormControlLabel value="&quot;" control={<Radio />} label="Double quotes (&quot;)" />
          <FormControlLabel value="'" control={<Radio />} label="Single quotes (')" />
        </RadioGroup>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
      <FormLabel component="legend">Invert fields order</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={invertFields} onChange={handleInvertFieldsChange} name="invert-fields" />}
          label="Invert fields order"
        />
      </FormGroup>
      <FormHelperText>It will switch "Given Name" and "Surname" when both are selected.</FormHelperText>
    </FormControl>
      <div>
        <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.button}
          onClick={handleCopyToClipboard}
          startIcon={<FileCopyIcon />}
        >
          Save to clipboard
        </Button>
      </div>
    </div>
      <TextareaAutosizeStyled aria-label="copy helper" rowsMin={3} placeholder="The rows selected from the table above will be displayed here for the ease of copying and pasting" value={data} />
    <Snackbar
      key={`bottom,center`}
      open={openSnackbar}
      autoHideDuration={2000}
      onClose={() => setOpenSnackbar(false)}
      message='Copied to clipboard!'
    />
    </Container>
  );
}

export default CopyHelper;