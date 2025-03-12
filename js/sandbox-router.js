document.addEventListener('DOMContentLoaded', function() {
    // Get the login form and other elements
    const loginForm = document.getElementById('sandbox-login-form');
    const emailInput = document.getElementById('email-input');
    const errorMessage = document.getElementById('error-message');
    const loader = document.getElementById('loader');
    const adminSandboxList = document.getElementById('admin-sandbox-list');
    const sandboxCardsContainer = document.getElementById('sandbox-cards-container');
    
    // Add event listener to the form
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get the email input value and validate
        const email = emailInput.value.trim().toLowerCase();
        if (!email || !isValidEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }
        
        // Show loader and hide any previous error
        errorMessage.style.display = 'none';
        loader.style.display = 'block';
        adminSandboxList.style.display = 'none';
        
        // Fetch the sandbox mappings
        fetch('/data/sandbox-mappings.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Hide loader
                loader.style.display = 'none';
                
                // Check if this is an admin with access to all sandboxes
                const adminMapping = data.email_mappings.find(m => 
                    m.email === email && m.access_all === true
                );
                
                if (adminMapping) {
                    // Show all available sandboxes to admin
                    displaySandboxList(data.sandbox_mappings);
                    return;
                }
                
                // Check for specific email mapping
                const specificEmailMapping = data.email_mappings.find(m => 
                    m.email === email
                );
                
                if (specificEmailMapping) {
                    // Redirect to the mapped sandbox
                    redirectToSandbox(specificEmailMapping.sandbox_url);
                    return;
                }
                
                // If no specific mapping, check domain-based mapping
                const emailDomain = email.split('@')[1];
                const domainMapping = data.sandbox_mappings.find(m => 
                    emailDomain === m.email_domain
                );
                
                if (domainMapping) {
                    // Redirect to the domain-mapped sandbox
                    redirectToSandbox(domainMapping.sandbox_url);
                    return;
                }
                
                // If no mapping found and there's a default sandbox, use that
                if (data.default_sandbox) {
                    redirectToSandbox(data.default_sandbox);
                    return;
                }
                
                // No mapping found and no default
                showError('No sandbox found for this email address. Please contact support.');
            })
            .catch(error => {
                // Hide loader and show error
                loader.style.display = 'none';
                showError('Error connecting to sandbox system. Please try again later.');
                console.error('Error:', error);
            });
    });
    
    // Function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Function to display error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
    
    // Function to redirect to sandbox
    function redirectToSandbox(url) {
        // You could add a loading message or transition here
        console.log(`Redirecting to: ${url}`);
        
        // For development/testing purposes, show an alert instead of actual redirect
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            alert(`Development mode: Would redirect to ${url}/web/login`);
        } else {
            // In production, perform the actual redirect
            window.location.href = `${url}/web/login`;
        }
    }
    
    // Function to display the list of sandboxes for admins
    function displaySandboxList(sandboxes) {
        // Clear previous content
        sandboxCardsContainer.innerHTML = '';
        
        // Create a card for each sandbox
        sandboxes.forEach(sandbox => {
            const card = document.createElement('div');
            card.className = 'sandbox-card';
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'sandbox-card-name';
            nameSpan.textContent = sandbox.name || `Sandbox for ${sandbox.email_domain}`;
            
            const linkBtn = document.createElement('a');
            linkBtn.href = `${sandbox.sandbox_url}/web/login`;
            linkBtn.textContent = 'Access Sandbox';
            linkBtn.target = '_blank';
            
            card.appendChild(nameSpan);
            card.appendChild(linkBtn);
            sandboxCardsContainer.appendChild(card);
        });
        
        // Show the sandbox list
        adminSandboxList.style.display = 'block';
    }
});
