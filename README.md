# 2024 Frontend Intern Homework

[Project requirements](https://drive.google.com/file/d/1x5l_hC5c26MauhTpACwGaa2nBUDo5uad/view)  
[Online working demo (d-card-blog.vercel.app)](https://d-card-blog.vercel.app)

### Project overview
The goal of this project is to create a blog application using NextJS. The blog app will fetch and display blog posts from GitHub Issues.

### Prerequisites
Before running the project, ensure that you have the following installed:
- Node.js
- npm (Node Package Manager)

### Getting Started
To get started with the project, follow these steps:

1. Clone the repository:
    ```
    git clone https://github.com/Joshimello/DCardBlog.git
    ```

2. Navigate to the project directory:
    ```
    cd DCardBlog
    ```

3. Install the project dependencies:
    ```
    npm i
    ```

4. Set up the environment variables:
    - Create a .env.local file in the project root.
    - Add the following variables to the file:
    ```
    NEXTAUTH_SECRET=SUPERSECRET
    NEXTAUTH_URL=https://example.com
    GITHUB_SECRET=SUPERSECRET
    GITHUB_ID=SUPERSECRET
    ```
    Replace SUPERSECRET with your actual NextAuth secret, GitHub app secret, and GitHub app ID, respectively.


5. Run the development server:
    ```
    npm run dev
    ```
    This will start the NextJS development server and the application will be accessible at http://localhost:3000.

### Project Structure
- `app/` : Contains the application pages and route handlers
  - `page.tsx` : Page that displays the list of blog posts
  - `n/` : Editor page to add a new blog post
  - `p/[id]` : Dynamic route to view individual blog posts
  - `e/[id]` : Dynamic route to edit individual blog posts
  - `api/auth` : Contains methods for authentication
- `components` : Contains reusable React components used throughout the application
- `lib` : Contains utility functions and helper modules


### Framework and Libraries
This project utilizes the following framework and libraries:
- NextJS: A React framework for building server-side rendered and statically generated web applications.
- React: A JavaScript library for building user interfaces.
- Octokit.js: Official GitHub SDK.
- Novel: An open-source Notion-style WYSIWYG editor.
- NextAuth: Standard Web APIs for authentication in web applications.
- Shadcn: Accessible and customizable components for React.

### Deployment
To deploy the application, you can use various platforms that support NextJS, such as Vercel. Follow the deployment instructions provided by your chosen platform.