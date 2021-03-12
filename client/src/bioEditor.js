import { Component } from "react";
import axios from "./axios";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            draft: "",
           
        };

        console.log("PROPS IN BIO EDITOR", props);
        console.log("DRAFT:", this.state.draft);
    }

    componentDidMount() {
        this.setState(
                    {
                        draft: this.props.bio,
                    })
       
    }

    handleClick() {
        this.setState({
            updateBio: !this.state.updateBio,
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
                            updateBio: false,
                        },
                        () =>
                            console.log(
                                "AFTER BIO UPDATE setState: ",
                                this.state
                            )
                    );
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
            draft: e.target.value,
        });
    }

    render() {
        return (
            <div className="bio">
                {!this.state.updateBio && <h1>{this.state.draft}</h1>}

                {this.state.updateBio && (
                    <textarea
                        onChange={(e) => this.handleChange(e)}
                        defaultValue={this.state.draft}
                    ></textarea>
                )}
                {this.state.updateBio && (
                    <button onClick={() => this.submitBio()}>Done</button>
                )}
                {!this.state.updateBio && !this.state.draft && (
                    <button onClick={() => this.handleClick()}>Add Bio</button>
                )}
                {!this.state.updateBio && this.state.draft && (
                    <button onClick={() => this.handleClick()}>Edit Bio</button>
                )}
            </div>
        );
    }
}
