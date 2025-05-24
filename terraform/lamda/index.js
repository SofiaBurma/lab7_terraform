const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  endpoint: 'http://s3.localhost.localstack.cloud:4566',
  s3ForcePathStyle: true,
  accessKeyId: 'test',
  secretAccessKey: 'test',
  region: 'us-east-1',
});

exports.handler = async (event) => {
  const srcBucket = event.Records[0].s3.bucket.name;
  const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  const destBucket = 's3-finish';

  try {
    // Отримати об'єкт
    const object = await s3.getObject({ Bucket: srcBucket, Key: srcKey }).promise();

    // Завантажити об'єкт у новий бакет
    await s3.putObject({
      Bucket: destBucket,
      Key: srcKey,
      Body: object.Body,
    }).promise();

    console.log(`Copied ${srcKey} from ${srcBucket} to ${destBucket}`);
  } catch (err) {
    console.error('Error copying object:', err);
    throw err;
  }
};