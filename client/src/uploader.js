import { Component } from "react";
import axios from "./axios";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            file:null
        };

        console.log("props in Uploader: ", props);
    }

    componentDidMount() {
        console.log("uploader mounted!");
    }

    // methodInUploader() {
    //     // console.log('running method in uploader');
    //     this.props.methodInApp("whoaaaa");
    // }

    handleClick() {
       
        const formData = new FormData();
        formData.append("file", this.state.file);
        axios
            .post("/upload", formData, this.state)
            .then(({ data }) => {
                console.log("DATA", data);
                if (data) {
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
                file: e.target.files[0],
            },
            // this callback runs after setState finishes updating state
            // because we're logging state here in the callback, this means this
            // log won't run until state has been updated, ensuring us that
            // we're seeing the most updated log
            () => console.log("this.state after setState: ", this.state)
        );
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onFormSubmit}></form>
                    <span>Firstname</span>
                    <input
                        type="file"
                        name="file"
                        accept="image/*"
                        onChange={(e) => this.handleChange(e)}
                    />
                    {this.state.error && (
                        <p className="error">Oups! Something Went Wrong.</p>
                    )}
                    <button onClick={() => this.handleClick()}>Submit</button>

                    {/* <h2 onClick={() => this.methodInUploader()}>
                    Click here to run method in uploader!
                </h2> */}

            </div>
        );
    }
}
