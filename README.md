# Real-Time Chat Application

I developed this real-time chat app using FastAPI, WebSockets, MongoDB, and React. Users can chat instantly in real-time, and every message is stored in MongoDB for persistence.
A
---

## ✅ Features

- Real-time messaging using **WebSockets**
- Persistent message storage with **MongoDB**
- Clean and responsive **React frontend**
- Easy to extend for authentication, rooms, or notifications

---

## 🛠️ Technologies Used

| Backend                | Frontend             | Database       |
|------------------------|--------------------|----------------|
| FastAPI                | React.js           | MongoDB        |
| Python 3.13+           | JavaScript (ES6+)  | MongoDB Atlas / Local |
| WebSockets             | Axios / Fetch API  | PyMongo / Motor |
| Uvicorn                | TailwindCSS (optional) |                |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.13+
- Node.js 18+
- MongoDB (local or Atlas)

---

### Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/jagankomma07/REAL-TIME-CHAT-API.git
cd REAL-TIME-CHAT-API/backend

Create and activate a virtual environment:

python -m venv venv
source venv/bin/activate   # Linux/macOS
venv\Scripts\activate      # Windows


Install dependencies:

pip install -r requirements.txt

Set up environment variables:

MONGO_URI=mongodb://localhost:27017/chatapp

uvicorn main:app --reload


### Frontend Setup

Navigate into the frontend folder:

cd ../frontend

Install frontend dependencies:

npm install


Start the React app:

npm start




