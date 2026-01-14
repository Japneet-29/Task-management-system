# Task Management System

## Overview

A full-stack Task Management System that allows users to securely create, manage, search, and filter tasks. The application is designed to help users organize tasks efficiently using priorities, statuses, and a clean, user-friendly interface.

## Tech Stack

Frontend: React (Vite), Custom CSS

Backend: Node.js, Express.js

Database: MongoDB

Authentication: JWT (JSON Web Tokens)

## Setup Instructions

### Backend

Clone the repository

Navigate to the backend directory

Install dependencies

Setup environment variables

Start the server

### Frontend

Navigate to the frontend directory

Install dependencies

Configure API endpoints

Start the development server

##Features Implemented

User authentication (Login and Register)

Create, update, and delete tasks

Task attributes: title, description, priority, status, and due date

Search tasks by title and description

Filter tasks by status and priority

Task statistics dashboard

Clean and responsive UI with separated CSS architecture

## Challenges and Solutions
Challenge 1

Managing search, status filtering, and priority filtering together while keeping the UI responsive.

Solution:
Implemented frontend-based filtering using React state and array filtering to avoid unnecessary API calls.

Challenge 2

Maintaining clean separation between UI logic and styling as the application grew.

Solution:
Moved all dashboard and authentication styling into dedicated CSS files, improving readability, maintainability, and scalability.
