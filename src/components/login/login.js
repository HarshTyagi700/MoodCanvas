import Grid from '@mui/material/Grid';
import "./login.css";
import React , {useState,useContext} from 'react';
// import inst_image from "../../images/9364675fb26a.svg";
// import inst_logo from "../../images/logoinsta.png";
// import fb from "../../images/fb.png";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import noteContext from '../../context/noteContext';

export const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate= useNavigate();
    const state=useContext(noteContext);

    const signInFunction  = async event =>{
        event.preventDefault();
        
        // console.log(username);
        // console.log(password);
        try{
            const response = await fetch("http://localhost:7000/pinterest/user-api/login",{
                method : "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password})   

            }) ;    

            const jsonResponse=await response.json();
            // console.log(jsonResponse);
           
            // console.log(state.username);
            // state.username=jsonResponse.username;
            // state.useremail=jsonResponse.emailId;
            state.token=jsonResponse.token;
            localStorage.setItem("username",jsonResponse.username);
            localStorage.setItem("useremail",jsonResponse.emailId);
            localStorage.setItem("token",jsonResponse.token);
            localStorage.setItem("isLoggedIn",true);
            // console.log(state.useremail);
            // console.log(state.token);
            // console.log(`Now : ` , state.username);
            // localStorage.setItem("username",state.username);
            // console.log("Login ke baad in login compo:",localStorage.getItem("useremail"));
            navigate("/");

        }
        catch(error){
            console.log(error.response);
            
        }
        


        
    }

    return (
        <Grid container>
            <Grid item xs = {3}>
            </Grid>
            <Grid item xs = {6}>
                <div className='loginpage_main'>
                    <div>
                        {/* <img src={inst_image} width="454px" /> */}Image
                    </div>
                    <div className='loginpage_right_main'>
                    <div className='loginpage_rightcomponent'>
                        {/* <img className='loginpage_logo' src={inst_logo} /> */}
                        <div className='loginpage_signin'>
                        <>
        <div>
            <form onSubmit={signInFunction}>
                <input className='loginpage_text' onChange={(e) => setUsername(e.target.value)} type='text' placeholder='Enter Username or Email'/>
                <input className='loginpage_text' onChange={(e) => setPassword(e.target.value)} type='password' placeholder='Password' />
                <button type='submit' className='loginpage_loginbutton'>Log in</button>
            </form>
        </div>
        </>
                        </div>
                        <div className='loginpage_ordiv'>
                            <div className='loginpage_orline'></div>
                            <div className='loginpage_or'>OR</div>
                            <div className='loginpage_orline'></div>
                        </div>
                        <div className='loginpage_signup'>
                            Don't have an account ? 
                            <br /><Link to='/register' className='loginpage_anchor'>Register</Link>
                        </div>
                       
                    </div>
                   
                    </div>
                </div>
            </Grid>
            <Grid item xs = {3}>
            </Grid>
        </Grid>
    );

}


