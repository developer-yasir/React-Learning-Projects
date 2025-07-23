<!-- Copy Button + README Content -->
<div style="position: relative; margin-bottom: 1rem;">
  <pre id="readme-content" style="overflow-x: auto; background: #f6f8fa; padding: 1rem; border-radius: 6px;"><code>
# 📚 React Learning Projects

Welcome to my React Learning Repository! This repo contains mini-projects built while learning and practicing React concepts such as:

- useState, useEffect
- Props & Component Structure
- Routing
- Conditional Rendering
- CRUD with localStorage
- Search & Filter functionality
- Charts and Dashboard UI (coming soon)

---

## 📁 Project Structure

Projects with useState/
├── project-1-counter-app/         # Simple counter using useState
├── project-2-todolist/            # To-Do list app with add/delete
├── project-3-user-management/     # Manage users with forms and validation

projects with props/
├── project-1-welcome-card/        # Props-based welcome card component
├── project-2-weather-app/         # Weather card using props + dummy data

---

## 🚀 Getting Started

Clone the repo:

git clone https://github.com/developer-yasir/React-Learning-Projects.git
cd React-Learning-Projects

Install and run any project individually:

cd Projects with useState/project-1-counter-app
npm install
npm run dev

> Use npm run dev or vite based on the setup.

---

## 🛠️ Tech Stack

- React.js
- Vite (for most projects)
- JavaScript (ES6+)
- CSS Modules & Tailwind (in some projects)

---

## 📌 Learning Goals

This repository is focused on learning:

- Component-based architecture
- Props vs State usage
- Reusability of components
- Handling input forms
- Dynamic rendering and interactivity
- LocalStorage & basic data persistence

---

## 📸 Screenshots (Coming Soon)

Will include images of working projects for visual reference.

---

## 🤝 Contribution

Feel free to fork, try the projects, or improve them. This repo is for learning — suggestions and improvements are welcome.

---

## 📧 Contact

Made with ❤️ by Yasir  
GitHub: https://github.com/developer-yasir
  </code></pre>
</div>

<script>
function copyReadme() {
  const content = document.getElementById("readme-content").innerText;
  navigator.clipboard.writeText(content).then(() => {
    alert("README content copied to clipboard! ✅");
  });
}
</script>
