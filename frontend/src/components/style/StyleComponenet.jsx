import { styled } from "@mui/material"

export const VisuallyHiddenInput = styled('input')({
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    width: 1,
    
    whiteSpace: 'nowrap',
})

export const InputBox = styled('input')`
width: 100%;
height: 100%;
border: none;
outline: none;
padding: 0 3rem;
background-color: #f2f2f2;
font-size: 1.2rem;
`