/**
 * DWIAGUS Ebook Rental System - Google Apps Script
 * 
 * Deployment:
 * 1. Create new Apps Script project at script.google.com
 * 2. Copy this code to Code.gs
 * 3. Setup Google Sheet variables below
 * 4. Deploy as Web App: Execute as "Me", Allow anyone (anonymous)
 * 5. Get deployment URL to use in frontend
 */

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================

// Your Google Spreadsheet ID (from URL)
const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";

// Your site URL for CORS
const ALLOWED_ORIGINS = [
  "https://dwiagus.com",
  "http://localhost:8000",
  "http://localhost:3000"
];

// ============================================
// GOOGLE SHEETS REFERENCES
// ============================================

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getSheet(sheetName) {
  try {
    return getSpreadsheet().getSheetByName(sheetName);
  } catch (e) {
    Logger.log("Sheet not found: " + sheetName);
    return null;
  }
}

// ============================================
// WEB APP HANDLER - MAIN ENTRY POINT
// ============================================

function doGet(e) {
  const action = e.parameter.action;
  
  try {
    switch (action) {
      case "checkAccess":
        return checkAccess(e);
      case "getCatalog":
        return getCatalog(e);
      default:
        return createResponse({ error: "Unknown action" }, 400);
    }
  } catch (err) {
    Logger.log("Error in doGet: " + err);
    return createResponse({ error: err.toString() }, 500);
  }
}

function doPost(e) {
  const action = e.parameter.action;
  
  try {
    switch (action) {
      case "startAccess":
        return startAccess(e);
      case "createUser":
        return createUser(e);
      default:
        return createResponse({ error: "Unknown action" }, 400);
    }
  } catch (err) {
    Logger.log("Error in doPost: " + err);
    return createResponse({ error: err.toString() }, 500);
  }
}

// ============================================
// UTILITY: Create Response with CORS
// ============================================

function createResponse(data, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Optional: Add CORS headers
  // Note: Cloudflare Pages handles CORS, so this may not be necessary
  
  return output;
}

// ============================================
// ACTION: Check Access
// ============================================

function checkAccess(e) {
  /**
   * GET /check-access
   * Params:
   *   - email: user email
   *   - ebook_slug: ebook identifier
   * 
   * Response:
   *   - access: true/false
   *   - remaining_time: days remaining (if active)
   *   - end_time: when access expires (if active)
   */
  
  const email = e.parameter.email;
  const ebookSlug = e.parameter.ebook_slug;
  
  if (!email || !ebookSlug) {
    return createResponse({ error: "Missing email or ebook_slug" }, 400);
  }
  
  // Find active transaction for user + ebook
  const transSheet = getSheet("TRANSACTIONS");
  const data = transSheet.getDataRange().getValues();
  
  const activeTransaction = findActiveTransaction(email, ebookSlug, data);
  
  if (activeTransaction) {
    const endTime = new Date(activeTransaction.end_time);
    const now = new Date();
    const remainingMs = endTime - now;
    const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
    
    return createResponse({
      access: true,
      email: email,
      ebook_slug: ebookSlug,
      end_time: activeTransaction.end_time,
      remaining_days: Math.max(0, remainingDays),
      transaction_id: activeTransaction.id
    });
  }
  
  return createResponse({
    access: false,
    email: email,
    ebook_slug: ebookSlug
  });
}

// ============================================
// ACTION: Start Access (Create Transaction)
// ============================================

function startAccess(e) {
  /**
   * POST /start-access
   * Body (JSON):
   *   - email: user email
   *   - ebook_slug: ebook identifier
   *   - duration_days: 7, 30, 90, or 365
   * 
   * Response:
   *   - success: true/false
   *   - transaction_id: new transaction ID
   *   - end_time: when access expires
   */
  
  const postData = JSON.parse(e.postData.contents);
  const email = postData.email;
  const ebookSlug = postData.ebook_slug;
  let durationDays = postData.duration_days || 7;
  
  if (!email || !ebookSlug) {
    return createResponse({ error: "Missing required fields" }, 400);
  }
  
  // Validate duration
  const validDurations = [7, 30, 90, 365];
  if (!validDurations.includes(parseInt(durationDays))) {
    durationDays = 7; // Default to 7 days
  }
  
  // Create or get user
  const usersSheet = getSheet("USERS");
  let user = findUserByEmail(email, usersSheet.getDataRange().getValues());
  
  if (!user) {
    // Create new user
    const now = new Date().toISOString();
    usersSheet.appendRow([
      email,
      email.split("@")[0], // Use email prefix as name
      now,
      now,
      1
    ]);
    user = { email: email };
  } else {
    // Update total_purchases
    updateUserPurchaseCount(email, usersSheet);
  }
  
  // Create transaction
  const transSheet = getSheet("TRANSACTIONS");
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + durationDays * 24 * 60 * 60 * 1000);
  
  // Generate transaction ID
  const txId = generateTransactionId();
  
  // Get pricing from catalog
  const catalogSheet = getSheet("EBOOK_CATALOG");
  const catalog = findEbookByCatalog(ebookSlug, catalogSheet.getDataRange().getValues());
  const priceColumn = "price_" + (durationDays === 365 ? "1year" : durationDays + "days");
  const price = catalog ? catalog[priceColumn] : 0;
  
  // Add transaction row
  transSheet.appendRow([
    txId,
    email,
    ebookSlug,
    durationDays,
    price,
    startTime.toISOString(),
    endTime.toISOString(),
    "active",
    new Date().toISOString(),
    "simulated"
  ]);
  
  return createResponse({
    success: true,
    transaction_id: txId,
    email: email,
    ebook_slug: ebookSlug,
    duration_days: durationDays,
    price_usd: price,
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    remaining_days: durationDays,
    message: `Access granted for ${durationDays} days`
  });
}

// ============================================
// ACTION: Get Catalog
// ============================================

function getCatalog(e) {
  /**
   * GET /get-catalog
   * Optional params:
   *   - ebook_slug: specific ebook (if not provided, return all)
   * 
   * Response:
   *   - ebooks: array of ebook objects
   */
  
  const ebookSlug = e.parameter.ebook_slug;
  const catalogSheet = getSheet("EBOOK_CATALOG");
  const data = catalogSheet.getDataRange().getValues();
  
  const ebooks = [];
  
  // Skip header row
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    if (!row[0]) continue; // Skip empty rows
    
    const ebook = {
      slug: row[0],
      title: row[1],
      author: row[2],
      description: row[3],
      pdf_url: row[4],
      pricing: {
        "7days": row[5],
        "30days": row[6],
        "90days": row[7],
        "1year": row[8]
      },
      available: row[9] === true || row[9] === "TRUE"
    };
    
    if (ebookSlug && ebook.slug === ebookSlug) {
      return createResponse({ ebook: ebook });
    }
    
    ebooks.push(ebook);
  }
  
  return createResponse({ ebooks: ebooks });
}

// ============================================
// ACTION: Create User
// ============================================

function createUser(e) {
  /**
   * POST /create-user
   * Body (JSON):
   *   - email: user email
   *   - full_name: user name (optional)
   * 
   * Response:
   *   - success: true/false
   *   - user: user object
   */
  
  const postData = JSON.parse(e.postData.contents);
  const email = postData.email;
  const fullName = postData.full_name || email.split("@")[0];
  
  if (!email) {
    return createResponse({ error: "Missing email" }, 400);
  }
  
  const usersSheet = getSheet("USERS");
  const userData = usersSheet.getDataRange().getValues();
  
  // Check if user already exists
  const existingUser = findUserByEmail(email, userData);
  if (existingUser) {
    return createResponse({
      success: true,
      existing: true,
      user: existingUser
    });
  }
  
  // Create new user
  const now = new Date().toISOString();
  usersSheet.appendRow([
    email,
    fullName,
    now,
    now,
    0
  ]);
  
  return createResponse({
    success: true,
    user: {
      email: email,
      full_name: fullName,
      created_at: now,
      total_purchases: 0
    }
  });
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function findUserByEmail(email, usersData) {
  // Skip header row (row 0)
  for (let i = 1; i < usersData.length; i++) {
    if (usersData[i][0] === email) {
      return {
        email: usersData[i][0],
        full_name: usersData[i][1],
        created_at: usersData[i][2],
        updated_at: usersData[i][3],
        total_purchases: usersData[i][4]
      };
    }
  }
  return null;
}

function findActiveTransaction(email, ebookSlug, transData) {
  const now = new Date();
  
  // Skip header row (row 0)
  for (let i = 1; i < transData.length; i++) {
    const row = transData[i];
    
    if (row[1] === email && row[2] === ebookSlug) {
      const status = row[7];
      const endTime = new Date(row[6]);
      
      // Check if transaction is still active
      if (status === "active" && endTime > now) {
        return {
          id: row[0],
          email: row[1],
          ebook_slug: row[2],
          duration_days: row[3],
          price_usd: row[4],
          start_time: row[5],
          end_time: row[6],
          status: row[7],
          created_at: row[8],
          payment_method: row[9]
        };
      }
    }
  }
  
  return null;
}

function findEbookByCatalog(slug, catalogData) {
  // Skip header row (row 0)
  for (let i = 1; i < catalogData.length; i++) {
    if (catalogData[i][0] === slug) {
      return {
        slug: catalogData[i][0],
        title: catalogData[i][1],
        author: catalogData[i][2],
        description: catalogData[i][3],
        pdf_url: catalogData[i][4],
        "price_7days": catalogData[i][5],
        "price_30days": catalogData[i][6],
        "price_90days": catalogData[i][7],
        "price_1year": catalogData[i][8],
        available: catalogData[i][9]
      };
    }
  }
  return null;
}

function updateUserPurchaseCount(email, usersSheet) {
  const data = usersSheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) {
      // Update count in column E (index 4)
      usersSheet.getRange(i + 1, 5).setValue(data[i][4] + 1);
      // Update updated_at in column D (index 3)
      usersSheet.getRange(i + 1, 4).setValue(new Date().toISOString());
      break;
    }
  }
}

function generateTransactionId() {
  // Simple ID: timestamp + random string
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 5);
  return "TX" + timestamp + random;
}

// ============================================
// MAINTENANCE FUNCTIONS
// ============================================

function expireOldTransactions() {
  /**
   * Run this as a scheduled trigger to mark expired transactions
   * Set up via: Edit > Current project's triggers
   * Trigger: Time-driven > Daily
   */
  
  const transSheet = getSheet("TRANSACTIONS");
  const data = transSheet.getDataRange().getValues();
  const now = new Date();
  
  // Skip header row
  for (let i = 1; i < data.length; i++) {
    const endTime = new Date(data[i][6]);
    
    if (data[i][7] === "active" && endTime < now) {
      // Mark as expired
      transSheet.getRange(i + 1, 8).setValue("expired");
    }
  }
  
  Logger.log("Transaction expiry check completed");
}

function listActiveUsers() {
  /**
   * Debug function: List all active users
   * Run this in Apps Script editor to see results in Logs
   */
  
  const usersSheet = getSheet("USERS");
  const data = usersSheet.getDataRange().getValues();
  
  Logger.log("=== Active Users ===");
  for (let i = 1; i < data.length; i++) {
    Logger.log(data[i][0] + " | " + data[i][1] + " | Purchases: " + data[i][4]);
  }
}

function resetAllData() {
  /**
   * WARNING: This will delete all data!
   * Only use for testing/development
   */
  
  const ss = getSpreadsheet();
  
  const sheets = ["USERS", "TRANSACTIONS", "EBOOK_CATALOG"];
  
  for (let sheetName of sheets) {
    const sheet = ss.getSheetByName(sheetName);
    if (sheet) {
      // Delete all data except header
      const range = sheet.getRange(2, 1, sheet.getMaxRows(), sheet.getMaxColumns());
      range.clearContent();
    }
  }
  
  Logger.log("All data has been cleared!");
}

// ============================================
// SETUP FUNCTION - Run once on first setup
// ============================================

function setupGoogleSheet() {
  /**
   * Run this once to create sheets if they don't exist
   */
  
  const ss = getSpreadsheet();
  
  // Create USERS sheet
  let sheet = ss.getSheetByName("USERS");
  if (!sheet) {
    sheet = ss.addSheet("USERS");
    sheet.appendRow(["email", "full_name", "created_at", "updated_at", "total_purchases"]);
  }
  
  // Create TRANSACTIONS sheet
  sheet = ss.getSheetByName("TRANSACTIONS");
  if (!sheet) {
    sheet = ss.addSheet("TRANSACTIONS");
    sheet.appendRow([
      "id", "email", "ebook_slug", "duration_days", "price_usd",
      "start_time", "end_time", "status", "created_at", "payment_method"
    ]);
  }
  
  // Create EBOOK_CATALOG sheet
  sheet = ss.getSheetByName("EBOOK_CATALOG");
  if (!sheet) {
    sheet = ss.addSheet("EBOOK_CATALOG");
    sheet.appendRow([
      "slug", "title", "author", "description", "pdf_url",
      "price_7days", "price_30days", "price_90days", "price_1year", "available"
    ]);
  }
  
  // Create SETTINGS sheet (optional)
  sheet = ss.getSheetByName("SETTINGS");
  if (!sheet) {
    sheet = ss.addSheet("SETTINGS");
    sheet.appendRow(["key", "value", "description"]);
  }
  
  Logger.log("Google Sheet setup complete!");
}

// ============================================
// TEST FUNCTIONS - For development
// ============================================

function testCheckAccess() {
  const result = checkAccess({
    parameter: {
      email: "test@example.com",
      ebook_slug: "spiritualitas-sosial-transformasi"
    }
  });
  Logger.log(result);
}

function testStartAccess() {
  const result = startAccess({
    postData: {
      contents: JSON.stringify({
        email: "test@example.com",
        ebook_slug: "spiritualitas-sosial-transformasi",
        duration_days: 7
      })
    }
  });
  Logger.log(result);
}
