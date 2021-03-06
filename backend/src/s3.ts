import S3 from 'aws-sdk/clients/s3';
import dotenv from 'dotenv';
const fs = require('fs')

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

export function uploadFile(file: any) {
  const fileStream = fs.createReadStream(file.path)
  // console.log(bucketName);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename
  }
  return s3.upload(uploadParams).promise()
}

export function deleteFile(key: string) {
  const downloadParams = {
    Key: key,
    Bucket: bucketName
  }
  s3.deleteObject(downloadParams, function (err, data) {
    if (err) console.log(err, err.stack);
  })
}

// exports.uploadFile = uploadFile

// downloads a file from s3
export async function getFileStream(key: string) {
  const downloadParams = {
    Key: key,
    Bucket: bucketName
  }
  // var picture = ''

  return s3.getObject(downloadParams).createReadStream()
  // const picture = 
  // const picture = s3.getObject(downloadParams, (err, data) => {
  // return data.Body.toString('utf-8')
  // return 1
  // console.log(picture); // prints the string i want
  // return picture
  // })

  // const compressedFile = await s3.getObject(downloadParams).promise();
  // console.log(compressedFile);
  // console.log(compressedFile.toString());
  
  // var reader = new FileReader();
  // await reader.readAsDataURL(compressedFile);
  // reader.onload = function () {
  //     const jpegData = reader.result;
  // // return await data.Body.toString('utf-8');
  // return jpegData
  // return compressedFile



  // console.log(picture); // prints a big Request object

  // return picture

}

//   exports.getFileStream = getFileStream