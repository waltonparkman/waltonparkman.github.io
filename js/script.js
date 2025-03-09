document.addEventListener('DOMContentLoaded', function() {
    // Fixed header behavior
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'white';
            header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Handle Odoo sandbox links with password protection
    document.querySelectorAll('.sandbox-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const sandboxNumber = this.getAttribute('data-sandbox');
            const password = prompt(`Enter password for Odoo Sandbox #${sandboxNumber}:`);
            
            // In a real implementation, you would use a secure method to verify passwords
            // This is just a simple demonstration
            const sandboxURLs = {
                "1": "https://sandbox1.waltonparkman.com/odoo",
                "2": "https://sandbox2.waltonparkman.com/odoo",
                "3": "https://sandbox3.waltonparkman.com/odoo"
            };
            
            // Demo passwords (in production, use proper authentication)
            const sandboxPasswords = {
                "1": "sandbox1pass",
                "2": "sandbox2pass",
                "3": "sandbox3pass"
            };
            
            if (password === sandboxPasswords[sandboxNumber]) {
                // Redirect to the sandbox URL
                window.open(sandboxURLs[sandboxNumber], '_blank');
            } else if (password) {
                alert("Incorrect password. Please try again.");
            }
        });
    });

    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Basic form validation
            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            // In a real implementation, you would send this data to a server
            // For now, we'll just display a success message
            alert(`Thank you, ${name}! Your message has been received. I'll get back to you soon.`);
            contactForm.reset();
            
            // Note: In production, you would use a proper form submission method
            // such as fetch() to a backend API or a service like Formspree
        });
    }
});
