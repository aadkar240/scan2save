// List to hold hospital data
let hospitals = JSON.parse(localStorage.getItem('hospitals')) || [];

// Display the list of nearby hospitals
function displayNearbyHospitals(locationFilter = 'all') {
  const hospitalListBottom = document.getElementById('hospitalListBottom');
  if (hospitalListBottom) {
    hospitalListBottom.innerHTML = '';

    hospitals
      .filter(hospital => locationFilter === 'all' || hospital.location === locationFilter)
      .forEach((hospital, index) => {
        const hospitalEntry = document.createElement('div');
        hospitalEntry.innerHTML = `
          <div>
            <strong>${hospital.name}</strong><br>
            Location: ${hospital.location}<br>
            Blood Available: ${hospital.bloodAvailable}<br>
            Medicines: ${hospital.medicines}<br>
            Ventilators: ${hospital.ventilators}<br>
            <button onclick="editHospital(${index})">Edit</button>
            <button onclick="removeHospital(${index})">Remove</button>
          </div>`;
        hospitalListBottom.appendChild(hospitalEntry);
      });
  }
}

// Add hospital data
document.getElementById('hospitalForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('hospitalName').value;
  const location = document.getElementById('hospitalLocation').value;
  const bloodAvailable = Array.from(document.querySelectorAll('.blood-btn.selected')).map(btn =>
    btn.getAttribute('data-blood')
  ).join(', ');
  const medicines = Array.from(document.querySelectorAll('.medicine-btn.selected')).map(btn =>
    btn.getAttribute('data-medicine')
  ).join(', ');
  const ventilators = document.getElementById('ventilators').value;

  if (!name || !location || !ventilators) {
    alert('Please fill in all required fields!');
    return;
  }

  const hospital = { name, location, bloodAvailable, medicines, ventilators };
  hospitals.push(hospital);
  localStorage.setItem('hospitals', JSON.stringify(hospitals));
  alert('Hospital added successfully!');
  displayNearbyHospitals();
  document.getElementById('hospitalForm').reset();
});

// Edit hospital data
function editHospital(index) {
  const hospital = hospitals[index];
  document.getElementById('hospitalName').value = hospital.name;
  document.getElementById('hospitalLocation').value = hospital.location;
  document.querySelectorAll('.blood-btn').forEach(btn => {
    if (hospital.bloodAvailable.includes(btn.getAttribute('data-blood'))) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
  document.querySelectorAll('.medicine-btn').forEach(btn => {
    if (hospital.medicines.includes(btn.getAttribute('data-medicine'))) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
  document.getElementById('ventilators').value = hospital.ventilators;

  // Remove the hospital temporarily from the list
  hospitals.splice(index, 1);
  localStorage.setItem('hospitals', JSON.stringify(hospitals));
  displayNearbyHospitals();
}

// Remove hospital data
function removeHospital(index) {
  if (confirm('Are you sure you want to remove this hospital?')) {
    hospitals.splice(index, 1);
    localStorage.setItem('hospitals', JSON.stringify(hospitals));
    displayNearbyHospitals();
  }
}

// Generate QR Code
function generateQR() {
  const name = document.getElementById('name').value;
  const blood = document.getElementById('blood').value;
  const medicines = Array.from(document.querySelectorAll('.medicine-btn.selected')).map(btn =>
    btn.getAttribute('data-medicine')
  );
  const contact = document.getElementById('contact').value;

  if (!name || !blood || !contact) {
    alert('Please fill in all required fields!');
    return;
  }

  const qrData = JSON.stringify({ name, blood, medicines, contact });
  const qrcode = new QRCode(document.getElementById('qrcode'), {
    text: qrData,
    width: 128,
    height: 128,
  });

  alert('QR Code generated successfully!');
}

// Start QR scanning
async function startScan() {
  const video = document.getElementById('video');
  const canvasElement = document.getElementById('canvas');
  const canvas = canvasElement.getContext('2d');
  const scanResult = document.getElementById('scanResult');

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
          video.style.display = 'none';
          scanResult.innerText = `QR Code Data: ${code.data}`;
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

// Filter hospitals by location
function filterHospitals() {
  const location = document.getElementById('locationSelector').value;
  displayNearbyHospitals(location);
}

// Display initial hospitals
window.onload = function () {
  displayNearbyHospitals();
};