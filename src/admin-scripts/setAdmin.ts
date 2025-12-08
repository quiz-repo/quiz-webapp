
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const makeUserAdmin = async (email:any) => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(` User ${email} is now an admin.`);
  } catch (error) {
    console.error(" Error assigning admin role:", error);
  }
};

// Replace with your user's email
makeUserAdmin("adminemail@example.com");
