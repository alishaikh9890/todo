import React from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { FcTodoList } from 'react-icons/fc';
import { FaRegUserCircle } from 'react-icons/fa';

function Login() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [user, setUser] = React.useState("");
  const [pass, setPass] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchAndUpdate();
  }, []);

  const fetchAndUpdate = () => {
    fetch('http://localhost:3800/users/')
      .then((res) => res.json())
      .then((res) => setUsers(res))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const handleLogin = () => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].email === user && users[i].password === pass) {
        navigate(`/todos/${users[i].id}`);
        return;
      }
    }
    // If no user found, create a new user
    const payload = {
      email: user,
      password: pass,
      id: uuid(),
      todos: []
    };
    const dataToPost = JSON.stringify(payload);
    fetch(`http://localhost:3800/users`, {
      method: "POST",
      body: dataToPost,
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then(() => {
      fetchAndUpdate();
      navigate(`/todos/${payload.id}`);
    })
    .catch((err) => console.log(err));
  };

  return (
    <div className="Login">
      <div className='h2'>
        <FcTodoList className='icon'/>
        <h2>TO-DO APP</h2>
        <FaRegUserCircle className='icon'/>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }} className='input'>
        <h2 style={{ margin: "auto", color: "white" }}>Login</h2>
        <input
          type="text"
          placeholder="Enter Email"
          onChange={(e) => setUser(e.target.value)}
          value={user}
        />
        <input
          type="password" 
          placeholder="Password" 
          onChange={(e) => setPass(e.target.value)}
          value={pass}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
      <div className='footer'>footer</div>
    </div>
  );
}

export default Login;
