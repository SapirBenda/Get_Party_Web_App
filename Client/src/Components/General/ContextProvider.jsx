import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  deleteUser, 
  signInWithEmailAndPassword,  
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged,
  } from "firebase/auth";
import { auth } from "../../firebase";
import SERVER_PATH from "./config";


const AuthContext = createContext();
const provider = new GoogleAuthProvider();
provider.addScope('email');




export default function ContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()

  async function checkEmailAvailabilityPassword(email) {
    const response = await fetch(`${SERVER_PATH}/getUserIdByEmail?email=${email}`)
    const result = await response.json()
    if (result.length === 0){
      return true
    }
    return false
  }

  async function checkEmailAvailabilityGoogle(user) {
    const email  = user.providerData[0].email
    try{
        const response = await fetch(`${SERVER_PATH}/getUserIdByEmail?email=${email}`)
        const result = await response.json()
        if (result.length === 0){
          return true
        } else {
          if (user.uid && result[0].user_id === user.uid){
            // if the email was created with google sign in the uid will be the same - we should not delete the user
            return false
          }
          else{
            // Show an error message to the user indicating the email is already in use and delete user from firebase 
            deleteUser(user)
            .then(() => {
              console.log('Successfully deleted user');
            })
            .catch((error) => {
              console.log('Error deleting user:', error);
            });
            return false
          }
        } 
    } catch (e) {
        console.log(e)
    }
  };

  const createUser =  (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
    
  };
  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  const googleSignIn = () => {
    return signInWithPopup(auth, provider)
  };
  const googleSignUp = async () => {
      return signInWithPopup(auth, provider)
    }
  const getTokenId = async () => {
    return await auth.currentUser.getIdToken(/* forceRefresh */ true)
  }
  async function signout() {
    await signOut(auth);
    localStorage.removeItem("logged_in")
    setCurrentUser(null);
  };
  const getCurrentUserFromFirebase = () => {
    return auth.currentUser
  };
  const forgotPasswordSendResetEmail = (email) => {
    return sendPasswordResetEmail(auth, email)
  
  }
  
  useEffect( () => {
    const loadUser = onAuthStateChanged(auth, (user) => {
      async function fetchDataIfUserLoggedIn(){
        if (localStorage.getItem("logged_in") && user){
          try {
            const token_id = await getTokenId().catch((error) => console.log("Error getting tokenId"))
            if (token_id){
              const response = await fetch(
                `${SERVER_PATH}/userInfo?user_id=${user.uid}&token_id=${token_id}`
              );
              if (response.status === 401) {
                console.log("NOT AUTHORIZED")
              }
              if (response.status === 403){
                signout()
                alert("Session ended - please sign in again")
              }
              const resultjson = await response.json();
              setCurrentUser(resultjson)
            }
            else{
              console.log("token_id is null or undefiend");
            }
          } catch (error) {
            // alert("Context Provider Error: " + error);
            console.log("There was an error: " + error);
            console.log("user_id: " + user.uid);
            
          }
        }
        else {
          setCurrentUser(null)
          localStorage.removeItem("logged_in")
        }
      }
      fetchDataIfUserLoggedIn()
    })
    return () => {
      loadUser()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ 
     createUser,
     signIn,
     signout,
     googleSignIn,
     googleSignUp, 
     getTokenId, 
     getCurrentUserFromFirebase, 
     checkEmailAvailabilityGoogle, 
     checkEmailAvailabilityPassword,
     forgotPasswordSendResetEmail,
     currentUser, 
     setCurrentUser
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const UserAuth = () => {
  return useContext(AuthContext);
};
