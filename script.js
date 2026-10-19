// 1. Grab elements we need
const steps = document.querySelectorAll(".form-step");
const indicator = document.querySelectorAll(".step-indicator");
const nextBtn = document.getElementById("next-button");
const backBtn = document.getElementById("back-button");

// 2. State : which step is open
let currentStep = 0;

// 3. One function that updates the whole screen
function showStep(index) {
    steps.forEach((step, i) => {
        step.classList.toggle("active", i === index);
    });

    indicator.forEach((item, i) => {
        item.classList.toggle("active", i === Math.min(index, 3));
    });

    backBtn.style.visibility = index === 0 || index === 4 ? "hidden" : "visible";
    nextBtn.textContent = index === 3 ? "Confirm" : "Next Step";
    nextBtn.style.display = index === 4 ? "none" : "";
    document.querySelector(".navigation").style.display = index === 4 ? "none" : "";
}

// 4.Valudation Placeholder 
function validateStep(index) {
  if (index === 0) return validateStep1();
  if (index === 1) return validateStep2();
  return true;
}

// 5. Button Clicks
nextBtn.addEventListener("click", () => {
    if (!validateStep(currentStep)) {
        return;
    }
    currentStep++;
    if (currentStep === 3) renderSummary();  
    showStep(currentStep);
});

backBtn.addEventListener("click", () => {
    currentStep--;
    showStep(currentStep);
});
// 6. Show the first step on load
showStep(currentStep);

// Element for Validation
const nameInput = document.getElementById("userName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const planError = document.querySelector(".plan-error");
const planCards = document.querySelectorAll(".plan_card");

let selectedPlan = null;

// Show or clear an error under an input
function setError(input, message){
    const errorE1 = input.parentElement.querySelector(".error");
    errorE1.textContent = message;
    input.classList.toggle("invalid", message !== "");
}

// Step 1 Validation
function validateStep1(){
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valid = true;

    if(nameInput.value.trim() === ""){
        setError(nameInput, "Enter your name");
        valid = false;
    } else {
        setError(nameInput, "");
    }

    if(emailInput.value.trim() === ""){
        setError(emailInput, "Enter Email");
        valid = false;
    } else if(!emailPattern.test(emailInput.value.trim())) {
        setError(emailInput, "Enter a valid email");
        valid = false;
    } else {
        setError(emailInput, "");
    }

    if(phoneInput.value.trim() === ""){
        setError(phoneInput, "Enter your mobile Number");
        valid = false;
    } else {
        setError(phoneInput, "");
    }
    return valid;
}

// Step 2: Choose Plan
planCards.forEach((card) => {
    card.addEventListener("click", () => {
        planCards.forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");
        selectedPlan = card;
        planError.textContent = "";
    });
});

function validateStep2() {
    if(!selectedPlan){
        planError.textContent = "Please select a plan";
        return false;
    }
    return true;
}

// Part 5: Billing toggle and add-onns
const billingToggle = document.getElementById("billing-toggle");
const addonCards = document.querySelectorAll(".addon_card");

let isYearly = false;

function updatePrices() {
    const unit = isYearly ? "yr" : "mo";

    planCards.forEach((card) => {
        const price = isYearly ? card.dataset.yearly : card.dataset.monthly;
        card.querySelector(".price").textContent = `$${price}/${unit}`;
        card.querySelector(".yearly-benefit").style.display = isYearly ? "block" : "none";
    });

    addonCards.forEach((card) => {
        const price = isYearly ? card.dataset.yearly : card.dataset.monthly;
        card.querySelector("span").textContent = `+$${price}/${unit}`;
    });
}


    billingToggle.addEventListener("change", () => {
        isYearly = billingToggle.checked;
        updatePrices();
    });


    addonCards.forEach((card) => {
        const checkbox = card.querySelector("input");

        card.addEventListener("click", (e) => {
            if(e.target !== checkbox){
                checkbox.checked = !checkbox.checked;
            }
            card.classList.toggle("selected", checkbox.checked);
        });
    });
updatePrices();

// Part 6: Summary
const summaryPlan = document.getElementById("summary-plan");
const summaryPlanPrice = document.getElementById("summary-plan-price");
const summaryTotal = document.getElementById("summary-total");
const selectedAddonsBox = document.querySelector(".selected-addons");
const changePlanBtn = document.querySelector(".change-plan");

function renderSummary () {
    const unit = isYearly ? "yr" : "mo";
    const key = isYearly ? "yearly" : "monthly";
    
    const planPrice = Number(selectedPlan.dataset[key]);
    let total = planPrice;

    summaryPlan.textContent = `${selectedPlan.dataset.name} (${isYearly ? "Yearly" : "Monthly"})`;
    summaryPlanPrice.textContent = `$${planPrice}/${unit}`;

    selectedAddonsBox.innerHTML = "";
    addonCards.forEach((card) => {
        if(card.querySelector("input").checked) {
            const price = Number(card.dataset[key]);
            total += price;

            const row = document.createElement("div");
            row.className = "addon-row";
            row.innerHTML = `<span>${card.dataset.name}</span><span>+$${price}/${unit}</span>`;
            selectedAddonsBox.appendChild(row);
        }
    });
summaryTotal.textContent = `$${total}/${unit}`;
}

changePlanBtn.addEventListener("click", () => {
    currentStep = 1;
    showStep(currentStep);
});