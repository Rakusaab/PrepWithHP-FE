// Debug script - Run this in browser console to set token and test API
console.log('Setting token in localStorage...');

// Set the token
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTY4ODA2MzUsInN1YiI6InJha3VzYWFiQGdtYWlsLmNvbSIsInR5cGUiOiJhY2Nlc3MifQ.OO1ZloNQdLNOUmd3durVljsgMbEn_QujOOmD8ZAciJA';

localStorage.setItem('access_token', token);
localStorage.setItem('token', token); // Fallback key

console.log('Token set! Current tokens:');
console.log('access_token:', localStorage.getItem('access_token'));
console.log('token:', localStorage.getItem('token'));

// Test API call
console.log('Testing API call...');
fetch('/api/v1/admin/intelligent-scraping/scraping-jobs', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log('API Response:', data);
  console.log('Jobs with can_retry=true:', data.jobs.filter(job => job.can_retry));
})
.catch(error => {
  console.error('API Error:', error);
});

console.log('Now refresh the page to see the retry buttons!');
