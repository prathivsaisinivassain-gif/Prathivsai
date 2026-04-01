// Load GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Magnetic Cursor
document.addEventListener('mousemove', (e) => {
    gsap.to('#cursor', {
        x: e.clientX - 10,
        y: e.clientY - 10,
        duration: 0.1
    });
});

// Progress Indicator
gsap.to('#progress-path', {
    strokeDashoffset: 0,
    duration: 2,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
    }
});

// Odometer Counter
function animateOdometer(target, duration = 2) {
    const odometer = document.getElementById('odometer');
    let current = 0;
    gsap.to({value: current}, {
        value: target,
        duration: duration,
        ease: 'power2.out',
        onUpdate: function() {
            odometer.textContent = Math.floor(this.targets()[0].value).toString().padStart(4, '0');
        }
    });
}

// Load CSV Data
let carData = [];
fetch('data_500_rows.csv')
    .then(response => response.text())
    .then(csvText => {
        const rows = csvText.split('\n');
        const headers = rows[0].split(',');
        carData = rows.slice(1).map(row => {
            const values = row.split(',');
            return headers.reduce((obj, header, index) => {
                obj[header.trim()] = values[index]?.trim() || '';
                return obj;
            }, {});
        });
        initDashboard();
    })
    .catch(error => console.error('Error loading CSV:', error));

function initDashboard() {
    // Set odometer to total cars
    animateOdometer(carData.length);

    // Initialize Charts
    initCharts();

    // Populate Table
    populateTable();

    // Create Cards
    createCards();

    // GSAP Animations
    initAnimations();
}

function initCharts() {
    // Bar Chart: Average Horsepower by Brand
    const brandHp = {};
    carData.forEach(car => {
        if (!brandHp[car.Make]) brandHp[car.Make] = [];
        brandHp[car.Make].push(parseFloat(car['Engine HP']) || 0);
    });
    const brands = Object.keys(brandHp).slice(0, 10);
    const avgHp = brands.map(brand => {
        const hp = brandHp[brand];
        return hp.reduce((a, b) => a + b, 0) / hp.length;
    });

    new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: {
            labels: brands,
            datasets: [{
                label: 'Average Horsepower',
                data: avgHp,
                backgroundColor: '#333',
                borderColor: '#333',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: '#333' } }
            },
            scales: {
                y: { ticks: { color: '#333' } },
                x: { ticks: { color: '#333' } }
            }
        }
    });

    // Radar Chart: Sample car stats
    const sampleCar = carData[0];
    new Chart(document.getElementById('radarChart'), {
        type: 'radar',
        data: {
            labels: ['Horsepower', 'MPG Highway', 'MPG City', 'Popularity', 'Price'],
            datasets: [{
                label: sampleCar.Model,
                data: [
                    parseFloat(sampleCar['Engine HP']) || 0,
                    parseFloat(sampleCar['highway MPG']) || 0,
                    parseFloat(sampleCar['city mpg']) || 0,
                    parseFloat(sampleCar.Popularity) || 0,
                    parseFloat(sampleCar.MSRP) / 1000 || 0
                ],
                backgroundColor: 'rgba(51, 51, 51, 0.2)',
                borderColor: '#333',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: '#333' } }
            },
            scales: {
                r: { ticks: { color: '#333' } }
            }
        }
    });

    // Scatter Chart: Horsepower vs Price
    const scatterData = carData.slice(0, 100).map(car => ({
        x: parseFloat(car['Engine HP']) || 0,
        y: parseFloat(car.MSRP) || 0
    }));

    new Chart(document.getElementById('scatterChart'), {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Horsepower vs Price',
                data: scatterData,
                backgroundColor: 'rgba(51, 51, 51, 0.6)',
                borderColor: '#333'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: '#333' } }
            },
            scales: {
                x: { title: { display: true, text: 'Horsepower', color: '#333' }, ticks: { color: '#333' } },
                y: { title: { display: true, text: 'Price ($)', color: '#333' }, ticks: { color: '#333' } }
            }
        }
    });

    // Doughnut Chart: Fuel Types
    const fuelTypes = {};
    carData.forEach(car => {
        const fuel = car['Engine Fuel Type'];
        fuelTypes[fuel] = (fuelTypes[fuel] || 0) + 1;
    });

    new Chart(document.getElementById('doughnutChart'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(fuelTypes),
            datasets: [{
                data: Object.values(fuelTypes),
                backgroundColor: ['#333', '#666', '#999', '#ccc', '#eee']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: '#333' } }
            }
        }
    });
}

function populateTable() {
    const tbody = document.getElementById('tableBody');
    carData.forEach((car, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${car.Make}</td>
            <td>${car.Model}</td>
            <td>${car.Year}</td>
            <td>${car['Engine HP']}</td>
            <td>$${car.MSRP}</td>
            <td>${car['Engine Fuel Type']}</td>
            <td>${car['highway MPG']}</td>
        `;
        tbody.appendChild(row);
    });

    // Filter functionality
    document.getElementById('filter').addEventListener('input', (e) => {
        const filter = e.target.value.toLowerCase();
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(filter) ? '' : 'none';
        });
    });
}

function createCards() {
    const container = document.getElementById('cardContainer');
    carData.slice(0, 6).forEach(car => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <h3>${car.Make} ${car.Model}</h3>
                    <p>Year: ${car.Year}</p>
                </div>
                <div class="card-back">
                    <h3>Stats</h3>
                    <p>HP: ${car['Engine HP']}</p>
                    <p>Price: $${car.MSRP}</p>
                    <p>MPG: ${car['highway MPG']}</p>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function initAnimations() {
    // Hero animations
    gsap.from('#hero h1', { opacity: 0, y: 50, duration: 1, delay: 0.5 });
    gsap.from('#odometer', { opacity: 0, scale: 0.5, duration: 1, delay: 1 });

    // Section reveals
    gsap.utils.toArray('section:not(#hero)').forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 100,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Staggered animations for table rows
    gsap.from('#dataTable tr', {
        opacity: 0,
        x: -50,
        duration: 0.5,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '#table',
            start: 'top 80%'
        }
    });

    // Card animations
    gsap.from('.card', {
        opacity: 0,
        rotationY: -90,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
            trigger: '#cards',
            start: 'top 80%'
        }
    });

    // Parallax effect
    gsap.to('.layer1', {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
            trigger: '#parallax',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });

    gsap.to('.layer2', {
        yPercent: -100,
        ease: 'none',
        scrollTrigger: {
            trigger: '#parallax',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });

    gsap.to('.layer3', {
        yPercent: -150,
        ease: 'none',
        scrollTrigger: {
            trigger: '#parallax',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
}