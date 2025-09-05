// List of hospitals in Pune for matching after QR scan
let hospitals = JSON.parse(localStorage.getItem('hospitals')) || [
  { 
    name: "City Hospital", 
    bloodAvailable: "A+, B-", 
    medicine: [
      "Insulin", "Adrenaline", "Morphine", "Antibiotics", "Painkillers",
      "Atropine", "Dopamine", "Nitroglycerin", "Aspirin", "Anti-venom"
    ], 
    location: "Tingre Nagar",
    city: "Pune"
  },
  { 
    name: "General Hospital", 
    bloodAvailable: "O+, AB-", 
    medicine: [
      "Antibiotics", "Antihistamines", "Antacids", "Painkillers", "Anti-inflammatory",
      "Epinephrine", "Lidocaine", "Dexamethasone", "Metformin", "Warfarin"
    ], 
    location: "Viman Nagar" 
  },
  { 
    name: "Unity Care Hospital", 
    bloodAvailable: "B+, O-", 
    medicine: [
      "Painkillers", "Antibiotics", "Insulin", "Anti-inflammatory", "Antihistamines",
      "Amiodarone", "Naloxone", "Furosemide", "Heparin", "Calcium Gluconate"
    ], 
    location: "Airport Road" 
  },
  { 
    name: "Ruby Hall Clinic", 
    bloodAvailable: "A-, AB+", 
    medicine: [
      "Paracetamol", "Antibiotics", "Antihistamines", "Painkillers", "Anti-inflammatory",
      "Diazepam", "Propranolol", "Ranitidine", "Omeprazole", "Metoclopramide"
    ], 
    location: "Porwal Road" 
  },
  { 
    name: "Sahyadri Hospital", 
    bloodAvailable: "B-, A+", 
    medicine: [
      "Insulin", "Antibiotics", "Painkillers", "Anti-inflammatory", "Antihistamines",
      "Adenosine", "Verapamil", "Digoxin", "Amoxicillin", "Cefazolin"
    ], 
    location: "Viman Nagar" 
  },
  { 
    name: "Noble Hospital", 
    bloodAvailable: "O+, B+", 
    medicine: [
      "Antibiotics", "Painkillers", "Anti-inflammatory", "Antihistamines", "Antacids",
      "Methylprednisolone", "Albuterol", "Ipratropium", "Theophylline", "Montelukast"
    ], 
    location: "Tingre Nagar" 
  },
  { 
    name: "Columbia Asia", 
    bloodAvailable: "A+, AB-", 
    medicine: [
      "Painkillers", "Antibiotics", "Insulin", "Anti-inflammatory", "Antihistamines",
      "Phenytoin", "Levetiracetam", "Valproate", "Carbamazepine", "Phenobarbital"
    ], 
    location: "Lohgaon" 
  },
  { 
    name: "Jehangir Hospital", 
    bloodAvailable: "A-, O+", 
    medicine: [
      "Paracetamol", "Antibiotics", "Painkillers", "Anti-inflammatory", "Antihistamines",
      "Metoprolol", "Amlodipine", "Enalapril", "Hydrochlorothiazide", "Spironolactone"
    ], 
    location: "Camp Pune" 
  }
];

// Store selected medicines for each hospital
let selectedHospitalMedicines = {};

// Function to select medicine from hospital list
function selectMedicine(hospitalName, medicine) {
    if (!selectedHospitalMedicines[hospitalName]) {
        selectedHospitalMedicines[hospitalName] = [];
    }
    
    const medicineElement = document.querySelector(`#medicines-${hospitalName} li[data-medicine="${medicine}"]`);
    const isSelected = selectedHospitalMedicines[hospitalName].includes(medicine);
    
    if (isSelected) {
        // Remove selection
        selectedHospitalMedicines[hospitalName] = selectedHospitalMedicines[hospitalName].filter(m => m !== medicine);
        medicineElement.classList.remove('selected-medicine');
        medicineElement.querySelector('.select-btn').textContent = 'Select';
    } else {
        // Add selection
        selectedHospitalMedicines[hospitalName].push(medicine);
        medicineElement.classList.add('selected-medicine');
        medicineElement.querySelector('.select-btn').textContent = 'Selected';
    }
    
    // Update the save button state
    updateSaveButton(hospitalName);
}

// Function to update save button state
function updateSaveButton(hospitalName) {
    const saveBtn = document.querySelector(`#medicines-${hospitalName} .save-selected-btn`);
    if (selectedHospitalMedicines[hospitalName] && selectedHospitalMedicines[hospitalName].length > 0) {
        saveBtn.disabled = false;
        saveBtn.textContent = `Save ${selectedHospitalMedicines[hospitalName].length} Selected Medicines`;
    } else {
        saveBtn.disabled = true;
        saveBtn.textContent = 'No Medicines Selected';
    }
}

// Function to save selected medicines from a hospital
function saveHospitalMedicines(hospitalName) {
    if (selectedHospitalMedicines[hospitalName] && selectedHospitalMedicines[hospitalName].length > 0) {
        // Add selected medicines to saved list
        selectedHospitalMedicines[hospitalName].forEach(medicine => {
            if (!savedMedicines.includes(medicine)) {
                savedMedicines.push(medicine);
            }
        });
        
        // Update display
        updateSavedMedicinesDisplay();
        
        // Clear selection
        selectedHospitalMedicines[hospitalName] = [];
        document.querySelectorAll(`#medicines-${hospitalName} li`).forEach(li => {
            li.classList.remove('selected-medicine');
            li.querySelector('.select-btn').textContent = 'Select';
        });
        
        // Update save button
        updateSaveButton(hospitalName);
        
        // Show success message
        alert('Selected medicines have been saved successfully!');
    }
}

// Display the initial list of nearby hospitals (this will be visible at the bottom of the page)
function displayNearbyHospitals() {
  const hospitalListBottom = document.getElementById('hospitalListBottom');
  hospitalListBottom.innerHTML = ''; // Clear the bottom list
}

// Toggle medicines display for a specific hospital
function toggleMedicines(hospitalName) {
  const medicinesDiv = document.getElementById(`medicines-${hospitalName}`);
  const button = medicinesDiv.previousElementSibling;
  
  if (medicinesDiv.style.display === 'none') {
    medicinesDiv.style.display = 'block';
    button.textContent = 'Hide Medicines';
  } else {
    medicinesDiv.style.display = 'none';
    button.textContent = 'Show Medicines';
  }
}

// Start QR scanning
async function startScan() {
  const video = document.getElementById('video');
  const canvasElement = document.getElementById('canvas');
  const canvas = canvasElement.getContext('2d');
  const scanResult = document.getElementById('scanResult');
  const hospitalList = document.getElementById('hospitalList');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = stream;
    video.style.display = 'block';
    video.play();

    const scan = async () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.width = video.videoWidth;
        canvasElement.height = video.videoHeight;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' });

        if (code) {
          video.srcObject.getTracks().forEach(track => track.stop());
          
          try {
            const patientData = JSON.parse(code.data);
            
            // First display QR code data
            scanResult.innerHTML = `
              <div class="qr-data-display">
                <h4>Scanned QR Code Data:</h4>
                <div class="qr-data-content">
                  <div class="data-row">
                    <span class="data-label">Patient Name:</span>
                    <span class="data-value">${patientData.name}</span>
                  </div>
                  <div class="data-row">
                    <span class="data-label">Blood Group:</span>
                    <span class="data-value">${patientData.blood}</span>
                  </div>
                  <div class="data-row">
                    <span class="data-label">Required Medicines:</span>
                    <span class="data-value">${Array.isArray(patientData.conditions) ? patientData.conditions.join(', ') : patientData.conditions}</span>
                  </div>
                  <div class="data-row">
                    <span class="data-label">Contact Number:</span>
                    <span class="data-value">${patientData.contact}</span>
                  </div>
                  <div class="data-row">
                    <span class="data-label">Allergies:</span>
                    <span class="data-value">${patientData.allergies || 'None'}</span>
                  </div>
                </div>
              </div>`;

            // Then find and display matching hospitals
            const selectedCity = document.getElementById('scanCity').value;
            
            // First filter hospitals by selected city
            const cityFilteredHospitals = hospitals.filter(h => 
              selectedCity ? h.city === selectedCity : true
            );

            // Then find hospitals that match either blood group or medicines
            const matchingHospitals = cityFilteredHospitals.filter(h => {
              // Check if blood group matches
              const bloodMatch = h.bloodAvailable.includes(patientData.blood);
              
              // Check if any required medicine matches
              const medicineMatch = Array.isArray(patientData.conditions) && 
                patientData.conditions.some(med => 
                  h.medicine.some(hospitalMed => 
                    hospitalMed.toLowerCase() === med.toLowerCase()
                  )
                );

              // Return true if either blood group or medicine matches
              return bloodMatch || medicineMatch;
            });

            // Display matching hospitals
            if (matchingHospitals.length === 0) {
              hospitalList.innerHTML = '<p>No matching hospitals found in the selected city.</p>';
            } else {
              let result = '<h4>Matching Hospitals:</h4>';
              matchingHospitals.forEach(h => {
                // Find which medicines match
                const matchingMedicines = Array.isArray(patientData.conditions) ? 
                  h.medicine.filter(med => 
                    patientData.conditions.some(reqMed => 
                      reqMed.toLowerCase() === med.toLowerCase()
                    )
                  ) : [];

                // Determine match type
                const bloodMatch = h.bloodAvailable.includes(patientData.blood);
                const matchType = bloodMatch && matchingMedicines.length > 0 ? 'Both Blood and Medicines' :
                                bloodMatch ? 'Blood Group Match' : 'Medicines Match';

                result += `
                  <div class="hospital-card">
                    <p><strong>${h.name}</strong><br>
                    Location: ${h.location}<br>
                    City: ${h.city}<br>
                    Match Type: ${matchType}<br>
                    Blood Available: ${h.bloodAvailable}<br>
                    Matching Medicines: ${matchingMedicines.join(', ')}<br>
                    All Available Medicines: ${h.medicine.join(', ')}</p>
                    <div class="hospital-actions">
                      <button onclick="viewHospitalLocation('${h.name}', '${h.location}', '${h.city}')" class="view-location-btn">View Location</button>
                    </div>
                  </div>`;
              });
              hospitalList.innerHTML = result;
            }
          } catch (error) {
            console.error('Error parsing QR code data:', error);
            scanResult.innerHTML = '<p>Error: Invalid QR code format</p>';
            hospitalList.innerHTML = '';
          }
        } else {
          requestAnimationFrame(scan);
        }
      } else {
        requestAnimationFrame(scan);
      }
    };
    scan();
  } catch (error) {
    console.error('Error accessing camera: ', error);
    alert('Unable to access camera.');
  }
}

// Tab switching functionality
function showTab(tabName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Add active class to selected tab
    event.target.classList.add('active');
}

// Store saved medicines
let savedMedicines = [];

// Function to save selected medicines
function saveSelectedMedicines() {
    const selectedMedicines = Array.from(document.querySelectorAll('input[name="requiredMedicine"]:checked'))
        .map(checkbox => checkbox.value);
    
    // Add new medicines to saved list
    selectedMedicines.forEach(medicine => {
        if (!savedMedicines.includes(medicine)) {
            savedMedicines.push(medicine);
        }
    });
    
    // Update display
    updateSavedMedicinesDisplay();
    
    // Clear selection
    document.querySelectorAll('input[name="requiredMedicine"]:checked').forEach(checkbox => {
        checkbox.checked = false;
    });
}

// Function to remove a saved medicine
function removeSavedMedicine(medicine) {
    savedMedicines = savedMedicines.filter(m => m !== medicine);
    updateSavedMedicinesDisplay();
}

// Function to update the display of saved medicines
function updateSavedMedicinesDisplay() {
    const savedMedicinesList = document.getElementById('savedMedicinesList');
    savedMedicinesList.innerHTML = '';
    
    savedMedicines.forEach(medicine => {
        const medicineItem = document.createElement('div');
        medicineItem.className = 'saved-medicine-item';
        medicineItem.innerHTML = `
            <span>${medicine}</span>
            <button class="remove-medicine" onclick="removeSavedMedicine('${medicine}')">×</button>
        `;
        savedMedicinesList.appendChild(medicineItem);
    });
}

// Update the QR code generation to use saved medicines
document.getElementById('qrForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Check if any medicines are saved
    if (savedMedicines.length === 0) {
        alert('Please select and save at least one medicine before generating QR code.');
        return;
    }
    
    // Check if other required fields are filled
    const patientName = document.getElementById('patientName').value.trim();
    const bloodGroup = document.getElementById('bloodGroup').value;
    const contactNumber = document.getElementById('contactNumber').value.trim();
    
    if (!patientName || !bloodGroup || !contactNumber) {
        alert('Please fill in all required fields (Name, Blood Group, and Contact Number) before generating QR code.');
        return;
    }
    
    const patientData = {
        name: patientName,
        blood: bloodGroup,
        conditions: savedMedicines,
        contact: contactNumber,
        allergies: document.getElementById('allergies').value.trim() || 'None'
    };
    
    // Convert to JSON string
    const jsonString = JSON.stringify(patientData);
    
    // Generate QR code
    const qrDisplay = document.getElementById('qrDisplay');
    qrDisplay.innerHTML = ''; // Clear previous QR code
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    qrDisplay.appendChild(canvas);
    
    try {
        QRCode.toCanvas(canvas, jsonString, {
            width: 200,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        }, function(error) {
            if (error) {
                console.error('Error generating QR code:', error);
                alert('Error generating QR code. Please try again.');
                qrDisplay.innerHTML = '<p style="color: red;">Error generating QR code. Please try again.</p>';
            } else {
                // Add success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <div class="success-content">
                        <h3>QR Code Generated Successfully!</h3>
                        <p>Your emergency QR code is ready to use.</p>
                    </div>
                `;
                qrDisplay.insertBefore(successMessage, canvas);
                
                // Add QR code data display
                const qrDataDisplay = document.createElement('div');
                qrDataDisplay.className = 'qr-data-display';
                qrDataDisplay.innerHTML = `
                    <h4>QR Code Data:</h4>
                    <div class="qr-data-content">
                        <div class="data-row">
                            <span class="data-label">Patient Name:</span>
                            <span class="data-value">${patientName}</span>
                        </div>
                        <div class="data-row">
                            <span class="data-label">Blood Group:</span>
                            <span class="data-value">${bloodGroup}</span>
                        </div>
                        <div class="data-row">
                            <span class="data-label">Required Medicines:</span>
                            <span class="data-value">${savedMedicines.join(', ')}</span>
                        </div>
                        <div class="data-row">
                            <span class="data-label">Contact Number:</span>
                            <span class="data-value">${contactNumber}</span>
                        </div>
                        <div class="data-row">
                            <span class="data-label">Allergies:</span>
                            <span class="data-value">${document.getElementById('allergies').value.trim() || 'None'}</span>
                        </div>
                    </div>
                `;
                qrDisplay.appendChild(qrDataDisplay);
                
                // Add download button
                const downloadBtn = document.createElement('button');
                downloadBtn.className = 'generate-btn';
                downloadBtn.style.marginTop = '20px';
                downloadBtn.textContent = 'Download QR Code';
                downloadBtn.onclick = function() {
                    const link = document.createElement('a');
                    link.download = 'emergency-qr-code.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                };
                qrDisplay.appendChild(downloadBtn);
                
                // Show success alert
                alert('QR Code has been generated successfully! You can now download it.');
            }
        });
    } catch (error) {
        console.error('Error in QR code generation:', error);
        qrDisplay.innerHTML = '<p style="color: red;">Error: QR code generation failed. Please check if the QR code library is properly loaded.</p>';
    }
});

// Add event listener for save medicines button
document.getElementById('saveMedicinesBtn').addEventListener('click', saveSelectedMedicines);

// Function to get current location
function getCurrentLocation() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }

    const locationBtn = document.querySelector('.location-btn');
    locationBtn.disabled = true;
    locationBtn.textContent = 'Getting Location...';

    navigator.geolocation.getCurrentPosition(
        async function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            try {
                // Using OpenStreetMap Nominatim API for reverse geocoding
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();

                if (data.address && data.address.state === 'Maharashtra') {
                    // Find the closest city from our list
                    const citySelect = document.getElementById('scanCity');
                    const cities = Array.from(citySelect.options).map(option => option.value);
                    
                    // Extract city from address
                    const addressCity = data.address.city || data.address.town || data.address.village;
                    
                    if (addressCity && cities.includes(addressCity)) {
                        citySelect.value = addressCity;
                        alert(`Location detected: ${addressCity}`);
                    } else {
                        alert('Could not determine your city. Please select it manually.');
                    }
                } else {
                    alert('You are not in Maharashtra. Please select your city manually.');
                }
            } catch (error) {
                console.error('Error getting location:', error);
                alert('Error getting location. Please select your city manually.');
            } finally {
                locationBtn.disabled = false;
                locationBtn.textContent = 'Get Current Location';
            }
        },
        function(error) {
            console.error('Error getting location:', error);
            alert('Error getting location. Please select your city manually.');
            locationBtn.disabled = false;
            locationBtn.textContent = 'Get Current Location';
        }
    );
}

// Function to view hospital location on Google Maps
function viewHospitalLocation(hospitalName, location, city) {
    const searchQuery = encodeURIComponent(`${hospitalName}, ${city}, Maharashtra, India`);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
    window.open(mapsUrl, '_blank');
}

// Function to show hospital list
function showHospitalList(section) {
    const container = document.getElementById(`${section}HospitalList`);
    const content = container.querySelector('.hospital-list-content');
    
    // Toggle visibility
    if (container.style.display === 'none') {
        container.style.display = 'block';
        
        // Generate hospital list content
        let html = '';
        
        if (hospitals.length === 0) {
            html = '<p>No hospitals registered yet.</p>';
        } else {
            // Group hospitals by city
            const hospitalsByCity = {};
            hospitals.forEach((hospital, index) => {
                // Skip hospitals with undefined properties
                if (!hospital || !hospital.name || !hospital.location || !hospital.city) {
                    return;
                }
                
                if (!hospitalsByCity[hospital.city]) {
                    hospitalsByCity[hospital.city] = [];
                }
                hospitalsByCity[hospital.city].push({...hospital, index});
            });
            
            // Generate HTML for each city
            Object.keys(hospitalsByCity).forEach(city => {
                html += `
                    <div class="city-group">
                        <h4>${city}</h4>
                        ${hospitalsByCity[city].map(hospital => `
                            <div class="hospital-card">
                                <p><strong>${hospital.name}</strong><br>
                                Location: ${hospital.location}<br>
                                Blood Available: ${hospital.bloodAvailable || 'N/A'}<br>
                                Available Medicines: ${Array.isArray(hospital.medicine) ? hospital.medicine.join(', ') : 'N/A'}<br>
                                Ventilators: ${hospital.ventilators || 'N/A'}</p>
                                <div class="hospital-actions">
                                    <button onclick="viewHospitalLocation('${hospital.name}', '${hospital.location}', '${hospital.city}')" class="view-location-btn">View Location</button>
                                    <button onclick="editHospital(${hospital.index})" class="edit-btn">Edit</button>
                                    <button onclick="deleteHospital(${hospital.index})" class="delete-btn">Delete</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            });
        }
        
        content.innerHTML = html;
  } else {
        container.style.display = 'none';
    }
}

// Function to edit hospital
function editHospital(index) {
    const hospital = hospitals[index];
    
    // Fill the form with hospital data
    document.getElementById('hospitalName').value = hospital.name;
    document.getElementById('location').value = hospital.location;
    document.getElementById('city').value = hospital.city;
    document.getElementById('ventilators').value = hospital.ventilators;
    
    // Check blood groups
    const bloodGroups = hospital.bloodAvailable.split(', ');
    document.querySelectorAll('input[name="bloodGroups"]').forEach(checkbox => {
        checkbox.checked = bloodGroups.includes(checkbox.value);
    });

    // Check medicines
    document.querySelectorAll('input[name="medicines"]').forEach(checkbox => {
        checkbox.checked = hospital.medicine.includes(checkbox.value);
    });
    
    // Store the index for updating
    document.getElementById('hospitalForm').dataset.editIndex = index;
    
    // Switch to add hospital tab
    showTab('addHospital');
    
    // Change form submit button text
    const submitBtn = document.querySelector('#hospitalForm button[type="submit"]');
    submitBtn.textContent = 'Update Hospital';
}

// Function to delete hospital
function deleteHospital(index) {
    if (confirm('Are you sure you want to delete this hospital?')) {
        hospitals.splice(index, 1);
        saveHospitalsToStorage(); // Save to localStorage after deletion
        showHospitalList('add'); // Refresh the list
    }
}

// Function to save hospitals to localStorage
function saveHospitalsToStorage() {
    localStorage.setItem('hospitals', JSON.stringify(hospitals));
}

// Modify the form submission handler to handle both add and edit
document.getElementById('hospitalForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const hospitalName = document.getElementById('hospitalName').value.trim();
    const location = document.getElementById('location').value.trim();
    const city = document.getElementById('city').value.trim();
    
    // Get selected blood groups from checkboxes
    const bloodGroups = Array.from(document.querySelectorAll('input[name="bloodGroups"]:checked'))
        .map(checkbox => checkbox.value);
    
    // Get selected medicines from checkboxes
    const medicines = Array.from(document.querySelectorAll('input[name="medicines"]:checked'))
        .map(checkbox => checkbox.value);
    
    const ventilators = parseInt(document.getElementById('ventilators').value);
    
    // Validate inputs
    if (!hospitalName || !location || !city || bloodGroups.length === 0 || medicines.length === 0 || isNaN(ventilators) || ventilators < 0) {
        alert('Please fill in all required fields with valid values.');
        return;
    }
    
    // Create new hospital object
    const newHospital = {
        name: hospitalName,
        location: location,
        city: city,
        bloodAvailable: bloodGroups.join(', '),
        medicine: medicines,
        ventilators: ventilators
    };
    
    // Check if we're editing or adding
    const editIndex = this.dataset.editIndex;
    if (editIndex !== undefined) {
        // Update existing hospital
        hospitals[editIndex] = newHospital;
        delete this.dataset.editIndex;
    } else {
        // Add new hospital
        hospitals.push(newHospital);
    }
    
    // Save to localStorage
    saveHospitalsToStorage();
    
    // Update the display
    displayNearbyHospitals();
    
    // Clear form
    this.reset();
    
    // Reset submit button text
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Add Hospital';
    
    // Show success message
    alert(editIndex !== undefined ? 'Hospital updated successfully!' : 'Hospital added successfully!');
    
    // Show the updated hospital list
    showHospitalList('add');
    
    // Stay on the add hospital tab
    showTab('addHospital');
});

// Display initial hospitals when page loads
document.addEventListener('DOMContentLoaded', displayNearbyHospitals);

// Initialize Google Maps
let map;
let marker;

function initMap() {
    // Initialize the map with a default center (Pune)
    map = new google.maps.Map(document.getElementById('hospitalMap'), {
        center: { lat: 18.5204, lng: 73.8567 },
        zoom: 12
    });

    // Add event listener for hospital selection
    document.getElementById('hospitalName').addEventListener('change', updateMapLocation);
}

// Function to update map location when hospital is selected
async function updateMapLocation() {
    const hospitalName = document.getElementById('hospitalName').value;
    const location = document.getElementById('location').value;
    const city = document.getElementById('city').value;

    if (!hospitalName || !location || !city) return;

    // Create a search query for Google Maps
    const searchQuery = encodeURIComponent(`${hospitalName}, ${location}, ${city}, Maharashtra, India`);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
    
    // Open Google Maps in a new tab
    window.open(mapsUrl, '_blank');
}

// Function to get directions to the hospital
function getDirections(destination) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const origin = `${position.coords.latitude},${position.coords.longitude}`;
                const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
                window.open(url, '_blank');
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to get your location. Please enable location services.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser');
    }
}

// Theme switching functionality
function changeTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeColors(theme);
}

function updateThemeColors(theme) {
    const root = document.documentElement;
    if (theme === 'dark') {
        root.style.setProperty('--bg-color', 'rgba(0, 0, 0, 0.8)');
        root.style.setProperty('--text-color', '#ffffff');
        root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.1)');
        root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.2)');
    } else {
        root.style.setProperty('--bg-color', 'rgba(255, 255, 255, 0.9)');
        root.style.setProperty('--text-color', '#2c3e50');
        root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.8)');
        root.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.1)');
    }
}

// Initialize theme from localStorage or system preference
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        changeTheme(savedTheme);
    } else {
        changeTheme(prefersDark ? 'dark' : 'light');
    }
}

// Add theme initialization to window load
window.addEventListener('load', function() {
    initializeTheme();
    // ... existing initialization code ...
});