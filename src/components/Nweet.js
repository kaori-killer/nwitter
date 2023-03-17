import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { dbService } from "fbase";
import { async } from '@firebase/util';

const Nweet = ({ nweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);

    const onDeleteClick = async () => {
        const ok = window.confirm("정말 삭제하시겠습니까?");
        if(ok) {
            await deleteDoc(doc(dbService, `nweets/${nweetObj.id}`));
        }
    }

    const toggleEditing = () => setEditing((prev) => !prev);

    const onChange = (event) => {
        const {target: {value}, } = event;
        setNewNweet(value);
    }

    const onCancle = () => {
        setEditing(false);
        setNewNweet(nweetObj.text);
    }  
    
    
    const onSubmit = async (event) => {
        event.preventDefault();

        const washingtonRef = doc(dbService, `nweets/${nweetObj.id}/`);

        await updateDoc(washingtonRef, {
            text: newNweet
        });

        setEditing(false);
    }

    return (
        <div>
                { editing ?
                    <>
                        {isOwner && ( 
                            <>
                            <form onSubmit={onSubmit}>
                                <input value={newNweet} onChange={onChange} type="text" placeholder="What's on your mind" maxLength={120} />
                                <input onClick={onSubmit} type="submit" value={"수정완료"} />                    
                                </form>
                            <button onClick={onCancle}>수정 취소</button> 
                            </>
                        )}
                    </>
                    : 
                    <>
                        <h4>{nweetObj.text}</h4>
                        {isOwner && ( 
                        <>
                            <button onClick={toggleEditing}>수정하기</button>
                            <button onClick={onDeleteClick}>삭제하기</button>
                        </>
                        )}
                    </>
                }
        </div>
    );
};

export default Nweet;