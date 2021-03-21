import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
    }

    handleClick() {
        axios
            .post("/welcome", this.state)
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
                console.log("err in axios POST /registration: ", err);
            });
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            // this callback runs after setState finishes updating state
            // because we're logging state here in the callback, this means this
            // log won't run until state has been updated, ensuring us that
            // we're seeing the most updated log
            () => console.log("this.state after setState: ", this.state)
        );
    }

    handleErrorMsg(e) {
        this.setState({
            error: false,
        });
    }

    render() {
        return (
            <div className="regForm">
                <h1>Registration</h1>
                <span>Firstname</span>
                <input
                    autoComplete="none"
                    name="firstname"
                    placeholder="First Name"
                    onChange={(e) => this.handleChange(e)}
                    onClick={() => this.handleErrorMsg()}
                />
                <span>Lastname</span>
                <input
                    autoComplete="none"
                    name="lastname"
                    placeholder="Last Name"
                    onChange={(e) => this.handleChange(e)}
                    onClick={() => this.handleErrorMsg()}
                />
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
                <span className="regSpan">
                    User Already?
                    <Link to="/login" className="links">
                        Login
                    </Link>
                </span>
            </div>
        );
    }
}