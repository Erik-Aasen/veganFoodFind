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

export function uploadFile(key: string, picture: string) {
  // console.log(bucketName);

  const uploadParams = {
    Bucket: bucketName,
    Body: picture,
    Key: key
  }

  return s3.upload(uploadParams).promise()

}

// exports.uploadFile = uploadFile

// downloads a file from s3
export async function getFileStream(fileKey: string) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }
  // var pictureString = ''

  // return s3.getObject(downloadParams).createReadStream()
  // const pictureString = 
  // const pictureString = s3.getObject(downloadParams, (err, data) => {
    // return data.Body.toString('utf-8')
    // return 1
    // console.log(pictureString); // prints the string i want
    // return pictureString
  // })

  const data = await s3.getObject(downloadParams).promise();
  return data.Body.toString('utf-8');
  


  // console.log(pictureString); // prints a big Request object

  // return picture

}

//   exports.getFileStream = getFileStream