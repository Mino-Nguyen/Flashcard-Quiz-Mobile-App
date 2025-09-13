# Flashcard Quiz App

An interactive mobile app built with React Native that allows users to study quizzes, flip flashcards, and track their results. Designed for clarity, responsiveness, and a smooth user experience.

---

## Navigation Overview

The app uses a tab-based layout with two main screens:

- **Quizzes Tab**: Browse available quizzes and start answering.
- **Results Tab**: View past quiz attempts with scores and timestamps.

---

## 🔄 App Flow: Input → Process → Output

### Input

- **Quiz Data**: Each quiz contains a title and a list of questions with answers.
- **User Interaction**:
  - Tap a flashcard to reveal the answer.
  - Tap "Answer This Quiz" to begin answering.
  - Submit answers to record your score.

### Process

- **Flashcard Reveal**: Tapping toggles between question and answer.
- **Answer Screen**:
  - User selects answers.
  - Score is calculated based on correctness.
  - Result is saved to persistent storage (`AsyncStorage`) with metadata.
- **Results Filtering**:
  - Only valid, scored entries are shown.
  - Sorted by most recent timestamp.

### Output

- **Flashcard Screen**: Interactive cards with reveal logic.
- **Answer Screen**: Quiz interface with scoring.
- **Results Tab**: Displays:
  - Quiz title
  - Correct/Total count
  - Timestamp
  - Optional percentage score

---

## Navigation Details

| Screen         | Component       | Description                                      |
|----------------|------------------|--------------------------------------------------|
| Home Tabs      | `Tabs.js`        | Switch between Quizzes and Results               |
| Quiz List      | `QuizList.js`    | Displays all available quizzes                   |
| Flashcards     | `FlashcardScreen.js` | Tap-to-reveal flashcards for study          |
| Answer Quiz    | `AnswerScreen.js` | Interactive quiz with scoring logic             |
| Results        | `ResultsTab.js`  | Shows saved quiz attempts with scores            |

---

## Storage Format (AsyncStorage)

Each result is saved as an object in the `results` array:

```json
{
  "quizTitle": "JavaScript Basics",
  "correct": 4,
  "total": 5,
  "timestamp": "2025-09-13T06:45:00.000Z"
}