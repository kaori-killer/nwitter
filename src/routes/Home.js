import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { dbService, storageService } from "fbase";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

import Nweet from "components/Nweet";

const Home = ( {userObj} ) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState(""); 
    
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
        let attachmentUrl = "";

        if(attachment !== "") {
            const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url");
            attachmentUrl = await getDownloadURL(response.ref);                
        }
        const nweetObj = {
            text: nweet,
            createdAt: Date.now(),
            createdId: userObj.uid,
            attachmentUrl,
        }
        try {
            const docRef = await addDoc(collection(dbService, "nweets"), nweetObj);
            setNweet("");
            setAttachment("");
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

    const onFileChange = (event) => {
        const { target : { files }, } = event;
        const theFile = files[0];
        const reader = new FileReader();

        //event listener: 파일 로딩 혹은 읽는 것이 끝나면 finishedEvent를 갖게 된다. 
        reader.onloadend = (finishedEvent) => {
            const { currentTarget: { result }, } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };

    const onClearAttachmentClick = () => setAttachment("");

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind" maxLength={120} />
                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type="submit" value="Nweet" />
                {attachment && <div><img src={attachment} alt="" width="50px" height="50px"/></div>}
                <button onClick={onClearAttachmentClick}>Clear</button>
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