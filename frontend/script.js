const chatBox = document.querySelector('.chat-box');
let userMessages = [];
let assistantMessages = [];
//let myDateTime = '';
let date = '';
let time = '';

function startFortune() {

    date = document.querySelector('#date').value;
    time = document.querySelector('#time').value;

    if (date == '') {
        alert('생년월일을 입력하여 주세요.');
        return;
    }
    // if (time == '') {
    //     alert('태어난 시각을 입력하여 주세요.');
    //     return;
    // }

    //myDateTime = date + ' ' +time;
    //console.log(myDateTime); 2023-05-02 05:37

     document.querySelector('.question-container').style.display = "none";
     document.querySelector('.chat-container').style.display = "block";
     document.querySelector('.intro-message').innerHTML = "오... 그대의 모든 것이 보인다!"
}


function loadingOn() {
    // Spin Loader 활성화하기
    document.getElementById("loader").style.display = "block";
    // Button 비활성화하기 
    document.querySelector('.chat-input button').disabled = true;
}


function loadingOff() {
    // Spin Loader 비활성화하기
    document.getElementById("loader").style.display = "none";
    // Button 활성화하기 
    document.querySelector('.chat-input button').disabled = false;
}


function sendMessage() {
    loadingOn();
    const chatInput = document.querySelector('.chat-input input');
    displayMessage("user", chatInput.value); //리스트에 채팅 저장 -> 채팅 디스플레이
    console.log(chatInput.value);
    chatInput.value = "";
    fetchData(); //백엔드에 요청 보내기
}


function displayMessage(from, data) {
    let text = '';
    const chatMessage = document.createElement('div');
    chatMessage.classList.add('chat');

    if (from == "user") { // 사용자 메시지
        chatMessage.classList.add('user');
        text = data;
        userMessages.push(text);
        chatMessage.innerHTML = text;
        
    } else { // 서버 응답 메시지
        chatMessage.classList.add('assistant');
        if (typeof data == 'object') {
            text = data.assistant;
            assistantMessages.push(text);

            //포맷팅
            text = text.split(". ").join(".<br>");
            text = text.split("! ").join("!<br>");
            text = text.split("? ").join("?<br>");
            chatMessage.innerHTML = text;

            //복채 보내기 추가
            const donateMessage = document.createElement('p');
            donateMessage.innerHTML = "링크를 눌러 복채를 보내보세요. 그럼 영험한 제가 당신의 무운을 빌어드릴게요. 👉";
            const link = document.createElement('a');
            link.href = "https://toss.me/tojiyu";
            link.innerText = "복채 보내기👈";
            donateMessage.appendChild(link);
            chatMessage.appendChild(donateMessage);
            console.log(chatMessage);
        } else { // 서버 에러 메시지
            text = data;
            chatMessage.innerHTML = text;
        }
    }
    chatBox.appendChild(chatMessage);    
}


async function fetchData() {
    try {
        const response = await fetch('https://31ger7bcv8.execute-api.ap-northeast-2.amazonaws.com/prod/fortuneTell', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body : JSON.stringify({
                "date": date,
                "time": time,
                "userMessages": userMessages,
                "assistantMessages": assistantMessages
            })
        });
        const data = await response.json();
        displayMessage("assistant", data);
        loadingOff()
    } catch(error) {
        //loader 멈추기
        document.getElementById("loader").style.display = "none";
        console.log(error);
        displayMessage("assistant", "쨰찌삐띠 너무 힘들어서 기절...🤒");
    }
}

