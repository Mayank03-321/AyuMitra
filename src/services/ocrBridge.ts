import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

export interface OcrResult {
  success: boolean;
  engine: string;
  rawText: string;
  ocrConfidence: number;
  lineCount: number;
  error?: string;
}

/**
 * Executes the PaddleOCR Python runner on an image file or base64 payload
 */
export async function runPaddleOcrOnImage(imageInput: string): Promise<OcrResult> {
  return new Promise((resolve) => {
    let tempImagePath = imageInput;
    let isTemp = false;

    // If input is base64 data URL, write to a temporary file
    if (imageInput.startsWith('data:image') || imageInput.length > 500) {
      isTemp = true;
      const base64Data = imageInput.replace(/^data:image\/\w+;base64,/, '');
      tempImagePath = path.join(os.tmpdir(), `ocr_${Date.now()}.png`);
      try {
        fs.writeFileSync(tempImagePath, Buffer.from(base64Data, 'base64'));
      } catch (err: any) {
        return resolve({
          success: false,
          engine: 'PaddleOCR',
          rawText: '',
          ocrConfidence: 0,
          lineCount: 0,
          error: `Failed to create temporary image file: ${err.message}`,
        });
      }
    }

    const scriptPath = path.join(process.cwd(), 'ocr_service', 'paddle_ocr_runner.py');
    const pythonProcess = spawn('python', [scriptPath, '--image', tempImagePath]);

    let stdoutData = '';
    let stderrData = '';

    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      // Clean up temp file
      if (isTemp && fs.existsSync(tempImagePath)) {
        try {
          fs.unlinkSync(tempImagePath);
        } catch {
          // ignore cleanup error
        }
      }

      if (code !== 0 && !stdoutData.trim()) {
        return resolve({
          success: false,
          engine: 'PaddleOCR',
          rawText: '',
          ocrConfidence: 0,
          lineCount: 0,
          error: stderrData || `Process exited with code ${code}`,
        });
      }

      try {
        const parsed = JSON.parse(stdoutData.trim());
        resolve(parsed);
      } catch {
        resolve({
          success: true,
          engine: 'PaddleOCR',
          rawText: stdoutData.trim(),
          ocrConfidence: 0.9,
          lineCount: stdoutData.trim().split('\n').length,
        });
      }
    });
  });
}
