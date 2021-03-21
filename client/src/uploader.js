import { Component } from "react";
import axios from "./axios";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            file: null,
        };

        console.log("PROPS IN UPLOADER", props);
    }

    componentDidMount() {
        console.log("uploader mounted!");
    }

    handleClick() {
        const formData = new FormData();
        formData.append("file", this.state.file);
        axios
            .post("/upload", formData, this.state)
            .then(({ data }) => {
                console.log("DATA", data);
                if (data) {
                    this.props.picUpdate(data.data.img_url);
                } else {
                    console.log("data fail");
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    error: true,
                });
                console.log("err in axios in Image Uploader ", err);
            });
    }

    handleChange(e) {
        this.setState(
            {
                file: e.target.files[0],
            },
            () => console.log("this.state after setState: ", this.state)
        );
    }

    render() {
        return (
            <div className="uploaderBack">
                <h3>Profile Image</h3>
                <div className="uploader">
                    <div
                        className="X"
                        onClick={() => this.props.toggleUploader()}
                    >
                        X
                    </div>
                    <img className="uploader-pic" src={this.props.imageUrl} />
                    <h1>Select New</h1>
                    <div className="fileUploader">
                        <input
                            type="file"
                            name="file"
                            accept="image/*"
                            onChange={(e) => this.handleChange(e)}
                        />
                    </div>
                    {this.state.error && (
                        <p className="error">Oups! Something Went Wrong.</p>
                    )}
                    <button onClick={() => this.handleClick()}>Submit</button>
                </div>
            </div>
        );
    }
}
