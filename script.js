function runSimulation() {
    let metal = document.getElementById("metal").value;
    let property1 = document.getElementById("property1").value;
    let property2 = document.getElementById("property2").value;

    fetch('/simulate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            metal: metal,
            property1: property1,
            property2: property2
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("damageFactor").innerText = "Damage Factor: " + data.damage_factor;
        document.getElementById("recommendation").innerText = "Recommendation: " + data.recommendation;

        // Load graph after simulation
        document.getElementById("graph").src = "/generate_graph";
        document.getElementById("graph").style.display = "block";
    })
    .catch(error => console.error("Error:", error));
}
