import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryResponse } from './upload-image.response';
import * as streamifier from 'streamifier';

@Injectable()
export class UploadImageService {
    uploadFile(file : Express.Multer.File) : Promise<CloudinaryResponse> {
        return new Promise<CloudinaryResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('Upload failed: result is undefined'));
                    resolve(result);
                }
            )
            streamifier.createReadStream(file.buffer).pipe(uploadStream)
        })
    }
}
  
