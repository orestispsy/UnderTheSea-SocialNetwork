import { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilePic";
import Uploader from "./uploader";
import Profile from "./profile";
var synchIt=false;

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bio:"",
            uploaderIsVisible: false,
            profileIsVisible:true,
            updateBio:false
        };
    }
 
    componentDidMount() {
        axios
            .get("/user")
            .then(({ data }) => {
                console.log("DATA In APP", data);
                if (data) {
                    synchIt=true;
                    this.setState(
                        {
                            imageUrl: data.data.img_url,
                            firstname: data.data.firstname,
                            lastname: data.data.lastname,
                            bio: data.data.bio,
                        },
                        () =>
                            console.log(
                                "this.state IN APP after setState: ",
                                this.state
                            )
                    );
                }
            })
            .catch((err) => {
                console.log("err in axios App User POST Request : ", err);
            });
    }

    toggleUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
            profileIsVisible: !this.state.profileIsVisible
        });
    }

    render() {
        return (
            <div className="appContainer">
                <div className="appBar">
                    <div className="logoBack">
                        <div className="logo">Under The Surface</div>
                    </div>
                    <ProfilePic
                        firstname={this.state.firstname}
                        lastname={this.state.lastname}
                        imageUrl={this.state.imageUrl}
                        toggleUploader={() => this.toggleUploader()}
                        className="profile-pic"
                    />
                </div>
                {this.state.profileIsVisible && synchIt && (
                    <Profile
                        firstname={this.state.firstname}
                        lastname={this.state.lastname}
                        imageUrl={this.state.imageUrl}
                        bio={this.state.bio}
                        updateBio={this.state.updateBio}
                        toggleUploader={() => this.toggleUploader()}
                        className="profile-pic-big"
                    />
                )}

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
