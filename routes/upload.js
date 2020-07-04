const express = require('express');
const router = express.Router();
var _ = require('lodash');
/**
 * express-fileupload middleware provide mv function to move files or directory
 */
router.post('/upload_one', async (request,response,next) => {
    try{
        if (request.files){
            console.log(request.files);
            let file_name = request.files.file_name;
            file_name.mv('./uploads/' + file_name.name,(error,result) => {
                if (error) {
                    console.log(error);
                    response.status(400).send({
                        status : false,
                        message : "error in move directory",
                        data: {
                            error: error
                        }
                    });
                }
                response.send({
                    status : true,
                    message : 'file uploaded succesfully!',
                    data: {
                        name : file_name.name,
                        mime_type : file_name.mimetype,
                        size : file_name.size
                    }
                });
            });
        }if (!request.files || Object.keys(request.files).length === 0) {
            return response.status(400).send({
                status : false,
                message : 'file did not  uploaded succesfully!',
                data: {}
          });
        }
    }catch(error){
        console.log(error);
        response.status(500).send(error);
    }
});

upload_multiple_files = (request,response,next) => {
    try{
        if (request.files){
            console.log(request.files);
            const data = [];
            _.forEach(_.keysIn(request.files.files),(key) =>{
                let filename = request.files.files[key];
                filename.mv('./uploads/'+ filename.name,(error,result)=>{
                    if (error) {
                        response.status(400).send({
                            status :false,
                            message :error,
                            data:{}
                        })
                    }
                });
                data.push({
                    name : filename.name,
                    size : filename.size,
                    mime_type : filename.mimetype
                })
            });
            response.status(400).send({
                status : true,
                message : 'file uploaded succesfully!',
                data: data
            });
        }
            if (!request.files || Object.keys(request.files).length === 0) 
            return response.status(400).send({
                status : false,
                message : 'file did not  uploaded succesfully!',
                data: {}
            });
        }
        catch(error){
            console.log(error);
            response.status(500).send(error);
        }
    }

// multiple files upload
router.post('/upload_multiple',upload_multiple_files); 











module.exports = router