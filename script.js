```javascript
"use strict";

/* =========================
   VERSEUP BIBLE STUDY
   ========================= */

const lessons = [
  {
    id: 1,
    title: "Trust God With Your Path",
    reference: "Proverbs 3:5",
    verse: "Trust in the LORD with all thine heart; and lean not unto thine own understanding.",
    explanation:
      "This verse reminds us that we do not have to figure everything out by ourselves. We can trust God and seek His direction.",
    question:
      "According to Proverbs 3:5, what should we trust God with?",
    answers: [
      "All our heart",
      "Only our money",
      "Only our schoolwork",
      "Nothing"
    ],
    correct: 0
  },
  {
    id: 2,
    title: "Love One Another",
    reference: "John 13:34",
    verse: "A new commandment I give unto you, That ye love one another; as I have loved you.",
    explanation:
      "Jesus teaches His followers to show love to other people. Love should be something we practice through our actions.",
    question:
      "What commandment does Jesus give in this verse?",
    answers: [
      "Love one another",
      "Become famous",
      "Never help anyone",
      "Keep everything for yourself"
    ],
    correct: 0
  },
  {
    id: 3,
    title: "Be Thankful",
    reference: "1 Thessalonians 5:18",
    verse: "In every thing give thanks: for this is the will of God in Christ Jesus concerning you.",
    explanation:
      "Being thankful helps us recognize the good things God has given us, even when life is difficult.",
    question:
      "What does this verse tell us to do?",
    answers: [
      "Give thanks",
      "Complain constantly",
      "Give up",
      "Ignore everyone"
    ],
    correct: 0
  },
  {
    id: 4,
    title: "God Is With You",
    reference: "Joshua 1:9",
    verse: "Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.",
    explanation:
      "God encourages His people to be courageous and remember that they are not alone.",
    question:
      "Why should we be courageous?",
    answers: [
      "Because God is with us",
      "Because we never make mistakes",
      "Because we are better than everyone",
      "Because life is always easy"
    ],
    correct: 0
  },
  {
    id: 5,
    title: "Walk in Kindness",
    reference: "Ephesians 4:32",
    verse: "And be ye kind one to another, tenderhearted, forgiving one another.",
    explanation:
      "Kindness and forgiveness can change the way we treat people around us.",
    question:
      "What does Ephesians 4:32 tell us to be?",
    answers: [
      "Kind",
      "Selfish",
      "Angry",
      "Proud"
    ],
    correct: 0
  },
  {
    id: 6,
    title: "Ask God for Wisdom",
    reference: "James 1:5",
    verse: "If any of you lack wisdom, let him ask of God, that giveth to all men liberally.",
    explanation:
      "When we don't know what to do, we can ask God for wisdom and guidance.",
    question:
      "What should we ask God for when we lack it?",
    answers: [
      "Wisdom",
      "Fame",
      "Popularity",
      "More problems"
    ],
    correct: 0
  },
  {
    id: 7,
    title: "Let Your Light Shine",
    reference: "Matthew 5:16",
    verse: "Let your light so shine before men, that they may see your good works, and glorify your Father.",
    explanation:
      "Our actions can point other people toward God. Doing good can be a way of showing His love.",
    question:
      "What should shine before others?",
    answers: [
      "Our light",
      "Our anger",
      "Our possessions",
      "Our mistakes"
    ],
    correct: 0
  },
  {
    id: 8,
    title: "Do Not Give Up",
    reference: "Galatians 6:9",
    verse: "And let us not be weary in well doing: for in due season we shall reap, if we faint not.",
    explanation:
      "Doing the right thing can take patience. This verse encourages us not to give up.",
    question:
      "What should we not become weary in?",
    answers: [
      "Well doing",
      "Complaining",
      "Arguing",
      "Giving up"
    ],
    correct: 0
  }
];


/* =========================
   STATE
   ========================= */

const STORAGE_KEY = "verseup_bible_study_v3";

let state = {
  xp: 0,
  completedLessons: [],
  streak: 0,
  lastCompletedDate: null,
  reflections: {},
  currentLesson: 1
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      state = {
        ...state,
        ...JSON.parse(saved)
      };
    }
  } catch (error) {
    console.error("Could not load saved progress:", error);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Could not save progress:", error);
  }
}


/* =========================
   LEVEL SYSTEM
   ========================= */

function getLevel() {
  return Math.floor(state.xp / 100) + 1;
}

function getLevelXP() {
  return state.xp % 100;
}


/* =========================
   NAVIGATION
   ========================= */

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const page = document.getElementById(pageId);

  if (page) {
    page.classList.add("active");
  }

  document.querySelectorAll(".nav-btn").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.page === pageId
    );
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  updateUI();
}


/* =========================
   LESSONS
   ========================= */

function getLesson(id) {
  return lessons.find(lesson => lesson.id === Number(id));
}

function isUnlocked(id) {
  if (id === 1) return true;

  return state.completedLessons.includes(id - 1);
}

function renderHomeLessons() {
  const container = document.getElementById("homeLessons");

  if (!container) return;

  container.innerHTML = lessons.slice(0, 6).map(lesson => {
    const completed = state.completedLessons.includes(lesson.id);
    const unlocked = isUnlocked(lesson.id);

    return `
      <div class="lesson-card ${!unlocked ? "locked" : ""}">
        <div class="lesson-number">
          LESSON ${lesson.id}
          ${completed ? " • ✓ COMPLETE" : ""}
        </div>

        <h3>${escapeHTML(lesson.title)}</h3>
        <p>${escapeHTML(lesson.reference)}</p>

        <button
          class="primary-btn lesson-open-btn"
          data-lesson="${lesson.id}"
          ${!unlocked ? "disabled" : ""}
        >
          ${completed ? "Review Study" : unlocked ? "Start Study" : "Locked"}
        </button>
      </div>
    `;
  }).join("");

  document.querySelectorAll(".lesson-open-btn").forEach(button => {
    button.addEventListener("click", () => {
      openLesson(Number(button.dataset.lesson));
    });
  });
}

function renderStudyLessons() {
  const container = document.getElementById("studyLessonList");

  if (!container) return;

  container.innerHTML = lessons.map(lesson => {
    const completed = state.completedLessons.includes(lesson.id);
    const unlocked = isUnlocked(lesson.id);

    return `
      <button
        class="lesson-side-btn ${state.currentLesson === lesson.id ? "active" : ""}"
        data-lesson="${lesson.id}"
        ${!unlocked ? "disabled" : ""}
      >
        ${completed ? "✓ " : ""}${lesson.id}. ${escapeHTML(lesson.title)}
      </button>
    `;
  }).join("");

  document.querySelectorAll(".lesson-side-btn").forEach(button => {
    button.addEventListener("click", () => {
      openLesson(Number(button.dataset.lesson));
    });
  });
}


/* =========================
   STUDY FLOW
   ========================= */

let currentStep = 1;
let currentQuestionAnswered = false;

function openLesson(id) {
  const lesson = getLesson(id);

  if (!lesson) return;

  if (!isUnlocked(id)) {
    showToast("Complete the previous study first.");
    return;
  }

  state.currentLesson = id;
  currentStep = 1;
  currentQuestionAnswered = false;

  showPage("study");
  renderLesson();
}

function renderLesson() {
  const lesson = getLesson(state.currentLesson);

  if (!lesson) return;

  document.getElementById("studyTitle").textContent = lesson.title;
  document.getElementById("verseText").textContent = lesson.verse;
  document.getElementById("verseReference").textContent = lesson.reference;
  document.getElementById("lessonExplanation").textContent = lesson.explanation;

  document.getElementById("questionText").textContent = lesson.question;

  const answers = document.getElementById("answerOptions");

  answers.innerHTML = lesson.answers.map((answer, index) => `
    <button class="answer-btn" data-answer="${index}">
      ${escapeHTML(answer)}
    </button>
  `).join("");

  document.querySelectorAll(".answer-btn").forEach(button => {
    button.addEventListener("click", () => {
      answerQuestion(Number(button.dataset.answer));
    });
  });

  document.getElementById("answerResult").textContent = "";
  document.getElementById("questionNextBtn").disabled = true;

  const reflection = document.getElementById("reflectionInput");

  reflection.value = state.reflections[state.currentLesson] || "";

  showStep(1);
  renderStudyLessons();
}

function showStep(step) {
  currentStep = step;

  document.querySelectorAll(".study-step").forEach(element => {
    element.classList.remove("active");
  });

  const target = document.getElementById(`step${step}`);

  if (target) {
    target.classList.add("active");
  }

  document.querySelectorAll(".step").forEach(element => {
    const number = Number(element.dataset.step);

    element.classList.toggle("active", number === step);
    element.classList.toggle("done", number < step);
  });
}

function answerQuestion(answerIndex) {
  const lesson = getLesson(state.currentLesson);
  const buttons = document.querySelectorAll(".answer-btn");
  const result = document.getElementById("answerResult");

  if (!lesson || currentQuestionAnswered) return;

  buttons.forEach(button => {
    button.disabled = true;
  });

  const selected = buttons[answerIndex];

  if (answerIndex === lesson.correct) {
    selected.classList.add("correct");
    result.textContent = "✓ Correct! Great job.";
    result.style.color = "#4ade80";

    currentQuestionAnswered = true;
    document.getElementById("questionNextBtn").disabled = false;
  } else {
    selected.classList.add("incorrect");
    result.textContent = "Not quite. Try the study verse again.";
    result.style.color = "#f87171";

    setTimeout(() => {
      buttons.forEach(button => {
        button.disabled = false;
        button.classList.remove("incorrect");
      });

      result.textContent = "";
    }, 900);
  }
}


/* =========================
   COMPLETION
   ========================= */

function completeLesson() {
  const lessonId = state.currentLesson;

  const reflection = document
    .getElementById("reflectionInput")
    .value
    .trim();

  state.reflections[lessonId] = reflection;

  if (!state.completedLessons.includes(lessonId)) {
    state.completedLessons.push(lessonId);
    state.xp += 50;

    updateStreak();

    saveState();

    showToast("+50 XP earned! 🎉");
  } else {
    saveState();
    showToast("Study reviewed.");
  }

  showStep(4);
  updateUI();
}

function updateStreak() {
  const today = new Date().toISOString().split("T")[0];

  if (!state.lastCompletedDate) {
    state.streak = 1;
    state.lastCompletedDate = today;
    return;
  }

  if (state.lastCompletedDate === today) {
    return;
  }

  const previous = new Date(state.lastCompletedDate);
  const current = new Date(today);

  const difference =
    Math.round((current - previous) / 86400000);

  if (difference === 1) {
    state.streak++;
  } else {
    state.streak = 1;
  }

  state.lastCompletedDate = today;
}


/* =========================
   BIBLE SEARCH
   ========================= */

async function searchBible() {
  const book = document.getElementById("bookInput").value.trim();
  const chapter = document.getElementById("chapterInput").value.trim();
  const verse = document.getElementById("verseInput").value.trim();
  const result = document.getElementById("bibleResult");

  if (!book || !chapter || !verse) {
    showToast("Enter a book, chapter, and verse.");
    return;
  }

  const reference = `${book} ${chapter}:${verse}`;

  result.classList.remove("hidden");

  result.innerHTML = `
    <p class="muted">Searching for ${escapeHTML(reference)}...</p>
  `;

  try {
    const url =
      `https://bible-api.com/${encodeURIComponent(reference)}?translation=kjv`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Bible search failed.");
    }

    const data = await response.json();

    if (!data.text) {
      throw new Error("Verse not found.");
    }

    result.innerHTML = `
      <p class="eyebrow">KJV</p>
      <h2>${escapeHTML(data.reference || reference)}</h2>
      <p>${escapeHTML(data.text.trim())}</p>
    `;

  } catch (error) {
    console.error(error);

    result.innerHTML = `
      <p class="eyebrow">SEARCH ERROR</p>
      <h2>Verse not found</h2>
      <p class="muted">
        Check the book, chapter, and verse and try again.
      </p>
    `;
  }
}


/* =========================
   UI
   ========================= */

function updateUI() {
  const level = getLevel();
  const levelXP = getLevelXP();

  const levelElements = [
    "levelDisplay",
    "sideLevel",
    "progressLevel"
  ];

  levelElements.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.textContent = level;
  });

  const xpElements = [
    "xpDisplay",
    "topXP"
  ];

  xpElements.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.textContent = state.xp;
  });

  document.getElementById("completedDisplay").textContent =
    state.completedLessons.length;

  document.getElementById("streakDisplay").textContent =
    `${state.streak} 🔥`;

  document.getElementById("topStreak").textContent =
    state.streak;

  document.getElementById("progressXPText").textContent =
    `${levelXP} / 100 XP`;

  const percentage = levelXP;

  document.getElementById("sideXPBar").style.width =
    `${percentage}%`;

  document.getElementById("bigXPBar").style.width =
    `${percentage}%`;

  const firstIncomplete =
    lessons.find(lesson => !state.completedLessons.includes(lesson.id));

  const todayLesson = firstIncomplete || lessons[lessons.length - 1];

  document.getElementById("homeLessonTitle").textContent =
    todayLesson.title;

  document.getElementById("homeLessonVerse").textContent =
    todayLesson.reference;

  renderHomeLessons();
  renderStudyLessons();
  renderHistory();
}

function renderHistory() {
  const container = document.getElementById("historyList");

  if (!container) return;

  if (state.completedLessons.length === 0) {
    container.innerHTML = `
      <p class="muted">
        No completed studies yet. Start your first study today!
      </p>
    `;
    return;
  }

  container.innerHTML = [...state.completedLessons]
    .sort((a, b) => a - b)
    .map(id => {
      const lesson = getLesson(id);

      return `
        <div class="history-item">
          <strong>✓ ${escapeHTML(lesson.title)}</strong>
          <span>${escapeHTML(lesson.reference)} • +50 XP</span>
        </div>
      `;
    })
    .join("");
}


/* =========================
   TOAST
   ========================= */

let toastTimer;

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}


/* =========================
   SECURITY
   ========================= */

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* =========================
   EVENT LISTENERS
   ========================= */

function setupEvents() {

  /* Navigation */
  document.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", () => {
      showPage(button.dataset.page);
    });
  });


  /* Home */
  document.getElementById("continueBtn")
    .addEventListener("click", () => {
      const nextLesson =
        lessons.find(
          lesson => !state.completedLessons.includes(lesson.id)
        ) || lessons[0];

      openLesson(nextLesson.id);
    });


  document.getElementById("viewAllBtn")
    .addEventListener("click", () => {
      showPage("study");
    });


  /* Back */
  document.getElementById("backHomeBtn")
    .addEventListener("click", () => {
      showPage("home");
    });


  /* Next step buttons */
  document.querySelectorAll(".next-btn").forEach(button => {
    button.addEventListener("click", () => {
      showStep(Number(button.dataset.next));
    });
  });


  /* Question next */
  document.getElementById("questionNextBtn")
    .addEventListener("click", () => {
      showStep(3);
    });


  /* Complete study */
  document.getElementById("completeStudyBtn")
    .addEventListener("click", completeLesson);


  /* Finish */
  document.getElementById("finishBtn")
    .addEventListener("click", () => {
      showPage("home");
      showToast("Welcome back to your dashboard!");
    });


  /* Bible */
  document.getElementById("bibleSearchBtn")
    .addEventListener("click", searchBible);


  /* Enter key for Bible search */
  [
    "bookInput",
    "chapterInput",
    "verseInput"
  ].forEach(id => {
    document.getElementById(id).addEventListener("keydown", event => {
      if (event.key === "Enter") {
        searchBible();
      }
    });
  });
}


/* =========================
   START APP
   ========================= */

function startApp() {
  loadState();
  setupEvents();
  updateUI();

  console.log("VerseUp Bible Study loaded successfully.");
}


/*
  Because index.html uses:

  <script src="script.js" defer></script>

  the page is ready when this runs.
*/

startApp();
```
