import { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilePic";
import Uploader from "./uploader";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            first: "Layla",
            last: "Arias",
            uploaderIsVisible: false,
        };
    }

    componentDidMount() {
        // console.log('App mounted');
        // here is where we want to make an axios request to 'get' info about logged in user (first name, last name, and profilePicUrl / imageUrl)
        // an axios route '/user' is a good path for it
        // when we have the info from the server, add it to the state of the component (i.e. setState)
    }

    toggleUploader() {
        // console.log('toggleModal function is running!!!');
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    methodInApp(arg) {
        console.log("Im running in App!!! and my argument is: ", arg);
    }

    render() {
        return (
            <div className="startScreen">
                <p className="logo">Under The Sea</p>
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.imageUrl}
                    toggleUploader={() => this.toggleUploader()}
                />
               
                {this.state.uploaderIsVisible && (
                    <Uploader
                        methodInApp={this.methodInApp}
                        // methodInApp={(arg) => this.methodInApp(arg)}
                        toggleUploader={() => this.Uploader()}
                    />
                )}
            </div>
        );
    }
}
