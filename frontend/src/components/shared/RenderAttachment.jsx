

const RenderAttachment = (file,url) => {

  switch (file) {
    case "image":
      return (
          <img
            src={url}
            alt="Attachment"
            style={{ maxWidth: "100px", borderRadius: "5px" }}
            />
    
        );
    case "audio":
        return (
            <audio controls>
            <source src={url} type="audio/mpeg" />
            Your browser does not support the audio element.
            </audio>
        );
    case "video": 
        return (
            <video width="320" height="240" controls>
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
            </video>
        );
    case "raw":
        return (
     
            <img
                src={url}
                alt="Attachment"
                style={{ maxWidth: "100px", borderRadius: "5px" }}
            />
           
        );
        case "file":
        return (

            <img
                src={url}
                alt="Attachment"
                style={{ maxWidth: "100px", borderRadius: "5px" }}
            />
            
        );
    default:
        return (

            <img
                src={url}
                alt="Attachment"
                style={{ maxWidth: "100px", borderRadius: "5px" }}
            />
         
        );

}}

export default RenderAttachment;