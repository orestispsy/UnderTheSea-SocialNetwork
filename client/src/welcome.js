import { HashRouter, Route } from "react-router-dom";

import Registration from "./registration";

import Login from "./login";

import Reset from "./reset";



export default function Welcome() {
    return (
        <div>
            <h1 className="welcome">
                <div className="bubbles"></div>
                Welcome
                <span>Under the Surface</span>
            </h1>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset/start" component={Reset} />
                </div>
            </HashRouter>
        </div>
    );
}
