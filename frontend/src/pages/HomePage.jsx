import { useEffect, useState } from 'react'
import api from "../lib/axios"

import NavBar from '../components/NavBar'
import RateLimitedUI from '../components/RateLimitedUI'
import toast from 'react-hot-toast'
import NoteCard from '../components/NoteCard'
import NotesNotFound from '../components/NotesNotFound'

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes,setNotes] = useState([]);
  const [loading, setLoading] = useState(true)
  useEffect(()=> {
    const fetchNotes = async ()=>{
      console.log("1. Request fetchNotes has just STARTED...");
      try{
        const res = await api.get("/notes");
        console.log("2. Request SUCCESS!");
        setNotes(res.data);
        setIsRateLimited(false);
      }
      catch(error){
        console.log("2. Request FAILED! Status:", error.response?.status || "CORS/Network Error");
        console.error("Error fetching notes",error);
        if (error.response && error.response.status === 429) {
          setIsRateLimited(true);
        }
        else{
          toast.error("Failed to load Notes");

        }
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  },[]);
  return (
    <div className='min-h-screen'>
      <NavBar/>
      {isRateLimited && <RateLimitedUI/>}

      <div className='max-w-7xl mx-auto p-4 mt-6'>
        {loading && <div className='text-center text-primary py-10'>Loading Notes...</div>}

        {notes.length ===0 && !isRateLimited && <NotesNotFound />}
        {notes.length > 0 && !isRateLimited &&(
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {notes.map((note)=>(
              <NoteCard key={note._id} note={note} setNotes={setNotes}/>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage