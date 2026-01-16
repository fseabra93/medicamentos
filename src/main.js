import { ImageGenerator } from './imageGenerator.js';
import '../style.css';

// State Management
// State Management
const state = {
    step: 'welcome',
    medicationList: [], // { name, dosage, id }
    userName: '',
    userInputName: '',
    userInputDosage: '',
    isUpdateMode: false
};

// DOM Elements
const views = {
    welcome: document.getElementById('step-welcome'),
    userName: document.getElementById('step-user-name'),
    input: document.getElementById('step-input'),
    clarification: document.getElementById('step-clarification'),
    dosage: document.getElementById('step-dosage'),
    iteration: document.getElementById('step-iteration'),
    result: document.getElementById('step-result'),
    update: document.getElementById('step-update'),
    remove: document.getElementById('step-remove')
};

// UI Helpers
const showStep = (stepName) => {
    Object.values(views).forEach(el => el.classList.add('hidden'));
    views[stepName].classList.remove('hidden');
    state.step = stepName;
};

// Step 1: Welcome
document.getElementById('btn-start').addEventListener('click', () => {
    showStep('userName');
});

// Step 1.5: User Name
const userNameInput = document.getElementById('user-name-input');
const userNameError = document.getElementById('user-name-error');

document.getElementById('btn-confirm-user-name').addEventListener('click', () => {
    const name = userNameInput.value.trim();
    if (!name) {
        userNameError.classList.remove('hidden');
        return;
    }
    userNameError.classList.add('hidden');
    state.userName = name;
    showStep('input');
});

// Step 2: Input Name
const inputName = document.getElementById('medication-name');
const btnNextInput = document.getElementById('btn-next-input');
const inputError = document.getElementById('input-error');

btnNextInput.addEventListener('click', () => {
    const name = inputName.value.trim();
    if (!name) {
        inputError.classList.remove('hidden');
        return;
    }
    inputError.classList.add('hidden');
    state.userInputName = name;

    // Update Confirmation Screen
    document.getElementById('confirm-name-display').textContent = name;
    showStep('clarification');
});

// Step 3: Confirmation
document.getElementById('btn-confirm-name').addEventListener('click', () => {
    // Clear dosage input for fresh entry
    document.getElementById('dosage-input').value = '';
    showStep('dosage');
});

document.getElementById('btn-retry-name').addEventListener('click', () => {
    showStep('input');
    inputName.focus();
});

// Step 4: Dosage
const inputDosage = document.getElementById('dosage-input');
const btnConfirmDosage = document.getElementById('btn-confirm-dosage');
const dosageError = document.getElementById('dosage-error');

btnConfirmDosage.addEventListener('click', () => {
    const dosage = inputDosage.value.trim();
    if (!dosage) {
        dosageError.classList.remove('hidden');
        return;
    }
    dosageError.classList.add('hidden');
    state.userInputDosage = dosage;

    finishMedicationAddition();
});


const finishMedicationAddition = () => {
    // Add to main list
    state.medicationList.push({
        id: Date.now(),
        name: state.userInputName,
        dosage: state.userInputDosage
    });

    // Clear inputs
    inputName.value = '';
    inputDosage.value = '';

    showStep('iteration');
};

// Step 5: Iteration
document.getElementById('btn-add-more').addEventListener('click', () => {
    showStep('input');
});

document.getElementById('btn-finish').addEventListener('click', () => {
    renderResult();
    showStep('result');
});

// Step 6: Result & Generation
const canvasEl = document.getElementById('result-canvas');

const renderResult = () => {
    ImageGenerator.generate(state.medicationList, canvasEl, state.userName);
};

document.getElementById('btn-download').addEventListener('click', () => {
    ImageGenerator.download(canvasEl);
});

document.getElementById('btn-share').addEventListener('click', () => {
    if (navigator.share) {
        canvasEl.toBlob(blob => {
            const file = new File([blob], 'meus-medicamentos.png', { type: 'image/png' });
            navigator.share({
                title: 'Meus Medicamentos',
                text: 'Aqui está minha lista de medicamentos.',
                files: [file]
            }).catch(console.error);
        });
    } else {
        alert('Compartilhamento não suportado. Use o botão Baixar.');
    }
});

// Step 7: Updates
document.getElementById('btn-update-list').addEventListener('click', () => {
    if (confirm("Deseja atualizar a lista de medicamentos?")) {
        showStep('update');
    }
});

document.getElementById('btn-mode-cancel').addEventListener('click', () => {
    showStep('result');
});

document.getElementById('btn-mode-add').addEventListener('click', () => {
    showStep('input');
});

document.getElementById('btn-mode-remove').addEventListener('click', () => {
    setupRemoveList();
    showStep('remove');
});

// Step 8: Remove Logic
const removeListEl = document.getElementById('remove-list');

const setupRemoveList = () => {
    removeListEl.innerHTML = '';

    if (state.medicationList.length === 0) {
        removeListEl.innerHTML = '<p style="text-align:center; color:#666;">Lista vazia.</p>';
        return;
    }

    state.medicationList.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'remove-item';
        div.innerHTML = `
            <span>${item.name} (${item.dosage})</span>
            <span class="remove-icon">✕</span>
        `;
        div.onclick = () => {
            state.medicationList.splice(index, 1);
            setupRemoveList();
        };
        removeListEl.appendChild(div);
    });
};

document.getElementById('btn-back-result').addEventListener('click', () => {
    renderResult();
    showStep('result');
});
