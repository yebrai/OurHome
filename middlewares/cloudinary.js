const cloudinary = require("cloudinary").v2
const multer = require("multer")
const {CloudinaryStorage} = require("multer-storage-cloudinary")

//pasar las credenciales de cloudinary

cloudinary.config({
    coud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

// crea las configuracion del bundle

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        allowedFormats: ["jpg", "png"],
        folder: "patata"
    }
})

const uploader = multer({
    storage
})

//npm install cloudinary multer multer-storage-cloudinary

module.exports = uploader