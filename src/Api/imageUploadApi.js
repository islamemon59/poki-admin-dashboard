import axios from "axios";

export const uploadImage = async (imageFile) => {
  const formData = new FormData();
  // Change "image" to "images" to match upload.array("images") on the server
  formData.append("images", imageFile); 

  const { data } = await axios.post("https://server.innliv.com/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  console.log("url",data);

  // You also need to fix what you return/access, see *Note 1* below
  return data.urls[0]; // Assuming you only upload one image here
};