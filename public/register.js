document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      if (response.ok) {
        alert('Registration successful!');
        window.location.href = '/login.html';
      } else {
        alert('Registration failed.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
  