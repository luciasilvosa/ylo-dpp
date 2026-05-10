import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Catalogo from './pages/Catalogo'
import PaginaDPP from './pages/PaginaDPP'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/dpp/:tokenId" element={<PaginaDPP />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
