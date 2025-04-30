const { Op } = require('sequelize');
const { Paper, Subject } = require('../models');
const { uploadFileToS3, getSignedFileUrl, deleteFileFromS3 } = require('./s3Service');

exports.searchPapers = async ({ query, fromYear, toYear, terms }) => {
  const yearStart = parseInt(fromYear);
  const yearEnd = parseInt(toYear);

  if (isNaN(yearStart) || isNaN(yearEnd)) {
    throw new Error('Invalid year range');
  }

  // Convert terms to array if it's a string
  const termArray = typeof terms === 'string' ? [terms] : terms;

  const condition = {
    term: termArray,
    year: { [Op.between]: [yearStart, yearEnd] },
    ...(query && {
      [Op.or]: [
        { subject_id: { [Op.like]: `%${query}%` } },
        { title: { [Op.like]: `%${query}%` } },
      ],
    }),
  };

  const papers = await Paper.findAll({
    where: condition,
    include: [{
      model: Subject,
      as: 'subject',
      attributes: ['subject_id', 'subject_name']
    }],
    order: [['year', 'DESC']]
  });

  // Generate signed URLs for each paper
  const papersWithSignedUrls = await Promise.all(
    papers.map(async (paper) => {
      const paperData = paper.toJSON();
      try {
        // Extract key from the stored URL and generate a signed URL
        const fileKey = paperData.file_url.replace(`https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/`, '');
        paperData.signed_url = await getSignedFileUrl(fileKey);
      } catch (error) {
        console.error(`Error generating signed URL for paper ${paperData.paper_id}:`, error);
        paperData.signed_url = paperData.file_url; // Fallback to the stored URL
      }
      return paperData;
    })
  );

  return papersWithSignedUrls;
};

exports.uploadPaper = async (user, file, subjectCode, year, term, title) => {
  try {
    // Check if the subject exists
    const subject = await Subject.findByPk(subjectCode);
    if (!subject) {
      throw new Error(`Subject with code ${subjectCode} not found`);
    }

    // Upload to S3
    const fileUrl = await uploadFileToS3(file, subjectCode, year, term);
    
    // Create paper record in the database
    return Paper.create({
      subject_id: subjectCode,
      title: title || `${subject.name} - ${term} ${year}`,
      year,
      term,
      file_url: fileUrl,
      uploaded_by: user.user_id, // Use the database user_id
      is_deleted: false
    });
  } catch (error) {
    console.error('Error in uploadPaper:', error);
    throw error;
  }
};

exports.deletePaper = async (user, paperId) => {
  const paper = await Paper.findByPk(paperId);
  if (!paper) throw new Error('Paper not found');
  
  // Check authorization - user must be admin or the uploader
  if (paper.uploaded_by !== user.id && user.role !== 'admin')
    throw new Error('Unauthorized');
  
  // Delete the file from S3
  await deleteFileFromS3(paper.file_url);
  
  // Delete paper record from database
  await paper.destroy();
  
  return { message: 'Paper deleted successfully' };
};
