import React from 'react'
import WelcomeCard from './WelcomeCard'

const users = [
  {
    name: "Yasir",
    age: 25,
    city: "Lahore",
    image: "https://randomuser.me/api/portraits/men/75.jpg"
  },
  {
    name: "Sara",
    age: 22,
    city: "Karachi",
    image: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    name: "Ali",
    age: 30,
    city: "Islamabad",
    image: "https://randomuser.me/api/portraits/men/60.jpg"
  }
];

function App() {
  return (
    <>
      {users.map((user, index) => (
        <WelcomeCard 
          key={index}
          name={user.name}
          age={user.age}
          city={user.city}
          image={user.image} 
        />
      ))}
    </>
  )
}

export default App;
