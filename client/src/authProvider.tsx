import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    User,
    setPersistence,
    browserSessionPersistence,
    deleteUser
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { auth, database } from "./firebase";
import { useNavigate } from "react-router-dom";
import { setDoc, doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";

interface IProviderProps {
    /**
     * Manage sign up.
     * 
     * @param {string} email - a string representing an email
     * @param {string} password - a string representing a password
     */
    signUp: (email: string, password: string) => void,

    /**
     * Boolean: True if connexion is not finished, otherwise false.
     */
    loading: boolean;

    /**
     * User | null: Represents a user.
     */
    user: User | null,

    /**
     * Manage sign in.
     * 
     * @param {string} email - a string representing an email
     * @param {string} password - a string representing a password
     */
    signIn: (email: string, password: string) => void,

    /**
     * Manage sign out.
     */
    signOut: () => void,

    /**
     * Retrieve and update user collection when connected on the website.
     * 
     * @param {number[]} data - an array of number representing the user collection
     * @param {string} uid - a string representing the user identifier
     */
    updateCollection: (data: number[], uid: string) => void,

    /**
     * Retrieve and update user wishlist when connected on the website.
     * 
     * @param {number[]} data - an array of number representing the user wishlist
     * @param {string} uid - a string representing the user identifier
     */
    updateWishlist: (data: number[], uid: string) => void,

    /**
     * User cards collection.
     */
    cardsData: number[],

    /**
     * User wishlist.
     */
    wishesData: number[],

    /**
     * Delete user from database.
     */
    removeUser: () => void
}

export const AuthContext = createContext<IProviderProps>({
    signUp: () => { },
    loading: false,
    user: auth.currentUser,
    signIn: () => { },
    signOut: () => { },
    updateCollection: () => { },
    updateWishlist: () => { },
    cardsData: [],
    wishesData: [],
    removeUser: () => { }
});

type Props = {
    /**
     * A React component.
     */
    children?: React.ReactNode;
};


export const AuthProvider = ({ children }: Props) => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [collection, setCollection] = useState<number[]>([]);
    const [wishes, setWishes] = useState<number[]>([]);

    /**
     * Create a user in the database.
     * 
     * @param {string} email - a string representing an email
     * @param {string} password - a string representing a password
     */
    const createUser = async (email: string, password: string) => {
        setIsLoading(true);
        await createUserWithEmailAndPassword(auth, email, password).then((result) => {
            var { user } = result;
            if (user) {
                setCurrentUser(user);
                createCollection(user.uid);
            }
            setIsLoading(false);
        })
            .catch(error => {
                //check for error
                if (error.code === 'auth/email-already-in-use') {
                    alert("Email already exists.");
                } else if (error.code === 'auth/too-many-requests') {
                    console.log('too many requestes: ' + error);
                }
                // you can check for more error like email not valid or something
                setIsLoading(false);
            });
    };

    /**
     * Connect a user to the database.
     * 
     * @param {string} email - a string representing an email
     * @param {string} password - a string representing a password
     */
    const loginUser = async (email: string, password: string) => {
        setIsLoading(true);
        await setPersistence(auth, browserSessionPersistence).then(() => {
            signInWithEmailAndPassword(auth, email, password).then(
                (result) => {
                    var { user } = result
                    if (user) {
                        setCurrentUser(user);
                        navigate('/profile', { replace: true });
                    } else {
                        console.log('empty')
                    }
                    setIsLoading(false);
                }
            ).catch(error => {
                if (error.code === 'auth/wrong-password') {
                    alert("Wrong Email and/or password.");
                } else if (error.code === 'auth/too-many-requests') {
                    console.log('too many request: ' + error)
                } else if (error.code === 'auth/invalid-email') {
                    alert("Wrong Email and/or password.");
                }
                setIsLoading(false);
            });
        })
            .catch((error) => {
                console.log('Error persistence: ' + error)
            });


    };

    /**
     * Log out a user from the database.
     */
    const logOut = async () => {
        setIsLoading(true);
        try {
            await signOut(auth);

        } catch (error) {
            setIsLoading(false);
        }
        setCollection([]);
        setCurrentUser(null);
        setWishes([]);
        navigate('/', { replace: true });
    };

    /**
     * Delete a user from the database.
     */
    const removeUser = () => {
        if (currentUser) deleteUser(currentUser).then(() => {
            console.log("User has been deleted.")
        }).catch((error) => {
            console.log('Failed to delete user', error)
        });
    }

    /**
     * Create a collection in the database for a user using their identifier.
     * 
     * @param {string} uid - a string representing the user identifier
     */
    const createCollection = async (uid: string) => {
        await setDoc(doc(database, "collection", uid), {
            createdAt: serverTimestamp(),
            collection: [],
            wishes: [],
        });
    }

    /**
     * Retrieve the user collection using their identifier.
     * 
     * @param {string} uid - a string representing the user identifier
     */
    const getUserData = async (uid: string) => {
        const docRef = doc(database, 'collection', uid);
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            setCollection(docSnap.data().collection);
            setWishes(docSnap.data().wishes);
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    }

    /**
     * Update a user collection.
     * 
     * @param {number[]} data -  an array of number representing the user cards collection
     * @param {string} uid - a string representing the user identifier
     */
    const updateCollection = async (data: number[], uid: string) => {
        try {
            await updateDoc(doc(database, 'collection', uid), { "collection": data });
            setCollection(data);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    /**
     * Update a user wishlist.
     * 
     * @param {number[]} data -  an array of number representing the user wishlist
     * @param {string} uid - a string representing the user identifier
     */
    const updateWishlist = async (data: number[], uid: string) => {
        try {
            await updateDoc(doc(database, 'collection', uid), { "wishes": data });
            setWishes(data);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                getUserData(user.uid);

            } else {
                setCurrentUser(null);
                setCollection([]);
                setWishes([]);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const authValue: IProviderProps = {
        signUp: createUser,
        loading: isLoading,
        user: currentUser,
        signIn: loginUser,
        signOut: logOut,
        updateCollection: updateCollection,
        updateWishlist: updateWishlist,
        cardsData: collection,
        wishesData: wishes,
        removeUser: removeUser
    };

    return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};