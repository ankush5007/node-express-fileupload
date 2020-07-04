const express = require('express');
const router = express.Router();
var _ = require('lodash');
const multer  =require('multer');
//multer configration
const FILE_PATH = 'uploads/';

const upload = multer({
  dest: FILE_PATH,
  limits: {
    files: 5, // allow up to 5 files per request,
    fieldSize: 2 * 1024 * 1024 // 2 MB (max file size)
},
fileFilter: (req, file, cb) => {
    // allow images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image are allowed.'), false);
    }
    cb(null, true);
}
});

/**
 *  To handle single file use object.single(filename)
 *  To handle multiple file use object.array(filename,max_count)
 */

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


// multer upload single gile
// in case of single instanc saved in request.file
router.post('/upload_multer',upload.single('my_file'),(request,response,next) => {
    file = request.file;
    console.log(file);
    if (file){
        response.status(200).send({
            status : true,
            message : 'file uploaded successfully!',
            data : file
        })
    }else{
        response.status(400).send({
            status : false,
            message :'file not uploaded',
            data : file
        })
    }
});

// multer upload multiples files
// in case of multiple instane save in request.files 
// we used this approach for proper error handling

var upload_one = multer({
    dest: FILE_PATH,
}).array('files',4);
router.post('/upload_multer_multi',(request,response,next) => {
    upload_one(request,response,(error) => {
        if (error){
            response.status(400).send({
                status : false,
                message: error,
                data:{}
            });
        }else{
            response.status(200).send({
                status : true,
                message : 'file uploaded successfully!',
                data : request.files
            })
        }
    });
});



module.exports = router