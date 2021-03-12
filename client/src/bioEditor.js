import { Component } from "react";
import axios from "./axios";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            draft:"",
        
        };

        console.log("PROPS IN BIO EDITOR", props);
        console.log("DRAFT:",this.state.draft)
    }

    componentDidMount() {
        console.log("uploader mounted!");
    }

    handleClick() {
        this.setState({
            updateBio: !this.state.updateBio,
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
                <p>{this.bio}</p>
                {this.state.updateBio && (
                    <textarea
                        onChange={(e) => this.handleChange(e)}
                        defaultValue={this.state.draft}
                    ></textarea>
                )}
                {this.state.updateBio && (
                    <button onClick={() => this.handleClick()}>Done</button>
                )}
                {!this.state.updateBio && (
                    <button onClick={() => this.handleClick()}>Add Bio</button>
                )}
            </div>
        );
    }
}
