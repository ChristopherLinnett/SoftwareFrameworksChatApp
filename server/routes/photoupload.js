const formidable = require('formidable')

module.exports = (app, db, uuidv4) => {
    app.post("/profile/updatephoto", (req, res) => {
        var form = new formidable.IncomingForm({ uploadDir: './images'});
        form.keepExtensions = true;
        form.on('error', (error)=>{
            res.send({
                success: false,
                data: {},
                numberOfImages: 0,
                message:" Cannot upload images. error is :"+ error
            });
            throw error;
        });

        form.on ('fileBegin', function(formname, file) {
            const uniqueFileName = uuidv4()
            file.filepath = form.uploadDir + "/" + uniqueFileName +'.jpg';
            file.newFilename = uniqueFileName+'.jpg'
        })

        form.parse(req, (err, fields, files)=>{
            console.log(files.file.newFilename)
            console.log(fields)
            if (fields.chatMsg == 'false'){
            db.collection("Users").updateOne({username: fields.username}, { $set: {profileImg : files.file.newFilename}})
            } 
            if (fields.chatMsg == 'true'){
                res.send({
                    filename: files.file.newFilename,
                })
            } else {
                res.send({
                    result: "OK",
                    filename: files.file.newFilename,
                    data: {'filename': files.file.newFilename, 'size': files.file.size},
                    numberOfImages: 1,
                    message: 'upload successful'
                })
            }
        })
    })
}