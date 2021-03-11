// pass 'props' as an argument to get access to the info being passed down from the parent (App)
// we can also use destructuring to pull up the properties inside props
export default function ProfilePic ({ firstname, lastname, imageUrl, toggleUploader }) {
    // console.log('in profilePic: ', toggleUploader);

    imageUrl = imageUrl || "default.jpg";
    return (
        <div>
            <img
                className="profile-pic"
                src={imageUrl}
                alt={firstname + lastname}
                onClick={() => toggleUploader()}
            />
        </div>
    );
}

