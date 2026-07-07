const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

class DocumentService {
  async extractText(filePath, fileType) {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      
      if (fileType === 'pdf') {
        const data = await pdfParse(fileBuffer);
        return data.text;
      } else if (fileType === 'txt' || fileType === 'md') {
        return fileBuffer.toString('utf8');
      }
      
      throw new Error('Unsupported file type for text extraction');
    } catch (error) {
      console.error('Text extraction error:', error);
      throw new Error('Failed to extract text from document');
    }
  }

  async deleteFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('File deletion error:', error);
    }
  }
}

module.exports = new DocumentService();