import { Component } from "react";
import axios from "./axios";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            draft: null,
           
        };

        console.log("PROPS IN BIO EDITOR", props);
        console.log("DRAFT:", this.state.draft);
    }


    componentDidMount()  {
            this.setState({
                draft: this.props.bio,
            });
    }
    handleClick() {
        this.setState({
            bioCheck: !this.state.bioCheck,
        });
    }

    submitBio() {
        axios
            .post("/update-bio", this.state)
            .then(({ data }) => {
                console.log("DATA in bio sumbit:", data.data.bio);
                if (data) {
                    this.setState(
                        {
                            draft: data.data.bio,
                            bioCheck: false,
                        },
                        () =>
                            console.log(
                                "AFTER BIO UPDATE setState: ",
                                this.state
                            )
                    );
                     this.props.bioUpdate(data.data.bio);
                }
            })
            .catch((err) => {
                this.setState({
                    error: true,
                });
                console.log("err in axios in submitting BIO ", err);
            });
    }

    handleChange(e) {
        this.setState({
            draft: e.target.value
        });
    }

    render() {
        return (
            <div className="bio">
                {!this.state.bioCheck && this.state.draft && (<h2>{this.state.draft}</h2>)}
                {this.state.bioCheck && (
                    <textarea
                        onChange={(e) => this.handleChange(e)}
                        defaultValue={this.state.draft}
                    ></textarea>
                )}
                {this.state.bioCheck && (
                    <button onClick={() => this.submitBio()}>Done</button>
                )}
                {!this.state.bioCheck && !this.state.draft && (
                    <button onClick={() => this.handleClick()}>Add Bio</button>
                )}
                {!this.state.bioCheck && this.state.draft && (
                    <button onClick={() => this.handleClick()}>Edit Bio</button>
                )}
            </div>
        );
    }
}
