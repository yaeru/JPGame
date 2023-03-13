// obtener el parámetro de nombre del jugador de la URL
const urlParams = new URLSearchParams(window.location.search);
const playerName = urlParams.get('playerName');

// obtener el elemento span con id "player-name" y establecer su texto
const playerSpan = document.getElementById('player-name');
playerSpan.textContent = playerName;
console.log(`Bienvenido/a, ${playerName}!`);


// CLIMA
const climaActualElement = document.getElementById('clima-actual');

// Definir los posibles estados de clima y sus probabilidades
const estadosClima = [
  {estado: '☀ Soleado', chance: 0.6},
  {estado: '☁ Nublado', chance: 0.2},
  {estado: '🌧 Lluvia', chance: 0.1},
  {estado: '🌩 Tormenta', chance: 0.05},
  {estado: '🌪 Huracán', chance: 0.05},
];

function actualizarClima() {
  let climaActual = '';
  let random = Math.random();

  for (let i = 0; i < estadosClima.length; i++) {
    const estadoClima = estadosClima[i];

    if (random <= estadoClima.chance) {
      climaActual = estadoClima.estado;
      break;
    }

    random -= estadoClima.chance;
  }
  climaActualElement.innerText = climaActual;
}

let meat = 250;
let plants = 250;
let meatToAdd = 10;
let plantsToAdd = 10;
const famine = 10;
const hungerPerTurn = 10;

let dinosaurs = [
{
	name: "trex",
	health: 50,
	diet: "carnivoro",
	hunger: 80,
	mood: null
},
{
	name: "triceratops",
	health: 100,
	diet: "herbivoro",
	hunger: null,
	mood: null
}
];

const dinosaurList = document.getElementById("dinosaur-list");
const meatCounter = document.getElementById("meat-counter");
const plantsCounter = document.getElementById("plants-counter");
meatCounter.innerHTML = meat;
plantsCounter.innerHTML = plants;

// Mood base ni bien comienza el juego
function mood(dinosaur) {	
	if (dinosaur.hunger <= 33) {
		dinosaur.mood = "😀";
	} else if (dinosaur.hunger <= 66) {
		dinosaur.mood = "😕";
	} else {
		dinosaur.mood = "😡";
	}
}
dinosaurs.forEach(dinosaur => {
	mood(dinosaur);
});

dinosaurs.forEach(dinosaur => {
	const dinosaurItem = `
	<div class="card card-body mb-3">
	<h4>${dinosaur.name} <span id="${dinosaur.name}-mood">${dinosaur.mood}</span></h4>
	<ul >
	<li>🧡 <span id="${dinosaur.name}-health">${dinosaur.health}</span>/100</li>
	<li>Hambre: <span id="${dinosaur.name}-hunger">${dinosaur.hunger}</span>/100</li>
	<li>Diet: ${dinosaur.diet}</li>
	</ul>
	
	<button id="${dinosaur.name.toLowerCase()}-feed-button" class="btn btn-success btn-sm">Alimentar</button>
	<button type="button" class="btn btn-primary btn-sm mt-2" data-bs-toggle="modal" data-bs-target="#paddockModal">Ver Paddock</button>
	</div>
	`;
	dinosaurList.insertAdjacentHTML("beforeend", dinosaurItem);

	const feedButton = document.getElementById(`${dinosaur.name.toLowerCase()}-feed-button`);
	const hungerElement = document.getElementById(`${dinosaur.name}-hunger`);
	const moodElement = document.getElementById(`${dinosaur.name}-mood`);

	if (dinosaur.hunger === 0) {
		feedButton.disabled = true;
		console.log(`${dinosaur.name} ya está satisfecho.`);
	} else if ((dinosaur.diet === "carnivoro" && meat === 0) || (dinosaur.diet === "herbivoro" && plants === 0)) {
		feedButton.disabled = true;
		alert("Comida insuficiente.")
	}

	// Alimentar
	feedButton.addEventListener("click", () => {
		if (dinosaur.hunger > 0) {
			if (dinosaur.diet === "carnivoro" && meat > 0) {
				dinosaur.hunger--;
				hungerElement.innerHTML = dinosaur.hunger;
				meat--;
				meatCounter.innerHTML = meat;
			} else if (dinosaur.diet === "herbivoro" && plants > 0) {
				dinosaur.hunger--;
				hungerElement.innerHTML = dinosaur.hunger;
				plants--;
				plantsCounter.innerHTML = plants;
			} else {
				alert(`No hay comida suficiente para alimentar al ${dinosaur.name}`);
			}
			mood(dinosaur);
			moodElement.innerHTML = dinosaur.mood;
		} else {
			alert(`${dinosaur.name} ya está satisfecho.`);
		}
	});
});


// TURNOS
let tiempoRestante = 0;
let intervalo;
let turnoActual = 0;
const turnoActualElemento = document.getElementById('turno-actual');
turnoActualElemento.innerHTML = turnoActual;

function iniciarTurno() {
	// Actualizar clima
  actualizarClima();
  // Habilitar botones de alimentar
	document.querySelectorAll('.btn-success').forEach(btn => btn.disabled = false);

  // Habilitar botón de finalizar turno
	const btnFinalizarTurno = document.getElementById('btn-finalizar-turno');
	btnFinalizarTurno.disabled = true;

  // Establecer tiempo restante a 30 segundos
	tiempoRestante = 1;
	mostrarTiempoRestante();

  // Iniciar intervalo para decrementar tiempo restante
	intervalo = setInterval(() => {
		tiempoRestante--;
		mostrarTiempoRestante();
		if (tiempoRestante === 0) {
			finalizarTurno();
		}
	}, 1000);

	// Añadir meat y plants
	meat += meatToAdd;
	plants += plantsToAdd;
	meatCounter.innerHTML = meat;
	plantsCounter.innerHTML = plants;

	// Actualizar estado de ánimo y salud de los dinosaurios
	dinosaurs.forEach(dinosaur => {
		const moodElement = document.getElementById(`${dinosaur.name}-mood`);
		const healthElement = document.getElementById(`${dinosaur.name}-health`);
		const hungerElement = document.getElementById(`${dinosaur.name}-hunger`);

		// Quitar vida por cada turno furioso
		if (dinosaur.mood === "😡") {
			dinosaur.health -= famine;
			if (dinosaur.health <= 0) {
				dinosaur.health = 0;
			}
			healthElement.innerHTML = dinosaur.health;
		}
		moodElement.innerHTML = dinosaur.mood;

		// Aumentar hambre en 10 al final de cada turno
		dinosaur.hunger += hungerPerTurn;
		if (dinosaur.hunger > 100) {
			dinosaur.hunger = 100;
		}		
		hungerElement.innerHTML = dinosaur.hunger;

		// Verificar si el dinosaurio ha muerto
		if (dinosaur.health <= 0) {
			dinosaur.mood = "☠";
			moodElement.innerHTML = dinosaur.mood;
			console.log(`${dinosaur.name} ha muerto.`);

			document.getElementById(`${dinosaur.name.toLowerCase()}-feed-button`).disabled = true;
			document.getElementById(`${dinosaur.name.toLowerCase()}-feed-button`).innerHTML = dinosaur.name + " Murió";
		}

		mood(dinosaur);
		
	});
}

function finalizarTurno() {
	// Detener intervalo
	clearInterval(intervalo);

  // Incrementar turno actual
	turnoActual++;
	mostrarTurnoActual();

  // Deshabilitar botones de alimentar
	document.querySelectorAll('.btn-success').forEach(btn => btn.disabled = true);

  // Deshabilitar botón de finalizar turno
	const btnFinalizarTurno = document.getElementById('btn-finalizar-turno');
	btnFinalizarTurno.disabled = false;
}

function mostrarTiempoRestante() {
	const tiempoRestanteElemento = document.getElementById('tiempo-restante');
	tiempoRestanteElemento.innerHTML = tiempoRestante;
}

function mostrarTurnoActual() {
	const turnoActualElemento = document.getElementById('turno-actual');
	turnoActualElemento.innerHTML = turnoActual;
}

// Inicializar primer turno
iniciarTurno();

// Agregar evento al botón de finalizar turno
const btnFinalizarTurno = document.getElementById('btn-finalizar-turno');
btnFinalizarTurno.addEventListener('click', iniciarTurno);


// Filtrar dinosaurios vivos y muertos
const vivos = dinosaurs.filter(dino => dino.health > 0);
const muertos = dinosaurs.filter(dino => dino.health <= 0);

// Obtener el número de dinosaurios vivos y muertos
const numVivos = vivos.length;
const numMuertos = muertos.length;

// Imprimir la lista de dinos vivos y muertos
document.getElementById("animal-count").innerHTML = `${numVivos} animales vivos y ${numMuertos} animales muertos`;


