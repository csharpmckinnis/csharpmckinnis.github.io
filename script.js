
function timestamp() {
    var response = document.getElementById("g-recaptcha-response");
    if (response == null || response.value.trim() == "") {
        var elems = JSON.parse(document.getElementsByName("captcha_settings")[0].value);
        elems["ts"] = JSON.stringify(new Date().getTime());
        document.getElementsByName("captcha_settings")[0].value = JSON.stringify(elems);
    }
}
setInterval(timestamp, 500);

let currentStep = 0;

        function showStep(step) {
            const steps = document.querySelectorAll('.form-step');
            steps.forEach((stepElement, index) => {
                stepElement.classList.toggle('form-step-active', index === step);
            });

            const stepIndicators = document.querySelectorAll('.step-indicator li');
            stepIndicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === step);
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
            const transferCheckbox = document.getElementById('transferAccount');
            const transferFields = document.getElementById('transferFields');
            if (transferCheckbox.checked) {
                transferFields.style.display = 'block';
            } else {
                transferFields.style.display = 'none';
            }
        }

        function getAccountType() {
            let accountType = [];
            if (document.getElementById('newCustomer').checked) {
                accountType.push('New Customer');
            }
            if (document.getElementById('transferAccount').checked) {
                accountType.push('Transfer from Previous Town of Cary Account');
            }
            if (document.getElementById('landlord').checked) {
                accountType.push('Landlord');
            }
            return accountType.join(', ') || 'None provided';
        }

        function submitForm() {
            // Get field values
            const name = document.getElementById('name').value.trim();
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
            const accountType = getAccountType();
        
            // Check for required fields
            if (!name || !email || !serviceAddress || !startServiceDate) {
                alert("Please fill out all required fields.");
                return false;
            }
        
            if (!validateStep(currentStep)) {
                alert("Please fill out all required fields.");
                return false;
            }
            
            // Create description
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
        
            // Set description value
            document.getElementById('description').value = description.trim();
        
            // Submit the form
            document.getElementById('webToCaseForm').submit();
        
            // Redirect to DocuSign webform
            const redirectUrl = `https://us.services.docusign.net/webforms-ux/v1.0/forms/3c210fa70e818616c9877e6eb9a5a125#Signer_1_name=${encodeURIComponent(name)}&Signer_1_email=${encodeURIComponent(email)}`;
            window.location.href = redirectUrl;
        }
        
        document.addEventListener('DOMContentLoaded', () => {
            showStep(currentStep);
        });