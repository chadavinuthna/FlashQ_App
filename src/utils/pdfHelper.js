/**
 * Utility for parsing exact PDF page counts from binary ArrayBuffers
 * and managing PDF file preview Object URLs.
 */

export function parsePdfPageCount(buffer) {
  try {
    if (!buffer) return 1;
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
    }

    // 1. Search for /Type /Pages dictionary with /Count N
    const countMatches = [...binary.matchAll(/\/Type\s*\/Pages[\s\S]*?\/Count\s+(\d+)/gi)];
    if (countMatches.length > 0) {
      let maxCount = 0;
      for (const m of countMatches) {
        const val = parseInt(m[1], 10);
        if (!isNaN(val) && val > maxCount) {
          maxCount = val;
        }
      }
      if (maxCount > 0) return maxCount;
    }

    // 2. Search for general /Count N in PDF dictionary
    const generalCountMatches = [...binary.matchAll(/\/Count\s+(\d+)/gi)];
    if (generalCountMatches.length > 0) {
      let maxCount = 0;
      for (const m of generalCountMatches) {
        const val = parseInt(m[1], 10);
        if (!isNaN(val) && val > maxCount) {
          maxCount = val;
        }
      }
      if (maxCount > 0) return maxCount;
    }

    // 3. Count occurrences of /Type /Page (excluding /Type /Pages)
    const pageMatches = binary.match(/\/Type\s*\/Page\b/gi);
    if (pageMatches && pageMatches.length > 0) {
      return pageMatches.length;
    }
  } catch (err) {
    console.warn('[pdfHelper] Page count extraction error:', err);
  }
  return 1;
}

export function getExactPageCountFromFile(fileOrBlob) {
  return new Promise((resolve) => {
    if (!fileOrBlob) {
      resolve(1);
      return;
    }

    // Standard Web File / Blob
    if (typeof FileReader !== 'undefined' && (fileOrBlob instanceof Blob || fileOrBlob instanceof File)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const buffer = e.target.result;
        const pageCount = parsePdfPageCount(buffer);
        resolve(pageCount);
      };
      reader.onerror = () => resolve(1);
      reader.readAsArrayBuffer(fileOrBlob);
      return;
    }

    // React Native / Expo Uri fallback fetch
    if (typeof fileOrBlob === 'string' && (fileOrBlob.startsWith('http') || fileOrBlob.startsWith('file:') || fileOrBlob.startsWith('blob:'))) {
      fetch(fileOrBlob)
        .then(res => res.arrayBuffer())
        .then(buffer => {
          const pageCount = parsePdfPageCount(buffer);
          resolve(pageCount);
        })
        .catch(() => resolve(1));
      return;
    }

    resolve(1);
  });
}
