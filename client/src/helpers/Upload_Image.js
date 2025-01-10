const Upload_Image = async (image) => {
  const formData = new FormData();
  formData.append("file", image); // Append the file to the FormData object
  formData.append("upload_preset", "react_mern_product"); // Append the upload preset to the FormData objectfile to the FormData object

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDNARY_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    return response.json();
  } catch (error) {
    console.log(error);
  }
};
export default Upload_Image;
