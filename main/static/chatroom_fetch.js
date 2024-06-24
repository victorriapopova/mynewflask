var lastReceivedMessageId = -1;
const msgContainer = document.querySelector(".chat-messages");
const chatForm = document.getElementById("chat-form");

chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const text = document.getElementById("text").value;

    await fetch("/", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            username: username,
            text: text
        })
    });

    document.getElementById("text").value = "";
});

async function fetchMessages() {
    const response = await fetch("/request_messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            last_received_message_id: lastReceivedMessageId
        })
    });

    const response_data = await response.json();

    response_data.forEach((element) => {
        lastReceivedMessageId = Math.max(lastReceivedMessageId, element.id);

        var message = document.createElement("div");
        message.classList.add("message");
        message.classList.add(element.username === "Seller" ? "seller-message" : "user-message");
        msgContainer.appendChild(message);

        var user = document.createElement("div");
        user.classList.add("sender");
        user.textContent = element.username;
        message.appendChild(user);

        var text = document.createElement("p");
        text.textContent = element.text;
        message.appendChild(text);
    });

    msgContainer.scrollTop = msgContainer.scrollHeight;
}

// Fetch messages every 1 second
setInterval(fetchMessages, 1000);
