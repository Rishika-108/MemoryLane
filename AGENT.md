# AGENT.md: Memory Lane Snapshot

**Developers must read this document in its entirety before making any changes to the codebase to ensure architectural and design consistency. The project is currently 70% developed; you must review the existing codebase thoroughly to identify completed modules and focus exclusively on the remaining 30% required to achieve a 100% functional solution**

## 1. Project Identity and Context
**Memory Lane Snapshot** is an **AI-powered personal digital memory assistant** designed to solve the problem of digital over-consumption where users forget previously read articles, videos, or posts. The system automatically captures, organizes, and retrieves content based on **context, meaning, and emotion**.

*   **Target Users:** Modern internet users who require a more intuitive retrieval system than traditional bookmarks or browser history.
*   **Deployment Environment:** Web application (Dashboard) and Browser Extension (Capture Layer).

## 2. Technical Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js |
| **Extension** | Browser Extension (Manifest V3) |
| **Backend** | Node.js |
| **Database** | MongoDB |
| **AI Processing** | Gemini API / OpenAI GPT |
| **Vector Search** | MongoDB Atlas Vector Search |

## 3. Frontend Architecture & Design Principles
The frontend acts as the **user-facing brain**, focusing on **display, search, and interaction** rather than heavy processing.

### 3.1. Core Components & Functionality
*   **Dashboard:** The main entry point featuring recent content cards, trending topics, and a quick search bar.
*   **Content Cards:** Each item displays an AI-generated summary, title, source URL, timestamp, and metadata like **tags (chips)** and **emotion labels (badges)**.
*   **Search Interface:** Supports three distinct modes: **Keyword Search** (exact text), **Semantic Search** (meaning-based via embeddings), and **Emotion Filter** (e.g., searching for "inspiring" content).
*   **Timeline & Analytics:** Renders grouped historical data and visual charts (e.g., Chart.js) to show content trends and most-viewed topics.

### 3.2. Design Principles for Elegant Interfaces
All frontend development must adhere to professional UI/UX standards to maintain a clean, consistent appearance:
*   **Color Strategy (60-30-10 Rule):** Use 60% neutral/background colors, 30% secondary colors, and 10% accent colors for key interactions.
*   **Typography Hierarchy:** Maintain a clear distinction between headers and body. Use a **1.5x line height** for body text and **1.2x-1.3x** for large headers to ensure readability.
*   **Grid and Spacing:** Implement a **4-pixel grid for mobile** and an **8-column grid for desktop**. Stick to consistent margins (e.g., 16px or 20px) religiously.
*   **Interactive Elements:** Ensure high **tappability** by spacing filters and buttons far enough apart to prevent accidental clicks.
*   **Fall-Back UI:** Always design and implement states for empty libraries, 404 errors, and no-internet scenarios.

## 4. Browser Extension (Capture Layer)
The extension serves as a **silent observer and smart capture tool** that extracts data without interrupting the user's workflow.

### 4.1. Extension Modules
*   **Content Script (`content.js`):** Runs inside webpages to extract meaningful content. To avoid "noise," it uses readability libraries or targets `<article>` tags instead of the entire `document.body`.
*   **Background Script (`background.js`):** The main logic hub that receives data from the content script and decides when to transmit it to the backend. It implements **Smart Logic** to avoid duplicate captures and ignores short pages or login screens.
*   **Popup UI:** Provides manual controls for users to save a page, toggle tracking, or blacklist specific domains.

## 5. Backend (Core Engine)
The Node.js backend manages the orchestration between the capture layer, the AI processing pipeline, and the database.

### 5.1. System Flows
*   **Content Capture Flow:** Receives raw data from the extension → sends it to the AI layer → stores the returned summary, tags, and embeddings in MongoDB.
*   **Search System:**
    *   For **Semantic Search**, the backend converts the user's query into a vector embedding and runs a **vector similarity search** via MongoDB Atlas.
    *   For **Keyword Search**, it utilizes standard MongoDB text indexing.
*   **Privacy Management:** Handles domain blacklisting and data deletion requests to ensure user trust.

## 6. AI Processing Layer
This layer provides the intelligence for the system by transforming raw HTML/text into structured, searchable data.

### 6.1. AI Pipeline Tasks
1.  **Summarization:** Converts long-form articles into concise summaries.
2.  **Keyword/Topic Extraction:** Identifies core subjects (e.g., "AI," "Productivity") for tagging.
3.  **Emotion Detection:** Analyzes sentiment to assign labels like "inspiring," "helpful," or "shocking".
4.  **Embedding Generation:** Converts content summaries into numerical **vector embeddings** that represent semantic meaning, enabling searches based on concepts rather than exact words.

### 6.2. Optimization Rule
To reduce latency and API costs, **combine summarization, tagging, and emotion detection into a single AI prompt** whenever possible.

## 7. Implementation Do's and Don'ts
*   **Do:** Use **Axios** for all Frontend-to-Backend communication.
*   **Do:** Implement **Deduplication** by checking URLs before saving to prevent cluttered libraries.
*   **Do:** Ensure **Privacy Controls** are prominent, allowing users to pause tracking or block sensitive sites like banking or email.
*   **Don't:** Capture content blindly; implement a delay (e.g., 5-10 seconds) or a minimum time-spent rule to ensure the user is actually engaging with the content.
*   **Don't:** Mix different icon families (e.g., line vs. solid) in the UI.