// Sample Data for Farm-stays (Simulating a Firebase Database)
const farmStays = [
    {
        id: 1,
        title: "Gowda's Organic Farm",
        location: "Mandya, Karnataka",
        image: "./assets/hero_farm.png",
        activities: ["farming", "dairy"],
        rating: 4.9,
        reviews: 24,
        price: "₹1,500/night",
        verified: true
    },
    {
        id: 2,
        title: "Malnad Heritage Stay",
        location: "Shimoga, Karnataka",
        image: "./assets/farm_room.png",
        activities: ["cooking", "nature"],
        rating: 4.8,
        reviews: 18,
        price: "₹2,000/night",
        verified: true
    },
    {
        id: 3,
        title: "Sunrise Dairy Farm",
        location: "Hassan, Karnataka",
        image: "./assets/cow_milking.png",
        activities: ["dairy", "farming"],
        rating: 4.7,
        reviews: 32,
        price: "₹1,200/night",
        verified: true
    }
];

const activityLabels = {
    farming: "Field Plowing",
    dairy: "Cow Milking",
    cooking: "Local Cooking",
    nature: "Birdwatching"
};

// --- Navbar Scroll Effect ---
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// --- Render Farm Catalog ---
const catalogContainer = document.getElementById('farm-catalog');

function renderFarms(filter = 'all') {
    catalogContainer.innerHTML = '';
    
    const filteredFarms = filter === 'all' 
        ? farmStays 
        : farmStays.filter(farm => farm.activities.includes(filter));

    filteredFarms.forEach(farm => {
        const card = document.createElement('div');
        card.className = 'farm-card';
        
        // Generate Activity Tags
        const tagsHtml = farm.activities.map(act => 
            `<span class="activity-tag">${activityLabels[act]}</span>`
        ).join('');

        card.innerHTML = `
            <img src="${farm.image}" alt="${farm.title}" class="farm-card-img" onerror="this.src='./assets/hero_farm.png'">
            ${farm.verified ? `<div class="farm-badge"><i class="fa-solid fa-check-circle"></i> Verified</div>` : ''}
            <div class="farm-card-content">
                <div class="farm-location"><i class="fa-solid fa-location-dot"></i> ${farm.location}</div>
                <h3>${farm.title}</h3>
                <div style="color: #ffc107; margin-bottom: 0.5rem; font-size: 0.9rem;">
                    <i class="fa-solid fa-star"></i> ${farm.rating} (${farm.reviews} reviews)
                </div>
                <div class="farm-activities">
                    ${tagsHtml}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; border-top: 1px solid #eee; padding-top: 1rem;">
                    <span style="font-weight: 600;">${farm.price}</span>
                    <button class="btn btn-primary" onclick="openBookingModal('${farm.title}')" style="padding: 0.5rem 1rem; font-size: 0.9rem;">Book Stay</button>
                </div>
            </div>
        `;
        catalogContainer.appendChild(card);
    });
}

// Initial Render
renderFarms();

// --- Filters Logic ---
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked
        btn.classList.add('active');
        // Render filtered
        renderFarms(btn.dataset.filter);
    });
});

// --- Host Academy Stepper Logic ---
let currentStep = 1;
const totalSteps = 4;

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const steps = document.querySelectorAll('.step');
const panes = document.querySelectorAll('.step-pane');
const checkboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');

function updateStepper() {
    // Update Sidebar Steps
    steps.forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        step.classList.remove('active', 'completed');
        if (stepNum === currentStep) {
            step.classList.add('active');
        } else if (stepNum < currentStep) {
            step.classList.add('completed');
            step.querySelector('.step-icon').innerHTML = '<i class="fa-solid fa-check"></i>';
        } else {
            // Restore original number for future steps
            if(stepNum !== 4) {
                step.querySelector('.step-icon').innerText = stepNum;
            }
        }
    });

    // Update Panes
    panes.forEach((pane, index) => {
        pane.classList.remove('active');
        if (index + 1 === currentStep) {
            pane.classList.add('active');
        }
    });

    // Button visibility and text
    if (currentStep === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'inline-block';
    }

    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        prevBtn.style.display = 'none'; // Hide back on final score screen
        calculateScore();
    } else if (currentStep === totalSteps - 1) {
        nextBtn.innerText = 'Calculate Score';
        nextBtn.classList.remove('btn-outline');
        nextBtn.style.backgroundColor = 'var(--success-color)';
        nextBtn.style.color = 'white';
    } else {
        nextBtn.innerText = 'Next Step';
        nextBtn.style.backgroundColor = ''; // Reset to default CSS
    }
}

nextBtn.addEventListener('click', () => {
    if (currentStep < totalSteps) {
        currentStep++;
        updateStepper();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        updateStepper();
    }
});

function calculateScore() {
    let totalScore = 0;
    checkboxes.forEach(cb => {
        if (cb.checked) {
            totalScore += parseInt(cb.value);
        }
    });

    // Max score is 100 based on value sums (20+15+10 + 15+10+10 + 10+10 = 100)
    
    const circle = document.getElementById('score-circle');
    const scoreText = document.getElementById('score-text');
    const scoreMessage = document.getElementById('score-message');

    // Animate circle
    setTimeout(() => {
        circle.setAttribute('stroke-dasharray', `${totalScore}, 100`);
        
        // Color based on score
        if (totalScore >= 80) {
            circle.setAttribute('stroke', 'var(--success-color)');
            scoreMessage.innerHTML = '🌟 <strong>Excellent!</strong> You are fully ready to host city guests. You earn the "Verified Host" badge.';
            scoreMessage.style.color = 'var(--success-color)';
        } else if (totalScore >= 50) {
            circle.setAttribute('stroke', '#ffc107'); // Warning yellow
            scoreMessage.innerHTML = '👍 <strong>Good start.</strong> Make a few more improvements to ensure guest comfort and earn your badge.';
            scoreMessage.style.color = '#ff9800';
        } else {
            circle.setAttribute('stroke', 'var(--error-color)');
            scoreMessage.innerHTML = '🌱 <strong>Keep going.</strong> Review the checklist to meet basic hygiene and comfort standards before hosting.';
            scoreMessage.style.color = 'var(--error-color)';
        }
    }, 100);

    // Animate text number
    let currentCount = 0;
    const duration = 1000;
    const interval = 20;
    const steps = duration / interval;
    const increment = totalScore / steps;

    const counter = setInterval(() => {
        currentCount += increment;
        if (currentCount >= totalScore) {
            currentCount = totalScore;
            clearInterval(counter);
        }
        scoreText.textContent = `${Math.round(currentCount)}%`;
    }, interval);
}

// --- Booking Modal Logic ---
const modal = document.getElementById('booking-modal');
const closeBtn = document.querySelector('.close-btn');
const bookingForm = document.getElementById('booking-form');
const bookingSuccess = document.getElementById('booking-success');
const modalTitle = document.getElementById('modal-title');

window.openBookingModal = function(farmTitle) {
    modalTitle.innerText = `Book: ${farmTitle}`;
    bookingForm.style.display = 'block';
    bookingSuccess.style.display = 'none';
    modal.style.display = 'flex';
}

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Simulate booking process
    const btn = bookingForm.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = 'Processing...';
    btn.disabled = true;

    setTimeout(() => {
        bookingForm.style.display = 'none';
        bookingSuccess.style.display = 'block';
        btn.innerText = originalText;
        btn.disabled = false;
        bookingForm.reset();
    }, 1500);
});

// Set minimum date for checkin to today
const today = new Date().toISOString().split('T')[0];
document.getElementById('checkin').setAttribute('min', today);
document.getElementById('checkin').addEventListener('change', (e) => {
    document.getElementById('checkout').setAttribute('min', e.target.value);
});
