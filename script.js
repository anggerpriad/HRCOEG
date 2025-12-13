// Smooth scroll to sections
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

// Handle contact form submission
function handleContactSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const name = form.querySelector('input[type="text"]').value;
  const email = form.querySelector('input[type="email"]').value;
  const message = form.querySelector('textarea').value;
  
  // Simple validation
  if (name.trim() && email.trim() && message.trim()) {
    // Here you would typically send this to a server
    alert(`Thank you ${name}! We'll get back to you at ${email} shortly.`);
    form.reset();
  } else {
    alert('Please fill in all fields.');
  }
}

// Search table function
function searchTable(searchInputId, tableId) {
  const input = document.getElementById(searchInputId);
  const filter = input.value.toUpperCase();
  const table = document.getElementById(tableId);
  const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

  for (let i = 0; i < rows.length; i++) {
    let match = false;
    const cells = rows[i].getElementsByTagName('td');
    
    for (let j = 0; j < cells.length - 1; j++) {
      if (cells[j].textContent.toUpperCase().indexOf(filter) > -1) {
        match = true;
        break;
      }
    }
    
    rows[i].style.display = match ? '' : 'none';
  }
}

// Add candidate function
function addCandidate() {
  alert('Add Candidate feature coming soon!');
}

// Add job function
function addJob() {
  alert('Add Job feature coming soon!');
}