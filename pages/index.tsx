import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Switch from '@material-ui/core/Switch';
import Head from 'next/head';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const Meta = () => <Head>
    <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"/>
    <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
    />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
</Head>

const useStyles = makeStyles((theme?: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

function Home() {

    return <>




        <Meta />
        <CssBaseline />
        <Container maxWidth="sm">
            <div>Welcome to Next.js!</div>
            <Button variant="contained" color="primary">Hello World</Button>
            <Checkbox
                checked={true}
                onChange={() => {}}
                value="checkedA"
                inputProps={{
                'aria-label': 'primary checkbox',
                }}
            />
            <div>
            <Switch
                checked={true}
                onChange={(a, checked) => {alert(checked)}}
                value="checkedA"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
            </div>
        </Container>
    </>;
}

export default Home