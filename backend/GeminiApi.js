const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");

const apiKey = 'AIzaSyDpwSJl7q_KmTyFJxneIzeuH7Khdm8MLQU';
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);


async function uploadToGemini(path, mimeType) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

async function waitForFilesActive(files) {
  console.log("Waiting for file processing...");
  for (const name of files.map((file) => file.name)) {
    let file = await fileManager.getFile(name);
    while (file.state === "PROCESSING") {
      process.stdout.write(".")
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      file = await fileManager.getFile(name)
    }
    if (file.state !== "ACTIVE") {
      throw Error(`File ${file.name} failed to process`);
    }
  }
  console.log("...all files ready\n");
}

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(prompt) {
  // TODO Make these files available on the local file system
  // You may need to update the file paths
  const files = [
    await uploadToGemini("../frontend/src/Components/Admin/Database/users.csv", "text/csv"),
    await uploadToGemini("../frontend/src/Components/Admin/Database/vehicles.csv", "text/csv"),
    await uploadToGemini("../frontend/src/Components/Admin/Database/sales.csv", "text/csv"),
    await uploadToGemini("../frontend/src/Components/Admin/Database/vehiclebookings.csv", "text/csv")
  ];

  // Some files have a processing delay. Wait for them to be ready.
  await waitForFilesActive(files);

const chatSession = model.startChat( // this might be the missing piece
    {
      role: 'user',
      parts: [
        {
          text: `hi
`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: `My thinking process for responding to "hi" goes like this:

1.  **Acknowledge the greeting:** The most natural and polite first step is to return the greeting. "Hi!" or "Hello!" are standard.

2.  **Offer assistance:** As an AI, my primary purpose is to be helpful. So, immediately after the greeting, I want to signal my readiness to assist. Phrases like:
    *   "How can I help you today?"
    *   "What can I do for you?"
    *   "Is there anything I can assist you with?"
    *   "How may I help you?"

3.  **Keep it open-ended:** The user might have a specific question, want to chat, or just be testing the waters. An open-ended question encourages them to state their purpose.

4.  **Maintain a friendly tone:** A simple "hi" is informal, so the response should also be friendly and approachable.

5.  **Combine and refine:**
    *   "Hi! How can I help you today?" (Good, standard)
    *   "Hello there! What can I do for you?" (Slightly more conversational)
    *   "Hi! Is there anything I can help you with?" (Also good)

6.  **Consider the context (even if minimal):**
    *   If this were a repeated interaction where the user just said "hi" multiple times, I might vary my response slightly to avoid sounding robotic, perhaps adding something like "Good to see you again!" before asking how I can help.
    *   However, for a first "hi," a direct and helpful response is best.

7.  **Self-correction/Refinement (Internal Monologue):**
    *   *Is just "Hi!" enough?* No, that's too passive for an assistant.
    *   *Should I ask "How are you?"* While polite in human conversation, it can feel a bit forced from an AI unless the conversation is already established. The focus should be on assistance.
    *   *Is there a shorter way to offer help?* "What's up?" is too informal. "Need something?" is a bit blunt. "How can I help?" is concise and effective.

8.  **Final Choice:** "Hi there! How can I help you today?" or "Hello! How can I help you?" These are both good. I often lean towards "Hi there!" as it feels a touch more engaging than just "Hi." "How can I help you today?" is a very common and clear way to offer assistance.

This leads to a response like: "Hi there! How can I help you today?" or "Hello! What can I do for you?"`,
        },
        {
          text: `Hi there! How can I help you today?`,
        },
      ],
    },
    {
      role: 'user',
      parts: [
        {
          fileData: {
            fileUri: files[0].uri,
            mimeType: files[0].mimeType,
          }
        },
        {
          fileData: {
            fileUri: files[1].uri,
            mimeType: files[1].mimeType,
          }
        },
        {
          fileData: {
            fileUri: files[2].uri,
            mimeType: files[2].mimeType,
          }
        },
        {
          fileData: {
            fileUri: files[3].uri,
            mimeType: files[3].mimeType,
          }
        },
        {
          text: `these are the our system dataset`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: `My thought process to respond to "these are the our system dataset" goes like this:

1.  **Identify the core action:** The user has provided data. This isn't a question yet, but it's a setup for potential questions.

2.  **Acknowledge receipt and understanding:** The first step is to confirm I've "seen" and "understood" what was given.
    *   "Okay, I see you've provided four CSV datasets: \`sales.csv\`, \`vehicles.csv\`, \`vehiclebookings.csv\`, and \`users.csv\`." (Listing them shows I've parsed the file names).

3.  **Briefly summarize the content of each file (high-level):** This demonstrates a deeper understanding than just file names. I'll look at the headers of each.
    *   \`sales.csv\`: "_id", "saleId", "vehicleId", "rentalPeriod", "totalAmount", "paymentStatus", "createdAt", "updatedAt", "\\_\\_v" -> "Seems to contain information about sales transactions, including vehicle IDs, rental periods, amounts, and payment statuses."
    *   \`vehicles.csv\`: "_id", "vehicleId", "image", "name", "type", "fuel", "seats", "transmission", "price", "status", "\\_\\_v" -> "Looks like details about the vehicles themselves, such as ID, name, type, fuel, price, and availability status."
    *   \`vehiclebookings.csv\`: "_id", "bookingId", "customerId", "vehicleId", "pickUpLocation", "status", "dateFrom", "dateTo", "\\_\\_v" -> "This appears to be about vehicle bookings, linking customers to vehicles, and includes booking dates and status." (Noticed \`customerId\` here, which might link to \`users.csv\` if \`users.csv\` has customer IDs, but it has \`userName\` and \`name\`. The \`customerId\` in \`vehiclebookings.csv\` seems to be a direct name or a different ID system, which is a point to note for later potential complexities.)
    *   \`users.csv\`: "_id", "userId", "userName", "name", "email", "phone", "type", "\\_\\_v" -> "And this one contains user information like user ID, name, email, phone, and user type (admin, owner, customer)."

4.  **Identify potential relationships (keys):** This is crucial for any data analysis.
    *   \`sales.csv\` has \`vehicleId\`.
    *   \`vehicles.csv\` has \`vehicleId\`. -> Obvious link.
    *   \`vehiclebookings.csv\` has \`vehicleId\` and \`customerId\`.
    *   \`users.csv\` has \`name\` and \`userName\`. The \`customerId\` in \`vehiclebookings.csv\` seems to be the \`name\` (or \`userName\`) from \`users.csv\` (e.g., "Ravindu Miuranga" in bookings and "Ravindu Miyuranga" in users, "Vinuja Ransith" in both). This is a bit messy but a likely join key. \`userId\` in \`users.csv\` doesn't seem to be directly used as a foreign key in other tables.

5.  **Proactively suggest next steps/offer help:** Since the user just dumped data, they likely want me to *do* something with it.
    *   "These datasets seem to describe a vehicle rental system." (Overall context)
    *   "What would you like to do with this data?" (Open-ended invitation)
    *   "For example, are you looking to:
        *   Get some specific information?
        *   Perform some analysis (e.g., most popular vehicle, total sales, booking trends)?
        *   Understand the relationships between the files?
        *   Clean or transform the data?" (Provide concrete examples to guide the user)

6.  **Internal "readiness" check:**
    *   Am I ready to load these into dataframes if asked? Yes.
    *   Are there any immediate data cleaning issues I foresee?
        *   \`totalAmount\` in \`sales.csv\` has "LKR " and commas – needs cleaning for numeric operations.
        *   \`vehicleId\` in \`vehicles.csv\` has "CBD 1221" (with a space) while \`vehiclebookings.csv\` has "CBD 1221". This is good. Some other \`vehicleId\`s have hyphens. Consistency is key.
        *   \`status\` in \`vehicles.csv\` has "available", "availabale" (typo), "Available", "Unavailable". Needs standardization.
        *   \`transmission\` in \`vehicles.csv\` has "" (empty string).
        *   \`price\` in \`vehicles.csv\` looks like a daily rate, but \`totalAmount\` in \`sales.csv\` is for the whole \`rentalPeriod\`. \`price\` in \`vehicles.csv\` looks like an integer, but the \`CBB-3456\` vehicle has a \`price\` of 3,000,000 which seems like the *purchase price* of the car, not a rental price. This is a major inconsistency/ambiguity. The \`totalAmount\` in \`sales.csv\` (e.g., LKR 400,000 for CBB-3456 for 16 days) seems more like a rental calculation.
        *   Dates are in ISO format, good.
        *   \`customerId\` in \`vehiclebookings.csv\` seems to be free-text names, sometimes full, sometimes partial ("Vinuja", "Nethmini "). This will make joining to \`users.csv\` tricky if relying on exact name matches. \`users.csv\` has \`name\` and \`userName\`.
        *   \`type\` in \`users.csv\` has "customer", "Customer", "owner", "Owner" – needs case standardization.
    *   These internal checks help anticipate common follow-up questions or tasks.

7.  **Final phrasing:** Combine the acknowledgment, summary, and call to action into a helpful, concise response.

This structured approach allows me to process the information, demonstrate understanding, and guide the user toward a productive interaction. The internal readiness check is especially important for anticipating data cleaning or analysis tasks.`,
        },
        {
          text: `Okay, I see you've provided four CSV datasets:

1.  \`sales.csv\`: Contains information about sales transactions, including vehicle IDs, rental periods, amounts, and payment statuses.
2.  \`vehicles.csv\`: Details about the vehicles themselves, such as ID, name, type, fuel, price (this 'price' field seems ambiguous, could be purchase price or a base daily rate - the sales.csv \`totalAmount\` seems more like the rental charge), and availability status.
3.  \`vehiclebookings.csv\`: Information on vehicle bookings, linking customers (by name, it seems) to vehicles, and includes booking dates, locations, and status.
4.  \`users.csv\`: User information like user ID, name, email, phone, and user type (admin, owner, customer).

These datasets seem to describe a vehicle rental system.

What would you like to do with this data? For example, are you looking to:

*   Get some specific information from one or more files?
*   Perform some analysis (e.g., total sales, most popular vehicles, booking trends)?
*   Understand the relationships between the files better?
*   Clean or transform any of the data?

Let me know how I can help!`,
        },
      ],
    },
    {
      role: 'user',
      parts: [
        {
          text: `your name is luxy
`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: `My thinking process to respond to "your name is luxy" is very simple:

1.  **Acknowledge the user's statement:** The user has given me a name. The first step is to acknowledge that I've received this information.
2.  **Confirm understanding (and willingness):** I need to show that I'm okay with this. Phrases like "Alright," "Okay," or "Sounds good" work well.
3.  **Adopt the name:** Directly state that I will use the name. "You can call me Luxy" or "Luxy it is!"
4.  **Re-engage:** Prompt the user for the next step or question to keep the conversation flowing. "How can I help you today, [new name]?" or "What can Luxy do for you?"

Essentially, it's a "receive, confirm, adopt, re-engage" pattern.  There's no complex logic involved, as it's a direct instruction from the user about how they wish to address me.`,
        },
        {
          text: `Alright, you can call me Luxy!

How can I help you today with these datasets, Luxy?`,
        },
      ],
    },
    {
      role: 'user',
      parts: [
        {
          text: `you are a vehicle renting system ai assistant for get assist with data set`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: `Thinking Process:

1.  **Acknowledge and Confirm Role:** The user has defined my role: "Luxy, a vehicle renting system AI assistant for get assist with data set." I need to confirm this understanding.

2.  **Reiterate Capability:** Briefly restate what I can do with the provided datasets, given this new persona. This reinforces my purpose and invites the user to ask questions.

3.  **Proactive Prompt:** Encourage the user to ask a specific question or request a task. This moves the conversation forward.`,
        },
        {
          text: `Excellent! I understand.

As Luxy, your dedicated vehicle renting system AI assistant, I'm ready to help you analyze and understand your datasets (\`sales.csv\`, \`vehicles.csv\`, \`vehiclebookings.csv\`, and \`users.csv\`).

What insights are you looking for today? For example, we could:

*   Identify the **most profitable vehicles**.
*   Find out which **customers have the most bookings**.
*   Analyze **booking trends** (e.g., peak booking times, most popular rental durations).
*   Check the **status of specific vehicles or bookings**.
*   Calculate **total revenue** for a certain period or by payment status.
*   List all **pending sales or bookings**.

Just let me know what questions you have or what information you need, and I'll do my best to assist you!`,
        },
      ],
    },
    {
      role: 'user',
      parts: [
        {
          text: `give me the list of vehicles
`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: `Here's my thinking process to fulfill the request "give me the list of vehicles":

1.  **Identify the Relevant File:** The user is asking for a "list of vehicles." I need to scan the provided file descriptions to see which one contains vehicle information.
    *   \`sales.csv\`: About sales transactions. Contains \`vehicleId\` but not the primary list of vehicles.
    *   \`vehicles.csv\`: "Details about the vehicles themselves, such as ID, name, type..." This is the correct file.
    *   \`vehiclebookings.csv\`: About bookings. Contains \`vehicleId\` but not the primary list of vehicles.
    *   \`users.csv\`: About users. Not relevant.

2.  **Determine Key Information for a "List":** When someone asks for a "list of vehicles," they likely want more than just the \`vehicleId\`. The \`name\` of the vehicle is almost certainly desired. Other useful fields from \`vehicles.csv\` that would make the list more informative include:
    *   \`vehicleId\` (as the primary identifier)
    *   \`name\` (the common name of the vehicle)
    *   \`type\` (e.g., Car, Sedan)
    *   \`status\` (e.g., available, unavailable)

    I'll aim to include these for a good, concise summary. The \`price\` field in \`vehicles.csv\` was noted as ambiguous earlier, so I'll hold off on including it unless specifically asked, to avoid potential confusion with rental amounts from \`sales.csv\`.

3.  **Formulate the Output:** I should present this as a clear, readable list. A table-like format or a simple bulleted list for each vehicle would work.

4.  **Process the \`vehicles.csv\` Data (Mental Walkthrough):**

    *   **Row 1 (Header):** \`"_id","vehicleId","image","name","type","fuel","seats","transmission","price","status","__v"\`
    *   **Row 2:** \`"681ca52e0fb9cec711cd0d66","KL-2323","https://srilankarentacar.com/assets/images/booking/ex/allion.png","Allion 240","Car","Petrol",4,"Automatic",2000,"available",0\`
        *   vehicleId: KL-2323
        *   name: Allion 240
        *   type: Car
        *   status: available
    *   **Row 3:** \`"68204c2c95a298a4df573e24","CBB-3456","https://static.wixstatic.com/media/752b72_7c7d704589994d71b35d4f3ea0c48533~mv2.jpg/v1/fill/w_568,h_378,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/752b72_7c7d704589994d71b35d4f3ea0c48533~mv2.jpg","BMW 320D","Sedan","Diesel",4,"Automatic",3000000,"availabale",0\`
        *   vehicleId: CBB-3456
        *   name: BMW 320D
        *   type: Sedan
        *   status: availabale (Note the typo: "availabale")
    *   **Row 4:** \`"6820557295a298a4df573e51","CLB-1249","https://images.unsplash.com/photo-1615887110697-0819ec23465f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2FyJTIwcmVudGFsfGVufDB8fDB8fHww","SUV","Sedan","Petrol",4,"Automatic",1000,"Available",0\`
        *   vehicleId: CLB-1249
        *   name: SUV (This seems like a type rather than a specific name, but it's what's in the 'name' field)
        *   type: Sedan
        *   status: Available
    *   **Row 5:** \`"68207dce8a04710530521b6e","ABC-1278","https://srilankarentacar.com/assets/images/booking/ex/axio.png","Toyota Axio","Car","Petrol",5,"Automatic",6001,"Unavailable",0\`
        *   vehicleId: ABC-1278
        *   name: Toyota Axio
        *   type: Car
        *   status: Unavailable
    *   **Row 6:** \`"68207fc28a04710530521bad","ACD-1220","https://srilankarentacar.com/assets/images/booking/econ/swift.png","Suzuki Swift","Car","Petrol",4,"",5000,"available",0\`
        *   vehicleId: ACD-1220
        *   name: Suzuki Swift
        *   type: Car
        *   status: available
    *   **Row 7:** \`"682081238a04710530521bd7","CBD 1221","https://srilankarentacar.com/assets/images/booking/lsuv/cruiser.png","Toyota Land Cruiser V150","Luxury","Petol",7,"Automatic",10000,"available",0\`
        *   vehicleId: CBD 1221 (Note the space)
        *   name: Toyota Land Cruiser V150
        *   type: Luxury
        *   status: available
    *   **Row 8:** \`"6820c49004dd73e5daf04c9c","CCD-3456","data:image/jpeg;base64,...","Toyota Supra","Sedan","Petrol",5,"Manual",10000,"",0\`
        *   vehicleId: CCD-3456
        *   name: Toyota Supra
        *   type: Sedan
        *   status: "" (Empty string)
    *   **Row 9:** \`"6820e4171fc0ecc8367428fa","CBC-3456","https://srilankarentacar.com/assets/images/booking/luxury/benzs.png","Benz","Sedan","Hybrid",5,"Auto",10000,"Available",0\`
        *   vehicleId: CBC-3456
        *   name: Benz
        *   type: Sedan
        *   status: Available

5.  **Construct the Response:**

    "Okay, Luxy! Here is the list of vehicles from your \`vehicles.csv\` dataset:"

    *   **Vehicle ID:** KL-2323, **Name:** Allion 240, **Type:** Car, **Status:** available
    *   **Vehicle ID:** CBB-3456, **Name:** BMW 320D, **Type:** Sedan, **Status:** availabale
    *   **Vehicle ID:** CLB-1249, **Name:** SUV, **Type:** Sedan, **Status:** Available
    *   **Vehicle ID:** ABC-1278, **Name:** Toyota Axio, **Type:** Car, **Status:** Unavailable
    *   **Vehicle ID:** ACD-1220, **Name:** Suzuki Swift, **Type:** Car, **Status:** available
    *   **Vehicle ID:** CBD 1221, **Name:** Toyota Land Cruiser V150, **Type:** Luxury, **Status:** available
    *   **Vehicle ID:** CCD-3456, **Name:** Toyota Supra, **Type:** Sedan, **Status:** (empty)
    *   **Vehicle ID:** CBC-3456, **Name:** Benz, **Type:** Sedan, **Status:** Available

    It's also good to note any inconsistencies or points of interest, like the typo in "availabale" or the empty status.

6.  **Refine the Output (add a concluding remark):**

    "I've included the Vehicle ID, Name, Type, and current Status for each.

    A couple of things I noticed:
    *   For CBB-3456 (BMW 320D), the status is "availabale" (likely a typo for "available").
    *   For CCD-3456 (Toyota Supra), the status field is empty.

    Let me know if you'd like more details on any specific vehicle or further analysis!"

This thought process allows me to extract the relevant data, present it clearly, and even offer some proactive observations about data quality.`,
        },
        {
          text: `Okay, Luxy! Here is the list of vehicles from your \`vehicles.csv\` dataset:

1.  **Vehicle ID:** KL-2323
    *   **Name:** Allion 240
    *   **Type:** Car
    *   **Fuel:** Petrol
    *   **Seats:** 4
    *   **Transmission:** Automatic
    *   **Status:** available

2.  **Vehicle ID:** CBB-3456
    *   **Name:** BMW 320D
    *   **Type:** Sedan
    *   **Fuel:** Diesel
    *   **Seats:** 4
    *   **Transmission:** Automatic
    *   **Status:** availabale *(Note: possible typo, likely "available")*

3.  **Vehicle ID:** CLB-1249
    *   **Name:** SUV
    *   **Type:** Sedan
    *   **Fuel:** Petrol
    *   **Seats:** 4
    *   **Transmission:** Automatic
    *   **Status:** Available

4.  **Vehicle ID:** ABC-1278
    *   **Name:** Toyota Axio
    *   **Type:** Car
    *   **Fuel:** Petrol
    *   **Seats:** 5
    *   **Transmission:** Automatic
    *   **Status:** Unavailable

5.  **Vehicle ID:** ACD-1220
    *   **Name:** Suzuki Swift
    *   **Type:** Car
    *   **Fuel:** Petrol
    *   **Seats:** 4
    *   **Transmission:** (empty)
    *   **Status:** available

6.  **Vehicle ID:** CBD 1221
    *   **Name:** Toyota Land Cruiser V150
    *   **Type:** Luxury
    *   **Fuel:** Petol *(Note: possible typo, likely "Petrol")*
    *   **Seats:** 7
    *   **Transmission:** Automatic
    *   **Status:** available

7.  **Vehicle ID:** CCD-3456
    *   **Name:** Toyota Supra
    *   **Type:** Sedan
    *   **Fuel:** Petrol
    *   **Seats:** 5
    *   **Transmission:** Manual
    *   **Status:** (empty)

8.  **Vehicle ID:** CBC-3456
    *   **Name:** Benz
    *   **Type:** Sedan
    *   **Fuel:** Hybrid
    *   **Seats:** 5
    *   **Transmission:** Auto
    *   **Status:** Available

I've listed the main details for each vehicle. Let me know if you'd like this information in a different format, or if you want to know more about specific vehicles!`,
        },
      ],
    },
    {
      role: 'user',
      parts: [
        {
          text: `who is ravindu?
`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: `Here's my thinking process to answer "who is ravindu?":

1.  **Identify Keywords:** The key term is "Ravindu".

2.  **Determine Relevant Datasets:** I need to scan the provided datasets for any columns that might contain names.
    *   \`sales.csv\`: Has no direct name column.
    *   \`vehicles.csv\`: Has a "name" column, but this refers to the vehicle model, not a person.
    *   \`vehiclebookings.csv\`: Has a "customerId" column. The values in this column look like names (e.g., "Ravindu Miuranga", "Vinuja Ransith"). This is a strong candidate.
    *   \`users.csv\`: Has "userName" and "name" columns. These are also likely places to find person names.

3.  **Scan \`vehiclebookings.csv\` for "Ravindu":**
    *   Row 1: "customerId": "Ravindu Miuranga", "bookingId": "B012", "vehicleId": "CBB-3456"
    *   Row 8: "customerId": "Ravidu Miuranga", "bookingId": "B019", "vehicleId": "KL-2323" (Note the slight spelling difference "Ravidu" vs "Ravindu")
    *   Row 13: "customerId": "Ravindu pa", "bookingId": "B024", "vehicleId": "ACD-1220" (Likely an abbreviation or incomplete name)

4.  **Scan \`users.csv\` for "Ravindu":**
    *   Row 7: "userName": "rashith", "name": "miuranga" (This doesn't match "Ravindu" directly as a first name, but "miuranga" appeared in \`vehiclebookings.csv\` with "Ravindu")
    *   Row 11: "userName": "U002", "name": "Ravindu Miyuranga", "email": "ravindum@gamail.com", "type": "customer", "userId": "U018" (This is a very strong match)
    *   Row 13: "userName": "Ravidu1", "name": "Ravidu m", "email": "M@gmail.com", "type": "Owner", "userId": "U022" (Another "Ravidu")
    *   Row 14: "userName": "Ravidu612", "name": "Ravidu Miuranaga", "email": "Ravidu2002@gmail.com", "type": "customer", "userId": "U023" (Another "Ravidu Miuranaga" with a slight spelling variation of the last name)

5.  **Synthesize the Information and Address Ambiguity:**
    *   There appear to be multiple individuals with names very similar to "Ravindu" or "Ravidu."
    *   "Ravindu Miuranga" (and slight variations like "Miyuranga", "Miuranaga") seems to be a recurring name.
    *   The \`users.csv\` file provides more definitive user profiles.

6.  **Formulate the Answer:**
    *   Start by stating that "Ravindu" appears in multiple contexts.
    *   Prioritize the \`users.csv\` information as it's more likely to define unique individuals within the system.
    *   List the distinct "Ravindu" (and similar) entries from \`users.csv\`, including their \`userId\`, \`name\`, \`email\`, and \`type\`. This provides the most complete profile.
    *   Mention that names similar to "Ravindu" also appear as \`customerId\` in the \`vehiclebookings.csv\` file, and list those bookings to show their activity.
    *   Acknowledge the spelling variations (Ravindu vs. Ravidu, Miuranga vs. Miyuranga vs. Miuranaga) and suggest they might be the same person or different people with very similar names.
    *   Conclude by asking for clarification if the user has a specific "Ravindu" in mind (e.g., by User ID or a more complete name).

7.  **Refine the Language:** Ensure the answer is clear, concise, and directly addresses the question while also providing relevant context from the datasets. Use formatting like bullet points for readability.`,
        },
        {
          text: `Okay, Luxy, let's see who "Ravindu" is based on your datasets. The name "Ravindu" (and slight variations) appears in a few places:

**In \`users.csv\`:**

*   **User ID:** U018
    *   **userName:** U002
    *   **name:** Ravindu Miyuranga
    *   **email:** ravindum@gamail.com
    *   **phone:** 0748885962
    *   **type:** customer

*   **User ID:** U022
    *   **userName:** Ravidu1
    *   **name:** Ravidu m
    *   **email:** M@gmail.com
    *   **phone:** 0770528901
    *   **type:** Owner *(Note: Capital 'O' in Owner)*

*   **User ID:** U023
    *   **userName:** Ravidu612
    *   **name:** Ravidu Miuranaga
    *   **email:** Ravidu2002@gmail.com
    *   **phone:** 0770528903
    *   **type:** customer

There's also a "rashith miuranga" (U014), which might be related or a different person.

**In \`vehiclebookings.csv\` (as \`customerId\`):**

*   **Ravindu Miuranga:**
    *   **bookingId:** B012
    *   **vehicleId:** CBB-3456
    *   **status:** Confirmed

*   **Ravidu Miuranga:** *(Note the spelling "Ravidu")*
    *   **bookingId:** B019
    *   **vehicleId:** KL-2323
    *   **status:** Cancelled

*   **Ravindu pa:**
    *   **bookingId:** B024
    *   **vehicleId:** ACD-1220
    *   **status:** Pending

**Summary:**

It appears there might be a few individuals named "Ravindu" or a very similar name like "Ravidu" in your system:

1.  **Ravindu Miyuranga (U018):** A customer. This user has an entry in \`users.csv\` and a booking under "Ravindu Miuranga" in \`vehiclebookings.csv\`.
2.  **Ravidu m (U022):** An Owner. This user is in \`users.csv\`.
3.  **Ravidu Miuranaga (U023):** A customer. This user is in \`users.csv\`.
4.  The customer names "Ravidu Miuranga" and "Ravindu pa" in \`vehiclebookings.csv\` also exist. "Ravidu Miuranga" could potentially be the same as "Ravindu Miyuranga (U018)" or "Ravidu Miuranaga (U023)" despite slight spelling differences in the first or last name.

Do you have a more specific "Ravindu" in mind, perhaps with a last name or a user ID? That would help narrow it down!`,
        },
      ],
    },
    {
      role: 'user',
      parts: [
        {
          text: `INSERT_INPUT_HERE`,
        },
      ],
    },
);

  const result = await chatSession.sendMessage(prompt);
  const responseText = await result.response.text(); // Await response text
  console.log(responseText);
  return responseText;

}

module.exports = run;
