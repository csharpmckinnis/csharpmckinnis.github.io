// Global variables
let currentStep = 0;
const totalSteps = 2;

let selectedAccountType = '';
let sameAsServiceChecked = '';

// DOM elements
const form = document.getElementById('webToCaseForm');
const steps = document.querySelectorAll('.form-step');
const progressSteps = document.querySelectorAll('.progress-step');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Event listeners
document.addEventListener('DOMContentLoaded', initForm);
form.addEventListener('change', handleFormChange);
prevBtn.addEventListener('click', () => navigateStep(-1));
nextBtn.addEventListener('click', handleNextButtonClick);

document.querySelectorAll('.phone-input').forEach((phoneInput) => {
    phoneInput.addEventListener('input', function () {
        let input = this.value.replace(/\D/g, ''); // Remove all non-numeric characters
        if (input.length > 10) input = input.slice(0, 10); // Limit input to 10 digits

        const areaCode = input.slice(0, 3);
        const middle = input.slice(3, 6);
        const last = input.slice(6);

        if (input.length > 6) {
            this.value = `(${areaCode}) ${middle}-${last}`;
        } else if (input.length > 3) {
            this.value = `(${areaCode}) ${middle}`;
        } else if (input.length > 0) {
            this.value = `(${areaCode}`;
        }
    });
});

function initForm() {
    showStep(currentStep);
    document.getElementById('sameAsService').addEventListener('change', copyServiceAddress);
    document.getElementById('sameAsService').addEventListener('change', function() {
        sameAsServiceChecked = 'x';
        toggleCommercialFields();
    });

    document.getElementById('newCustomer').addEventListener('change', function() {
        selectedAccountType = this.checked ? 'New Customer' : '';
        toggleTransferFields(); // Ensure fields are toggled when switching between radio buttons
        toggleCommercialFields();
    });

    document.getElementById('transferAccount').addEventListener('change', function() {
        selectedAccountType = this.checked ? 'Transfer from Previous Town of Cary Account' : '';
        toggleTransferFields(); // Ensure fields are toggled when switching between radio buttons
        toggleCommercialFields();
    });

    document.getElementById('landlord').addEventListener('change', function() {
        selectedAccountType = this.checked ? 'Landlord' : '';
        toggleTransferFields(); // Ensure fields are toggled when switching between radio buttons
        toggleCommercialFields();
    });
    document.getElementById('commercial').addEventListener('change', function() {
        selectedAccountType = this.checked ? 'Commercial' : '';
        toggleTransferFields();
    });
}

function handleNextButtonClick() {
    if (currentStep === totalSteps - 1) {
        if (validateStep(currentStep)) {
            submitAndShowDocusignStep();
        }
    } else {
        navigateStep(1);
    }
}

function navigateStep(direction) {
    const newStep = currentStep + direction;
    if (newStep >= 0 && newStep < totalSteps && validateStep(currentStep)) {
        currentStep = newStep;
        showStep(currentStep);
    }
}

function handleFormChange(event) {
    const { name, value, type, checked } = event.target;
    
    if (name === 'Account_Type__c') {
        if (value === 'Transfer from Previous Town of Cary Account') {
            toggleTransferFields();
        } else if (value === 'Commercial') {
            toggleCommercialFields();
        }
    }
}

function showStep(step) {
    steps.forEach((stepElement, index) => {
        stepElement.style.display = index === step ? 'block' : 'none';
    });

    progressSteps.forEach((progressStep, index) => {
        progressStep.classList.toggle('active', index === step);
    });

    prevBtn.style.display = step === 0 ? 'none' : 'inline-block';
    nextBtn.textContent = step === totalSteps - 1 ? 'Submit' : 'Next';
}



function validateStep(step) {
    if (step < 0 || step >= steps.length) {
        console.error(`Invalid step: ${step}`);
        return false;
    }

    const currentStepElement = steps[step];
    const requiredFields = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');

    let isValid = true;

    requiredFields.forEach((field) => {
        const errorMessage = field.nextElementSibling; // Get the <small> element directly after the field

        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error'); // Add error styling
            if (errorMessage) {
                errorMessage.style.display = 'block'; // Show pre-defined error message
            }
        } else {
            field.classList.remove('error');
            if (errorMessage) {
                errorMessage.style.display = 'none'; // Hide error message
            }
        }
    });

    // Additional validation for specific steps (e.g., Step 0 for radio buttons)
    if (step === 0) {
        const accountTypeRadios = document.querySelectorAll('input[name="Account_Type__c"]');
        const accountTypeError = document.querySelector('#accountTypeError'); // Add this as an <small> near your radio buttons
        if (!Array.from(accountTypeRadios).some((radio) => radio.checked)) {
            isValid = false;
            accountTypeError.style.display = 'block';
        } else {
            accountTypeError.style.display = 'none';
        }
    }

    return isValid;
}

function copyServiceAddress() {
    const sameAsService = document.getElementById('sameAsService');
    const fields = [
        { from: 'serviceAddress', to: 'mailingAddress' },
        { from: 'city', to: 'mailingCity' },
        { from: 'zip', to: 'mailingZip' }
    ];

    fields.forEach(field => {
        const fromElement = document.getElementById(field.from);
        const toElement = document.getElementById(field.to);
        if (fromElement && toElement) {
            toElement.value = sameAsService.checked ? fromElement.value : '';
        }
    });
}

function toggleTransferFields() {
    const transferFields = document.getElementById('transferFields');
    const transferRadio = document.getElementById('transferAccount');
    transferFields.style.display = transferRadio.checked ? 'block' : 'none';
}

function toggleCommercialFields() {
    const commercialFields = document.getElementById('commercialFields');
    const commercialRadio = document.getElementById('commercial');
    commercialFields.style.display = commercialRadio.checked ? 'block' : 'none';
}

function generateDocusignUrl() {
    console.log('running updateDocusignLink');
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const serviceAddress = document.getElementById('serviceAddress').value.trim();
    const serviceCity = document.getElementById('city').value.trim();
    const serviceZip = document.getElementById('zip').value.trim();
    const serviceStartDate = document.getElementById('startServiceDate').value.trim();
    const mailAddress = document.getElementById('mailingAddress').value.trim();
    const mailCity = document.getElementById('mailingCity').value.trim();
    const mailZip = document.getElementById('mailingZip').value.trim();
    const billingContactFirstName = document.getElementById('billingContactFirstName').value.trim();
    const billingContactLastName = document.getElementById('billingContactLastName').value.trim();
    const billingContactPhone = document.getElementById('billingContactPhone').value.trim();
    // Reformat date from YYYY-MM-DD to MM/DD/YYYY
    const [year, month, day] = serviceStartDate.split('-');
    const formattedDate = `${month}/${day}/${year}`;
    // Get Business Information
    const businessName = document.getElementById('businessName') ? document.getElementById('businessName').value.trim() : '';
    const federalTaxId = document.getElementById('federalTaxId') ? document.getElementById('federalTaxId').value.trim() : '';
    const businessPhone = document.getElementById('businessPhone') ? document.getElementById('businessPhone').value.trim() : '';

    // Garbage Cart Field(s)
    const extraGarbageCart = document.getElementById('secondGarbageCart').checked ? 'Yes' : 'No';

    // Placeholder value 
    const placeholder = 'Not Provided';
    const emptyPlaceholder = '';
    
    const docusignUrl = `https://na3.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=eb143945-8c8e-4180-9e4a-4c3e357f8af2&env=na3&acct=9bf19d04-f0ac-4eb6-bae4-1429d861f6a9&v=2&Citizen_UserName=${encodeURIComponent(firstName)}%20${encodeURIComponent(lastName)}&Citizen_Email=${encodeURIComponent(email)}&Primary Email Address=${encodeURIComponent(email)}&ServiceStartDate=${encodeURIComponent(formattedDate)}&ServiceAddress=${encodeURIComponent(serviceAddress)}&ServiceCity=${encodeURIComponent(serviceCity)}&ServiceZip=${encodeURIComponent(serviceZip)}&MailingAddress=${encodeURIComponent(mailAddress)}&MailingCity=${encodeURIComponent(mailCity)}&MailingZip=${encodeURIComponent(mailZip)}&LastName=${encodeURIComponent(lastName)}&FirstName=${encodeURIComponent(firstName)}&Primary_Mobile_Phone=${encodeURIComponent(phone)}&Mailing Add Same=${sameAsServiceChecked}&Type of Account=${encodeURIComponent(selectedAccountType)}&SecondaryAccountOwnerName=${encodeURIComponent(billingContactFirstName)}%20${encodeURIComponent(billingContactLastName)}&SecondaryAccountOwnerPhone=${encodeURIComponent(billingContactPhone)}&EnvelopeField_BusinessName=${encodeURIComponent(businessName || placeholder)}&EnvelopeField_BusinessTIN=${encodeURIComponent(federalTaxId || placeholder)}&EnvelopeField_BusinessPhone=${encodeURIComponent(businessPhone || placeholder)}&EnvelopeField_ExtraGarbageCart=${encodeURIComponent(extraGarbageCart)}&SSN=${encodeURIComponent(federalTaxId || emptyPlaceholder)}&retURL=https://na3.docusign.net`;
    return docusignUrl;
}

function updateFormDescription() {
    const descriptionField = document.getElementById('description');
    let description = `
        Name: ${document.getElementById('firstName').value} ${document.getElementById('lastName').value}
        Email: ${document.getElementById('email').value}
        Phone: ${document.getElementById('phone').value || 'Not provided'}
        Service Address: ${document.getElementById('serviceAddress').value}, ${document.getElementById('city').value} ${document.getElementById('zip').value}
        Service Start Date: ${document.getElementById('startServiceDate').value}
        Mailing Address: ${document.getElementById('mailingAddress').value}, ${document.getElementById('mailingCity').value} ${document.getElementById('mailingZip').value}
        Account Type: ${document.querySelector('input[name="Account_Type__c"]:checked').value}
        
        Secondary Contact:
        Name: ${document.getElementById('billingContactFirstName').value} ${document.getElementById('billingContactLastName').value}
        Email: ${document.getElementById('billingContactEmail').value}
        Phone: ${document.getElementById('billingContactPhone').value || 'Not provided'}
        Company Name: ${document.getElementById('billingCompanyName').value || 'Not provided'}
    `;

    if (document.getElementById('commercial').checked) {
        description += `
            Business Name: ${document.getElementById('businessName').value}
            Federal Tax ID: ${document.getElementById('federalTaxId').value}
            Business Phone: ${document.getElementById('businessPhone').value}
        `;
    }

    if (document.getElementById('secondGarbageCart').checked) {
        description += 'Requesting additional garbage cart\n';
    }

    descriptionField.value = description.trim();
}

function submitFormToSalesforce() {
    const formData = new FormData(form);
    
    return fetch(form.action, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
    })
    .then(response => {
        console.log('Form submitted successfully');
        // Since we're using no-cors mode, we can't actually read the response
        // So we'll resolve the promise if the fetch didn't throw an error
        return Promise.resolve();
    })
    .catch(error => {
        console.error('Error submitting form:', error);
        return Promise.reject(error);
    });
}

function showDocusignStep() {
    const docusignStep = document.getElementById('docusignStep');
    const docusignFrame = document.getElementById('docusignFrame');

    // Update DocuSign URL with form data
    const docusignUrl = generateDocusignUrl();
    docusignFrame.src = docusignUrl;

    // Hide current step and show DocuSign step
    steps[currentStep].style.display = 'none';
    docusignStep.style.display = 'block';

    // Hide navigation buttons
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
}

function submitAndShowDocusignStep() {
    updateFormDescription();
    submitFormToSalesforce()
        .then(() => {
            showDocusignStep();
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            alert('There was an error submitting the form. Please try again.');
        });
}