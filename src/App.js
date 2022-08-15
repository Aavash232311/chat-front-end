import React from "react";
import Box from "@mui/material/Box";
import "./css/main.css";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {domain} from "./utils/lang.js";
import CircularProgress from "@mui/material/CircularProgress";
import {GiBurningDot} from 'react-icons/gi';
import {AppBar, IconButton, Toolbar} from "@mui/material";
import {AiOutlineDisconnect} from 'react-icons/ai';

let connect = false;


let godLevelDeclare = false;
let godLevelSocket = null;
let currentToken = null;

function GetCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function MenuIcon() {
    return null;
}

function App() {
    const clientMessage = React.useRef(null);
    const chatPortalMessage = React.useRef(null);
    const [disconnect, setDisconnect] = React.useState(false);
    const nextButton = React.useRef(null);
    const bottomRef = React.useRef(null);

    let stringToHTML = function (str) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(str, 'text/html');
        return doc.body;
    };


    React.useEffect(() => {
        nextButton.current.disabled = true;
        setTimeout(() => {
            if (connect === false) {
                fetch(domain() + "/api/sync/", {
                    method: 'GET', headers: {
                        'Content-Type': 'application/json', 'Accept': 'application/json'
                    }
                }).then(rsp => rsp.json()).then(function (response) {
                    currentToken = response.token;
                    console.log(currentToken);
                    const chatSocket = new WebSocket("ws://strangerchatanonymous.herokuapp.com/socket/" + response.token + '/');
                    nextButton.current.disabled = false;
                    chatSocket.onerror = function () {
                        console.log("SOME ERROR")
                    }
                    chatSocket.onmessage = function (event) {
                        let data = JSON.parse(event.data);
                        let body = data["message"];
                        let direction = data["direction"];
                        let stat = data["status"];
                        if (stat === "commercial") {
                            let margin = " margin-left: 5px;";
                            let color = " background-color: white";
                            if (direction === "right") {
                                margin = " margin-right: 5px;";
                                color = " background-color: #a2cf6e";
                            }
                            chatPortalMessage.current.append(stringToHTML("<div class='chatBlocks' style='width: 100%;" + "display: inline-block;' ><div class='chatBlock' style='float: " + direction + ";" + margin + ";" + color + "; font-size: 18px'>" + "<span style='float: " + direction + "; margin-left: " + margin + "'>" + body + "</span>" + "</div></div>"));
                            bottomRef.current.scrollIntoView();
                        } else if (stat === 'alert') {
                            setDisconnect(true);
                        }
                        userFound(true);
                        godLevelSocket = chatSocket;
                    }
                    if (response.socket === true) {
                        userFound(true);
                        godLevelSocket = chatSocket;
                    }
                });
            }
        }, 1000);
        window.addEventListener("keydown", window.sendSocket = function (event) {
            userFound(true);
            if (event.keyCode === 13 && godLevelDeclare) {
                godLevelSocket.send(JSON.stringify({
                    "message": clientMessage.current.value,
                }));
                clientMessage.current.value = '';
            }
        });
        if (user) {
            clientMessage.current.disabled = false;
        } else {
            clientMessage.current.disabled = true;
        }

        return () => {
            // Event listener overflow prevention
            window.removeEventListener('keydown', window.sendSocket);
        };
    }, []);


    React.useEffect(() => {


        setTimeout(() => {
            if (connect === false) {

            }
            connect = true;
        }, 1000);
    }, []);


    let [user, userFound] = React.useState(false);

    if (user === true) {
        godLevelDeclare = true;
    } else {
        godLevelDeclare = false;
    }


    const ChatBody = (params) => {
        if (user === false) {
            return (<div>
                <hr
                    style={{
                        visibility: "hidden", height: "200px",
                    }}
                />
                <center>
            <span id="span_search_message">
              Looking for someone
              <br/>
              <br/>
              <CircularProgress color="inherit"/>
            </span>
                </center>
            </div>);
        }
    };

    const ConnectIndicator = (params) => {
        if (params.dis) {
            clientMessage.current.disabled = true;
            return (<div style={{color: "white"}}>USER DISCONNECTED <AiOutlineDisconnect/></div>)
        }
        if (params.bool === false) {
            return (<div style={{color: "white"}}>Talk with stranger</div>)
        } else {
            clientMessage.current.disabled = false;
            return (<div style={{color: "white", marginTop: "-8px"}}>
                <span style={{fontWeight: "bold"}}>connected</span>
                <GiBurningDot color="lightgreen"/>
            </div>)
        }
    }

    const show = {
        display: "block"
    }

    const hide = {
        display: "none"
    }

    function appBarLabel(label) {
        return (<Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{mr: 2}}>
                <MenuIcon/>
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{flexGrow: 1}}>
                {label}
            </Typography>
        </Toolbar>);
    }

    const searchNextUser = () => {
        nextButton.current.disabled = true;
        userFound(false);
        setDisconnect(false);
        const request = new Request(domain() + '/api/next/', {
            headers: {
                'X-CSRFToken': GetCookie("csrftoken"), 'Content-Type': 'application/json',
            }
        });
        fetch(request, {
            method: 'post', body: JSON.stringify({
                anonymous_id: currentToken
            })
        }).then(rsp => rsp.json()).then(function (response) {
            let userStatus = response.socket;
            if (userStatus) {
                if (disconnect) {
                    setDisconnect(false);
                }
                nextButton.current.disabled = false;
                userFound(true);
                // using 10000% brain
                if (bat) {
                    setBat(false);
                } else {
                    setBat(true);
                }
            }
        });
    }

    const [bat, setBat] = React.useState(true);

    const ChatBodySync = (params) => {
        if (params.bool) {
            return (<div style={user ? show : hide}>
                <div style={{height: 500, overflow: "auto"}}>
                    <div ref={chatPortalMessage}></div>
                    <div ref={bottomRef}>Bottom Ref</div>
                </div>
            </div>)
        } else {
            return (<div style={user ? show : hide}>
                <div style={{height: 500, overflow: "auto"}}>
                    <div ref={chatPortalMessage}></div>
                    <div ref={bottomRef}>Bottom Ref</div>
                </div>
            </div>)
        }
    }

    return (<div className="App">
        <header className="App-header">
            <AppBar position="static" style={{backgroundColor: "#ffcc80"}} enableColorOnDark>
                {appBarLabel('Find stranger')}
            </AppBar>
            <br/>
            <center>
                <Box
                    className="shadow-lg p-3 mb-5 bg-white rounded"
                    id="chatBox"
                    sx={{
                        boxShadow: 3,
                        width: "35%",
                        height: 650,
                        backgroundColor: "#9fa8da",
                        borderRadius: "5px",
                        overflow: "auto"
                    }}
                >
                    <center>
                        <br/>
                        <ConnectIndicator dis={disconnect} bool={user}/>
                    </center>
                    <br/>
                    <Box

                        sx={{
                            height: 500, width: "95%", backgroundColor: "#c5cae9", borderRadius: "5px",
                        }}
                    >
                        <ChatBodySync bool={bat}/>
                        <ChatBody bool={user}/>
                    </Box>
                    <Button
                        id="nextButton"
                        variant="contained"
                        ref={nextButton}
                        color="success"
                        onClick={searchNextUser}
                        sx={{
                            float: "left", marginTop: "10px", height: "55px", marginLeft: "2%",
                        }}
                    >
                        Next
                    </Button>

                    <TextField
                        inputRef={clientMessage}
                        sx={{
                            fontSize: "12px",
                            marginTop: "10px",
                            float: "left",
                            marginRight: "10px",
                            backgroundColor: "#FFFFFF",
                            borderRadius: "5px",
                            marginLeft: "2.5%",
                            width: "70%",
                        }}
                        label="message"
                        variant="filled"
                    />
                </Box>
            </center>
        </header>
    </div>);
}

export default App;
