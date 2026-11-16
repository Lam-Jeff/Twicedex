import { createContext, useContext } from "react";
import { useCollection } from "./useOwned";

const CollectionContext = createContext<ReturnType<
  typeof useCollection
> | null>(null);

export function CollectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const collection = useCollection();
  return (
    <CollectionContext.Provider value={collection}>
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollectionContext() {
  const ctx = useContext(CollectionContext);
  if (!ctx)
    throw new Error("useCollectionContext doit être dans CollectionProvider");
  return ctx;
}
