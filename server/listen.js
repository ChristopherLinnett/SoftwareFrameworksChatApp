module.exports = {
    listen: (app,PORT)=> {
        app.listen(PORT, ()=>{
            let dateNow = new Date();
            let hour = dateNow.getHours();
            let minutes = dateNow.getMinutes();
            console.log(`Server started on port ${PORT} at ${hour}:${minutes}`);
        });
    }
}

