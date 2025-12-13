# HRCOEG Project - Pseudocode Guide

## Overview
HRCOEG (HR & Consultation for Employment Generation) is a talent management platform connecting fresh graduates with companies. This guide provides pseudocode for all major features and workflows.

---

## 1. HOMEPAGE FUNCTIONALITY (Index.html)

### 1.1 Smooth Navigation Scroll
```pseudocode
FUNCTION scrollToSection(sectionId)
    INPUT: sectionId (string) - The ID of the target section
    
    GET element with ID = sectionId from DOM
    IF element exists THEN
        SCROLL element into view with smooth behavior
    END IF
END FUNCTION
```

### 1.2 Contact Form Submission
```pseudocode
FUNCTION handleContactSubmit(event)
    INPUT: event - Form submission event
    
    PREVENT default form submission
    GET form reference
    
    EXTRACT form values:
        - name = form input field (type=text)
        - email = form input field (type=email)
        - message = form input field (type=textarea)
    
    TRIM whitespace from all fields
    
    IF all fields are non-empty THEN
        SHOW confirmation alert: "Thank you {name}! We'll contact {email}"
        RESET form to empty state
    ELSE
        SHOW error alert: "Please fill in all fields"
    END IF
END FUNCTION
```

---

## 2. DATA VIEW TABLE FUNCTIONALITY (data-view.html)

### 2.1 Load Excel File (XLSX Parser)
```pseudocode
FUNCTION loadExcelFile(inputId, tableId)
    INPUT: 
        - inputId: ID of file input element
        - tableId: ID of target table
    
    GET file input element
    IF no file selected THEN
        RETURN early
    END IF
    
    GET first file from input
    CREATE FileReader instance
    
    ON file load completion:
        TRY
            CALL waitForXLSX() to ensure XLSX library is available
            IF XLSX library not available THEN
                RETRY after 200ms
                RETURN
            END IF
            
            CONVERT file to Uint8Array
            PARSE array with XLSX.read()
            
            IF workbook is empty THEN
                THROW error: "No sheets found"
            END IF
            
            GET first worksheet from workbook
            CONVERT worksheet to JSON array
            
            IF no rows found THEN
                SHOW alert: "No data in Excel file"
                RETURN
            END IF
            
            GET table element
            GET table tbody
            CLEAR tbody HTML
            
            FOR each row in parsed data DO
                CREATE new table row
                SET row number
                
                FOR each cell value in row DO
                    CREATE input element
                    SET input value to cell value
                    ADD input to new row
                END FOR
                
                ADD Delete button to row
                ADD Details button to row
                APPEND row to tbody
            END FOR
            
            SHOW success alert: "{count} rows loaded"
            UPDATE statistics
            RESET file input
            
        CATCH error as err
            SHOW alert: "Error reading Excel: {err.message}"
            LOG error to console
        END TRY
    
    READ file as array buffer
END FUNCTION
```

### 2.2 Sort Table by Column
```pseudocode
FUNCTION sortTable(tableId, columnIndex)
    INPUT: 
        - tableId: ID of table to sort
        - columnIndex: Column number to sort by
    
    GET table element
    GET tbody element
    
    CONVERT all tbody rows to array
    
    SORT array using comparison function:
        FOR each pair of rows (a, b):
            GET value from column at columnIndex in row a
            GET value from column at columnIndex in row b
            COMPARE values lexicographically
            RETURN comparison result
    
    CLEAR tbody HTML
    
    FOR each sorted row with index DO
        UPDATE row number display to index + 1
        APPEND row to tbody
    END FOR
END FUNCTION
```

### 2.3 Filter Table by Search Criteria
```pseudocode
FUNCTION filterTable(tableId)
    INPUT: tableId - ID of table to filter
    
    GET table element
    GET all rows in tbody
    GET all filter input elements
    
    INITIALIZE visible count to 0
    
    FOR each row in rows DO
        INITIALIZE match flag to TRUE
        
        FOR each filter with index DO
            GET filter value
            IF filter has value AND
               filter value is NOT in row cell at index THEN
                SET match flag to FALSE
                BREAK from filter loop
            END IF
        END FOR
        
        IF match is TRUE THEN
            SET row display to visible
            INCREMENT visible count
        ELSE
            SET row display to hidden
        END IF
    END FOR
    
    UPDATE statistics with visible count
END FUNCTION
```

### 2.4 Add New Row to Table
```pseudocode
FUNCTION addCandidateRow()
    INPUT: None
    
    GET candidate table element
    GET tbody element
    CREATE new empty row
    
    GET current row count as rowNum
    
    GENERATE new ID = 'C' + padded(rowNum)
    
    BUILD row HTML with:
        - Row number: rowNum
        - ID input with generated ID
        - Name input (empty placeholder)
        - Email input (empty placeholder)
        - Skills input (empty placeholder)
        - Status dropdown (default: Active)
        - Actions:
            - Details button (👁️)
            - Delete button
    
    INSERT HTML into new row
    APPEND row to tbody
    UPDATE table statistics
END FUNCTION
```

### 2.5 Delete Row from Table
```pseudocode
FUNCTION deleteRow(button)
    INPUT: button - The delete button clicked
    
    GET row element (button's parent tr)
    REMOVE row from DOM
    GET table ID from button's context
    UPDATE statistics for that table
END FUNCTION
```

### 2.6 Update Statistics
```pseudocode
FUNCTION updateStats(tableId)
    INPUT: tableId - ID of table to get stats for
    
    GET table element
    GET all visible rows (not hidden by filter)
    
    IF tableId is candidateTable THEN
        SET total count = number of visible rows
        COUNT rows where Status column = "Active"
        UPDATE #candidateCount element
        UPDATE #candidateActive element
        
    ELSE IF tableId is jobTable THEN
        SET total count = number of visible rows
        COUNT rows where Status column = "Open"
        SET closed count = total - open count
        UPDATE #jobCount element
        UPDATE #jobOpen element
        UPDATE #jobClosed element
    END IF
END FUNCTION
```

### 2.7 Export Table to CSV
```pseudocode
FUNCTION exportToCSV(tableId, filename)
    INPUT: 
        - tableId: ID of table to export
        - filename: Name for downloaded CSV file
    
    GET table element
    INITIALIZE empty CSV string
    
    FOR each row in table (including header) DO
        INITIALIZE cells array
        
        FOR each cell (th or td) in row DO
            SKIP first cell (row number)
            GET cell value (from input/select or text content)
            ESCAPE quotes in value
            WRAP value in quotes
            ADD to cells array
        END FOR
        
        JOIN cells with comma
        ADD newline
        APPEND to CSV string
    END FOR
    
    CREATE data URL with CSV content (UTF-8 encoded)
    CREATE temporary link element
    SET link href to data URL
    SET link download attribute to filename
    TRIGGER link click
    REMOVE temporary link
END FUNCTION
```

### 2.8 Import CSV to Table
```pseudocode
FUNCTION importCSV(event, tableId)
    INPUT: 
        - event: File input change event
        - tableId: ID of target table
    
    GET file from event.target.files[0]
    IF no file selected THEN
        RETURN
    END IF
    
    CREATE FileReader instance
    
    ON file load:
        GET CSV content string
        SPLIT string by newlines
        FILTER out empty rows
        
        GET table element
        GET tbody element
        CLEAR tbody HTML
        
        FOR each row starting from index 1 (skip header) DO
            SKIP if row is empty
            
            SPLIT row by comma
            REMOVE quote characters
            
            CREATE new tbody row
            SET row number to current index
            
            FOR each cell value with index DO
                IF last cell THEN
                    ADD Delete button
                ELSE
                    CREATE input with cell value
                END IF
            END FOR
            
            APPEND row to tbody
        END FOR
        
        UPDATE statistics
    
    READ file as text
END FUNCTION
```

---

## 3. MODAL/DETAIL VIEW FUNCTIONALITY

### 3.1 Show Candidate Detail Modal
```pseudocode
FUNCTION showCandidateDetail(button)
    INPUT: button - The Details button clicked
    
    GET parent row of button
    GET all cells in row
    
    EXTRACT values from cells:
        - id = cell[1].textContent
        - name = cell[2].input.value
        - email = cell[3].input.value
        - skills = cell[4].input.value
        - status = cell[5].select.value
    
    GET detail grid element
    
    BUILD detail HTML:
        FOR each field (ID, Name, Email, Skills, Status) DO
            CREATE detail field container
            ADD label element with field name
            ADD value element with field value
            APPEND to detail grid
        END FOR
    
    CALL openDetailModal()
END FUNCTION
```

### 3.2 Open Detail Modal
```pseudocode
FUNCTION openDetailModal()
    INPUT: None
    
    GET modal element (#detailModal)
    ADD CSS class 'show' to modal
    MODAL becomes visible with animation
    SET z-index to bring to front
END FUNCTION
```

### 3.3 Close Detail Modal
```pseudocode
FUNCTION closeDetailModal()
    INPUT: None
    
    GET modal element (#detailModal)
    REMOVE CSS class 'show' from modal
    MODAL becomes hidden
END FUNCTION
```

### 3.4 Edit Candidate (Placeholder)
```pseudocode
FUNCTION editCandidate()
    INPUT: None
    
    SHOW alert: "Edit mode coming soon!"
    CALL closeDetailModal()
    
    NOTE: Future implementation should:
        - Enable edit mode on modal fields
        - Save changes back to table
        - Validate data
        - Update statistics
END FUNCTION
```

### 3.5 Close Modal on Outside Click
```pseudocode
FUNCTION handleWindowClick(event)
    INPUT: event - Click event
    
    GET modal element
    IF clicked target is the modal element (not content) THEN
        CALL closeDetailModal()
    END IF
END FUNCTION
```

---

## 4. LIBRARY INITIALIZATION

### 4.1 Wait for XLSX Library
```pseudocode
FUNCTION waitForXLSX(callback)
    INPUT: callback - Function to call when XLSX is ready
    
    IF XLSX is defined globally THEN
        CALL callback()
    ELSE
        WAIT 100 milliseconds
        RECURSIVELY call waitForXLSX(callback)
    END IF
    
    NOTE: This ensures the XLSX library from CDN is loaded
    BEFORE code tries to use it
END FUNCTION
```

### 4.2 Trigger File Picker
```pseudocode
FUNCTION openTalentPoolFile()
    INPUT: None
    
    GET file input element (#talentPoolFile)
    TRIGGER click event on file input
    
    NOTE: This opens the system file browser for .xlsx files
END FUNCTION
```

---

## 5. DOM INITIALIZATION

### 5.1 Page Load Setup
```pseudocode
EVENT: DOMContentLoaded

    CALL updateStats('candidateTable')
    CALL updateStats('jobTable')
    
    NOTE: Initialize statistics when page loads
END EVENT
```

---

## 6. DATA STRUCTURES

### 6.1 Candidate Object (from Excel)
```pseudocode
STRUCTURE Candidate
    id: String          // Unique identifier (C001, C002, etc.)
    name: String        // Full candidate name
    email: String       // Email address
    phone: String       // Phone number (optional)
    skills: String      // Comma-separated skills
    status: String      // Active, Pending, Inactive
    age: Number         // Age (from Excel)
    gender: String      // Male, Female, Other
    salary: Number      // Expected/Current salary
    province: String    // Province/State
    city: String        // City/District
    education: String   // Education level/field
    experience: Number  // Years of experience
    createdAt: Date     // Record creation date
END STRUCTURE
```

### 6.2 Job Object
```pseudocode
STRUCTURE Job
    id: String          // Unique identifier (J001, J002, etc.)
    title: String       // Job title
    company: String     // Company name
    location: String    // Job location
    postedDate: Date    // When job was posted
    status: String      // Open, Closed
    description: String // Job description (optional)
    requirements: String// Job requirements (optional)
END STRUCTURE
```

### 6.3 Table State
```pseudocode
STRUCTURE TableState
    rows: Array[Object]       // All rows in table
    visibleRows: Array[Object]// Filtered rows currently shown
    totalCount: Number        // Total number of rows
    visibleCount: Number      // Number of visible rows
    sortColumn: Number        // Currently sorted column
    filters: Array[String]    // Active filter values
END STRUCTURE
```

---

## 7. USER WORKFLOWS

### 7.1 Workflow: Load and View Excel Data
```pseudocode
WORKFLOW: LoadExcelData
    
    USER: Clicks "Load Talent Pool" button
    SYSTEM: Opens file picker dialog
    
    USER: Selects HRCOEG Talent Pool #1.xlsx file
    SYSTEM: 
        - Reads Excel file
        - Parses first worksheet
        - Converts to JSON array
        - Populates candidate table
        - Shows success message
        
    USER: Table now shows all candidates with columns
    SYSTEM: Updates statistics (total count, active count)
    
END WORKFLOW
```

### 7.2 Workflow: Search and Filter Candidates
```pseudocode
WORKFLOW: FilterCandidates
    
    USER: Types in search field
    SYSTEM: Detects input change event
    
    SYSTEM: Calls filterTable()
        - Gets filter value
        - Checks each row for match
        - Hides non-matching rows
        - Shows matching rows
    
    SYSTEM: Updates statistics
        - Shows only visible row count
    
    USER: Sees filtered results in real-time
    
END WORKFLOW
```

### 7.3 Workflow: View Candidate Details
```pseudocode
WORKFLOW: ViewCandidateDetail
    
    USER: Clicks "👁️ Details" button on candidate row
    SYSTEM:
        - Extracts data from row cells
        - Builds detail view
        - Opens modal with animation
    
    MODAL: Displays candidate information in 2-column grid:
        - ID, Name, Email, Skills, Status
        - Can be extended with Age, Gender, Salary, etc.
    
    USER: Reviews candidate information
    
    USER: Clicks "Close" button or outside modal
    SYSTEM: Hides modal with smooth transition
    
END WORKFLOW
```

### 7.4 Workflow: Add New Candidate
```pseudocode
WORKFLOW: AddNewCandidate
    
    USER: Clicks "+ Add Row" button
    SYSTEM:
        - Creates new empty row
        - Generates ID (C + next number)
        - Sets default values
        - Appends to table
        - Updates statistics
    
    USER: Edits row fields directly in table:
        - Type in Name field
        - Type in Email field
        - Select Status from dropdown
    
    SYSTEM: Updates statistics on field change
    
    USER: Clicks Delete to remove row if needed
    SYSTEM: Removes row and updates statistics
    
END WORKFLOW
```

### 7.5 Workflow: Export Candidates to CSV
```pseudocode
WORKFLOW: ExportCandidatesCSV
    
    USER: Clicks "📥 Export CSV" button
    SYSTEM:
        - Extracts all table data
        - Formats as CSV string
        - Creates downloadable file
        - Triggers browser download
    
    FILE: candidates.csv is downloaded to user's device
    
END WORKFLOW
```

### 7.6 Workflow: Import Candidates from CSV
```pseudocode
WORKFLOW: ImportCandidatesCSV
    
    USER: Clicks "📤 Import CSV" button
    SYSTEM: Opens file picker
    
    USER: Selects CSV file
    SYSTEM:
        - Reads CSV content
        - Parses rows and columns
        - Clears existing table data
        - Populates table with CSV data
        - Updates statistics
    
    USER: Sees imported data in table
    
END WORKFLOW
```

---

## 8. ALGORITHM DETAILS

### 8.1 String Matching Algorithm (Filter)
```pseudocode
ALGORITHM: StringMatch(searchTerm, cellValue)
    INPUT: 
        - searchTerm: User's search input
        - cellValue: Cell content to match
    
    CONVERT both to UPPERCASE
    IF searchTerm is found in cellValue THEN
        RETURN TRUE (match found)
    ELSE
        RETURN FALSE (no match)
    END IF
END ALGORITHM
```

### 8.2 Sort Algorithm (Lexicographic)
```pseudocode
ALGORITHM: LexicographicSort(array, columnIndex)
    INPUT:
        - array: Array of rows to sort
        - columnIndex: Column to sort by
    
    USE built-in sort with comparator:
        COMPARATOR(rowA, rowB):
            valueA = rowA[columnIndex]
            valueB = rowB[columnIndex]
            
            RETURN valueA.localeCompare(valueB)
                   (alphabetical comparison)
    
    RETURN sorted array
END ALGORITHM
```

### 8.3 CSV Parsing Algorithm
```pseudocode
ALGORITHM: ParseCSV(csvString)
    INPUT: csvString - Raw CSV content
    OUTPUT: Array of rows with cells
    
    SPLIT csvString by newline → rows
    FILTER empty rows
    
    FOR each row DO
        SPLIT by comma → cells
        FOR each cell DO
            REMOVE surrounding quotes
            REMOVE escaped quotes (two quotes → one)
        END FOR
        ADD to results
    END FOR
    
    RETURN results
END ALGORITHM
```

### 8.4 Excel Parsing Algorithm
```pseudocode
ALGORITHM: ParseExcel(arrayBuffer)
    INPUT: arrayBuffer - Binary Excel file data
    OUTPUT: Array of rows as JSON objects
    
    CALL XLSX.read(arrayBuffer, options)
    GET first worksheet from workbook
    CALL XLSX.utils.sheet_to_json()
    
    RETURN JSON array of rows
END ALGORITHM
```

---

## 9. ERROR HANDLING

### 9.1 Excel Loading Errors
```pseudocode
ERROR_CASE: Excel file not readable
    SHOW alert to user
    LOG error details to console
    ALLOW user to retry
END ERROR_CASE

ERROR_CASE: XLSX library not loaded
    RETRY loading after delay
    SHOW message if timeout exceeded
END ERROR_CASE

ERROR_CASE: No data in Excel
    SHOW informative alert
    ALLOW user to select another file
END ERROR_CASE
```

### 9.2 Form Validation Errors
```pseudocode
ERROR_CASE: Form field empty
    DO NOT submit
    SHOW validation message
    HIGHLIGHT empty field
END ERROR_CASE

ERROR_CASE: Invalid email format
    BROWSER validates automatically
    PREVENT form submission
END ERROR_CASE
```

---

## 10. PERFORMANCE CONSIDERATIONS

### 10.1 Table Rendering
```pseudocode
OPTIMIZATION: Large dataset handling

    IF rows > 1000 THEN
        USE virtual scrolling (load visible rows only)
    ELSE
        LOAD all rows (current implementation)
    END IF
END OPTIMIZATION
```

### 10.2 Library Loading
```pseudocode
OPTIMIZATION: XLSX CDN reliability

    TRY primary CDN
    IF fails THEN
        TRY secondary CDN
    END IF
    
    USE retry logic for async loading
    TIMEOUT after 2 seconds
END OPTIMIZATION
```

---

## 11. FUTURE ENHANCEMENTS (Pseudocode)

### 11.1 Advanced Edit Mode
```pseudocode
FUNCTION enterEditMode()
    INPUT: rowId or candidateId
    
    GET row or modal detail
    CONVERT display fields to input fields
    SHOW Save and Cancel buttons
    
    USER: Edits data
    
    IF user clicks Save THEN
        VALIDATE data
        UPDATE database/storage
        SHOW success message
        EXIT edit mode
    ELSE IF user clicks Cancel THEN
        DISCARD changes
        EXIT edit mode
    END IF
END FUNCTION
```

### 11.2 Matching Algorithm
```pseudocode
FUNCTION matchCandidateToJob(candidate, job)
    INPUT: 
        - candidate: Candidate object
        - job: Job object
    
    INITIALIZE match score to 0
    
    // Skill matching
    candidateSkills = candidate.skills.split(",")
    jobSkills = job.requirements.split(",")
    
    FOR each job skill DO
        IF found in candidate skills THEN
            INCREMENT match score
        END IF
    END FOR
    
    // Experience matching
    IF candidate.experience >= job.requiredExperience THEN
        INCREMENT match score
    END IF
    
    // Location matching
    IF candidate.location == job.location THEN
        INCREMENT match score
    END IF
    
    CALCULATE percentage match = (match score / total criteria) * 100
    
    RETURN match score and percentage
END FUNCTION
```

### 11.3 Notification System
```pseudocode
FUNCTION notifyCandidateOfMatch(candidate, job, matchScore)
    INPUT:
        - candidate: Candidate object
        - job: Job object
        - matchScore: Match percentage
    
    IF matchScore > 75% THEN
        SEND email to candidate.email
        SHOW in-app notification
        LOG notification in history
    END IF
END FUNCTION
```

---

## 12. DATABASE SCHEMA (Future Implementation)

### 12.1 Candidates Table
```sql
CREATE TABLE candidates (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    skills TEXT,
    status ENUM('Active', 'Pending', 'Inactive'),
    age INT,
    gender VARCHAR(20),
    salary DECIMAL(10, 2),
    province VARCHAR(50),
    city VARCHAR(50),
    education VARCHAR(100),
    experience INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

### 12.2 Jobs Table
```sql
CREATE TABLE jobs (
    id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    posted_date TIMESTAMP,
    status ENUM('Open', 'Closed'),
    description TEXT,
    requirements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

---

## 13. SECURITY CONSIDERATIONS

### 13.1 Input Sanitization
```pseudocode
FUNCTION sanitizeInput(userInput)
    INPUT: userInput - Raw user input
    
    REMOVE leading/trailing whitespace
    ESCAPE special HTML characters:
        - & → &amp;
        - < → &lt;
        - > → &gt;
        - " → &quot;
        - ' → &#x27;
    
    RETURN sanitized string
END FUNCTION
```

### 13.2 CSV Injection Prevention
```pseudocode
WHEN exporting CSV:
    IF cell value starts with =, +, -, or @ THEN
        PREPEND single quote (')
        This prevents formula injection
    END IF
END WHEN
```

---

## PSEUDOCODE LEGEND

- **INPUT/OUTPUT**: Function parameters and returns
- **IF/THEN/ELSE**: Conditional logic
- **FOR/WHILE**: Loops
- **INITIALIZE**: Variable assignment
- **GET**: Retrieve DOM element or value
- **SET**: Assign value to DOM element or variable
- **CALL**: Execute another function
- **RETURN**: Send result back
- **TRY/CATCH**: Error handling
- **EVENT**: JavaScript event listener
- **STRUCTURE**: Data type definition
- **WORKFLOW**: User interaction sequence
- **ALGORITHM**: Detailed step-by-step process
- **NOTE**: Additional explanation
- **TODO**: Future implementation

---

## Quick Reference: Function List

| Function | Purpose |
|----------|---------|
| `scrollToSection()` | Smooth scroll to page section |
| `handleContactSubmit()` | Process contact form |
| `loadExcelFile()` | Import Excel data to table |
| `sortTable()` | Sort table by column |
| `filterTable()` | Filter/search table |
| `addCandidateRow()` | Add new row |
| `deleteRow()` | Remove row |
| `updateStats()` | Update counters |
| `exportToCSV()` | Download table as CSV |
| `importCSV()` | Upload CSV to table |
| `showCandidateDetail()` | Open detail modal |
| `openDetailModal()` | Display modal |
| `closeDetailModal()` | Hide modal |
| `editCandidate()` | Edit mode (future) |
| `waitForXLSX()` | Library initialization |

---

**Document Version**: 1.0  
**Last Updated**: December 1, 2025  
**Project**: HRCOEG - HR Talent Management System
