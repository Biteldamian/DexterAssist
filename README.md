# Personal AI Assistant

A powerful, self-hosted AI assistant with document processing, autonomous task execution, and local model training capabilities.

## Features

- 💬 **Chat Interface**: Natural conversation with context awareness
- 📚 **Knowledge Base**: Upload and process documents for AI reference
- 🤖 **Autonomous Tasks**: Delegate complex tasks to the AI agent
- 🧠 **Local Training**: Fine-tune the model on your specific data
- 🌓 **Dark/Light Mode**: Comfortable viewing in any environment
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide Icons
- **Backend**: Node.js, Express
- **AI/ML**: Ollama, ChromaDB
- **Storage**: SQLite (metadata), File System (documents)

## Getting Started

### Prerequisites

- Node.js 18+
- Ollama
- Python 3.8+ (for ChromaDB)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/personal-ai-assistant.git
   cd personal-ai-assistant
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Backend Implementation

### Required Components

1. **Document Processing Service**
   - File upload handling
   - Text extraction from various formats
   - Embedding generation
   - Vector storage management

2. **Task Management Service**
   - Task queue system
   - Autonomous agent implementation
   - Progress tracking
   - Result storage

3. **Training Service**
   - Data preparation pipeline
   - Model fine-tuning
   - Training metrics collection
   - Model versioning

4. **Vector Store (ChromaDB)**
   - Document embeddings
   - Semantic search
   - Knowledge retrieval

### API Endpoints

```typescript
// Document endpoints
POST /api/documents/upload
GET /api/documents
GET /api/documents/:id
DELETE /api/documents/:id

// Task endpoints
POST /api/tasks
GET /api/tasks
GET /api/tasks/:id
DELETE /api/tasks/:id

// Training endpoints
POST /api/training/start
GET /api/training/status
POST /api/training/stop

// Chat endpoints
POST /api/chat/message
GET /api/chat/history
```

### Database Schema

```sql
-- Documents
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  size INTEGER NOT NULL,
  status TEXT NOT NULL,
  embedding_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tasks
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  result TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME
);

-- Training Sessions
CREATE TABLE training_sessions (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  progress INTEGER NOT NULL,
  metrics JSON,
  started_at DATETIME,
  completed_at DATETIME
);

-- Chat Messages
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.