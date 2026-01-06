import React, { useState } from 'react';
import { fastAuthAPI } from '../../services/fast-api';

const TestAuth = () => {
  const [email, setEmail] = useState('newuser@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const testLogin = async () => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('=== FAST LOGIN TEST ===');
      console.log('Sending:', { email, password });
      
      const response = await fastAuthAPI.login({ email, password });
      console.log('Success:', response.data);
      
      setResult('✅ LOGIN SUCCESS!');
      localStorage.setItem('token', response.data.accessToken);
    } catch (error) {
      console.error('Error:', error);
      setResult(`❌ ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testRegister = async () => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('=== FAST REGISTER TEST ===');
      console.log('Sending:', { email, password, role: 'subscriber' });
      
      const response = await fastAuthAPI.register({ email, password, role: 'subscriber' });
      console.log('Success:', response.data);
      
      setResult('✅ REGISTER SUCCESS!');
    } catch (error) {
      console.error('Error:', error);
      setResult(`❌ ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>🧪 Auth Test (Fast)</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', fontSize: '16px' }}
        />
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '10px', fontSize: '16px' }}
        />
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button
          onClick={testLogin}
          disabled={loading}
          style={{ 
            flex: 1, 
            padding: '15px', 
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          {loading ? 'Testing...' : '🔑 Test Login'}
        </button>
        
        <button
          onClick={testRegister}
          disabled={loading}
          style={{ 
            flex: 1, 
            padding: '15px', 
            fontSize: '16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          {loading ? 'Testing...' : '📝 Test Register'}
        </button>
      </div>
      
      {result && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #dee2e6',
          borderRadius: '5px',
          fontSize: '16px'
        }}>
          {result}
        </div>
      )}
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Test Accounts:</strong></p>
        <p>newuser@example.com / password123</p>
        <p>test@example.com / password123</p>
      </div>
    </div>
  );
};

export default TestAuth;
