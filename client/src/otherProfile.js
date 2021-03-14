import { Component } from "react";
import axios from "./axios";

export default class otherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };

        console.log("Props in otherProfile", props);
    }

    componentDidMount() {
        console.log("otherProfile prop match", this.props.match);
         axios
             .post("/api/user", this.props.match.params)
             .then(({ data }) => {
                 console.log("DATA In OTHERPROFILE", data);
                 if (this.props.match.params.id == data.id) {
                     this.props.history.push("/");
                 } else {
                     this.setState(
                         {
                             imageUrl: data.data.img_url,
                             firstname: data.data.firstname,
                             lastname: data.data.lastname,
                             bio: data.data.bio,
                         },
                         () =>
                             console.log(
                                 "this.state IN OTHERPROFILE after setState: ",
                                 this.state
                             )
                     );
                 }
             })
             .catch((err) => {
                 console.log("err in axios App User POST Request : ", err);
             });
    }


    render() {
        return (
            <div className="hello">
                <div className="bubbles2"></div>
                {this.state.firstname} {this.state.lastname}
                <div className="profile">
                    <img
                        className="profile-pic-big"
                        src={this.state.imageUrl}
                        alt={`${this.state.firstname} ${this.state.lastname}`}
                    />
                    <div className="bio">
                        <h2>{this.state.bio}</h2>
                    </div>
                </div>
            </div>
        );
    }
}
