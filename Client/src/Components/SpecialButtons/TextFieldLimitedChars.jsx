import { TextField } from "@mui/material";
import React from "react";
import { useState } from "react";

export default function TextFieldLimitedChars({setFunction, label, name, id, value, required, width, validCharacters, helperText }){
    const [invalidChar, setInvalidChar] = useState(false)

    const handleChange = (event) => {
        const value = event.target.value;
        if (value !== "" && !validCharacters.test(value)) {
            setFunction(event.target.value)
            setInvalidChar(true) 
            return
        }
        setInvalidChar(false)
        setFunction(event.target.value)
    }

    const handleBlur = () => {
        if (invalidChar){
            setFunction("")
        }
        setInvalidChar(false)
    }

    return(
        <TextField 
            sx={{ width: {width} }}
            required={required}
            name={name}
            label={label}
            value={value}
            error={invalidChar}
            helperText={invalidChar ? helperText : null}
            onBlur={handleBlur}
            onChange={(event) => handleChange(event)}/>
            
    )
}