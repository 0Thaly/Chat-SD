// Firebase configuracao
const firebaseConfig = {
    apiKey: "AIzaSyAdGqW9cUWdkIPMKyTpkS58WEcp0tsZcHw",
    authDomain: "chatwebapp-9a019.firebaseapp.com",
    databaseURL: "https://chatwebapp-9a019-default-rtdb.firebaseio.com",
    projectId: "chatwebapp-9a019",
    storageBucket: "chatwebapp-9a019.firebasestorage.app",
    messagingSenderId: "420201836143",
    appId: "1:420201836143:web:3955529dac5108efcfa79a",
    measurementId: "G-1M1K334EJ3"
};

// Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Elementos
const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const logoutButton = document.getElementById('logout-button');
const contactName = document.getElementById('contact-name');
const chatContainer = document.getElementById('chat-container');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

// Autenticacao 
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
      await auth.signInWithEmailAndPassword(email, password);
      loginScreen.style.display = 'none';
      document.getElementById('conversation-list-screen').style.display = 'block'; // Mostrar tela de conversação
      
  } catch (error) {
      alert(error.message);
  }
});

logoutButton.addEventListener('click', async () => {
  await auth.signOut();
  document.getElementById('conversation-list-screen').style.display = 'none';
  loginScreen.style.display = 'block';
});

// Carrega mensagens de bate-papo
function loadChat() {
  contactName.textContent = "Contact Name"; 

  db.collection('messages').orderBy('timestamp').onSnapshot((snapshot) => {
      chatContainer.innerHTML = '';
      snapshot.forEach((doc) => {
          const message = doc.data();
          const messageElement = document.createElement('div');
          messageElement.textContent = `${message.sender}: ${message.text}`;
          chatContainer.appendChild(messageElement);
      });
      chatContainer.scrollTop = chatContainer.scrollHeight;
  });
}

//Enviar uma messagem
messageForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = messageInput.value;
  const sender = auth.currentUser.email;

  try {
      await db.collection('messages').add({
          text,
          sender,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      messageInput.value = '';
  } catch (error) {
      alert(error.message);
  }
});
