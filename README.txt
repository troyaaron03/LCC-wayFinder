CAMPUS WAYFINDER

A responsive campus directory and navigation app built with HTML, CSS, and
JavaScript modules. It keeps the existing Firebase Authentication and Firestore
setup and uses Tailwind CSS for the browser UI.

FIREBASE SETUP
1. Enable Email/Password in Firebase Authentication.
2. Keep Email/Password enabled in Firebase Authentication. Email verification is not required by this app.
3. Create a Firestore database.
4. Add an administrator document at users/{UID} with role = admin. To enable
   role promotion, provision at least one trusted superadmin by setting that
   account's users/{UID} document role to superadmin in the Firebase console.
5. Publish the updated Firestore rules first:
   firebase deploy --only firestore:rules --project campus-navigation-system-4292f
   The signed-in admin and superadmin roles can read destination transactions.
   If the admin page reports "Missing or insufficient permissions", make sure
   the latest rules are deployed to the same Firebase project used by the app.
6. Deploy the student-number and account-management Cloud Functions:
   firebase deploy --only functions --project campus-navigation-system-4292f
   Enter the Firebase Web API key when prompted for FIREBASE_WEB_API_KEY. This
   is the same public key used in the app configuration, not an admin secret.
   Cloud Functions deployment requires the Firebase project to have billing
   enabled.

SIGN-IN
Sign in with the campus email used to create the account. Use Forgot password?
on the sign-in page to request a reset email. Student numbers are used for
registration and account records; they are not accepted as a login identifier.
Students can check in even when no student number is linked.

ADMIN USER LIST TROUBLESHOOTING
The admin User accounts page reads account profiles directly from the Firestore
users collection, so it does not require Cloud Functions or a paid Firebase plan.
Only accounts with a Firestore profile appear. This page is view-only; role
changes and account deletion are not available.

STUDENT ACCOUNTS
Students register with an 8-digit student number, campus email, and a password
of at least 8 characters containing at least one uppercase letter. Email
verification is not required for sign-in. Students sign in with their campus
email; the student number is linked privately to their account and included in
arrival records when available.

Student, visitor, and faculty accounts can use the map and request their device
location; visitor and faculty accounts cannot create student arrival
transactions. The admin User accounts tab is view-only and lists Firestore
profiles. Role changes and account deletion are unavailable. Student numbers
are not used to sign in.

RUN
Open the cns folder in VS Code and use Live Server on index.html. The Tailwind
browser build and QR renderer are loaded from public CDNs, so an internet
connection is needed. The browser-based Tailwind build is convenient for this
static prototype; use a compiled Tailwind build before production deployment.

BRANDING ASSETS
Keep assets/campus-logo.jpg and assets/campus-building.jpg in place when
deploying. The full college logo appears in the app header; the campus photo is
used on room cards that do not have their own image.

ROOMS AND GPS DIRECTIONS
Administrators can add a latitude and longitude to a room in Rooms & locations.
Both coordinates are required together. Coordinates are optional; rooms without
them remain available in the directory. Students can select Use my location to
start live browser location tracking, see nearby rooms first, and open a Google
Maps route. GPS requires the user's permission and a secure context (HTTPS
or localhost). Use my location streams device position while tracking is active
so the distance to the selected destination updates while walking. A user's
location is held in page memory only and is not written to Firebase. It is
included in a Google Maps link only if the user chooses to open directions.
Faculty locations can also be given latitude and longitude in the faculty editor.
Mapped faculties appear as map destinations and can use camera compass guidance;
camera arrival check-ins remain limited to rooms.
The Computer Lab entry defaults to 14.803056, 121.069722, converted from the
coordinates supplied for the campus. Administrators should verify the pin is at
the correct entrance before relying on directions.

MAP DIRECTIONS, ARRIVALS, AND FEEDBACK
Students can choose a destination from the room directory, request their
current location, and open available routes in Google Maps. Opening a route
shows the feedback form in Campus Wayfinder. Students can also select Use
camera; on-device OCR checks room numbers and names across all room and faculty
destinations. When one is recognized, the student's arrival is recorded
automatically with the destination and account name. This creates a destination
visit record that admins can review. Opening a Google Maps route records a
map-use transaction and opens the feedback form. OCR is approximate and does not
prove physical location. Camera frames are processed on the device and are not
recorded or uploaded.
Use my location starts live GPS updates so the distance to the selected
destination updates while walking. Student camera arrivals can be recorded
without a student number; available student numbers are included when present.

Camera access and OCR need an internet connection to load the recognition
library and HTTPS or localhost for camera access. Students can still use room
directions without granting camera or location access.

QR GUIDES
Administrators add a guide name and an HTTP/HTTPS destination. The app generates
the QR image in the browser; no image upload or QR image storage is needed.
Existing QR records with a pdfLink continue to work.

IMAGES
Faculty and room images are resized/compressed in the browser and stored as data
URLs in Firestore documents. Original images may be up to 10 MB; the compressed
image is kept below approximately 700 KB. This is suitable for a modest
prototype, not a large production image library.

IMPORTANT
Keep Firestore Security Rules enabled. Verified students can read campus
information, submit feedback, and create their own arrival records; only admins
can manage campus records and review feedback and destination visits.
Do not put passwords in project files.
