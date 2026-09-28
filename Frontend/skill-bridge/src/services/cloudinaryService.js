const CLOUDINARY_CLOUD_NAME =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_IMAGE_UPLOAD_PRESET =
    import.meta.env.VITE_CLOUDINARY_IMAGE_UPLOAD_PRESET;

const CLOUDINARY_COMMUNITY_UPLOAD_PRESET =
    import.meta.env.VITE_CLOUDINARY_COMMUNITY_UPLOAD_PRESET;

const CLOUDINARY_FILE_UPLOAD_PRESET =
    import.meta.env.VITE_CLOUDINARY_FILE_UPLOAD_PRESET;


const CLOUDINARY_IMAGE_UPLOAD_URL =
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const CLOUDINARY_FILE_UPLOAD_URL =
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`;


export const uploadImage = async (file) => {

    if (!file) {
        throw new Error("Please select an image");
    }

    const formData = new FormData();

    formData.append("file", file);

    formData.append(
        "upload_preset",
        CLOUDINARY_IMAGE_UPLOAD_PRESET
    );

    formData.append(
        "folder",
        "profiles"
    );

    const response = await fetch(
        CLOUDINARY_IMAGE_UPLOAD_URL,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {

        const errorData =
            await response.json().catch(() => ({}));

        throw new Error(
            errorData?.error?.message ||
            "Profile image upload failed"
        );
    }

    const data = await response.json();

    return data.secure_url;
};


export const uploadCommunityCover = async (file) => {

    if (!file) {
        throw new Error("Please select a cover image");
    }

    const formData = new FormData();

    formData.append("file", file);

    formData.append(
        "upload_preset",
        CLOUDINARY_COMMUNITY_UPLOAD_PRESET
    );

    formData.append(
        "folder",
        "Communities/covers"
    );

    const response = await fetch(
        CLOUDINARY_IMAGE_UPLOAD_URL,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {

        const errorData =
            await response.json().catch(() => ({}));

        throw new Error(
            errorData?.error?.message ||
            "Community cover upload failed"
        );
    }

    const data = await response.json();

    return data.secure_url;
};


export const uploadCommunityIcon = async (file) => {

    if (!file) {
        throw new Error("Please select a community icon");
    }

    const formData = new FormData();

    formData.append("file", file);

    formData.append(
        "upload_preset",
        CLOUDINARY_COMMUNITY_UPLOAD_PRESET
    );

    formData.append(
        "folder",
        "Communities/icons"
    );

    const response = await fetch(
        CLOUDINARY_IMAGE_UPLOAD_URL,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {

        const errorData =
            await response.json().catch(() => ({}));

        throw new Error(
            errorData?.error?.message ||
            "Community icon upload failed"
        );
    }

    const data = await response.json();

    return data.secure_url;
};


export const uploadFile = async (file) => {

    if (!file) {
        throw new Error("Please select a file");
    }

    const formData = new FormData();

    formData.append("file", file);

    formData.append(
        "upload_preset",
        CLOUDINARY_FILE_UPLOAD_PRESET
    );

    formData.append(
        "folder",
        "tasks"
    );

    const response = await fetch(
        CLOUDINARY_FILE_UPLOAD_URL,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {

        const errorData =
            await response.json().catch(() => ({}));

        throw new Error(
            errorData?.error?.message ||
            "Task file upload failed"
        );
    }

    const data = await response.json();

    return {
        url: data.secure_url,
        publicId: data.public_id,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
    };
};