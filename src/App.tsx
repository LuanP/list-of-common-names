import React from 'react';
import MUIDataTable, { MUIDataTableColumnOptions } from 'mui-datatables';
import styled, { createGlobalStyle, } from 'styled-components';
// import Button from '@material-ui/core/Button';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import popularGivenNamesData from './data/popular-given-names.json';

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
    name: "name",
    label: "Name",
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
    name: "region",
    label: "Region",
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
];

const options: MUIDataTableColumnOptions = {
  filterType: 'checkbox',
};

const App: React.FC = () => {
  // const [data, setData] = useState<any[]>([])

  // const getPopularGivenNames = async () => {
  //   const popularGivenNames = popularGivenNamesData
  //   setData(popularGivenNames)
  // }

  return (
    <MuiThemeProvider theme={theme}>
      <AppBox>
        <GlobalStyle />
        {/* <Button variant="contained" color="primary" onClick={getPopularGivenNames}>Popular Given Names</Button> */}
        <MUIDataTable
          title={"Popular names"}
          data={popularGivenNamesData}
          columns={columns}
          options={options}
        />
      </AppBox>
    </MuiThemeProvider>
  );
}

export default App;

