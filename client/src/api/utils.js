import axios from "axios"


//  upload image and return image url
export const imageUpload = async imageData =>  {
    const imageFormData = new FormData()
    imageFormData.append('image', imageData)

     //  upload image in imgbb server using post request
    const {data} = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, imageFormData)

    //  image url response from imgbb 
    return data?.data?.display_url
}