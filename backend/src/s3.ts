import S3 from 'aws-sdk/clients/s3';
import dotenv from 'dotenv';
dotenv.config();


const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

export function uploadFile(picture: string) {
    // console.log(bucketName);
    
    const uploadParams = {
        Bucket: bucketName,
        Body: picture,
        Key: 'test'
    }

    return s3.upload(uploadParams).promise()

}

// exports.uploadFile = uploadFile

// downloads a file from s3
export function getFileStream(fileKey: string) {
    const downloadParams = {
      Key: fileKey,
      Bucket: bucketName
    }
  
    return s3.getObject(downloadParams).createReadStream()
  }

//   exports.getFileStream = getFileStream