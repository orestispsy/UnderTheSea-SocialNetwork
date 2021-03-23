import { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilePic";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherProfile from "./otherProfile";
import FindPeople from "./findPeople";
import Friends from "./friends";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Chat from "./chat";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bio: "",
            uploaderIsVisible: false,
            profileIsVisible: true,
            synchIt: false,
            visibility: false,
        };
    }

    componentDidMount() {
        axios
            .get("/api/user")
            .then(({ data }) => {
                if (data) {
                    this.setState({
                        synchIt: true,
                        imageUrl: data.data.img_url,
                        firstname: data.data.firstname,
                        lastname: data.data.lastname,
                        bio: data.data.bio,
                        id: data.data.id,
                    });
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

    picUpdate(arg) {
        this.setState({
            imageUrl: arg,
        });
    }

    bioUpdate(arg) {
        this.setState({
            bio: arg,
        });
    }

    hideUploader(arg) {
        this.setState({
            uploaderIsVisible: arg,
        });
    }

    showProfile(arg) {
        this.setState({
            profileIsVisible: arg,
        });
    }

    render() {
        return (
            <BrowserRouter>
                <div className="appContainer">
                    <div className="appBar">
                        <div className="logo">Under The Surface </div>
                        <div className="appBar">
                            <Link to="/chat">
                                <div className="chatBar"></div>
                            </Link>
                            <Link
                                to="/friends"
                                onClick={(arg) => this.showProfile(false)}
                            >
                                <div className="friendsBar">
                                    <div ></div>
                                </div>
                            </Link>
                            <Link
                                to="/user"
                                onClick={(arg) => this.hideUploader(false)}
                            >
                                <div className="find"></div>
                            </Link>
                            <Link
                                to="/"
                                onClick={(arg) => this.showProfile(false)}
                                onClick={(arg) =>
                                    this.hideUploader(
                                        this.state.profileIsVisible
                                    )
                                }
                            >
                                <ProfilePic
                                    firstname={this.state.firstname}
                                    lastname={this.state.lastname}
                                    imageUrl={this.state.imageUrl}
                                    toggleUploader={() => this.toggleUploader()}
                                    className="profile-pic"
                                />
                            </Link>
                        </div>
                    </div>

                    {this.state.profileIsVisible && this.state.synchIt && (
                        <Route
                            exact
                            path="/"
                            render={(props) => (
                                <Profile
                                    firstname={this.state.firstname}
                                    lastname={this.state.lastname}
                                    imageUrl={this.state.imageUrl}
                                    bio={this.state.bio}
                                    toggleUploader={() => this.toggleUploader()}
                                    bioUpdate={(arg) => this.bioUpdate(arg)}
                                    className="profile-pic-big"
                                />
                            )}
                        />
                    )}

                    <Route
                        path="/user/"
                        render={(props) => (
                            <FindPeople
                                showProfile={(arg) => this.showProfile(arg)}
                            />
                        )}
                    />

                    <Route path="/chat/" render={(props) => <Chat />} />

                    {this.state.profileIsVisible && (
                        <Route
                            path="/user/:id"
                            render={(props) => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                    profileIsVisible={
                                        this.state.profileIsVisible
                                    }
                                />
                            )}
                        />
                    )}

                    <Route
                        exact
                        path="/friends"
                        render={(props) => (
                            <Friends
                                id={this.state.id}
                                showProfile={(arg) => this.showProfile(arg)}
                            />
                        )}
                    />

                    <div className="logout" onClick={() => this.logOut()}>
                        <span>logout</span>
                    </div>
                    {this.state.uploaderIsVisible && (
                        <Uploader
                            toggleUploader={() => this.toggleUploader()}
                            imageUrl={this.state.imageUrl}
                            picUpdate={(arg) => this.picUpdate(arg)}
                            uploaderIsVisible={this.state.uploaderIsVisible}
                            hideUploader={(arg) => this.hideUploader(arg)}
                            showProfile={(arg) => this.showProfile(arg)}
                        />
                    )}
                </div>
            </BrowserRouter>
        );
    }
}
