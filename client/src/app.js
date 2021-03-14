import { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilePic";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherProfile from "./otherProfile"
import { BrowserRouter, Route } from "react-router-dom";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bio: "",
            uploaderIsVisible: false,
            profileIsVisible: true,
            updateBio: false,
            synchIt: false,
        };
    }

    componentDidMount() {
        axios
            .get("/api/user")
            .then(({ data }) => {
                console.log("DATA In APP", data);
                if (data) {
                    this.setState(
                        {
                            synchIt: true,
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
            profileIsVisible: !this.state.profileIsVisible,
        });
    }

    logOut() {
        axios
            .get("/logout")
            .then(() => {
                location.replace("/");
            })
            .catch((err) => {
                this.setState({
                    error: true,
                });
                console.log("err in axios in submitting BIO ", err);
            });
    }

    render() {
        return (
            <BrowserRouter>
                <div className="appContainer">
                    <div className="appBar">
                        <div className="logo">Under The Surface </div>
                        <ProfilePic
                            firstname={this.state.firstname}
                            lastname={this.state.lastname}
                            imageUrl={this.state.imageUrl}
                            toggleUploader={() => this.toggleUploader()}
                            className="profile-pic"
                        />
                    </div>

                   {this.state.profileIsVisible && this.state.synchIt && ( <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                firstname={this.state.firstname}
                                lastname={this.state.lastname}
                                imageUrl={this.state.imageUrl}
                                bio={this.state.bio}
                                updateBio={this.state.updateBio}
                                toggleUploader={() => this.toggleUploader()}
                                run={() => this.componentDidMount()}
                                className="profile-pic-big"
                     
                            />
                        )}
                    />
                   )}

                   <Route path="/user/:id" render={(props) => (
                       <OtherProfile 
                            key={props.match.url}
                            match={props.match}
                            history={props.history}
                             />
                        )}
                    />


                    {this.state.uploaderIsVisible && (
                        <Uploader
                            toggleUploader={() => this.toggleUploader()}
                            imageUrl={this.state.imageUrl}
                            run={() => this.componentDidMount()}
                        />
                    )}
                    <div className="logout" onClick={() => this.logOut()}>
                        logout
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}
