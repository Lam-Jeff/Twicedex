import { Hashes } from "./hashUtils";

const IDB_NAME = "scan-cache";
const IDB_VER = 2;
const IDB_STORE = "hashes";

export async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VER);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (db.objectStoreNames.contains(IDB_STORE)) {
        db.deleteObjectStore(IDB_STORE);
      }
      db.createObjectStore(IDB_STORE);
    };
    req.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result);
    req.onerror = (e) => reject((e.target as IDBOpenDBRequest).error);
  });
}

export async function saveHashesToIDB(
  index: Map<number, Hashes>,
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    const store = tx.objectStore(IDB_STORE);
    for (const [id, hashes] of index) {
      store.put(JSON.stringify(hashes), id);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject((e.target as IDBRequest).error);
  });
}

export async function loadHashesFromIDB(): Promise<Map<number, Hashes>> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readonly");
    const store = tx.objectStore(IDB_STORE);
    const map = new Map<number, Hashes>();

    const reqKeys = store.getAllKeys();
    const reqValues = store.getAll();

    reqValues.onsuccess = () => {
      const values = reqValues.result as string[];
      const keys = reqKeys.result as number[];
      keys.forEach((k, i) => {
        try {
          const parsed = JSON.parse(values[i]);
          if (parsed.phash) map.set(k as number, parsed);
        } catch {}
      });
      resolve(map);
    };
    reqValues.onerror = (e) => reject((e.target as IDBRequest).error);
  });
}
