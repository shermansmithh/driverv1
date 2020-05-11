export const environment = {
  production: true,
  firebase: {
    apiKey: "AIzaSyBJhQfWQAcZzUg-Uas6F77m2de_h61ncXY",
    authDomain: "cuberdatabase.firebaseapp.com",
    databaseURL: "https://cuberdatabase.firebaseio.com",
    projectId: "cuberdatabase",
    storageBucket: "cuberdatabase.appspot.com",
    messagingSenderId: "2414210943"
  }
};

export let SHOW_VEHICLES_WITHIN = 100; // within 5km
export let POSITION_INTERVAL = 10000; // 2000ms
export let VEHICLE_LAST_ACTIVE_LIMIT = 60000; // 60s

export let DEAL_STATUS_PENDING = 'pending';
export let DEAL_STATUS_ACCEPTED = 'accepted';
export let TRIP_STATUS_GOING = 'going';
export let TRIP_STATUS_FINISHED = 'finished';
export let DEAL_TIMEOUT = 20000; // 20s

export let EMAIL_VERIFICATION_ENABLED = true; // send verification email after user register
export let ENABLE_SIGNUP = true;
export let SOS = "+919500707757";
export let DEFAULT_AVATAR = "http://placehold.it/150x150";