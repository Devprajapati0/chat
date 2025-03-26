export const fileFormat =(url="")=>{
    const file = url.split(".").pop();
    if(file === "mp4" || file === "webm" || file === "ogg"){return "video"}
    if(file === "mp3" || file === "wav" || file === "ogg"){return "audio"}
    if(file === "jpg" || file === "jpeg" || file === "png" || file === "gif"){return "image"}
    if(file === "pdf"){return "pdf"}
    return "file"
}
 
export const Last7Days = () => {
    let result = [];
    for (let i = 0; i < 7; i++) {
        let d = new Date();
        d.setDate(d.getDate() - i);
        result.push(d.toISOString().split('T')[0]);
    }
    return result;
}