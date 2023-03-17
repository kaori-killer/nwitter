import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { dbService } from "fbase";

import Nweet from "components/Nweet";

const Home = ( {userObj} ) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    
    useEffect(() => {
        // 실시간으로 데이터를 DB에서 가져오며 DB의 변화를 계속 지켜본다.

        const q = query(collection(dbService, "nweets"), 
        // where("text", "==", "CA")
        orderBy('createdAt')
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const nweetArray = querySnapshot.docs.map(doc=>{
                return ({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setNweets(nweetArray);
            console.log("Current: ", nweetArray);
        });

        return ()=>{unsubscribe();};
    }, []);


    const onSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const docRef = await addDoc(collection(dbService, "nweets"), {
                text: nweet,
                createdAt: Date.now(),
                createdId: userObj.uid,
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }

        setNweet("");
    }

    const onChange = (event) => {
        const { target: { value }, } = event; 
        setNweet(value);
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind" maxLength={120} />
                <input type="submit" value="Nweet" />
            </form>
            <div>
                {nweets.map(nweet => 
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.createdId === userObj.uid}/>
                )}
            </div>
        </div>
    );
};
export default Home; 
