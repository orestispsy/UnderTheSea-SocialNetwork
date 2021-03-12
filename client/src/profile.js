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
    updateBio
}) {
    console.log('bio in profile: ', bio);

    return (
        <div className="profile">
            <h1>Welcome, {firstname}</h1>
            <ProfilePic
                imageUrl={imageUrl}
                toggleUploader={() => toggleUploader()}
                className="profile-pic-big"
            />
            <BioEditor bio={bio} updateBio={updateBio} />
        </div>
    );
}
