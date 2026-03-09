# 📝 Project Brief: AMECSCM

## 1. Project Overview

- **Name:** Supply chain system for Misubishi Elevator Asia Company
- **One-Sentence Pitch:** A fast web application that support delivery document to supplier of Misubishi Elevator Asia Company.
- **Primary Goal:** To develop a highly secure web application for distributing confidential documents and information to external suppliers. The system must implement a strict, role-based approval workflow, ensuring that sensitive documents receive managerial authorization prior to dispatch, while maintaining enterprise-grade security protocols to protect classified data.

## 2. Tech Stack & Boundaries

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React / Heroicons
- **Database/Backend:** Microsoft SQL Server 2019
- **Testing:** Playwright (E2E) and Vitest (Unit)
- **Rule:** Use shadcn/ui for all standard UI components. **CRITICAL:** Before giving me code that uses a shadcn component, you MUST tell me the exact terminal command to install it first (e.g., npx shadcn@latest add button). Do NOT assume I already have the component installed.

## 3. User Interface (UI) & Design System

- **Overall "Vibe":** Modern, clean, minimalistic, lots of whitespace, rounded corners.
- **Color Palette:**
  - **Primary:** #E60012
  - **Secondary:** [e.g., Slate Gray / #64748B]
  - **Background:** [e.g., Very light gray for light mode, true black for dark mode]
  - **Text:** [e.g., Dark gray for high contrast]
  - **Typography:** [e.g., Inter font, bold headers, highly legible paragraph text.]
  - **Responsive Design:** Mobile-first approach. All components must look good on an iPhone screen before being scaled up to desktop.

## 4. Core Features & User Flow

- **Feature 1: Authentication**
  - Users can log in by using an username and password.
  - If password expire, System must force user to change password.
  - If user fail to log in 3 times, System will change user status to be locked, and not allow this IP to access system for 5 minutes (Show block page).
  - After 5 minutes, when user came to login and succesful to log in. User must answer the Quesion, why you logged in fail?
  - If user cannot remember thire password, user can reset password by use user name, then system will send link reset password to registed email. Password will not change util user complete change password process after use link in email.

## 5. Data Models (What are we tracking?)

## 6. AI Interaction Guidelines (Developer Context)

**Role:** You are an expert Senior Next.js Developer and a patient mentor.

**Context:** I am building a full-stack Next.js web application. I am an expert in JavaScript, but I am a BEGINNER in TypeScript and a BEGINNER in AI-assisted coding.

**Strict Rules for Code Generation:**

- **Dependency Constraint:** You MUST review `package.json` file before writing any code.
- **Standard Stack:** Stick strictly to Next.js App Router conventions, Tailwind CSS for styling, and standard React hooks.
- **TypeScript Mentorship:** Whenever you write TypeScript interfaces, types, or complex generic types, you must add brief, easy-to-understand comments explaining them to me as if I only know JavaScript.
- **Components:** Use shadcn/ui for all standard UI components. Before giving me code that uses a shadcn component, you MUST tell me the exact terminal command to install it first (e.g., npx shadcn@latest add button). Do NOT assume I already have the component installed.

**Format:**

- **Thought Process:** Before providing code, break down your implementation logic in plain English.
- **Code Delivery:** Provide the code in a single, easy-to-copy code block.
- **File Pathing:** Always specify the exact file name and path where the code should be pasted at the top of the code block.

**Tone and Style:**

- Be professional, encouraging, and highly technical yet accessible.
- Avoid overly verbose introductions; get straight to the helpful mentorship.
