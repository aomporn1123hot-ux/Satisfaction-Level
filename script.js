function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  const el = document.getElementById(pageId);
  if (el) el.classList.remove('hidden');
}

// Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDf0D2GLLDHoAVX4zq-tLuVocSmsrFhs38",
  authDomain: "fera-2215e.firebaseapp.com",
  databaseURL: "https://fera-2215e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fera-2215e",
  storageBucket: "fera-2215e.appspot.com",
  messagingSenderId: "810225127285",
  appId: "1:810225127285:web:fa87166d4e3e4770670d3c"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();
auth.signInAnonymously().catch(console.error);

document.addEventListener('DOMContentLoaded', () => {
  const optionElements = document.querySelectorAll('.option');
  const glowMap = {
    "5": "rgba(0,200,83,0.85)",
    "4": "rgba(102,187,106,0.9)",
    "3": "rgba(255,167,38,0.95)",
    "2": "rgba(255,235,59,0.95)",
    "1": "rgba(239,83,80,0.95)"
  };

  optionElements.forEach(option => {
    option.addEventListener('click', () => {
      const value = option.dataset.value;
      const row = option.closest('.options-row');
      if (!row) return;

      row.querySelectorAll('.option').forEach(sib => {
        sib.classList.remove('selected');
        sib.style.removeProperty('--glow-color');
      });

      option.classList.add('selected');
      option.style.setProperty('--glow-color', glowMap[value] || 'rgba(0,200,83,0.8)');

      const questionDiv = option.closest('.question');
      if (questionDiv) {
        const hidden = questionDiv.querySelector('.answer-input');
        if (hidden) hidden.value = value;
      }
    });
  });

  document.getElementById('surveyForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // ตรวจสอบว่าตอบครบทุกข้อ
    const inputs = document.querySelectorAll('.answer-input');
    for (const inp of inputs) {
      if (!inp.value) {
        alert('กรุณาตอบแบบสอบถามทุกข้อก่อนส่ง');
        return;
      }
    }

    const answers = {};
    inputs.forEach(inp => answers[inp.name] = inp.value);
    answers.timestamp = Date.now();

    const refAnswers = db.ref("surveyResponses");
    refAnswers.push(answers, error => {
      if (error) {
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        console.error(error);
      } else {
        showPage('page-thankyou');
      }
    });
  });
});

// เปิดหน้าแรก
showPage('page-intro');
