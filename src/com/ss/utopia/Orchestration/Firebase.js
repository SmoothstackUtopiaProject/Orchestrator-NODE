const Constants = require("../resources/constants.json");
const firebase = require("firebase");
require("firebase/app");
require("firebase/auth");
require("firebase/database");

class Firebase {
  static apiKey = Constants.firebase.apiKey;
  static path = Constants.firebase.path;
  static appId = Constants.firebase.appId;
  static authDomain = Constants.firebase.authDomain;
  static databaseURL = Constants.firebase.databaseURL;
  static projectId = Constants.firebase.projectId;
  static messagingSenderId = Constants.firebase.messagingSenderId;
  static version = Constants.firebase.version;

  // =================
  // Firebase App
  // =================
  static getConfig() {
    return {
      apiKey: Firebase.apiKey,
      appId: Firebase.appId,
      authDomain: Firebase.authDomain,
      databaseURL: Firebase.databaseURL,
      projectId: Firebase.projectId,
      messagingSenderId: Firebase.messagingSenderId,
    };
  }

  static initialize(onComplete) {
    (async () => firebase.initializeApp(Firebase.getConfig()))
    ().then(() => onComplete());
  }

  // =================
  // Firebase Auth
  // =================
  static getAuth() {
    try {
      return firebase.auth().currentUser;
    } catch(err) {
      return null;
    }
  }

  static login(username, password, onError, onSuccess) {
    firebase.auth().signInWithEmailAndPassword(username, password)
      .then(() => onSuccess())
      .catch((err) => onError(err));
  }

  // =================
  // Firebase Database
  // =================
  static read(path, onError, onSuccess) {
    const repository = path.split("/")[0];
    firebase.database().ref(repository)
      .child(path.replace(String(`${repository}/`), ""))
      .once("value")
      .then((snapshot) => {
        const payload = snapshot.val();
        if(payload) onSuccess(payload);
        else onError("Item not found.");
      })
      .catch((err) => onError(err));
  }

  static save(path, payload, onError, onSuccess) {
    const repository = path.split("/")[0];
    firebase.database().ref(repository)
      .child(path.replace(String(`${repository}/`), ""))
      .set(payload)
      .then(() => onSuccess())
      .catch((err) => onError(err));
  }

  static saveUnique(path, payload, onError, onSuccess) {
    const repository = path.split("/")[0];
    try {
      const uniqueId = firebase.database().ref(repository)
      .child(path.replace(String(`${repository}/`), ""))
      .push(payload).key;
      onSuccess(uniqueId);
    }
    catch(err) {
      onError(err);
    }
  }

  static delete(path, onError, onSuccess) {
    Firebase.save(path, null, onError, onSuccess);
  }
}
module.exports = Firebase;
