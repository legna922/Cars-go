const video = document.getElementById('video');
const canvas = document.getElementById('canvas');

// Activar la cámara en el dispositivo
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => video.srcObject = stream)
    .catch(err => console.error("Acceso denegado a la cámara:", err));

// --- 1. Algoritmo de Búsqueda y Registro de Autos ---
document.getElementById('btn-capture').addEventListener('click', () => {
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoData = canvas.toDataURL('image/png');

    // Búsqueda simulada basada en datos de marcas
    const catalog = [
        { marca: "Nissan", nombre: "370Z", basePrice: 25000, pot: 332 },
        { marca: "Toyota", nombre: "GR Supra", basePrice: 45000, pot: 382 },
        { marca: "Ford", nombre: "Mustang GT", basePrice: 38000, pot: 450 },
        { marca: "Chevrolet", nombre: "Corvette C8", basePrice: 65000, pot: 495 },
        { marca: "BMW", nombre: "M3 Competition", basePrice: 75000, pot: 503 }
    ];

    const found = catalog[Math.floor(Math.random() * catalog.length)];
    const rarityMultiplier = (Math.random() * 0.5 + 0.8).toFixed(2);
    
    const newCar = {
        id: Date.now().toString(),
        marca: found.marca,
        nombre: found.nombre,
        potencia: Math.floor(found.pot * rarityMultiplier),
        precioEstimado: Math.floor(found.basePrice * rarityMultiplier),
        photo: photoData,
        nivelMejora: 1
    };

    if (!userData.garage) userData.garage = [];
    userData.garage.push(newCar);

    db.collection("users").doc(currentUser.uid).update({ garage: userData.garage })
        .then(() => alert(`¡Auto Registrado!\n${newCar.marca} ${newCar.nombre}\nPotencia: ${newCar.potencia} HP`));
});

// --- 2. Selección de Ramas (Árbol de Desarrollo) ---
function selectBranch(branchName) {
    if (!currentUser) return;
    userData.branch = branchName;
    db.collection("users").doc(currentUser.uid).update({ branch: branchName });
    alert(`Especialización elegida: ${branchName}`);
}

// --- 3. Renderizado del Garaje ---
function renderGarage() {
    const container = document.getElementById('garage-list');
    container.innerHTML = '';
    
    (userData.garage || []).forEach(car => {
        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `
            <img src="${car.photo}">
            <h4>${car.marca} ${car.nombre}</h4>
            <p>⚡ ${car.potencia} HP</p>
            <p>💰 $${car.precioEstimado}</p>
            <button onclick="uploadToCarshow('${car.id}')">Publicar Carshow</button>
        `;
        container.appendChild(div);
    });
}

// --- 4. Publicar en Carshow ---
function uploadToCarshow(carId) {
    const car = userData.garage.find(c => c.id === carId);
    if (!car) return;

    db.collection("carshow").doc(carId).set({
        ownerId: currentUser.uid,
        car: car,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => alert("Publicado exitosamente en el Carshow general."));
}

// --- 5. Sistema de Arrancones / Duelos ---
function challengeRace(opponentCar) {
    const myCar = userData.garage[0];
    if (!myCar) return alert("Debes tener al menos un vehículo en tu garaje para participar.");

    // Aplicar bonificador según la rama elegida
    let bonusHP = 0;
    if (userData.branch === "Tuning") bonusHP = 40; // Rama Tuning suma potencia extra

    const totalMyPower = myCar.potencia + bonusHP;
    const totalOpponentPower = opponentCar.potencia;

    if (totalMyPower >= totalOpponentPower) {
        const reward = 10000;
        const newMoney = (userData.money || 0) + reward;
        db.collection("users").doc(currentUser.uid).update({ money: newMoney });
        alert(`¡Victoria en Arrancones!\nTu potencia: ${totalMyPower} HP vs Oponente: ${totalOpponentPower} HP.\nGanaste $${reward}.`);
    } else {
        let newMoney = (userData.money || 0) - 10000;
        if (newMoney < 0) {
            newMoney = 0;
            userData.garage.shift(); // Pierde el auto si no puede saldar la apuesta
            alert(`¡Derrota!\nNo tenías dinero suficiente para pagar la apuesta y perdiste tu auto.`);
        } else {
            alert(`¡Derrota!\nPerdiste la carrera y $10,000.`);
        }
        db.collection("users").doc(currentUser.uid).update({ money: newMoney, garage: userData.garage });
    }
}

// Cargar publicaciones de Carshow global
db.collection("carshow").onSnapshot(snapshot => {
    const container = document.getElementById('carshow-list');
    container.innerHTML = '';
    snapshot.forEach(doc => {
        const data = doc.data();
        if (data.ownerId === currentUser?.uid) return;

        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `
            <img src="${data.car.photo}">
            <h4>${data.car.marca} ${data.car.nombre}</h4>
            <p>⚡ ${data.car.potencia} HP</p>
            <button onclick='challengeRace(${JSON.stringify(data.car)})'>Retar a Arrancones</button>
        `;
        container.appendChild(div);
    });
});
