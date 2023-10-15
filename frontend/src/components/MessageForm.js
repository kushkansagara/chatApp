import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
// import InputEmoji from "react-input-emoji"
import Picker from "emoji-picker-react"
import { BsEmojiSmileFill } from "react-icons/bs"
import "./MessageForm.css";
// import { events } from "../../../backend/models/User";
// import emojis from "emoji-picker-react/dist/data/emojis";
function MessageForm() {

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [message, setMessage] = useState('');
    // const [newMessage, setNewMessage] = useState("");

    // const hendleChange = (newMessage) => {
    //     setNewMessage(newMessage)
    // }

    const user = useSelector((state) => state.user);
    const { socket, currentRoom, setMessages, messages, privateMemberMsg } = useContext(AppContext);
    const messageEndRef = useRef(null);
    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    const handleEmojiPickerHideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    }
    const handleEmojiCLick = (event, emoji) => {
        console.log(emoji);
        let m = message;
        m += emoji.emoji;
        setMessage(m)
    }



    function getFormattedDate() {
        const date = new Date();
        const year = date.getFullYear();
        let month = (1 + date.getMonth()).toString();

        month = month.length > 1 ? month : "0" + month;
        let day = date.getDate().toString();

        day = day.length > 1 ? day : "0" + day;

        return month + "/" + day + "/" + year;
    }


    function handleSubmit(e) {
        e.preventDefault();
    }

    function scrollToBottom() {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    const todayDate = getFormattedDate();

    socket.off("room-messages").on("room-messages", (roomMessages) => {
        setMessages(roomMessages);
    });

    function handleSubmit(e) {
        e.preventDefault();
        if (!message) return;
        const today = new Date();
        const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
        const time = today.getHours() + ":" + minutes;
        const roomId = currentRoom;
        socket.emit("message-room", roomId, message, user, time, todayDate);
        setMessage("");
    }
    return (
        <>
            <div className="messages-output">
                {user && !privateMemberMsg?._id && <div className="alert alert-info">You are in the {currentRoom} room</div>}
                {user && privateMemberMsg?._id && (
                    <>
                        <div className="alert alert-info conversation-info">
                            <div>
                                Your conversation with {privateMemberMsg.name} <img src={privateMemberMsg.picture} className="conversation-profile-pic" />
                            </div>
                        </div>
                    </>
                )}
                {!user && <div className="alert alert-danger">Please login</div>}

                {user &&
                    messages.map(({ _id: date, messagesByDate }, idx) => (
                        <div key={idx}>
                            <p className="alert alert-info text-center message-date-indicator">{date}</p>
                            {messagesByDate?.map(({ content, time, from: sender }, msgIdx) => (
                                <div className={sender?.email == user?.email ? "message" : "incoming-message"} key={msgIdx}>
                                    <div className="message-inner">
                                        <div className="d-flex align-items-center mb-3">
                                            <img src={sender.picture} style={{ width: 35, height: 35, objectFit: "cover", borderRadius: "50%", marginRight: 10 }} />
                                            <p className="message-sender">{sender._id == user?._id ? "You" : sender.name}</p>
                                        </div>
                                        <p className="message-content">{content}</p>
                                        <p className="message-timestamp-left">{time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                <div ref={messageEndRef} />
            </div>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={11}>
                        {/* <Form.Group> */}

                        <Form.Group>
                            <div className="button-container">
                                <div className="emoji">
                                    <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
                                    {
                                        showEmojiPicker && <Picker onEmojiClick={handleEmojiCLick} />
                                    }
                                    {/* <InputEmoji
                                    value={newMessage}
                                    onChange={hendleChange}
                                /> */}
                                </div>
                            </div>
                            <Form.Control type="text" placeholder="Your message" disabled={!user} value={message} onChange={(e) => setMessage(e.target.value)}></Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={1}>
                        <Button variant="primary" type="submit" style={{ width: "100%", backgroundColor: "orange" }} disabled={!user}>
                            <i className="fas fa-paper-plane"></i>
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}
// const Container = styled.div,

export default MessageForm;
