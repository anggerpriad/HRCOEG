// Create an enhanced data-view that loads Excel data via import
// This file demonstrates how to use the data with the Excel-like viewer

// Sample data structure from the Talent Pool Excel file
const talentPoolData = {
  headers: ["ID", "Name", "Email", "Phone", "Skills", "Experience", "Location", "Status"],
  rows: [
    { ID: "TP001", Name: "John Smith", Email: "john@example.com", Phone: "+1-555-0101", Skills: "JavaScript, React, Node.js", Experience: "5 years", Location: "New York, NY", Status: "Active" },
    { ID: "TP002", Name: "Sarah Johnson", Email: "sarah@example.com", Phone: "+1-555-0102", Skills: "Python, Django, SQL", Experience: "4 years", Location: "San Francisco, CA", Status: "Active" },
    { ID: "TP003", Name: "Michael Chen", Email: "michael@example.com", Phone: "+1-555-0103", Skills: "Java, Spring Boot, AWS", Experience: "6 years", Location: "Seattle, WA", Status: "Pending" },
    { ID: "TP004", Name: "Emily Davis", Email: "emily@example.com", Phone: "+1-555-0104", Skills: "UI/UX Design, Figma", Experience: "3 years", Location: "Los Angeles, CA", Status: "Active" },
    { ID: "TP005", Name: "David Wilson", Email: "david@example.com", Phone: "+1-555-0105", Skills: "Data Science, Python, ML", Experience: "7 years", Location: "Boston, MA", Status: "Inactive" }
  ]
};

// You can use this with the Excel-like table viewer in data-view.html
console.log("Talent Pool Data loaded");
console.log(`Total candidates: ${talentPoolData.rows.length}`);
