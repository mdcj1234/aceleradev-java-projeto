import React , { useState , useEffect , ChangeEvent } from 'react';
import { useHistory, Link } from 'react-router-dom';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel'
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';

import api from '../../services/api';
import './styles.css'

interface Column {
  id: 'id' | 'level' | 'description' | 'origin' | 'quantity' | 'createdAt';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

interface Log {
  id: number;
  level: string;
  description: string;
  origin: string;
  quantity: number;
  createdAt: string;
}

const LogList = () => {
  const classes = useStyles();
  const history = useHistory();
  const columns: Column[] = [
    { id: 'id', label: 'Id', minWidth: 50 },
    { id: 'level', label: 'Level', minWidth: 100 },
    { id: 'description', label: 'Description', minWidth: 200, },
    { id: 'origin', label: 'Origin', minWidth: 100, },
    { id: 'quantity', label: 'Quantity', minWidth: 50, format: (value: number) => value.toFixed(0), },
    { id: 'createdAt', label: 'CreatedAt', minWidth: 150, },
  ];
  const types: string[] = ['','ERROR','INFO','WARNING'];

  const [items, setItems] = useState<Log[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortedColumn, setSortedColumn] = useState('id');
  const [order, setOrder] = useState(true);
  const [formData, setFormData] = useState({
    id: '',
    level: '',
    description: '',
    origin: '',
    quantity: '',
    createdAtInit: '',
    createdAtEnd: ''
  })

  useEffect(() => {

    const pagable = {
      page: page,
      size: rowsPerPage,
      sort: sortedColumn
    }

    const params = Object.assign(pagable, formData)

    api.get('logs', {
      params
    }).then(response => {
      setItems(response.data.content);
      setTotalItems(response.data.totalElements)
    }).catch(function (error) {
      history.push('/')
    })

  },[page,rowsPerPage,history,sortedColumn,formData]);

  const handleInputChange = (event:ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {

    const value = event.target.value as string;
    setFormData({ ...formData, level: value })
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleTableHeaderClickSort = (label: string) =>  {
    setOrder(!order);
    setSortedColumn(label + "," + (order ? 'desc' : 'asc'));
  };

  const handleLogout = () => {

    api.defaults.headers.common = {'Authorization': ``}
    history.push('/')
  }

  return (
    <>
    <AppBar position="static">
        <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Central de Erros
            </Typography>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
    </AppBar>

    <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          
          <Grid item xs={2}>

            <TextField 
            margin="normal"
            placeholder="createdAt init" 
            name="createdAtInit"
            type="date"
            variant="outlined"
            inputProps={{ 'aria-label': 'description' }} 
            onChange={handleInputChange}
            />

            </Grid>

            <Grid item xs={2}>

            <TextField 
            margin="normal"
            placeholder="createdAt end" 
            name="createdAtEnd"
            type="date"
            variant="outlined"
            inputProps={{ 'aria-label': 'description' }} 
            onChange={handleInputChange}
            />

          </Grid>

        </Grid>
    </Container>

    <Container maxWidth="lg" className={classes.container}>

      <Grid container spacing={3}>

          <Grid item xs={2}>
            <FormControl variant="outlined" className={classes.formControl}>
              <Select
                name="Level"
                label="Level"
                placeholder="Level"
                id="level-id"
                value={formData.level}
                onChange={handleSelectChange}
              >
                <MenuItem value={types[0]}>TODOS</MenuItem>
                <MenuItem value={types[1]}>ERROR</MenuItem>
                <MenuItem value={types[2]}>INFO</MenuItem>
                <MenuItem value={types[3]}>WARNING</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={2}>

            <TextField 
              margin="normal"
              placeholder="id"
              name="id"
              type="number"
              variant="outlined"
              inputProps={{ 'aria-label': 'description' }} 
              onChange={handleInputChange}
              />
          </Grid>

          <Grid item xs={2}>

            <TextField 
            margin="normal"
            placeholder="description" 
            name="description"
            variant="outlined"
            inputProps={{ 'aria-label': 'description' }} 
            onChange={handleInputChange}
            />

          </Grid>
          
          <Grid item xs={2}>

            <TextField 
            margin="normal"
            placeholder="origin" 
            name="origin"
            variant="outlined"
            inputProps={{ 'aria-label': 'description' }} 
            onChange={handleInputChange}
            />

          </Grid>

          <Grid item xs={2}>

            <TextField 
            margin="normal"
            placeholder="quantity" 
            name="quantity"
            type="number"
            variant="outlined"
            inputProps={{ 'aria-label': 'description' }} 
            onChange={handleInputChange}
            />
          </Grid>
          
        </Grid>

    </Container>

    <Container maxWidth="lg">
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    <TableSortLabel
                      active={sortedColumn === column.label}
                      direction={order ? 'desc' : 'asc'}
                      onClick={() => handleTableHeaderClickSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={item.id}>
                  {columns.map((column) => {
                    const value = item[column.id];
                    if (column.id === 'id') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                            <Link to={{
                              pathname: '/logs/detail',
                              state: { id: value }
                            }}>
                              {column.format && typeof value === 'number' ? column.format(value) : value} 
                            </Link>           
                        </TableCell>
                      );
                    } else {
                      return (
                        <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number' ? column.format(value) : value} 
                        </TableCell>
                      );
                    }
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={totalItems}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
    </Container>
    </>
  );
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: 20,
            width: '100%',
        }, 
        
        formControl: {
            marginTop: theme.spacing(2),
            width: '100%',
        },

        container: {
            marginTop: 20,
            height: '100%',
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
            color: '#FFF'
        },
    })
);


export default LogList;