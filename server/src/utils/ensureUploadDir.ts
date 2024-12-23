// src/utils/ensureUploadDir.ts
import fs from 'fs';
import path from 'path';

export const ensureUploadDir = async () => {
  const uploadDir = path.join(__dirname, '../uploads');
  
  try {
    await fs.promises.access(uploadDir);
  } catch {
    await fs.promises.mkdir(uploadDir, { recursive: true });
  }
};