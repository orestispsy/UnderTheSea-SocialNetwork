import ProfilePic from "./profilePic";
import BioEditor from "./bioEditor";

// pass 'props' as an argument to get access to the info being passed down from the parent (App)
// we can also use destructuring to pull up the properties inside props
export default function Profile({
    firstname,
    lastname,
    imageUrl,
    toggleUploader,
    bio,
    bioUpdate

}) {

    return (
        <div className="hello">
            <div className="bubbles2"></div>
            Hello, {firstname}
            <div className="profile">
                <ProfilePic
                    imageUrl={imageUrl}
                    toggleUploader={() => toggleUploader()}
                    className="profile-pic-big"
                />
                <BioEditor
                    bio={bio}
                    bioUpdate={bioUpdate}
                />
            </div>
        </div>
    );
}
