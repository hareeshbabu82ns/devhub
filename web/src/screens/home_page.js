import React from 'react'
/*
<h1>Dashboard (TODOs)</h1>
<ul>
  <li>Suggestions for the day</li>
  <li>Recently viewed items</li>
  <li>Favorites</li>
  <li>Bookmarks</li>
</ul>
*/
import BookmarkList from '../components/bookmark_list'

const Home = () => {
  return (
    <div>
      <BookmarkList />
    </div>
  )
}

export default Home