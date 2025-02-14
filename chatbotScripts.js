let apiResponse = null;
let chatHistory = [];
document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById("userInput");
    const chatbotToggle = document.querySelector('.chatbot__button');
    const sendChatBtn = document.querySelector('.chatbot__input-box span');
    const chatbotCloseBtn = document.querySelector('.chatbot__header span');
    apiResponse = document.getElementById("apiResponse");

    userInput.addEventListener('keyup', (e) => { 
        console.log(e.key)
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    chatbotToggle.addEventListener('click', () =>
        document.body.classList.toggle('show-chatbot')
    );
    chatbotCloseBtn.addEventListener('click', () =>
        document.body.classList.remove('show-chatbot')
    );
})

async function sendMessage() {
    const userInput = document.getElementById("userInput");
    const userInputValue = userInput.value.trim();
    userInput.innerHTML = "";
    userInput.value = "";
    if (userInputValue === "") {
        alert("Por favor, digite uma mensagem antes de enviar.");
        return;
    }
    const questionLi = document.createElement("li");
    questionLi.classList.add("chatbot__chat");
    questionLi.classList.add("outgoing");
    const question = document.createElement("p");

    question.innerHTML = userInputValue;
    questionLi.appendChild(question);

    const chatBox = document.querySelector(".chatbot__box");
    chatBox.appendChild(questionLi);
    questionLi.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const paragraphTagWaiting = document.createElement("p");
    const answerWaiting = document.createElement("li");

    answerWaiting.classList.add("chatbot__chat");
    answerWaiting.classList.add("incoming");
    answerWaiting.classList.add("waiting");
    paragraphTagWaiting.innerHTML = "...";
    answerWaiting.appendChild(paragraphTagWaiting);

    chatBox.appendChild(answerWaiting);

    chatHistory.push({ role: 'USER', message: userInputValue });

    try {

        const response = await fetch("https://alessandro-chatbot.vercel.app/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ history: chatHistory })
        });

        const data = await response.json();

        // http://localhost:3000/chat
        // const data = await new Promise((resolve, reject) => {
        //     setTimeout(() => {
        //         resolve({
        //             "reply": "Here are a few online business ideas that can be successfully launched in a beachside location:\n\n1. Beach Gear Rental Service: You can create an online platform to rent out beach gear such as umbrellas, surfboards, kayaks, and other recreational equipment. Customers can easily book and pay for rentals online, and you can provide convenient pick-up and drop-off points near the beach.\n\n2. Online Beach Boutique: If you have a passion for fashion, you can start an online boutique specializing in beach-inspired clothing, swimwear, sandals, and other coastal-themed apparel. Setting up an e-commerce platform allows you to reach a wider audience, including tourists and locals alike.\n\n3. Beachfront Catering: If you possess culinary skills, you can offer online catering services specializing in beach-themed menus, seafood specials, or even beach picnic baskets. Customers can customize their orders online, and you can conveniently cater to beach events, parties, and weddings.\n\n4. Online Surf Instruction: Surfing lessons can be incredibly popular, especially in beach communities. You can establish an online platform offering virtual surf instruction and tutorials. This can include theoretical lessons, technique demonstrations, and even analyzing surfing videos to help students improve their skills.\n\n5. Beach Photography Service: Beach landscapes offer stunning backdrops for photography. You can set up an online photography business, capturing family portraits, couples' shots, or artistic images of the beach. Clients can easily book sessions, preview, and purchase photos through your website.\n\n6. Online Beach Store for Tropical Souvenirs: If you want to cater to tourists, you can start an online store selling tropical souvenirs, beach-themed home decor, framed sea shells, customized beach jewelry, and more. An e-commerce platform allows you to reach visitors worldwide who are looking for memorable gifts and souvenirs.\n\n7. Online Beach Tourism Guide: You can create a blog or online platform providing comprehensive information about the beachside area, including tourist attractions, activities, the best beaches, restaurants, and nightlife options. You can generate revenue through online advertising, promoting local businesses, or selling paid listings.\n\n8. Social Media-Centric Business: Instagram and TikTok have become powerful platforms for influencers. You can start a business dedicated to creating captivating short videos or stunning Instagram feeds of the beach, showcasing artistic content, or reviewing beach products like sunscreen, beach towels, etc. \n\nRemember, regardless of the online business you choose, having a solid understanding of the local beach community and targeting your audience specifically to maximize success."
        //         });
        //     }, 1000);
        // });

        if (data.reply) {
            chatHistory.push({ role: "CHATBOT", message: data.reply });
            const paragraphs = data.reply.split('\n');
            const chatbotChatWaiting = document.querySelector('.waiting');
            chatbotChatWaiting.remove();


            const paragraphTag = document.createElement("p");
            const answer = document.createElement("li");
            answer.classList.add("chatbot__chat");
            answer.classList.add("incoming");

            paragraphs.forEach(paragraph => {
                if (paragraph === "") {
                    return;
                }
                paragraphTag.innerHTML = paragraphTag.innerHTML + paragraph + "<br><br>";
            });

            answer.appendChild(paragraphTag)
            chatBox.appendChild(answer);
            answer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            const chatbotChatWaiting = document.querySelector('.waiting');
            chatbotChatWaiting.remove();

            const paragraphTag = document.createElement("p");
            paragraphTag.classList.add("error");
            const answer = document.createElement("li");
            answer.classList.add("chatbot__chat");
            answer.classList.add("incoming");

            paragraphTag.innerHTML = "Something went wrong. Please try again later.";
            chatHistory.pop();
            answer.appendChild(paragraphTag)
            chatBox.appendChild(answer);
            answer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }


    } catch (error) {
        const chatbotChatWaiting = document.querySelector('.waiting');
        chatbotChatWaiting.remove();
        const paragraphTag = document.createElement("p");
        paragraphTag.classList.add("error");
        const answer = document.createElement("li");
        answer.classList.add("chatbot__chat");
        answer.classList.add("incoming");
        paragraphTag.innerHTML = "Something went wrong. Please try again later.";
        answer.appendChild(paragraphTag)
        chatBox.appendChild(answer);
        chatHistory.pop();
        answer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        console.error(error);
    }
}
