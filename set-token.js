// Run this script in the browser console to set the test token
const testToken = '250|DwnQBXt1ViocJhIjNNgMLHRvTZ2EDkWbE7QbpygR95364c9e';
const testUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'creator'
};

// Set in localStorage
localStorage.setItem('token', testToken);
localStorage.setItem('user', JSON.stringify(testUser));

console.log('✅ Test token set successfully!');
console.log('Token:', testToken.substring(0, 20) + '...');
console.log('User:', testUser);

// Test the token immediately
fetch('http://localhost:8000/api/test-auth', {
  headers: {
    'Authorization': `Bearer ${testToken}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
})
.then(response => response.json())
.then(data => {
  console.log('✅ Token test successful:', data);
})
.catch(error => {
  console.error('❌ Token test failed:', error);
});

// Reload the page to apply the new token
console.log('🔄 Reloading page to apply new token...');
setTimeout(() => window.location.reload(), 1000); 