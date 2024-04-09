import React from 'react';
import{ useEffect} from "react";
import {v4 as uuid} from "uuid"
import { FcTodoList } from 'react-icons/fc';
import { FaRegUserCircle, FaTooth } from 'react-icons/fa';
import { useParams } from "react-router-dom";

function Todos() {

    const { todosId } = useParams();

    const [users, setUsers] = React.useState({})

    const [loading, setLoading]= React.useState(true);
    const [todos, setTodos] = React.useState([]);
    const [error, setError] = React.useState(false);
  
  const [input, setInput] = React.useState("")
  const [data, setData] = React.useState([])
  const [editId, setEditId] = React.useState(null)
  const [editTitle, setEditTitle] = React.useState("")
  const [show, setShow] = React.useState(null)
  
  
  const handleTodo = () => {
    if (!todosId) {
        alert("User ID is missing. Please try again later.");
        return;
    }
    
    if (input.trim() === "") {
        alert("Please add a todo!");
    } else {
        const payload = {
            title: input,
            status: false,
            id:uuid()
        };

users.todos.push(payload)
        
        const dataToPost = JSON.stringify(users);
        
        fetch(`http://localhost:3800/users/${todosId}`, {
            method: "PUT",
            body: dataToPost,
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(() => {
            // Refresh todos after successfully adding a new todo
            fetchAndUpdateData();
            // Reset input field after successful addition
            setInput("");
        })
        .catch((err) => console.log(err));
    }
}

  
  
  
  const handleDelete = (id) => {

    users.todos.splice(id, 1);

    fetch(`http://localhost:3800/users/${todosId}`, {
      method:"PUT",
      body:JSON.stringify(users),
      headers:{
        "Content-Type" : "application/json"
      }
    }).then(() => {
      fetchAndUpdateData();
  })
  
    // const update = data.filter((el) => el.id !== id);
    // setData(update)
    // localStorage.setItem("todoData", JSON.stringify(update))
  }
  
  
  const handleEdit = (id, val) => {
    if (editId === id) {

      const updatedTodos = users.todos.map(todoItem => {
        if (todoItem.id === id) {
            return { ...todoItem, title: val };
        } else {
            return todoItem;
        }
    });

      fetch(`http://localhost:3800/users/${todosId}`, {
        method: 'PUT',
        body: JSON.stringify({ ...users, todos: updatedTodos }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(() => {
          fetchAndUpdateData(); 
        })
        .catch(error => {
          console.error('Error updating todo:', error);
        });
        setEditId(null);
    } else {
      setEditId(id);
      setEditTitle(val);
    }
  };
  

  const handleCheck = (id) => {
    const todoToUpdate = todos.find(el => el.id === id);
    if (!todoToUpdate) return; // Handle case where todo is not found
  
    fetch(`http://localhost:3000/users/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        status: !todoToUpdate.status,
        title: todoToUpdate.title
      }) // Include both status and title in the request body
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the response body as JSON
      })
      .then(() => {
        // Optionally, you can update state or perform other actions upon successful update
        fetchAndUpdateData(); // Assuming this function fetches and updates your todos after editing
      })
      .catch(error => {
        console.error('Error updating todo:', error);
        // Optionally, you can handle errors here, e.g., show an error message to the user
      });
  };
  
  const handleFilter = (stat) => {
    const update = data.map((el) => 
    el.status === stat )
    setData(update)
    localStorage.setItem("todoData", JSON.stringify(update))
  }
  
  
  const handleClear = () => {
    const update = data.filter((el) => el.status !== true)
    setData(update)
    localStorage.setItem("todoData", JSON.stringify(update))
  }
  
  
  // React.useEffect(() => {
  //   const storedData = JSON.parse(localStorage.getItem('todoData')) || [];
  //   setData(storedData);
  // }, []);
  
  
useEffect(() => {
    fetchAndUpdateData()
  },[todosId])
  
  const fetchAndUpdateData = () => {
    fetch(`http://localhost:3800/users/${todosId}`)
    .then((res) => res.json())
    .then((res) => {
      setUsers(res);
      setTodos(res.todos)
    }) 
    .catch((err) => setError(true))
    .finally(() => setLoading(false))
};

  console.log(todos)
  console.log(todosId)
  console.log(users)

  return (
    <div className="App1">
    <div className='h2'>
      <FcTodoList className='icon'/>
      <h2>TO-DO APP</h2>
      <FaRegUserCircle className='icon'/>
    </div>
  
    <div className='input'>
        <input type="text" 
        placeholder="Enter the Todo" 
        onChange={(e) => setInput(e.target.value)}
        value={input}
        />
       
        <button onClick={() => handleTodo()}>Add</button>
    </div>
    
    <div className='Filters'>
    <div className='filter'>
      <div className='h3'><h3>Filter</h3><h3>⌵</h3></div>
      <div className='buttons'>
        <button onClick={() => setShow(null)}>Show All</button>
        <button onClick={() => setShow(true)}>Completed</button>
        <button onClick={() => setShow(false)}>InCompleted</button>
       </div>
   </div>
      
    <button onClick={handleClear}>Clear Completed</button>
    </div>

         
    <div className='tasks'>



    {
      loading ?  (
        <h2>loading....</h2>
      ) : error ? (
        <h2>Something went wrong</h2>
      ) : (
        todos.filter((todo) => (show === null ? todo : show ? todo.status : !todo.status))
      .map((todo) => (

        <div className='todo'

      style={
        todo.status ? 
        {backgroundColor:"#deebdd",
        backgroundImage: "linear-gradient(315deg, #deebdd 0%, #bbdbbe 74%)"
      } :
        {backgroundColor: "#f6ecc4",
          backgroundImage: "linear-gradient(315deg, #f6ecc4 0%, #f7d4d4 74%)"
        }
      } 
        key={todo.id}
        >
  
{/* ////////////////// TODO ///////////////////////////////////////////////////*/}

      { editId === todo.id ? 

        <input 
        id='updateinput'
            value={editTitle}
            type="text"
            onChange={(e) => setEditTitle(e.target.value)}
            /> 
        :
        <p>{todo.title}</p> }

{/* ////////////////// CHECKBOX ///////////////////////////////////////////////////*/}

      <input type="checkbox" checked={todo.status} onChange={() => handleCheck(todo.id)}/>

{/* ////////////////// EDIT ///////////////////////////////////////////////////*/}

      <button 
      className='edit'
      onClick = {() => handleEdit(todo.id, todo.title)}
      >
      {editId === todo.id ?  "Update" : "Edit"}
      </button>

{/* ////////////////// DELETE ///////////////////////////////////////////////////*/}

      <button 
   
      onClick = {() => handleDelete(todo.id)}
      >
      Delete
      </button>

      </div>
))
      )}
    


  </div>

    

    <div className='footer'>footer</div>

  </div>
  )
}

export default Todos