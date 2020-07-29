import React from 'react';
import {BrowserRouter, Switch, Route} from "react-router-dom/esm/react-router-dom";
import './App.scss';
import Contact from "./components/Contact";

function App() {
    return (
        <body>
        <BrowserRouter>
            {/*<Navbar/>*/}
        <Switch>
            <Route  exact path="/" component={Contact}/>
        </Switch>
            {/*<Footer/>*/}
        </BrowserRouter>
        </body>
    );
}

export default App;
