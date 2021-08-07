import { useState } from 'react';
import ImageUploader from 'react-images-upload';

export default function ImageUpload() {
    
    const [picture, setPicture] = useState([]);

    const onDrop = (pic) => {
        setPicture(pic);
    }
        
    return (
        <div>
            <ImageUploader
                withIcon={true}
                buttonText='Choose image'
                onChange={onDrop}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
            />
        </div>
    )
}
