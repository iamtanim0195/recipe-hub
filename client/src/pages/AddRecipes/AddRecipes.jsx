"use client";
import { Button, Image, Upload } from "antd";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { toast } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { addRecipe } from "../../api/recipes";

const AddRecipes = () => {
    const [recipes, setRecipes] = useState({
        thumbnail: "",
    });

    console.log(recipes)
    // image upload
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState([]);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    // Upload button
    const uploadButton = (
        <button
            style={{
                border: 0,
                background: "none",
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload Thumbnail
            </div>
        </button>
    );

    // Getting Input field data
    const { user } = useAuth()
    const handleInputChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setRecipes((prev) => ({
            ...prev,
            [name]: value,
            creatorEmail: user.email,
            watchCount: 0,
            purchased_by: [],
        }));
    };

    // Submitting all Data
    const handleSubmit = async () => {

        try {
            const imgData = new FormData();
            imgData.append("image", fileList[0].originFileObj);

            const response = await fetch(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
                {
                    method: "POST",
                    body: imgData,
                }
            );


            if (response.ok) {
                const data = await response.json();
                const imageUrl = data.data.url;

                recipes.thumbnail = imageUrl;

                try {
                    const recipeData = await addRecipe(recipes)
                    toast.success("Recipes added successfully")
                    console.log(recipeData);
                    setRecipes('');
                } catch (error) {
                    console.log(error);
                    toast.error("Recipes added failed");
                }
            }
        } catch (error) {
            toast.error("Something went wrong!");
            console.log("Error uploading image: ", error);
        }
    };

    return (
        <div className="overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" >
            <div className="flex justify-center ">
                <div className="z-40">
                    <h2 className="text-xl  mb-4 text-white text-center">Upload Recipes</h2>
                    <form className="space-y-4 flex flex-col items-center justify-center">
                        <div className="overflow-hidden">
                            {/* Upload Thumbnail */}
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={handlePreview}
                                onChange={handleChange}
                                className="text-blue-600 z-40"
                            >
                                {fileList.length == 1 ? null : uploadButton}
                            </Upload>

                            {/* Preivew Thumbnail Start */}
                            {previewImage && (
                                <Image
                                    alt="image"
                                    wrapperStyle={{
                                        display: "none",
                                    }}
                                    preview={{
                                        visible: previewOpen,
                                        onVisibleChange: (visible) => setPreviewOpen(visible),
                                        afterOpenChange: (visible) =>
                                            !visible && setPreviewImage(""),
                                    }}
                                    src={previewImage}
                                />
                            )}
                            {/* Preivew Thumbnail  End */}
                        </div>

                        <div className="flex flex-col gap-4">
                            <input
                                className="bg-pink-600 px-4 py-2 w-[40vw] rounded-md text-white placeholder:text-yellow-50"
                                onChange={handleInputChange}
                                name="RecipeName"
                                placeholder="Enter Recipe Name"
                            />

                            <input
                                className="bg-pink-600 px-4 py-2 w-[40vw] rounded-md text-white placeholder:text-yellow-50"
                                onChange={handleInputChange}
                                name="RecipeDetails"
                                placeholder="Enter Recipe details"
                            />
                            <input
                                className="bg-pink-600 px-4 py-2 w-[40vw] rounded-md text-white placeholder:text-yellow-50"
                                onChange={handleInputChange}
                                name="Video"
                                placeholder="Enter youtube video code"
                            />
                            <input
                                className="bg-pink-600 px-4 py-2 w-[40vw] rounded-md text-white placeholder:text-yellow-50"
                                onChange={handleInputChange}
                                name="Country"
                                placeholder="Enter Country "
                            />
                            <select onChange={handleInputChange}
                                name="Category " className="select focus:border-white bg-pink-600 px-4 py-2 w-[40vw] rounded-md text-white placeholder:text-yellow-50">
                                <option selected>Breakfast</option>
                                <option>Lunch</option>
                                <option>Dinner</option>
                            </select>
                        </div>
                    </form>
                    <div className="flex gap-2 justify-end mt-4">
                        <Button
                            size="large"
                            className="bg-green-400 mb-3 text-white border-none"
                            onClick={handleSubmit}
                        >
                            Create
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export default AddRecipes