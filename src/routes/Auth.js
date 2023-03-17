import React, { useState } from "react";
import {
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    GithubAuthProvider,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "fbase";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChange = (event) => {
        const {target: {name, value} } = event;
        if(name === "email") {
            setEmail(value);
        } else if(name === "password") {
            setPassword(value);
        }
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        if(newAccount) {
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
            })
            .catch((error) => {
                const errorMessage = error.message;
                setError(errorMessage);
            });
        } else {
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
            })
            .catch((error) => {
                console.log(error);
                const errorMessage = error.message;
                setError(errorMessage);
            });
        }        
    };

    const toggleAccount = () => {
        setNewAccount((prev) => !prev);
    }
    const onSocialClick = async (event) => {
        const {target: { name }} = event;
        let provider;
        if(name === "google"){
            provider = new GoogleAuthProvider();    
        }else if(name === "github"){
            provider = new GithubAuthProvider();    
        }

        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const credential = provider.credentialFromResult(auth, result);
        const token = credential.accessToken;
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input name="email" type="email" placeholder="Email" required defaultValue={email} onChange={onChange} />
                <input name="password" placeholder="Password" required  defaultValue={password} onChange={onChange} />
                <input type="submit" value={newAccount ? "회원가입" : "로그인" } />
                <span>{error}</span>
            </form>
            <span onClick={toggleAccount}>
                {newAccount ? "회원가입" : "로그인"}
            </span>
            <div>
                <button onClick={onSocialClick} name="google">Continus with Google</button>
                <button onClick={onSocialClick} name="github">Continus with Github</button>
            </div>
        </div>
    );
};


export default Auth;