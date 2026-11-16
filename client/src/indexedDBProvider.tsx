import { createContext, useEffect, useRef, useState } from "react";
import { openDB, IDBPDatabase } from "idb";
import global from "./files/global";
import PropTypes from "prop-types";
interface IProviderProps {
  database: IDBPDatabase | null;
  collection: number[];
  wishlist: number[];
  addData: (db: IDBPDatabase, value: number, id: string) => Promise<void>;
  getData: (db: IDBPDatabase, id: string) => Promise<number[]>;
  deleteData: (db: IDBPDatabase, value: number, id: string) => Promise<void>;
}
export const IndexedDBContext = createContext<IProviderProps>({
  database: null,
  collection: [],
  wishlist: [],
  addData: async () => Promise.resolve(),
  getData: async () => Promise.resolve([]),
  deleteData: async () => Promise.resolve(),
});

type Props = {
  /**
   * A React component.
   */
  children?: React.ReactNode;
};
export const IndexedDBProvider = ({ children }: Props) => {
  const databaseRef = useRef<IDBPDatabase | null>(null);
  const [collection, setCollection] = useState<number[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);

  useEffect(() => {
    const setupDB = async () => {
      databaseRef.current = await initializeDB();
      const collectionDB =
        (await getData(databaseRef.current, "collection")) || [];
      const wishlistDB = (await getData(databaseRef.current, "wishlist")) || [];
      setCollection(collectionDB);
      setWishlist(wishlistDB);
    };
    setupDB();
  }, []);

  /**
   * Initialize the database. Create the database if it does not exist. Open it otherwise.
   */
  const initializeDB = async (): Promise<IDBPDatabase> => {
    return await openDB(global.DATABASE_NAME, global.DATABASE_VERSION, {
      upgrade(db: IDBPDatabase) {
        if (!db.objectStoreNames.contains(global.STORAGE_NAME)) {
          const store = db.createObjectStore(global.STORAGE_NAME);
          store.put("collection", []);
          store.put("wishlist", []);
        }
      },
    });
  };

  /**
   * Add value to an array.
   *
   * @param {IDBPDatabase} db - database
   * @param {number} value - number to add to the array
   * @param {string} id - string representing the array's id
   */
  const addData = async (
    db: IDBPDatabase,
    value: number,
    id: string,
  ): Promise<void> => {
    const tx = db.transaction(global.STORAGE_NAME, "readwrite");
    const store = tx.objectStore(global.STORAGE_NAME);
    const array: number[] = (await store.get(id)) || [];
    array.push(value);
    await store.put(array, id);
    await tx.done;
    if (id === "collection") {
      setCollection(array);
    } else if (id === "wishlist" && !collection.includes(value)) {
      setWishlist(array);
    }
  };

  /**
   * Retrieve data.
   *
   * @param {IDBPDatabase} db - database
   * @param {number} id - string representing the array's id
   *
   * @return {Promise<number[]>} - return data
   */
  const getData = async (db: IDBPDatabase, id: string): Promise<number[]> => {
    const tx = db.transaction(global.STORAGE_NAME, "readonly");
    const store = tx.objectStore(global.STORAGE_NAME);
    const array = (await store.get(id)) || [];
    return array;
  };

  /**
   * Remove value from an array.
   *
   * @param {IDBPDatabase} db - database
   * @param {number} value - number to add to the array
   * @param {string} id - string representing the array's id
   */
  const deleteData = async (
    db: IDBPDatabase,
    value: number,
    id: string,
  ): Promise<void> => {
    const tx = db.transaction(global.STORAGE_NAME, "readwrite");
    const store = tx.objectStore(global.STORAGE_NAME);
    let array: number[] = (await store.get(id)) || [];
    array = array.filter((item: number) => item !== value);
    await store.put(array, id);
    await tx.done;
    if (id === "collection") {
      setCollection(array);
    } else if (id === "wishlist") {
      setWishlist(array);
    }
  };

  const IndexedDBValue: IProviderProps = {
    database: databaseRef.current,
    collection: collection,
    wishlist: wishlist,
    addData: addData,
    getData: getData,
    deleteData: deleteData,
  };
  return (
    <IndexedDBContext.Provider value={IndexedDBValue}>
      {children}
    </IndexedDBContext.Provider>
  );
};

IndexedDBProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
