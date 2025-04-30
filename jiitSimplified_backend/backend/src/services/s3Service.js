const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { s3Client, bucketName } = require('../config/s3Config');
const fs = require('fs');
const path = require('path');

/**
 * Upload a file to S3
 * @param {Object} file - The file object from multer
 * @param {string} subjectCode - Subject code to create folder structure
 * @param {number} year - Year of the paper
 * @param {string} term - Term identifier (T1, T2, T3)
 * @returns {Promise<string>} The URL of the uploaded file
 */
const uploadFileToS3 = async (file, subjectCode, year, term) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Create a unique file name
    const fileName = `${subjectCode}/${year}/${term}/${Date.now()}-${path.basename(file.originalname)}`;
    
    // Prepare upload parameters
    const uploadParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: fs.createReadStream(file.path),
      ContentType: file.mimetype,
    };

    // Upload to S3
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
    
    // Generate a URL (this is a placeholder - in production you'd use getSignedUrl or your CloudFront URL)
    const fileUrl = `https://${bucketName}.s3.amazonaws.com/${fileName}`;
    
    // Clean up the temp file
    fs.unlinkSync(file.path);
    
    return fileUrl;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};

/**
 * Generate a signed URL for temporary access to a file
 * @param {string} fileKey - The S3 object key
 * @returns {Promise<string>} A pre-signed URL for the file
 */
const getSignedFileUrl = async (fileKey) => {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });
    
    // URL expires in 3600 seconds (1 hour)
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw error;
  }
};

/**
 * Extract the file key from an S3 URL
 * @param {string} fileUrl - Full S3 URL
 * @returns {string} The file key
 */
const getFileKeyFromUrl = (fileUrl) => {
  // Parse the URL to extract just the key portion
  const urlObj = new URL(fileUrl);
  // Remove the first / to get the key
  return urlObj.pathname.substring(1);
};

/**
 * Delete a file from S3
 * @param {string} fileUrl - The full S3 URL of the file
 * @returns {Promise<boolean>} Success status
 */
const deleteFileFromS3 = async (fileUrl) => {
  try {
    const fileKey = getFileKeyFromUrl(fileUrl);
    
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });
    
    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw error;
  }
};

module.exports = {
  uploadFileToS3,
  getSignedFileUrl,
  getFileKeyFromUrl,
  deleteFileFromS3,
}; 