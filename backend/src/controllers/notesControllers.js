import Note from '../models/Note.js'
export async function getAllNotes(req,res){
    try{
        const notes = await Note.find().sort({createdAt: -1});
        res.status(200).json(notes);

    }
    catch (error){
        console.error("Error in getAllNotes Controller", error);
        res.status(500).json({message:"Internal server Error"})
    }
}

export const getNotebyId = async (req,res)=>{
    try{
        const note = await Note.findById(req.params.id);
        if(!note) return  res.status(404).json({message:"Note not found"});
        res.status(200).json(note)

    }
    catch(error){
        console.error("Error in getAllNotes Controller", error);
        res.status(500).json({message:"Internal server Error"})
    }
}
export  const createNote = async (req,res)=>{
    try{
        const{title,content} = req.body;
        console.log(title,content);
        const note = new Note({title, content});
        const savedNote = await note.save();
        res.status(201).json(savedNote);

    }catch(error){
        console.error("Error in createNote Controller", error);
        res.status(500).json({message:"Internal server Error"})

    }
}
export const updateNote =  async (req,res)=>{
    try{
        const {title,content} = req.body;
        const updatedNote = await Note.findByIdAndUpdate(req.params.id,{title,content},{new :true})
        if(!updatedNote){
            return res.status(404).json({message:"Note not found"});
        }
        res.status(200).json({message: "note updated successfully"})
    }
    catch (error){
        console.error("Error in createNote Controller", error);
        res.status(500).json({message:"Internal server Error"})
    }
}
export const deleteNote = async (req,res)=>{
    try{
    const deletedNote = await Note.findByIdAndDelete(req.params.id)
    if(!deletedNote){
            return res.status(404).json({message:"Note not found"});
        }
    res.status(200).json({message: "note deleted successfully"})

    }
    catch (error){
        console.error("Error in createNote Controller", error);
        res.status(500).json({message:"Internal server Error"})

    }
    
} 