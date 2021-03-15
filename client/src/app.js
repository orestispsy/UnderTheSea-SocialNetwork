import { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilePic";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherProfile from "./otherProfile";
import FindPeople from "./findPeople";
import { BrowserRouter, Route, Link } from "react-router-dom";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bio: "",
            uploaderIsVisible: false,
            profileIsVisible: true,
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

    render() {
        return (
            <BrowserRouter>
                <div className="appContainer">
                    <div className="appBar">
                        <div className="logo">Under The Surface </div>
                        <div className="appBar">
                            <Link to="/user" className="findPeople">
                                <div>Find People</div>
                            </Link>
                            <Link to="/">
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
                    <Route path="/user/" component={FindPeople} />
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

                    <div className="logout" onClick={() => this.logOut()}>
                        <span>logout</span>
                    </div>
                    {this.state.uploaderIsVisible && (
                        <Uploader
                            toggleUploader={() => this.toggleUploader()}
                            imageUrl={this.state.imageUrl}
                            picUpdate={(arg) => this.picUpdate(arg)}
                            uploaderIsVisible={this.state.uploaderIsVisible}
                        />
                    )}
                </div>
            </BrowserRouter>
        );
    }
}
