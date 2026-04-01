import { useState } from 'react';

function Login({ authToken, setAuthToken, onUserLogin, onLoginFailure }) {
  //!! Class 3: simple login form for demo auth token retrieval
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const result = await response.json();

      if (response.status === 200) {
        setAuthToken(result.token);
        if (onUserLogin) onUserLogin(username);
        setPassword('');
      } else {
        if (onLoginFailure) onLoginFailure(result.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      if (onLoginFailure) onLoginFailure('Login request failed. Is the backend running?');
    }
  };

  const handleLogout = () => {
    setAuthToken('');
    setUsername('');
    setPassword('');
  };

  return (
    <div id="login-panel">
      <h2>Login (Demo Authorization)</h2>
      {authToken ? (
        <>
          <p>You are logged in.</p>
          <button type="button" onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
          <p>Please log in to access all book management features.</p>
        </>
      )}
    </div>
  );
}

export default Login;
