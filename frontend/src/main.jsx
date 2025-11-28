import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import StoryView from './pages/StoryView'
import CreateStory from './pages/CreateStory'
import Manage from './pages/Manage'
import EditStory from './pages/EditStory'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="stories/:id" element={<StoryView />} />
          <Route path="create" element={<CreateStory />} />
          <Route path="manage" element={<Manage />} />
          <Route path="edit-story/:id" element={<EditStory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
