# LA CONCEPCION COLLEGE

## Bachelor of Science in Information Systems

### A Responsive Web Mapping and Navigation Application with Feedback Evaluation and Kiosk Integration

**Researchers**

Renzel F. Andrino  
Troy Aaron J. Carcosia  
Ezekiel B. Gonzales  
Jovani C. Sumayang  
Claudine Z. Villa

**BSIS 3A**  
**October 2026**

---

# CHAPTER 3

# METHODOLOGY

## Introduction

This chapter presents the methodology for developing and evaluating the *Responsive Web Mapping and Navigation Application with Feedback Evaluation and Kiosk Integration*. It discusses the research design, Agile software development approach, Input-Process-Output (IPO) framework, system design, data-gathering procedures, data-analysis techniques, and ethical safeguards.

The study addresses the need to help users locate rooms, offices, and other facilities within La Concepcion College. The application provides a campus directory, destination selection, browser-based live location tracking, distance and compass guidance when the necessary device and location data are available, camera-based optical character recognition (OCR) of room numbers and destination names, QR guides, and a feedback function. Authorized administrators can maintain campus records and review submitted feedback and destination-visit transactions.

The methodology combines iterative software development with a descriptive evaluation of the completed system. Development activities will be documented through prioritized requirements, iterations, tests, and review outcomes. Evaluation activities will collect quantitative ratings and qualitative comments from approved participants. Claims about kiosk operation will be limited to tests actually performed on the selected kiosk hardware.

## Research Design

The study will employ a descriptive mixed-methods system evaluation design. The quantitative component will summarize participants' ratings of the system using the approved evaluation instrument. The qualitative component will examine open-ended responses and suggestions concerning the participants' experience.

Participants will first complete a set of representative navigation tasks using the system. They will then complete the approved questionnaire and, where applicable, provide written feedback. Quantitative findings will describe response patterns, while qualitative findings will help explain usability concerns, successful features, and suggested improvements. The results will be interpreted together to provide a more complete assessment of the system.

The evaluation will focus on the system's implemented functions, including directory access, destination selection, directions, live location and distance updates, camera recognition, QR guides, feedback, and administrative operations. It will assess performance in the conditions tested; it will not claim that OCR recognition proves a person's physical arrival. OCR can misread text, device location accuracy varies, and external map routes may not provide indoor turn-by-turn guidance.

Before participant recruitment or data collection, the researchers shall finalize the target population, eligibility criteria, sampling method, sample size, questionnaire, task scenarios, rating-scale interpretation, and evaluation schedule in consultation with the adviser and the institution. These details must reflect the approved research protocol and must not be inferred after results are collected.

The unit of evaluation will be the completed application as experienced by an individual participant performing the defined tasks on a specified device and browser. Researchers will distinguish participant perceptions, measured task outcomes, and technical test results in reporting. These are related but different sources of evidence and will not be treated as interchangeable.

## Agile Software Development Methodology

### Selected Approach

The researchers will use an Agile software development approach. Agile organizes work into manageable increments, with requirements prioritized and selected for implementation, followed by testing and review. Feedback and test results inform the next development decisions. This approach supports ongoing refinement rather than deferring all integration and review until the end of development.

Agile is appropriate for the Campus Wayfinder system because it combines multiple functions that depend on accurate campus information, device capabilities, account permissions, and a clear user interface. The directory, coordinates, GPS distance calculations, camera-based OCR, QR guides, feedback, and administrative tools can be developed and checked incrementally. This makes it possible to find data, usability, permission, and integration problems earlier and to revise the work in response to evidence.

The study will apply the following Agile activities:

1. **Requirements and product backlog.** Record the system's functional and nonfunctional requirements as prioritized features or tasks. The backlog will include user needs, verified campus data, accessibility, privacy, role permissions, device compatibility, and the agreed project scope.
2. **Iteration planning.** Select a feasible set of backlog items for the next development iteration. For each item, define the expected result and acceptance criteria before implementation. The actual iteration duration and schedule will be reported from the researchers' development records.
3. **Design and implementation.** Design, implement, and integrate the selected features in small increments, using the project's web technologies and Firebase services. Changes to location, camera, account, or transaction workflows will be considered together with their permission and data-handling implications.
4. **Continuous verification.** Test each completed increment against its acceptance criteria. Record results for relevant interface, responsive-layout, authentication, Firestore, geolocation, camera, OCR, QR, and feedback behaviors. Defects will be documented and prioritized.
5. **Iteration review.** Review the completed work with the adviser and authorized stakeholders. User review or participant feedback will be conducted only when covered by the approved research protocol. Findings and decisions will be recorded, and suitable changes will be added to the backlog.
6. **Retrospective and backlog refinement.** Review the iteration process, identify recurring problems and effective practices, and adjust priorities based on test results, stakeholder feedback, feasibility, and study objectives.
7. **Release and system evaluation.** Integrate the accepted features, perform system-level testing, and conduct the approved participant evaluation. Report unfinished features, test limitations, and discrepancies between the tested system and the released version.

An increment will be considered complete when it meets its documented acceptance criteria and relevant tests have passed or any remaining defects have been recorded and justified. The researchers shall maintain a record of iteration dates, work completed, test outcomes, review feedback, and changes made. The final paper should describe the Agile practices actually used; it should not claim a particular framework, such as Scrum, unless the team followed that framework's defined roles and events.

For consistency, acceptance criteria will be written in observable terms before a feature is marked complete. For example, directory acceptance criteria may require that a selected record display its correct saved name and details; location criteria may require that the browser permission prompt be initiated only by user action and that the displayed distance update when a new position is received; and transaction criteria may require a successful database write before the interface reports an arrival as recorded. Camera recognition criteria will specify the tested room signs, destination names, device, and recognition conditions. A recognized text match alone will not be used as evidence that the user is physically at the destination.

**Figure 1.** Agile development cycle: prioritized requirements → iteration planning → design and implementation → testing → review and feedback → retrospective and backlog refinement → subsequent iteration.

### Rationale for Agile

Agile is appropriate because requirements for campus navigation may be clarified as users and stakeholders review the directory and navigation flows. It also supports incremental validation of the system's most important dependencies: room and faculty records must be reliable before they can support destination selection; coordinates must be available before GPS distance or compass guidance can be calculated; and account permissions must allow a transaction before an arrival can be recorded.

The iterative approach allows the researchers to test these dependencies and correct issues before final evaluation. It also permits interface changes to be reviewed on mobile and desktop screens and, if equipment is available, on the selected kiosk. Agile does not replace functional testing, data verification, privacy review, or research ethics approval. These activities remain required throughout development and evaluation.

## Input-Process-Output Framework

The IPO framework summarizes the resources required by the study, the activities performed, and the expected system output.

### Input

The study inputs will include:

- **Campus data:** verified building, room, faculty-office, and facility names; descriptions; floor information; contact details and office hours where applicable; and coordinates when confirmed.
- **User requirements:** navigation tasks, accessibility needs, interface expectations, and recommendations obtained through adviser-approved consultations or evaluation.
- **Technical resources:** HTML, CSS, JavaScript modules, Firebase Authentication, Cloud Firestore, Firebase Cloud Functions for selected account operations, browser geolocation and camera APIs, the OCR and QR libraries, and external map links used by the implemented application.
- **Hardware and access devices:** development computers and supported mobile and desktop browsers; kiosk equipment only if available and included in the actual testing.
- **Research materials:** approved test cases, task scenarios, questionnaire, consent information, participant criteria, and institutional approvals.
- **Researcher competencies:** knowledge of requirements analysis, web development, database design, information security, interface design, testing, and research ethics.

### Process

The study process will consist of:

1. planning and requirements analysis;
2. collection and verification of campus data;
3. system and interface design;
4. Agile iteration planning and incremental development;
5. continuous feature, integration, and regression testing;
6. device and kiosk checks where applicable;
7. participant evaluation and feedback collection under the approved protocol;
8. quantitative and qualitative data analysis; and
9. documented system refinement and final verification based on test and evaluation findings.

### Output

The expected output is a responsive web application that enables users to browse campus information, select rooms and faculty locations, request live browser location updates, view approximate distance and available direction guidance, open external map routes when coordinates are available, use camera OCR to recognize configured room numbers or destination names, access QR guides, and submit feedback. Authorized administrators can manage campus records and review available feedback and destination-visit records.

The title includes kiosk integration. This shall be reported as a completed system capability only if the researchers configure and test the application on the identified kiosk hardware. If kiosk equipment is not available or the integration is not tested, this limitation shall be clearly stated.

**Figure 2.** IPO framework: campus data, user requirements, technology, hardware, and research materials → requirements, design, Agile development, testing, integration, and evaluation → responsive campus navigation application with feedback and verified kiosk access, if tested.

## System Design

System-design diagrams shall be prepared from the application and data flows that are actually implemented. The following descriptions specify the required content for each diagram.

### Context Diagram

The context diagram will represent Campus Wayfinder as a single system and identify the entities that interact with it:

- **Students and visitors** browse campus information, select a destination, request supported navigation features, use QR guides, and provide feedback according to their account permissions.
- **Faculty members and staff** view campus information and may verify directory data. They may manage records only if assigned an authorized administrative role.
- **Administrators** maintain room, faculty, and QR-guide records and review feedback and destination-visit records, subject to the configured access controls.
- **Researchers** prepare approved evaluation tasks, conduct system tests, and analyze evaluation data.
- **Browser and device services** provide camera, geolocation, and device-orientation capabilities when supported and permitted by the user.
- **External map services** receive a destination link when the user chooses to open available directions.

The diagram shall distinguish information managed by Campus Wayfinder from capabilities provided by a browser or external mapping service.

### Data Flow Diagram

The data flow diagram will show the movement of information among users, application processes, and Firestore. It will include:

1. **Retrieve campus directory:** load room and faculty records and display available destination details.
2. **Select destination and provide directions:** use a selected record and available coordinates to display an approximate distance or construct an external map link.
3. **Request live device location:** obtain browser location updates after the user initiates tracking, use them in page memory for distance and direction calculations, and stop updates when tracking is stopped or the page is closed.
4. **Recognize destination text:** process camera frames in the browser with OCR and compare recognized text against configured room numbers and destination names.
5. **Record camera arrival:** for an eligible student account, store the recognized destination and account information as a transaction, subject to Firestore security rules. OCR recognition is an application event and is not independent proof of physical presence.
6. **Manage campus data:** allow authorized administrators to create, update, and delete room, faculty, and QR-guide records.
7. **Submit and review feedback:** store user ratings and comments and make them available to authorized administrators.

The diagram shall identify stored information separately from temporary browser data. Device location and camera frames are processed locally for the navigation features and are not intended to be saved in Firestore.

### Database Design

The application uses Cloud Firestore. Its principal collections and example fields are shown below. The final schema diagram must be checked against the actual deployed application and its security rules.

| Collection | Example data |
|---|---|
| `users` | User identifier, email, assigned role, optional student number, and account creation information |
| `rooms` | Room number, building, floor, room type, description, optional coordinates, and optional map or image links |
| `faculties` | Faculty or office name, description, location, contact information, office hours, image, and optional coordinates |
| `qrCodes` | Guide name and destination URL or supported legacy PDF link |
| `feedback` | Rating, optional comment, user identifier, account name or email, and timestamp |
| `transactions` | User identifier, account name or email, optional student number, room or faculty destination identifiers and labels, method, and timestamp |
| `studentNumbers` | Private reservation information used to associate a student number with an account, where applicable |

Directory data is stored separately from account, feedback, and transaction records. Firestore rules restrict access according to the signed-in user's role and validate submitted data. Optional fields shall be identified as such in the final schema.

### Use Case Diagram

The use case diagram will represent the functions available to the system's actors:

- **Student:** sign in, browse the directory, select destinations, request live location updates, view approximate distance and compass guidance where supported, open available map directions, use camera destination recognition, open QR guides, submit feedback, and generate an arrival transaction when the configured role and database rules permit it.
- **Visitor:** browse campus information and use navigation features allowed by the application. Visitor arrival-recording and feedback permissions shall reflect the deployed rules.
- **Faculty or staff member:** view campus information and use available navigation features. Directory editing requires an assigned administrator role.
- **Administrator:** manage campus listings, QR guides, and user roles when authorized; review feedback and destination transactions.
- **Researcher:** administer approved test scenarios and analyze evaluation data within the approved protocol.

The diagram shall distinguish viewing and navigation actions from administrative data-management functions.

### System Architecture

The system architecture comprises:

1. **Presentation layer:** responsive HTML and CSS pages with JavaScript modules for the user interface.
2. **Application logic:** client-side account flows, directory rendering, destination selection, validation, feedback submission, live-location distance calculations, camera OCR, and transaction submission.
3. **Identity and data services:** Firebase Authentication for account sign-in, Cloud Firestore for account profiles and application records, and Firebase Cloud Functions for selected account-management operations.
4. **Browser device services:** Geolocation, camera, and device-orientation APIs, subject to device support, secure browser context, and user permission.
5. **External services:** external map links and browser-loaded QR and OCR libraries.
6. **Client devices:** mobile and desktop browsers. Kiosk hardware is an additional client only after testing on the selected equipment.

Live location coordinates and camera frames are used in browser memory for their respective features and are not intended to be written to Firestore. Distance and compass guidance depend on the accuracy of the current location, verified destination coordinates, browser support, and device sensors. The application opens external map routes where possible; it does not claim to generate indoor, step-by-step routes.

The distance presented by the application is an approximate geographic distance between the latest browser location and the destination coordinates. It does not represent a measured walking path and may differ from the route a person must take because of buildings, floors, obstacles, GPS error, or external map routing. Evaluation results and system descriptions shall use the term “approximate distance” and shall not present it as a guaranteed walking distance.

## Data-Gathering Procedure

Data collection shall begin only after required institutional authorization and research ethics procedures have been completed. The researchers will document the instruments, devices, settings, and procedures used.

### Phase 1: Requirements Identification

The researchers will identify target users, campus-navigation tasks, system boundaries, and functional and nonfunctional requirements. Requirements may be gathered through approved consultations, observations, or questionnaires. The source and method of each requirement shall be recorded.

The identified requirements will guide directory search, destination details, GPS and camera functions, QR guides, feedback, administrative controls, accessibility, responsive layouts, and any kiosk configuration.

### Phase 2: Campus Data Collection and Verification

Campus records will be obtained from authorized institutional maps, official directories, facility records, and personnel designated to verify them. Room numbers, building and floor assignments, faculty names, descriptions, contact details, office hours, and coordinates will be checked for accuracy and consistency before being entered into the system.

Coordinates will be included only when they are obtained from an authorized or reliable source and verified for the relevant location. Missing or uncertain data will be documented rather than presented as confirmed navigation information.

### Phase 3: Backlog Preparation and Iteration Planning

The requirements will be organized into a prioritized development backlog. The researchers will define the intended result and acceptance criteria for each selected item, then plan the work to be completed during the next development iteration. Priorities will account for user value, dependencies, security, data quality, and project feasibility.

### Phase 4: Incremental Development and Review

The selected features will be designed, implemented, and integrated incrementally using the project's web and Firebase technologies. Each increment will be checked against its acceptance criteria. The researchers will record completed work, defects, technical decisions, and feedback from authorized reviewers. Appropriate changes will be returned to the backlog for prioritization.

### Phase 5: Integration, Device, and Kiosk Testing

The application will be checked on the desktop and mobile browsers selected for the study. Tests will cover screen responsiveness, authentication, database access, location and camera permission flows, network-dependent features, and user sign-out.

If kiosk integration is within the approved scope and equipment is available, the researchers will also test the application on the specific kiosk hardware. They will document its make and model, display size, input method, browser, network conditions, permission settings, and session-clearing behavior. Without that test, kiosk integration will be reported as a limitation or future implementation.

### Phase 6: Functional and Usability Testing

Functional testing will use documented test cases covering:

- account sign-in and role-based permissions;
- retrieval and display of room and faculty records;
- destination selection and available directions;
- starting, updating, and stopping live location tracking;
- distance calculation when valid current and destination coordinates are available;
- camera access and OCR recognition of configured room numbers and names;
- arrival transaction creation for an eligible account, including behavior when a write fails;
- QR-guide rendering or link opening;
- feedback submission; and
- administrator-only record-management and review functions.

For usability testing, eligible participants will complete representative tasks, such as finding a specified room, selecting a faculty destination, viewing directions, using live location, attempting camera recognition, and submitting feedback. The task instructions, completion criteria, device, browser, and observed technical issues will be documented. Task completion and errors will be recorded using the same criteria for all participants.

Each test case will state its objective, preconditions, steps, expected result, observed result, pass or fail status, and any related defect. Representative test accounts and verified campus records will be used. Tests of protected actions will check both the expected access for an authorized role and the expected denial for an unauthorized role.

The following matrix defines the planned test coverage. The researchers shall enter actual test conditions and results in their test records; the matrix does not imply that these tests have already been completed.

| Test area | Test procedure | Evidence to record |
|---|---|---|
| Directory and destination selection | Search for or select known room and faculty records, then compare the displayed details with the verified source data. | Record identifiers tested, expected and actual output, and pass/fail result. |
| Live location and distance | Start location tracking, grant browser permission, select a destination with verified coordinates, observe subsequent position and distance updates, and stop tracking. | Device and browser, reported location accuracy, displayed distance, update behavior, permission outcome, and stop behavior. |
| Camera and OCR | Present a predefined set of room signs or destination-name signs to the camera under recorded lighting, distance, and orientation conditions. | Correct recognitions, false recognitions, missed recognitions, test conditions, device, and browser. |
| Arrival transaction | For an eligible student test account, allow OCR to recognize a configured destination and verify the resulting transaction in the administrator view. Repeat with an account role that is not eligible to create a student arrival. | Test-account role, recognized destination, database-write result, interface response, transaction presence or absence, and any error. |
| Feedback and administration | Submit a rating with and without an optional comment; verify that authorized administrators can review submissions and that unauthorized accounts cannot perform administrative actions. | Submission outcome, saved fields, access outcome, and validation or permission errors. |
| QR guide and external directions | Open available QR-guide links and map directions for records with valid destinations; check behavior when a destination link or coordinates are unavailable. | Destination correctness, link behavior, unavailable-data messaging, and test device/browser. |

OCR results will be evaluated only against the predefined signs and conditions in the test set. If a recognition rate is reported, it will be calculated as correctly recognized test instances divided by all valid test instances, multiplied by 100. False recognitions and missed recognitions will also be reported separately. The test set, text-matching criteria, and conditions must be established before the results are summarized.

### Phase 7: Participant Evaluation and Data Collection

After completing the assigned tasks, participants will assess the system using the approved questionnaire. Evaluation criteria may include functionality, usability, accessibility, responsiveness, and satisfaction, as defined in the finalized instrument. Written comments may be collected through open-ended questions or the system feedback feature when the consent process and protocol permit their use as research data. The questionnaire will be administered consistently, and participants will be given the same instructions and response scale.

The researchers will explain what information is collected, how account details and feedback are handled, and whether camera or location permission is requested during the test.

### Phase 8: Analysis, Refinement, and Final Verification

Questionnaire responses, functional-test outcomes, and qualitative comments will be organized and analyzed using the techniques specified in this chapter. Findings will be reviewed against the system objectives and acceptance criteria. Recommended changes will be prioritized, implemented where feasible, and followed by relevant regression tests.

The final report will distinguish completed changes from recommendations that were not implemented. Results will be tied to the version of the application that participants actually evaluated.

## Data-Analysis Techniques

Data-analysis procedures will be selected in advance and applied consistently. The rating scale, scoring method, interpretation ranges, and performance criteria shall be finalized before analysis and shall match the approved instrument.

### Quantitative Analysis

#### Frequency and Percentage

Frequency and percentage will summarize the distribution of participant responses and approved respondent characteristics.

\[
\text{Percentage} = \frac{f}{N} \times 100
\]

where \(f\) is the number of responses in a category and \(N\) is the number of valid responses for the item.

#### Weighted Mean

For a Likert-type instrument, a weighted mean may be calculated for each criterion:

\[
\bar{x}_{w} = \frac{\sum (f_i x_i)}{N}
\]

where \(f_i\) is the number of responses assigned the value \(x_i\), and \(N\) is the number of valid responses. The researchers will state the questionnaire's scale anchors and interpretation intervals. The interpretation intervals shall be set before the results are examined.

#### Standard Deviation

Standard deviation may be used to describe variation in participant ratings. For sample data:

\[
s = \sqrt{\frac{\sum (x_i-\bar{x})^2}{n-1}}
\]

where \(x_i\) is an individual observation, \(\bar{x}\) is the sample mean, and \(n\) is the number of valid observations.

#### System Test Measures

Objective system outcomes will be reported separately from participant opinions. Applicable measures may include:

- **Test-case pass rate:** passed test cases divided by executed test cases, multiplied by 100.
- **Task-completion rate:** participants who successfully complete a defined task divided by participants who attempt it, multiplied by 100.
- **Response time:** elapsed time for a defined operation under documented conditions.
- **Error frequency:** number and type of failures observed during the test period.
- **Location or OCR observations:** measured or observed results under specified device, browser, network, location-accuracy, and image conditions.

Any target thresholds must be established before testing and justified. Results will identify the device, browser, network, sample, and procedure used so that the findings can be interpreted appropriately.

### Qualitative Analysis

Content analysis will be used to organize open-ended comments and suggestions. The researchers will:

1. compile responses collected under the approved protocol and remove unnecessary identifiers;
2. read the responses to become familiar with their content;
3. assign codes to statements relevant to navigation, interface clarity, accessibility, location data, camera recognition, kiosk use, and other study objectives;
4. group related codes into categories;
5. review the categories against the original responses; and
6. summarize recurring strengths, issues, and recommendations.

Qualitative results will be interpreted alongside quantitative findings. For example, comments about unclear destination labels may help explain lower ratings for ease of use. Identifiable participant comments will not be published unless the consent and approval explicitly allow it.

## Ethical Considerations

The study will follow voluntary participation, informed consent, confidentiality, data minimization, and responsible data-handling practices. Required institutional permissions and ethics review shall be obtained before recruitment or collection of research data.

### Informed Consent and Voluntary Participation

Before evaluation, participants will receive an explanation of the study's purpose, procedures, estimated duration, information collected, potential risks, and intended use of findings. Participation will be voluntary, and participants may decline or withdraw in accordance with the approved protocol without academic or institutional penalty.

If minors are included, the researchers will follow institutional requirements for parent or guardian permission and participant assent. The consent materials will provide appropriate contact information for questions or concerns.

### Confidentiality and Data Privacy

The researchers will comply with the Philippine Data Privacy Act of 2012 (Republic Act No. 10173), its applicable implementing rules, and institutional data-protection policies. Only information necessary for the system or approved research objectives will be collected.

Campus Wayfinder uses authenticated accounts and may store account identifiers, account email or name, optional student numbers, feedback, and destination-visit records in Firebase. Access to these records is controlled by the deployed Firestore security rules. Participants will be informed about this processing, and access will be limited to authorized individuals.

Browser location is requested only after the user chooses to start location tracking. Location updates are used in page memory to calculate distance and guidance and are not intended to be stored in Firestore. Camera frames are processed in the browser for OCR and are not intended to be recorded or uploaded. The researchers will verify these statements against the version used in the study.

Research records will be stored in an access-controlled location. Results will be reported in aggregate or de-identified form where practicable. Data retention and disposal will follow the approved protocol and institutional requirements.

### Risks and Risk Minimization

The study is expected to involve minimal risk because participants primarily interact with a navigation application and provide feedback. Potential concerns include inconvenience, exposure of account information, inaccurate location estimates, and OCR misrecognition.

The researchers will minimize these risks by collecting only necessary information, explaining camera and location permissions, restricting access to records, verifying campus information, and clearly stating that location and OCR results are estimates rather than proof of arrival. A process for reporting technical or privacy concerns will be provided in accordance with institutional procedures.

### Benefits and Compensation

Participants may contribute to improvements in campus information and navigation. Direct benefits to individual participants are not guaranteed. Compensation, if any, shall follow the approved protocol and be disclosed before participation. If no compensation is provided, this shall be stated in the consent information.

### Research Integrity

The researchers will report participant responses, system-test results, and limitations accurately. They will not fabricate, falsify, or intentionally misrepresent data. Unsuccessful tests, technical problems, and deviations from the approved procedures will be documented and reported as required. Institutional approval shall be obtained before data collection begins.

## References

The following references are relevant to the methodology. The researchers shall verify publication details against the sources actually consulted and follow the citation style required by the institution.

Braun, V., & Clarke, V. (2022). *Thematic analysis: A practical guide*. SAGE Publications.

Creswell, J. W., & Plano Clark, V. L. (2018). *Designing and conducting mixed methods research* (3rd ed.). SAGE Publications.

International Organization for Standardization. (2018). *ISO 9241-11:2018: Ergonomics of human-system interaction—Part 11: Usability: Definitions and concepts*. ISO.

Krippendorff, K. (2018). *Content analysis: An introduction to its methodology* (4th ed.). SAGE Publications.

Republic Act No. 10173. (2012). *Data Privacy Act of 2012*. Republic of the Philippines.

Pressman, R. S., & Maxim, B. R. (2020). *Software engineering: A practitioner's approach* (9th ed.). McGraw Hill. **Verify the year, edition, and publisher against the copy consulted before submission.**

## Details to Finalize Before Submission

The following study-specific information must be completed from the researchers' approved plans and records:

1. Participant population, eligibility criteria, sample size, and sampling technique.
2. Evaluation instrument, validation process, scale anchors, scoring, and interpretation intervals.
3. Actual Agile iteration schedule, backlog records, review activities, and acceptance criteria used.
4. Test tasks, test devices, browser versions, network conditions, and any performance thresholds.
5. Kiosk hardware and configuration, or a clear statement that kiosk testing was not completed.
6. Institutional permissions, ethics-review status, consent procedure, data-retention period, and disposal procedure.
7. The exact deployed system version and any differences from the version used during participant testing.
8. Final context, data-flow, database, use-case, and architecture diagrams based on the implemented system.
9. The thesis format and reference style required by La Concepcion College.
