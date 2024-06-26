let currentStep = 0;
let sameAsServiceChecked = '';
let selectedAccountType = '';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('sameAsService').addEventListener('change', copyServiceAddress);
});

///function monitorIframe() {
///    const iframe = document.getElementById('docusignFrame');
///    setInterval(function() {
///        try {
///            const nextURL = iframe.contentWindow.location.href;
///            if (nextURL.includes('carync.gov')) {
///                showSuccessStep();
///            }
///        } catch (e) {
///            // Handle the error if cross-origin access is not allowed
///         console.error('Error accessing iframe content:', e);
///        }
///    }, 1000); // Check every second
///}

function showStep(step) {
    console.log('running showStep');
    const steps = document.querySelectorAll('.form-step');
    steps.forEach((stepElement, index) => {
        stepElement.style.display = (index === step) ? 'block' : 'none';
    });
}

function nextStep() {
    console.log('running nextStep');
    if (!validateStep(currentStep)) {
        alert("Please fill out all required fields.");
        return false;
    }
    currentStep++;
    showStep(currentStep);
}

function previousStep() {
    console.log('running previousStep');
    currentStep--;
    showStep(currentStep);
}

function validateStep(step) {
    console.log('running validateStep');
    const steps = document.querySelectorAll('.form-step');
    const inputs = steps[step].querySelectorAll('input[required], textarea[required]');
    for (let input of inputs) {
        if (!input.value.trim()) {
            return false;
        }
    }
    // Check if at least one radio button is selected
    if (step === 0) { // Assuming the radio buttons are in the first step
        const radioButtons = document.querySelectorAll('input[name="Account_Type__c"]');
        let isChecked = false;
        for (let radioButton of radioButtons) {
            if (radioButton.checked) {
                isChecked = true;
                break;
            }
        }
        if (!isChecked) {
            alert("Please select an account type.");
            return false;
        }
    }
    return true;
}

function copyServiceAddress() {
    console.log('running copyServiceAddress');
    
    const serviceAddress = document.getElementById('serviceAddress');
    const city = document.getElementById('city');
    const zip = document.getElementById('zip');
    const mailingAddress = document.getElementById('mailingAddress');
    const mailingCity = document.getElementById('mailingCity');
    const mailingZip = document.getElementById('mailingZip');
    const sameAsService = document.getElementById('sameAsService');

    if (!serviceAddress || !city || !zip || !mailingAddress || !mailingCity || !mailingZip || !sameAsService) {
        console.error('One or more elements are missing in the DOM.');
        return;
    }

    if (sameAsService.checked) {
        mailingAddress.value = serviceAddress.value;
        mailingCity.value = city.value;
        mailingZip.value = zip.value;
    } else {
        mailingAddress.value = '';
        mailingCity.value = '';
        mailingZip.value = '';
    }
}

function toggleTransferFields() {
    console.log('running copyTransferFields');
    const transferFields = document.getElementById('transferFields');
    const transferCheckbox = document.getElementById('transferAccount');
    if (transferCheckbox.checked) {
        transferFields.style.display = 'block';
    } else {
        transferFields.style.display = 'none';
    }
}

function toggleCommercialFields() {
    console.log('running toggleCommercialFields');
    const commercialFields = document.getElementById('commercialFields');
    const transferFields = document.getElementById('transferFields');
    const commercialCheckbox = document.getElementById('commercial');
    if (commercialCheckbox.checked) {
        commercialFields.style.display = 'block';
        transferFields.style.display = 'none';
    } else {
        commercialFields.style.display = 'none';
    }
}

function updateDocusignLink() {
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

    // Placeholder value
    const placeholder = 'Not Provided';
    
    const docusignUrl = `https://na3.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=90ea2e80-71a5-4833-8e3d-8e9fc3d7e242&env=na3&acct=9bf19d04-f0ac-4eb6-bae4-1429d861f6a9&v=2&Citizen_UserName=${encodeURIComponent(firstName)}%20${encodeURIComponent(lastName)}&Citizen_Email=${encodeURIComponent(email)}&Primary Email Address=${encodeURIComponent(email)}&ServiceStartDate=${encodeURIComponent(formattedDate)}&ServiceAddress=${encodeURIComponent(serviceAddress)}&ServiceCity=${encodeURIComponent(serviceCity)}&ServiceZip=${encodeURIComponent(serviceZip)}&MailingAddress=${encodeURIComponent(mailAddress)}&MailingCity=${encodeURIComponent(mailCity)}&MailingZip=${encodeURIComponent(mailZip)}&LastName=${encodeURIComponent(lastName)}&FirstName=${encodeURIComponent(firstName)}&Primary_Mobile_Phone=${encodeURIComponent(phone)}&Mailing Add Same=${sameAsServiceChecked}&Type of Account=${encodeURIComponent(selectedAccountType)}&SecondaryAccountOwnerName=${encodeURIComponent(billingContactFirstName)}%20${encodeURIComponent(billingContactLastName)}&SecondaryAccountOwnerPhone=${encodeURIComponent(billingContactPhone)}&EnvelopeField_BusinessName=${encodeURIComponent(businessName || placeholder)}&EnvelopeField_BusinessTIN=${encodeURIComponent(federalTaxId || placeholder)}&EnvelopeField_BusinessPhone=${encodeURIComponent(businessPhone || placeholder)}&retURL=https://na3.docusign.net`;
    
    document.getElementById('docusignFrame').src = docusignUrl;

    
}

function updateAndSubmitFormWithAjax() {
    console.log('running updateAndSubmitFormWithAjax');
    const form = document.getElementById('webToCaseForm');
    const formData = new FormData(form);

    // Get form data
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim() || 'None provided';
    const serviceAddress = document.getElementById('serviceAddress').value.trim();
    const city = document.getElementById('city').value.trim();
    const zip = document.getElementById('zip').value.trim();
    const startServiceDate = document.getElementById('startServiceDate').value.trim();
    const mailingAddress = document.getElementById('mailingAddress').value.trim() || 'None provided';
    const mailingCity = document.getElementById('mailingCity').value.trim() || 'None provided';
    const mailingZip = document.getElementById('mailingZip').value.trim() || 'None provided';
    const accountType = selectedAccountType;

    // Secondary contact fields
    const billingContactFirstName = document.getElementById('billingContactFirstName').value.trim();
    const billingContactLastName = document.getElementById('billingContactLastName').value.trim();
    const billingContactEmail = document.getElementById('billingContactEmail').value.trim();
    const billingContactPhone = document.getElementById('billingContactPhone').value.trim() || 'None provided';
    const billingCompanyName = document.getElementById('billingCompanyName') ? document.getElementById('billingCompanyName').value.trim() : '';

    // Commercial fields
    const businessName = document.getElementById('businessName') ? document.getElementById('businessName').value.trim() : '';
    const federalTaxId = document.getElementById('federalTaxId') ? document.getElementById('federalTaxId').value.trim() : '';
    const businessPhone = document.getElementById('businessPhone') ? document.getElementById('businessPhone').value.trim() : '';

    // Validate required fields
    if (!firstName || !lastName || !email || !serviceAddress || !startServiceDate || !city || !zip || !billingContactFirstName || !billingContactLastName || !billingContactEmail) {
        alert("Please fill out all required fields.");
        return false;
    }

    if (!validateStep(currentStep)) {
        alert("Please fill out all required fields.");
        return false;
    }

    // Create name and description and subject
    let name = `${firstName} ${lastName}`;
    let description = `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Service Address: ${serviceAddress}, ${city} ${zip}
        Service Start Date: ${startServiceDate}
        Mailing Address: ${mailingAddress}, ${mailingCity} ${mailingZip}
        Account Type: ${accountType}
        
        Secondary Contact:
        Name: ${billingContactFirstName} ${billingContactLastName}
        Email: ${billingContactEmail}
        Phone: ${billingContactPhone}
        Company Name: ${billingCompanyName}
    `;

    // Add commercial fields to description if applicable
    if (accountType === 'Commercial') {
        description += `
            Business Name: ${businessName}
            Federal Tax ID: ${federalTaxId}
            Business Phone: ${businessPhone}
        `;
    }

    // Set hidden fields, Description, SuppliedName
    document.getElementById('description').value = description;
    formData.append('description', description);
    document.getElementById('SuppliedName').value = name;
    formData.append('name', name);

    // Submit the form data to Salesforce
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

    // Update the DocuSign link
    updateDocusignLink();
}

function submitAndShowDocusignStep(event) {
    console.log('running submitAndShowDocusignStep');
    // Prevent default form submission behavior
    // Submit the form data to Salesforce using AJAX
    updateAndSubmitFormWithAjax();
}

function showDocusignStep() {
    console.log('running showDocusignStep');
    // Update the DocuSign iframe URL
    updateDocusignLink();

    // Show the DocuSign step
    currentStep = 2; // Set current step to the third step
    showStep(currentStep); // Show the third step
}



function showSuccessStep() {
    console.log('running showSuccessStep');
    document.getElementById('docusignStep').style.display = 'none';
    document.getElementById('successStep').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    showStep(currentStep);
    
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
});