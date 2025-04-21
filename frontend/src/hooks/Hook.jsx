import { useEffect } from "react";
// import { toast } from "react-toastify"; // if using toast

const useErrors = (errors = []) => {
  useEffect(() => {
    errors.forEach((error) => {
      if (error?.isError) {
        // toast.error(error.message); // enable this if you use toast
        console.error(error.message);
      }
    });
  }, [errors]);
};


export const useSocketEvents = (socket,handler) => {
  useEffect(()=>{
    Object.entries(handler).forEach(([event, handler]) => {
      // console.log("event",event)
      // console.log("handler",handler)
      
      socket.on(event, handler);
    })

    return () => {
      Object.entries(handler).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  })
}

export default useErrors;
