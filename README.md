
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/21654446-cc7b-4204-b102-762fb07691c1

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/21654446-cc7b-4204-b102-762fb07691c1) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Features

### Regulatory Compliance Management System

This application provides comprehensive regulatory compliance management with the following features:

#### 1. Automated Document Ingestion
- **MAS Website Monitoring**: Automatically monitors MAS (Monetary Authority of Singapore) websites for new regulations
- **Manual Document Upload**: Users can manually upload compliance documents (PDF, DOC, DOCX)
- **Document Classification**: Automatic and manual tagging of documents by type (consultation papers, guidelines, notices, etc.)

#### 2. Manual File Upload System
The manual upload feature allows users to:
- Upload PDF, DOC, and DOCX files up to 10MB
- Specify document title, type, and publication date
- Add optional descriptions
- Support for both MAS regulatory documents and internal compliance documents
- Drag-and-drop file upload interface

#### 3. Multi-Document Analysis
- Cross-document impact analysis
- Gap identification across multiple regulations
- Compliance mapping and tracking

#### 4. Task Assignment and Collaboration
- Assign compliance tasks to team members
- Track task progress and deadlines
- Role-based access control

#### 5. Audit Trail and Reporting
- Complete audit history of all compliance activities
- Executive reporting capabilities
- User activity tracking

## Backend Integration (FastAPI + AWS)

### API Integration Points

The application is designed to integrate with a FastAPI backend hosted on AWS. The following files contain API integration points that need to be updated:

#### 1. Main API Provider (`src/lib/api-provider.ts`)
**Current Mock Endpoints to Replace:**
```typescript
// File Upload to S3
POST /documents/upload
- Uploads file to S3 bucket
- Creates document record in database
- Triggers analysis pipeline

// Document Analysis
POST /documents/{id}/analyze
- Analyzes uploaded document for compliance gaps

// Amendment Generation
POST /gaps/{id}/amendments
- Generates policy amendments using AI

// Cross-Impact Analysis
POST /analysis/cross-impact
- Analyzes impact across multiple documents

// Regulatory Source Scanning
POST /sources/scan
- Scans external regulatory sources

// Upload Status Tracking
GET /uploads/{uploadId}/status
- Returns upload and processing status

// Document Listing
GET /documents
- Returns list of uploaded documents with filters
```

#### 2. Compliance API Hook (`src/hooks/use-compliance-api.ts`)
Contains wrapper functions for all API calls with loading states and error handling.

#### 3. AWS S3 Integration
**Required Environment Variables:**
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
S3_BUCKET_NAME=your_bucket_name
```

**S3 Bucket Structure:**
```
your-bucket/
├── documents/
│   ├── mas-consultations/
│   ├── mas-guidelines/
│   ├── internal-policies/
│   └── uploads/
├── processed/
│   └── analysis-results/
└── temp/
    └── processing/
```

### Setting Up Backend Integration

1. **Update API Base URL**: 
   - Modify `baseUrl` in `src/lib/api-provider.ts`
   - Replace mock implementations with actual fetch calls

2. **Configure Authentication**:
   - Implement JWT token handling in `getAuthToken()` method
   - Add token refresh logic if needed

3. **S3 Upload Configuration**:
   - Set up pre-signed URLs for secure file uploads
   - Configure CORS policies for your S3 bucket

4. **Error Handling**:
   - Update error handling to match your API response format
   - Add retry logic for failed uploads

### Document Processing Pipeline

1. **File Upload**: User uploads file via web interface
2. **S3 Storage**: File is uploaded to designated S3 bucket
3. **Database Record**: Document metadata stored in database
4. **AI Analysis**: Document content analyzed for compliance gaps
5. **Notification**: User notified of analysis completion
6. **Review Process**: Compliance team reviews findings

### Security Considerations

- All file uploads are validated for type and size
- S3 bucket policies restrict access to authorized users only
- JWT tokens used for API authentication
- Audit logs maintained for all document operations

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/21654446-cc7b-4204-b102-762fb07691c1) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
