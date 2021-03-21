import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Reset extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
            step: 1,
        };
    }

    handleClick() {
        axios
            .post("/reset/start", this.state)
            .then(({ data }) => {
                console.log("DATA", data);
                if (data.step) {
                    this.setState({
                        step: 2,
                        error: false,
                    });
                } else {
                    console.log("data fail");
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("err in axios POST /reset: ", err);
            });
    }

    handleClickVerify() {
        axios
            .post("/reset/verify", this.state)
            .then(({ data }) => {
                console.log("DATA", data);
                if (data.step) {
                    this.setState({
                        step: 3,
                        error: false,
                    });
                } else {
                    console.log("data fail");
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("err in axios POST /reset/verify: ", err);
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
        this.setState({
            error: false,
        });
    }

    render() {
        const { step } = this.state;
        if (step == 1) {
            return (
                <div className="regForm">
                    <h1>Reset Password</h1>
                    <span>Email</span>
                    <input
                        autoComplete="none"
                        name="emailRes"
                        placeholder="Email"
                        onChange={(e) => this.handleChange(e)}
                        onClick={() => this.handleErrorMsg()}
                    />
                    {this.state.error && (
                        <p className="error">Oups! Something Went Wrong.</p>
                    )}
                    <button onClick={() => this.handleClick()}>Submit</button>
                    <Link to="/" className="links">
                        Back
                    </Link>
                </div>
            );
        } else if (step == 2) {
            return (
                <div className="regForm">
                    <h1>Confirm</h1>
                    <form autoComplete="off">
                        <span>Secret Code</span>
                        <input
                            autoComplete="none"
                            name="secret"
                            placeholder="Secret Code"
                            onChange={(e) => this.handleChange(e)}
                            onClick={() => this.handleErrorMsg()}
                        />
                        <span>New Password</span>
                        <input
                            name="password"
                            placeholder="New Password"
                            type="password"
                            onChange={(e) => this.handleChange(e)}
                            onClick={() => this.handleErrorMsg()}
                        />
                    </form>
                    {this.state.error && (
                        <p className="error">Oups! Something Went Wrong.</p>
                    )}
                    <button onClick={() => this.handleClickVerify()}>
                        Submit
                    </button>
                    <Link to="/login" className="links">
                        Back
                    </Link>
                </div>
            );
        } else if (step == 3) {
            return (
                <div className="regForm">
                    <h1>Password Updated </h1>

                    <Link to="/login" className="links">
                        Back
                    </Link>
                </div>
            );
        }
    }
}
