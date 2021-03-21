import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
    }

    handleClick() {
        axios
            .post("/login", this.state)
            .then(({ data }) => {
                console.log("DATA", data.data);
                if (data.data) {
                    location.replace("/");
                } else {
                    console.log("data fail");
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("err in axios POST /login: ", err);
            });
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state after setState: ", this.state)
        );
    }

    handleErrorMsg(e) {
        this.setState(
            {
                error: false,
            }
        );
    }

    render() {
        return (
            <div className="regForm">
                <h1>Login</h1>
                <span>Email</span>
                <input
                    autoComplete="none"
                    name="email"
                    placeholder="Email"
                    onChange={(e) => this.handleChange(e)}
                    onClick={() => this.handleErrorMsg()}
                />
                <span>Password</span>
                <input
                    name="password"
                    placeholder="Password"
                    type="password"
                    onChange={(e) => this.handleChange(e)}
                    onClick={() => this.handleErrorMsg()}
                />
                {this.state.error && (
                    <p className="error">Oups! Something Went Wrong.</p>
                )}
                <button onClick={() => this.handleClick()}>Submit</button>

                <Link to="/reset/start" className="links">
                    Reset Password
                </Link>
                <Link to="/" className="links">
                    Back
                </Link>
            </div>
        );
    }
}
