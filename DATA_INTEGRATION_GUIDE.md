# HRCOEG Data Integration Guide

## How to Use Talent Pool #1.xlsx Data

### Option 1: Direct Excel Import (Recommended)
1. Open `data-view.html` in your browser
2. Click the **📂 Load Talent Pool** button in the Candidates section
3. Select the `Talent Pool #1.xlsx` file from your HRCOEG folder
4. The data will automatically populate the Excel-like table
5. Edit, filter, sort, and export as needed

### Option 2: CSV Export/Import
1. Open `Talent Pool #1.xlsx` in Microsoft Excel
2. Save as CSV (File → Save As → CSV UTF-8)
3. In `data-view.html`, click **📤 Import CSV**
4. Select the CSV file
5. Data will load into the table

### Option 3: Manual Data Integration
If you want to pre-populate the table with Excel data:

**Step 1:** Extract Excel data to JSON
- Use the provided `extract_excel.py` script (requires Python + openpyxl)
- Or manually copy data from Excel

**Step 2:** Add the JSON data to your HTML
- Create a `dataLoader.js` file with your Excel data
- Link it in the HTML

**Step 3:** Load the data on page load
- Call the data loading function when the page initializes

## File Structure
```
HRCOEG/
├── Index.html              (Main homepage)
├── data-view.html          (Excel-like data viewer)
├── script.js               (Main JavaScript)
├── style.css               (Styling)
├── talentPoolData.js       (Sample data structure)
├── extract_excel.py        (Python script to extract Excel)
└── Talent Pool #1.xlsx     (Your Excel file with talent data)
```

## Features in data-view.html

✅ **Excel-like Interface**
- Spreadsheet styling with alternating row colors
- Column headers with sort functionality (click header)
- Row numbers on left side

✅ **Data Management**
- ➕ Add rows with auto-generated IDs
- 🗑️ Delete individual rows
- 📥 Export to CSV
- 📤 Import CSV/XLSX files
- 📂 Load Talent Pool Excel file

✅ **Filtering & Sorting**
- Real-time search across multiple fields
- Sort by column (ascending/descending)
- Status filtering

✅ **Real-time Statistics**
- Total count updates
- Status breakdowns
- Live row counting

## Browser Compatibility
- Uses XLSX.js library from CDN for Excel parsing
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- No server-side processing required

## Tips
1. **Large files**: Excel files are processed client-side, so performance depends on your browser
2. **Data persistence**: Use browser's LocalStorage to save data (can be added)
3. **Backup**: Always keep your original Excel file as backup
4. **CSV format**: If XLSX import fails, export to CSV first and use CSV import

## Troubleshooting

**Issue: "Error reading Excel file: XLSX is not defined"**
- The XLSX library is taking time to load from CDN
- **Solution 1:** Refresh the page and wait 2-3 seconds before clicking the button
- **Solution 2:** Check your internet connection (CDN needs access)
- **Solution 3:** Try a different browser (Chrome/Firefox recommended)
- **Solution 4:** Open browser Console (F12) and type `typeof XLSX` to check if library loaded
- **Solution 5:** Convert Excel to CSV first and use CSV import instead

**How to check if XLSX loaded:**
1. Press F12 to open Developer Tools
2. Go to Console tab
3. Type: `typeof XLSX`
4. Should show: `"object"` (if loaded) or `"undefined"` (if not loaded yet)

**Issue: "📂 Load Talent Pool button not working"**
- Ensure your browser allows file access
- Check that XLSX.js library is loaded (check Console with steps above)
- Try Firefox or Chrome instead
- Make sure you clicked the button correctly

**Issue: "Data not showing after import"**
- Check Excel file format (should be .xlsx or .xls)
- Verify Excel file has headers in first row
- Open browser Console (F12) for error messages
- Try converting to CSV first: Open Excel → Save As → CSV UTF-8

**Issue: "Columns don't align"**
- The system auto-generates columns based on Excel headers
- Ensure Excel headers are in the first row
- Delete any empty rows/columns at the top of your Excel file

**If all else fails:**
1. Convert your Excel file to CSV
2. Click **📤 Import CSV** button
3. Select the CSV file
4. This avoids XLSX library issues entirely

## Integration with Your Backend
To save data to a server:
1. Add an API endpoint to your backend
2. Modify the exportToCSV function to POST data
3. Add auto-save functionality

Example:
```javascript
function saveToServer(tableId) {
  const table = document.getElementById(tableId);
  const data = [];
  table.querySelectorAll('tbody tr').forEach(row => {
    // Extract row data
    // POST to server
  });
}
```

---

**For more help**, refer to the comments in `data-view.html` and `script.js`
