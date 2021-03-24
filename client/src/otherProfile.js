import { Component } from "react";
import axios from "./axios";
import FriendButton from "./friendButton"

export default class otherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    componentDidMount() {
         axios
             .post("/user", this.props.match.params)
             .then(({ data }) => {
                 if (data.oups) {
                      this.props.history.push("/");
                 }
                else if (this.props.match.params.id == data.id) {
                     this.props.history.push("/");
                 } else {
                     this.setState(
                         {
                             imageUrl: data.data.img_url,
                             firstname: data.data.firstname,
                             lastname: data.data.lastname,
                             bio: data.data.bio,
                         }
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
                <div className="profile-user">
                    <img
                        className="profile-user-pic"
                        src={
                            this.state.imageUrl ||
                            "https://cdn.dribbble.com/users/4157515/screenshots/8382071/nope_4x.png"
                        }
                        alt={`${this.state.firstname} ${this.state.lastname}`}
                    />

                    {this.state.bio && (
                        <div className="bio">
                            <h2>{this.state.bio}</h2>
                        </div>
                    )}
                    <FriendButton otherUserId={this.props.match.params.id} />
                </div>
            </div>
        );
    }
}
