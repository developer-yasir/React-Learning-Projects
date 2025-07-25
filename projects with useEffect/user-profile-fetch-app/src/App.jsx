import React, { useEffect, useState } from 'react';
import ProfileCard from './components/ProfileCard';
import './index.css';

function App() {
  const [user, setUser] = useState(null);

  const fetchUser = () => {
    fetch("https://randomuser.me/api/")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.results[0]);
        localStorage.setItem("user", JSON.stringify(data.results[0])); 
      
      });
    };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(()=>{
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser))
  },[]);


  return (
    <div className='container'>
      <h1>User Profile Fetch App</h1>

      {user ? (
        <>
          <ProfileCard user={user} />
          <button onClick={fetchUser}>Fetch New User</button>
        </>
      ) : (
        <h2>Loading User...</h2>
      )}
    </div>
  );
}

export default App;
