import React from "react";
import NoteContext from "./noteContext";

const NoteState =(props) =>{

    const state ={
        "username":"",
        "useremail":"",
        "searchResult":[],
        "token":""
    }

    return (
        <NoteContext.Provider value={state}>
             { props.children }
        </NoteContext.Provider>
    )
    
}

export default NoteState;