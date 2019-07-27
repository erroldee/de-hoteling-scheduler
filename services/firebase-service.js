import * as firebase from "firebase/app";
import "firebase/firestore";
import { CONSTANTS } from "../Constants";

if (!firebase.apps.length) {
    firebase.initializeApp(CONSTANTS.FIREBASE_CONFIG);

    firebase.firestore().settings({
        cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
    });
}

export default firebase.app();