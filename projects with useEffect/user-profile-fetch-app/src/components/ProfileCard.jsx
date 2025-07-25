import React from 'react'

function ProfileCard({user}) {
  return (
    <div className='profile-card'>
        <img src={user.picture.large} />
        <h3>{user.name.first}{user.name.last}</h3>
        <h3>{user.location.city}</h3>
        <h3>{user.email}</h3>
        <h3>{user.dob.age}</h3>
        
        ProfileCard</div>
  )
}

export default ProfileCard