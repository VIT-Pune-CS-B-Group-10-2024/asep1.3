// Dummy Data for Simulation
const dummyData = {
    aluminium: {
        gamma: { formula: (x) => 0.1 * x + 10, color: 0x00ff00 }, // Linear
        alpha: { formula: (x) => 0.01 * x * x - 2 * x + 100, color: 0xffa500 }, // Parabola
        beta: { formula: (x) => 1000 / x, color: 0xff0000 } // Hyperbola
    },
    tin: {
        gamma: { formula: (x) => 50 * Math.sin(x / 50) + 50, color: 0x00ff00 }, // Sine wave (mountain shape)
        alpha: { formula: (x) => 0.2 * x + 20, color: 0xffa500 }, // Linear
        beta: { formula: (x) => 0.005 * x * x + 10, color: 0xff0000 } // Parabola
    },
    graphite: {
        gamma: { formula: (x) => 2000 / x, color: 0x00ff00 }, // Hyperbola
        alpha: { formula: (x) => 0.03 * x * x - 3 * x + 150, color: 0xffa500 }, // Parabola
        beta: { formula: (x) => 40 * Math.sin(x / 40) + 60, color: 0xff0000 } // Sine wave (mountain shape)
    },
    iron: {
        gamma: { formula: (x) => 0.15 * x + 30, color: 0x00ff00 }, // Linear
        alpha: { formula: (x) => 0.02 * x * x + 20, color: 0xffa500 }, // Parabola
        beta: { formula: (x) => 3000 / x, color: 0xff0000 } // Hyperbola
    },
    copper: {
        gamma: { formula: (x) => 60 * Math.sin(x / 60) + 70, color: 0x00ff00 }, // Sine wave (mountain shape)
        alpha: { formula: (x) => 0.25 * x + 10, color: 0xffa500 }, // Linear
        beta: { formula: (x) => 0.01 * x * x - 1.5 * x + 80, color: 0xff0000 } // Parabola
    },
    steel: {
        gamma: { formula: (x) => 0.1 * x + 40, color: 0x00ff00 }, // Linear
        alpha: { formula: (x) => 0.04 * x * x - 4 * x + 200, color: 0xffa500 }, // Parabola
        beta: { formula: (x) => 4000 / x, color: 0xff0000 } // Hyperbola
    }
};

// Calculate Effect
function calculateEffect(metal, radiation, temperature, intensity) {
    const data = dummyData[metal][radiation];
    const effect = data.formula(temperature) + (intensity * 0.1); // Adjust effect based on intensity
    return effect;
}

// Determine Suitability
function determineSuitability(effect) {
    if (effect < 50) {
        return "suitable";
    } else if (effect >= 50 && effect < 80) {
        return "moderately suitable";
    } else {
        return "not suitable";
    }
}

// Generate 2D Graph
document.getElementById('graphBtn').addEventListener('click', function() {
    const metal = document.getElementById('metalSelect').value;
    const radiation = document.getElementById('radiationSelect').value;
    const temperature = parseFloat(document.getElementById('temperature').value);
    const intensity = parseFloat(document.getElementById('intensity').value);

    // Generate data for the graph
    const xValues = [100, 200, 300, 400, 500]; // Temperature (K)
    const yValues = xValues.map(temp => {
        const effect = calculateEffect(metal, radiation, temp, intensity);
        return effect; // No scaling needed
    });

    const data = [{
        x: xValues,
        y: yValues,
        mode: 'lines+markers',
        type: 'scatter',
        name: `${metal.charAt(0).toUpperCase() + metal.slice(1)} (${radiation})`,
        line: { color: '#0f0' }
    }];

    const layout = {
        title: `Radiation Effects on ${metal.charAt(0).toUpperCase() + metal.slice(1)} (${radiation})`,
        xaxis: { title: 'Temperature (K)' },
        yaxis: { title: 'Effect' }
    };

    Plotly.newPlot('graph', data, layout);
});

// Simulate 3D with Radiation Ray
document.getElementById('simulateBtn').addEventListener('click', function() {
    const metal = document.getElementById('metalSelect').value;
    const radiation = document.getElementById('radiationSelect').value;
    const temperature = parseFloat(document.getElementById('temperature').value);
    const intensity = parseFloat(document.getElementById('intensity').value);

    const effect = calculateEffect(metal, radiation, temperature, intensity);
    const cubeColor = dummyData[metal][radiation].color;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth * 0.8, 400);
    document.getElementById('simulation3d').appendChild(renderer.domElement);

    // Add a cube
    const cubeGeometry = new THREE.BoxGeometry();
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: cubeColor });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);

    // Add a radiation ray (cylinder)
    const rayGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 32);
    const rayMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const ray = new THREE.Mesh(rayGeometry, rayMaterial);
    ray.position.set(0, 0, -2); // Position the ray
    scene.add(ray);

    // Position the camera
    camera.position.z = 5;

    let isRadiationActive = false; // Track if radiation is active

    // Animation loop
    const animate = function () {
        requestAnimationFrame(animate);

        // Rotate the cube
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        // Move the radiation ray towards the cube
        if (isRadiationActive) {
            ray.position.z += 0.1; // Speed of the ray
            if (ray.position.z > 2) {
                ray.position.z = -2; // Reset ray position
            }

            // Expand the cube based on the effect
            const scaleFactor = 1 + (effect * 0.01); // Scale based on effect
            cube.scale.set(scaleFactor, scaleFactor, scaleFactor);
        } else {
            // Reset cube scale if radiation is not active
            cube.scale.set(1, 1, 1);
        }

        renderer.render(scene, camera);
    };

    animate();

    // Activate radiation after 3 seconds
    setTimeout(() => {
        isRadiationActive = true;
    }, 3000);
});

// Start Simulation
document.getElementById('startSimulation').addEventListener('click', function() {
    const metal = document.getElementById('metalSelect').value;
    const radiation = document.getElementById('radiationSelect').value;
    const temperature = parseFloat(document.getElementById('temperature').value);
    const intensity = parseFloat(document.getElementById('intensity').value);

    const effect = calculateEffect(metal, radiation, temperature, intensity);
    const suitability = determineSuitability(effect);

    const resultText = `${metal.charAt(0).toUpperCase() + metal.slice(1)} on ${radiation} radiation at ${temperature}K and ${intensity}W/m² has an effect of ${effect.toFixed(2)}. It is ${suitability} for building spacecraft.`;
    document.getElementById('resultText').innerText = resultText;
});

// Login Functionality
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send login request to the backend
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redirect to the main page
            window.location.href = '/index.html';
        } else {
            // Show error message
            document.getElementById('errorMessage').innerText = 'Invalid username or password';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Logout Functionality
document.getElementById('logoutBtn').addEventListener('click', function() {
    // Send logout request to the backend
    fetch('/logout', {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redirect to the login page
            window.location.href = '/login.html';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});