let currentStep = 0;
let sameAsServiceChecked = '';
let selectedAccountType = '';

function showStep(step) {
    const steps = document.querySelectorAll('.form-step');
    steps.forEach((stepElement, index) => {
        stepElement.style.display = (index === step) ? 'block' : 'none';
    });
}

function nextStep() {
    if (!validateStep(currentStep)) {
        alert("Please fill out all required fields.");
        return false;
    }
    currentStep++;
    showStep(currentStep);
}

function previousStep() {
    currentStep--;
    showStep(currentStep);
}

function validateStep(step) {
    const steps = document.querySelectorAll('.form-step');
    const inputs = steps[step].querySelectorAll('input[required], textarea[required]');
    for (let input of inputs) {
        if (!input.value.trim()) {
            return false;
        }
    }
    return true;
}

function copyServiceAddress() {
    if (document.getElementById('sameAsService').checked) {
        document.getElementById('mailingAddress').value = document.getElementById('serviceAddress').value;
        document.getElementById('mailingCity').value = document.getElementById('city').value;
        document.getElementById('mailingState').value = document.getElementById('state').value;
        document.getElementById('mailingZip').value = document.getElementById('zip').value;
    } else {
        document.getElementById('mailingAddress').value = '';
        document.getElementById('mailingCity').value = '';
        document.getElementById('mailingState').value = '';
        document.getElementById('mailingZip').value = '';
    }
}

function toggleTransferFields() {
    const transferFields = document.getElementById('transferFields');
    const transferCheckbox = document.getElementById('transferAccount');
    if (transferCheckbox.checked) {
        transferFields.style.display = 'block';
    } else {
        transferFields.style.display = 'none';
    }
}

function updateDocusignLink() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const serviceAddress = document.getElementById('serviceAddress').value.trim();
    const serviceCity = document.getElementById('city').value.trim();
    const serviceState = document.getElementById('state').value.trim();
    const serviceZip = document.getElementById('zip').value.trim();
    const serviceStartDate = document.getElementById('startServiceDate').value.trim();
    const mailAddress = document.getElementById('mailingAddress').value.trim();
    const mailCity = document.getElementById('mailingCity').value.trim();
    const mailState = document.getElementById('mailingState').value.trim();
    const mailZip = document.getElementById('mailingZip').value.trim();

    // Reformat date from YYYY-MM-DD to MM/DD/YYYY
    const [year, month, day] = serviceStartDate.split('-');
    const formattedDate = `${month}/${day}/${year}`;

    const docusignUrl = `https://na3.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=963a6232-6764-4580-b181-01fa4e7182b8&env=na3&acct=9bf19d04-f0ac-4eb6-bae4-1429d861f6a9&v=2&Citizen_UserName=${encodeURIComponent(firstName)}%20${encodeURIComponent(lastName)}&Citizen_Email=${encodeURIComponent(email)}&Primary Email Address=${encodeURIComponent(email)}&ServiceStartDate=${encodeURIComponent(formattedDate)}&ServiceAddress=${encodeURIComponent(serviceAddress)}&ServiceCity=${encodeURIComponent(serviceCity)}&ServiceZip=${encodeURIComponent(serviceZip)}&MailingAddress=${encodeURIComponent(mailAddress)}&MailingCity=${encodeURIComponent(mailCity)}&MailingState=${encodeURIComponent(mailState)}&MailingZip=${encodeURIComponent(mailZip)}&LastName=${encodeURIComponent(lastName)}&FirstName=${encodeURIComponent(firstName)}&Primary_Mobile_Phone=${encodeURIComponent(phone)}&Mailing Add Same=${sameAsServiceChecked}&Type of Account=${encodeURIComponent(selectedAccountType)}&retURL=https://csharpmckinnis.github.io/completion.html`;

    document.getElementById('docusignFrame').src = docusignUrl;
}

function updateAndSubmitForm() {
    // Prevent form from submitting
    event.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim() || 'None provided';
    const serviceAddress = document.getElementById('serviceAddress').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const zip = document.getElementById('zip').value.trim();
    const startServiceDate = document.getElementById('startServiceDate').value.trim();
    const previousServiceStopDate = document.getElementById('previousServiceStopDate').value.trim() || 'None provided';
    const previousServiceAddress = document.getElementById('previousServiceAddress').value.trim() || '';
    const previousServiceCity = document.getElementById('previousServiceCity').value.trim() || '';
    const previousServiceState = document.getElementById('previousServiceState').value.trim() || '';
    const previousServiceZip = document.getElementById('previousServiceZip').value.trim() || '';
    const mailingAddress = document.getElementById('mailingAddress').value.trim() || 'None provided';
    const mailingCity = document.getElementById('mailingCity').value.trim() || 'None provided';
    const mailingState = document.getElementById('mailingState').value.trim() || 'None provided';
    const mailingZip = document.getElementById('mailingZip').value.trim() || 'None provided';
    const additionalUserName = document.getElementById('additionalUserName').value.trim() || 'None provided';
    const additionalUserPhone = document.getElementById('additionalUserPhone').value.trim() || '';
    const accountType = selectedAccountType;

    if (!firstName || !lastName || !email || !serviceAddress || !startServiceDate) {
        alert("Please fill out all required fields.");
        return false;
    }

    if (!validateStep(currentStep)) {
        alert("Please fill out all required fields.");
        return false;
    }

    //generate name field
    const name = '${firstName} ${lastName}'

    const description = `
        Requested Service Start Date: ${startServiceDate}
        Service Account Type: ${accountType}
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Service Address: ${serviceAddress}, ${city}, ${state} ${zip}
        Stop Service Date: ${previousServiceStopDate}
        Previous Service Address: ${previousServiceAddress}, ${previousServiceCity}, ${previousServiceState} ${previousServiceZip}
        Mailing Address: ${mailingAddress}, ${mailingCity}, ${mailingState} ${mailingZip}
        Additional Authorized User: ${additionalUserName} (${additionalUserPhone})
    `;

    

    document.getElementById('description').value = description.trim();

    // Submit the form data to Salesforce
    document.getElementById('webToCaseForm').submit();

    // Update the DocuSign link
    updateDocusignLink();
}

function submitAndShowDocusignStep() {
    // Prevent default form submission behavior
    event.preventDefault();

    // Submit the form data to Salesforce using AJAX
    submitFormWithAjax();
}

function showDocusignStep() {
    // Update the DocuSign iframe URL
    updateDocusignLink();

    // Show the DocuSign step
    currentStep = 2; // Set current step to the third step
    showStep(currentStep); // Show the third step
}

function submitFormWithAjax() {
    const form = document.getElementById('webToCaseForm');
    const formData = new FormData(form);
    
    fetch(form.action, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // This is important to avoid CORS issues
    })
    .then(response => {
        console.log('Form successfully submitted');
        showDocusignStep(); // Proceed to show DocuSign step
    })
    .catch(error => {
        console.error('Error submitting form:', error);
    });
}

function showSuccessStep() {
    document.getElementById('docusignStep').style.display = 'none';
    document.getElementById('successStep').style.display = 'block';
}

window.addEventListener('hashchange', function() {
    if (window.location.href.includes('completion.html')) {
        showSuccessStep();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    showStep(currentStep);
    
    document.getElementById('sameAsService').addEventListener('change', function() {
        sameAsServiceChecked = 'x';
    });

    document.getElementById('newCustomer').addEventListener('change', function() {
        selectedAccountType = this.checked ? 'New Customer' : '';
        toggleTransferFields(); // Ensure fields are toggled when switching between radio buttons
    });

    document.getElementById('transferAccount').addEventListener('change', function() {
        selectedAccountType = this.checked ? 'Transfer from Previous Town of Cary Account' : '';
        toggleTransferFields(); // Ensure fields are toggled when switching between radio buttons
    });

    document.getElementById('landlord').addEventListener('change', function() {
        selectedAccountType = this.checked ? 'Landlord' : '';
        toggleTransferFields(); // Ensure fields are toggled when switching between radio buttons
    });
});