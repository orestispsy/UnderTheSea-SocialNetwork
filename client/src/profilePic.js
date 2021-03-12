// pass 'props' as an argument to get access to the info being passed down from the parent (App)
// we can also use destructuring to pull up the properties inside props
export default function ProfilePic ({ firstname, lastname, imageUrl, toggleUploader, className }) {
    // console.log('in profilePic: ', toggleUploader);

    imageUrl = imageUrl || "default.jpg";
    return (
        <div>
            <img
                className={className}
                src={imageUrl}
                onClick={() => toggleUploader()}
            />
        </div>
    );
}

