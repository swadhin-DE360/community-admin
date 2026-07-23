// IndexedDB helper for storing and retrieving large PDF files
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ward18_documents_db', 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('pdfs')) {
        db.createObjectStore('pdfs');
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const savePdfToIndexedDB = async (id: string, dataUrl: string): Promise<void> => {
  try {
    const db = await openDB();
    const tx = db.transaction('pdfs', 'readwrite');
    const store = tx.objectStore('pdfs');
    store.put(dataUrl, id);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error('Failed to save PDF to IndexedDB', error);
  }
};

export const getPdfFromIndexedDB = async (id: string): Promise<string> => {
  try {
    const db = await openDB();
    const tx = db.transaction('pdfs', 'readonly');
    const store = tx.objectStore('pdfs');
    const request = store.get(id);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || '');
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to get PDF from IndexedDB', error);
    return '';
  }
};

export const deletePdfFromIndexedDB = async (id: string): Promise<void> => {
  try {
    const db = await openDB();
    const tx = db.transaction('pdfs', 'readwrite');
    const store = tx.objectStore('pdfs');
    store.delete(id);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error('Failed to delete PDF from IndexedDB', error);
  }
};
