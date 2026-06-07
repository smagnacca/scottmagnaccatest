const { google } = require("googleapis");
const sgMail = require("@sendgrid/mail");

const SPREADSHEET_ID = "1RHtpqWJMbQPhTTBzF2HU5hzg9SISutY_m40UU_vCleE";
const TAB_NAME = "Calculator_Leads";

// Headers for the sheet
const HEADERS = ["Timestamp", "Name", "Email", "Company", "Team Size", "Calculated ROI", "Originating Website"];

async function getAuthClient() {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON env var is not set");
  }
  const credentials = JSON.parse(serviceAccountJson);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return auth.getClient();
}

async function ensureTabExists(sheets) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const sheetNames = meta.data.sheets.map((s) => s.properties.title);

  if (!sheetNames.includes(TAB_NAME)) {
    // Create the tab
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: { title: TAB_NAME },
            },
          },
        ],
      },
    });
    // Write headers
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${TAB_NAME}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [HEADERS] },
    });
  }
}

function parseBody(body, contentType) {
  if (!body) return {};
  if (contentType && contentType.includes("application/json")) {
    try { return JSON.parse(body); } catch { return {}; }
  }
  const params = new URLSearchParams(body);
  const result = {};
  params.forEach((v, k) => { result[k] = v; });
  return result;
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const contentType = event.headers["content-type"] || "";
    const fields = parseBody(event.body, contentType);

    const name = (fields.name || "").trim();
    const email = (fields.email || "").trim();
    const company = (fields.company || "").trim();
    const teamSize = (fields.teamSize || "").trim();
    const calculatedRoi = (fields.calculatedRoi || "").trim();
    const originatingWebsite = (fields.originatingWebsite || event.headers.host || "scottmagnaccatest.netlify.app").trim();

    if (!name || !email || !company || !teamSize) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Missing required fields" }),
      };
    }

    const authClient = await getAuthClient();
    const sheets = google.sheets({ version: "v4", auth: authClient });

    await ensureTabExists(sheets);

    const timestamp = new Date().toISOString();
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${TAB_NAME}!A1`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [[timestamp, name, email, company, teamSize, calculatedRoi, originatingWebsite]],
      },
    });

    // Send notification email to Scott
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    await sgMail.send({
      to: "scott.magnacca1@gmail.com",
      from: "scott@scottmagnacca.com",
      replyTo: email,
      subject: `New ROI Calculator Lead: ${name} from ${company}`,
      html: `
        <h2>New Sales ROI Calculator Lead</h2>
        <p><strong>Originating Website:</strong> ${originatingWebsite}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Team Size:</strong> ${teamSize} reps</p>
        <p><strong>Calculated Capacity Value:</strong> $${parseInt(calculatedRoi, 10).toLocaleString()}/year</p>
        <p><strong>Submitted:</strong> ${timestamp}</p>
      `,
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("calculator-lead error:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};
