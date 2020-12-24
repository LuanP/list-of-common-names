import React, { useState } from 'react';
import _ from 'lodash';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import styled, { createGlobalStyle, } from 'styled-components';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip"
import ShuffleIcon from "@material-ui/icons/Shuffle"

import merger from './data-merger';
import CopyHelper from './components/CopyHelper';

const theme = createMuiTheme()

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`

const AppBox = styled.div`
  margin: 2.5em;
`

const columns = [
  {
    name: "givenName",
    label: "Given Name",
    options: {
      filter: false,
      sort: true,
    }
  },
  {
    name: "surname",
    label: "Surname",
    options: {
      filter: false,
      sort: true,
    }
  },
  {
    name: "continent",
    label: "Continent",
    options: {
      filter: true,
      sort: true,
    }
  },
  {
    name: "gender",
    label: "Gender",
    options: {
      filter: true,
      sort: true,
    }
  },
  {
    name: "region",
    label: "Region",
    options: {
      filter: true,
      sort: true,
    }
  },
];

const options: MUIDataTableOptions = {
  filterType: 'checkbox',
  selectableRows: 'multiple',
  disableToolbarSelect: true,
  rowsPerPageOptions: [10, 25, 50, 100, 500]
};

const App: React.FC = () => {
  const [data, setData] = useState<any[]>(merger.merge())
  const [rowsSelected, setRowsSelected] = useState<any[]>([])

  options.rowsSelected = rowsSelected
  options.onRowsSelect = (_currentRowsSelected: any[], rowsSelected: any[]) => {
    setRowsSelected(rowsSelected);
  }

  const getDataByRowIndex = (data: any, rowsSelected: any) => {
    return _.map(rowsSelected, (obj) => data[obj.dataIndex])
  }

  const randomizeData = () => {
    setData(_.shuffle(data))
  }

  options.customToolbar = () => (
      <>
        <Tooltip title={"Randomize Data"}>
          <IconButton onClick={randomizeData}>
            <ShuffleIcon />
          </IconButton>
        </Tooltip>
      </>
    );


  return (
    <MuiThemeProvider theme={theme}>
      <AppBox>
        <GlobalStyle />
        {/* <Button variant="contained" color="primary" onClick={getPopularGivenNames}>Popular Given Names</Button> */}
        <MUIDataTable
          title={"Popular names"}
          data={data}
          columns={columns}
          options={options}
        />
        <CopyHelper data={getDataByRowIndex(data, rowsSelected)} />
      </AppBox>
    </MuiThemeProvider>
  );
}

export default App;

