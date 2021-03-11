import { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilePic";
import Uploader from "./uploader";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            imageUrl: "",
            firstname: "",
            lastname: "",
            uploaderIsVisible: false,
        };
    }

    componentDidMount() {
        axios
            .post("/user", this.state)
            .then(({ data }) => {
                console.log("DATA", data);
                this.setState({
                    imageUrl: data.data.img_url,
                    firstname: data.data.firstname,
                    lastname: data.data.lastname,
                });
            })
            .catch((err) => {
                console.log("err in axios App User POST Request : ", err);
            });
    }

    toggleUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    render() {
        return (
            <div className="appContainer">
                <div className="appBar">
                    <div className="logo">Under The Sea</div>
                    <ProfilePic
                        firstname={this.state.firstname}
                        lastname={this.state.lastname}
                        imageUrl={this.state.imageUrl}
                        toggleUploader={() => this.toggleUploader()}
                    />
                </div>

                {this.state.uploaderIsVisible && (
                    <Uploader
                        toggleUploader={() => this.toggleUploader()}
                        imageUrl={this.state.imageUrl}
                    />
                )}
            </div>
        );
    }
}
