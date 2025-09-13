/**
 * Document parser utilities for extracting text from various file formats
 */

import mammoth from 'mammoth';

/**
 * Extract text from a Word document (.docx format)
 * @param file - The Word document file
 * @returns Promise<string> - Extracted text content
 */
export async function extractTextFromDocx(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (result.messages && result.messages.length > 0) {
      console.warn('Word document parsing warnings:', result.messages);
    }
    
    return result.value || '';
  } catch (error) {
    console.error('Error extracting text from Word document:', error);
    throw new Error(`Failed to extract text from Word document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Extract text from a legacy Word document (.doc format)
 * Note: .doc files are not fully supported by mammoth, so we'll provide a fallback message
 * @param file - The Word document file
 * @returns Promise<string> - Extracted text or fallback message
 */
export async function extractTextFromDoc(file: File): Promise<string> {
  // Mammoth doesn't support .doc files (only .docx)
  // We'll return a helpful message for users
  return `[Legacy Word Document: ${file.name}]\n\nLegacy .doc files are not supported for automatic text extraction. Please save your document as .docx format or copy and paste the text content directly.\n\nTo convert:\n1. Open the .doc file in Microsoft Word\n2. Go to File > Save As\n3. Choose "Word Document (.docx)" format\n4. Upload the converted file\n\n`;
}

/**
 * Extract text from any supported document format
 * @param file - The document file
 * @returns Promise<string> - Extracted text content
 */
export async function extractTextFromDocument(file: File): Promise<string> {
  const fileType = file.type || '';
  const fileName = file.name ? file.name.toLowerCase() : '';
  
  try {
    // Handle different file types
    if (fileType === 'text/plain' || fileType === 'text/markdown') {
      return await file.text();
    } 
    else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
      return await extractTextFromDocx(file);
    } 
    else if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
      return await extractTextFromDoc(file);
    } 
    else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      // PDF processing would require additional setup
      return `[PDF File: ${file.name}]\nPDF text extraction requires additional setup. Please copy and paste the text content instead.\n\n`;
    } 
    else {
      return `[File: ${file.name}]\nUnsupported file type (${fileType}). Please copy and paste the text content.\n\n`;
    }
  } catch (error) {
    console.error(`Error processing file ${file.name}:`, error);
    return `[Error: ${file.name}]\nFailed to process this file. Please try copying and pasting the text content instead.\nError: ${error instanceof Error ? error.message : 'Unknown error'}\n\n`;
  }
}

/**
 * Process multiple files and extract text from all of them
 * @param files - Array of files to process
 * @param onProgress - Optional callback to report progress
 * @returns Promise<string> - Combined extracted text from all files
 */
export async function processMultipleFiles(
  files: File[], 
  onProgress?: (progress: number, currentFile?: string) => void
): Promise<string> {
  let combinedText = '';
  const totalFiles = files.length;
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const progress = Math.round(((i + 1) / totalFiles) * 100);
    
    if (onProgress) {
      onProgress(progress, file.name);
    }
    
    try {
      const extractedText = await extractTextFromDocument(file);
      combinedText += `=== ${file.name} ===\n\n${extractedText}\n\n`;
    } catch (error) {
      console.error(`Failed to process file ${file.name}:`, error);
      combinedText += `=== ${file.name} (Error) ===\n\nFailed to process this file. Please try again or copy and paste the content manually.\n\n`;
    }
  }
  
  return combinedText;
}
