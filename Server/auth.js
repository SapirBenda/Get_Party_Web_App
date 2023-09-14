

// Initialize firebase-admin
const admin = require('firebase-admin');
var CREDENTIALS_PATH;

if (process.env.NODE_ENV === "production") {
  CREDENTIALS_PATH="/projects/383395962608/secrets/auth_key/auth_key.json"
} else {
  CREDENTIALS_PATH="./auth_key.json"
}

const auth_app = admin.initializeApp({
  credential: admin.credential.cert(CREDENTIALS_PATH)
});

const query = require("./sqlQuery");

const http = require('http');

const {getAuth} = require('firebase-admin/auth');

async function verify_auth(req, res, next){
  const url = req.url.split("?")[0]
  try{
    getAuth()
    .verifyIdToken(req.query.token_id)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      if (uid === req.query.user_id){
        next()
      }
      else {
        res.status(403).send(error)
      }
    }).catch((error) => {
      if (error.code == 'auth/id-token-revoked') {
        // Token has been revoked. Inform the user to reauthenticate or signOut() the user.
        res.status(403).send("error accured:" + error)
        console.log("error accured: ", error, "url: ", url)
      } else {
        // Token is invalid.
        res.status(401).send(error)
        console.log("user not authorized or error accured: ", error, "url: ", url)
      }
      
    return
  })
  } catch (error){
    console.log("error accured: ", error, "url: ", url)
    return
  }
}

async function production_authorization_for_event_change(req, res, next){
  const url = req.url.split("?")[0]
  try{
    getAuth()
    .verifyIdToken(req.query.token_id)
    .then(async (decodedToken) => {
      const uid = decodedToken.uid;
      const event = await query.getEventByIdQuery(parseInt(req.query.event_id))
      if ((uid === req.query.user_id) && (event[0].user_id === req.query.user_id)){
        next()
      }
      else{
        res.status(405).send({error:"Method not authorized"})
        console.log("Method not authorized, user_id = ", uid)
      }
      }).  
    catch((error) => {
      if (error.code == 'auth/id-token-revoked') {
        // Token has been revoked. Inform the user to reauthenticate or signOut() the user.
        res.status(403).send(error)
        console.log("error accured: ", error, "url: ", url)
      } else {
        // Token is invalid.
        res.status(401).send(error)
        console.log("user not authorized or error accured: ", error, "url: ", url)
      }
      
    return
  })
  } catch (error){
    console.log("error accured: ", error, "url: ", url)
    return
  }
}


module.exports = {verify_auth, production_authorization_for_event_change}
  
