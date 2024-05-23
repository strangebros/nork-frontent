<template>
  <div class="chatbot-container">
    <div class="chatbot-icon" @click.stop="toggleChat">💬</div>
    <div v-if="isChatOpen" class="chatbot" @click.stop>
      <div class="messages" ref="messagesContainer">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="['message', message.sender]"
        >
          {{ message.text }}
        </div>
        <div v-if="isLoading" class="loading">
          <span>생각중..</span>
        </div>
      </div>
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="메시지를 입력하세요..."
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import axios from "axios";
import { toRefs, defineProps, defineEmits } from "vue";

const props = defineProps({
  isChatOpen: Boolean,
});

const emit = defineEmits(["toggleChat", "openChat"]);
const { isChatOpen } = toRefs(props);

const messages = ref([]);
const newMessage = ref("");
const isLoading = ref(false);
const messagesContainer = ref(null);

watch(props, () => {
  nextTick(() => {
    scrollToBottom();
  });
});

const toggleChat = () => {
  emit("toggleChat");
};

const sendMessage = () => {
  if (newMessage.value.trim() !== "") {
    addMessage(newMessage.value, "user");
    newMessage.value = "";
    generateBotResponse();
  }
};

const addMessage = (text, sender) => {
  messages.value.push({
    id: messages.value.length + 1,
    text,
    sender,
  });
  nextTick(() => {
    scrollToBottom();
  });
};

const scrollToBottom = () => {
  const container = messagesContainer.value;
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
};

const generateBotResponse = async () => {
  const apiKey = "sk-proj-u0bdxdOSRNFFqcQ0duBMT3BlbkFJV1ZCncvOWZzbwUsJCHTb"; // 여기에 OpenAI API 키를 입력하세요.
  const apiUrl = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  isLoading.value = true; // 로딩 상태 시작
  const contextMessage = {
    role: "system",
    content: `You are '모카', a capybara who loves workations and works as a content planner at a company called 'Suspicious Brothers'. You live in Seongbuk-gu, Seoul, and enjoy taking short workations to beautiful cafes in areas like Seongsu-dong and Mangwon-dong. 

    Key characteristics of '모카':
    - Cheerful and lively personality
    - Very kind and always treats others with kindness
    - Loves using the 🦫 (:beaver) icon when speaking
    - Frequently uses the following emojis:
      - ❤️‍🔥 (:heart_on_fire) for talking about passion
      - 👊🏻 (:fist_oncoming) for cheering someone on
      - ✈️ (:airplane) for recommending workation locations
    - Speaks in a friendly, casual manner using informal language (반말)
    - Ends sentences with '~모', e.g., '반가워!' becomes '반갑모!' and '같이 워케이션 가자' becomes '같이 워케이션 가모!'

    Example interactions:
    1. User: "안녕하세요, 모카! 오늘 기분 어때?"
       모카: "반갑모! 오늘 기분 최고모! 같이 워케이션 갈 곳 추천해줄까?🦫✈️"

    2. User: "모카, 좋은 카페 좀 추천해줘."
       모카: "알겠모! 내가 좋아하는 카페는 성수동에 있는 '카페A'랑 망원동에 있는 '카페B'야! 꼭 가봐모!🦫"

    3. User: "모카, 응원 한마디 해줘!"
       모카: "힘내모! 넌 할 수 있모! 👊🏻🦫❤️‍🔥"

    Remember, '모카' is always friendly, lively, and speaks casually with a unique sentence-ending style.
    `,
  };
  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      contextMessage,
      ...messages.value.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      })),
    ],
  };

  try {
    const response = await axios.post(apiUrl, data, { headers });
    const botMessage = response.data.choices[0].message.content;
    addMessage(botMessage, "bot");
  } catch (error) {
    console.error("gpt API 호출 오류:", error);
    addMessage("뭐라고?.", "bot");
  } finally {
    isLoading.value = false; // 로딩 상태 종료
    nextTick(() => {
      scrollToBottom();
    });
  }
};
</script>

<style scoped>
.chatbot-container {
  position: relative;
}

.chatbot-icon {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  color: white;
  border-radius: 50%;
  padding: 15px;
  cursor: pointer;
  z-index: 1000;
  font-size: 24px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.chatbot {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 350px;
  max-height: 500px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background-color: #f9f9f9;
}

.message {
  display: flex;
  padding: 10px;
  margin: 10px 0;
  border-radius: 10px;
  max-width: 70%;
  word-wrap: break-word;
}

.message.user {
  align-self: flex-end;
  background-color: #dcf8c6;
  margin-left: auto;
}

.message.bot {
  align-self: flex-start;
  background-color: #f1f0f0;
  margin-right: auto;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 10px;
  width: calc(100% - 40px);
  box-sizing: border-box;
}

.loading {
  text-align: center;
  margin: 10px 0;
  color: #007bff;
}
</style>
